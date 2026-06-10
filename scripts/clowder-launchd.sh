#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

ACTION="${1:-help}"
if [ $# -gt 0 ]; then
  shift
fi

LABEL="${CLOWDER_LAUNCHD_LABEL:-com.cat-cafe.clowder-ai}"
MODE="direct"
USE_MEMORY=false
PREFER_QUICK=true
PLIST_DIR="${HOME}/Library/LaunchAgents"
STATE_DIR="${HOME}/.cat-cafe/launchd"
LOG_DIR="${STATE_DIR}/logs"

usage() {
  cat <<'EOF'
Clowder AI macOS launchd helper

Usage:
  ./scripts/clowder-launchd.sh print-plist [--runtime] [--memory] [--no-quick] [--label LABEL]
  ./scripts/clowder-launchd.sh install     [--runtime] [--memory] [--no-quick] [--label LABEL]
  ./scripts/clowder-launchd.sh uninstall   [--label LABEL]
  ./scripts/clowder-launchd.sh status      [--label LABEL]
  ./scripts/clowder-launchd.sh restart     [--label LABEL]

Defaults:
  mode:      direct   (pnpm start:direct)
  quick:     enabled  (reuse existing build artifacts when they exist)
  label:     com.cat-cafe.clowder-ai

Notes:
  - LaunchAgent runs when the current macOS user logs in.
  - direct mode avoids auto-syncing origin/main on every boot.
EOF
}

die() {
  echo "[clowder-launchd] ERROR: $*" >&2
  exit 1
}

require_macos() {
  [ "$(uname -s)" = "Darwin" ] || die "launchd autostart is only supported on macOS"
}

xml_escape() {
  local value="$1"
  value="${value//&/&amp;}"
  value="${value//</&lt;}"
  value="${value//>/&gt;}"
  value="${value//\"/&quot;}"
  value="${value//\'/&apos;}"
  printf '%s' "$value"
}

resolve_pnpm_bin() {
  if [ -n "${PNPM_BIN:-}" ]; then
    printf '%s\n' "$PNPM_BIN"
    return 0
  fi

  local resolved
  resolved="$(command -v pnpm || true)"
  [ -n "$resolved" ] || die "pnpm not found in PATH; set PNPM_BIN explicitly if needed"
  printf '%s\n' "$resolved"
}

launchctl_domain() {
  printf 'gui/%s\n' "$(id -u)"
}

plist_path() {
  printf '%s/%s.plist\n' "$PLIST_DIR" "$LABEL"
}

stdout_log_path() {
  printf '%s/%s.log\n' "$LOG_DIR" "$LABEL"
}

stderr_log_path() {
  printf '%s/%s.error.log\n' "$LOG_DIR" "$LABEL"
}

join_shell_words() {
  local out=""
  local item
  for item in "$@"; do
    local quoted
    printf -v quoted '%q' "$item"
    if [ -z "$out" ]; then
      out="$quoted"
    else
      out="$out $quoted"
    fi
  done
  printf '%s\n' "$out"
}

build_direct_launch_command() {
  local pnpm_bin="$1"
  local quick_cmd base_cmd

  if [ "$USE_MEMORY" = true ]; then
    quick_cmd="$(join_shell_words "$pnpm_bin" start:direct -- --quick --memory)"
    base_cmd="$(join_shell_words "$pnpm_bin" start:direct -- --memory)"
  else
    quick_cmd="$(join_shell_words "$pnpm_bin" start:direct -- --quick)"
    base_cmd="$(join_shell_words "$pnpm_bin" start:direct)"
  fi

  if [ "$PREFER_QUICK" = true ]; then
    cat <<EOF
cd $(printf '%q' "$PROJECT_DIR")
if [ -f package.json ] && \
   [ -f packages/shared/dist/index.js ] && \
   [ -f packages/api/dist/index.js ] && \
   [ -f packages/mcp-server/dist/index.js ] && \
   [ -f packages/web/.next/BUILD_ID ]; then
  exec $quick_cmd
fi
exec $base_cmd
EOF
  else
    cat <<EOF
cd $(printf '%q' "$PROJECT_DIR")
exec $base_cmd
EOF
  fi
}

build_runtime_launch_command() {
  local pnpm_bin="$1"
  local args=(start)

  if [ "$PREFER_QUICK" = true ]; then
    args+=(--quick)
  fi
  if [ "$USE_MEMORY" = true ]; then
    args+=(--memory)
  fi

  local runtime_cmd
  runtime_cmd="$(join_shell_words "$pnpm_bin" "${args[@]}")"

  cat <<EOF
cd $(printf '%q' "$PROJECT_DIR")
exec $runtime_cmd
EOF
}

build_launch_command() {
  local pnpm_bin="$1"
  case "$MODE" in
    direct) build_direct_launch_command "$pnpm_bin" ;;
    runtime) build_runtime_launch_command "$pnpm_bin" ;;
    *) die "unknown mode: $MODE" ;;
  esac
}

print_plist() {
  require_macos

  local pnpm_bin launch_cmd path_value lang_value
  pnpm_bin="$(resolve_pnpm_bin)"
  launch_cmd="$(build_launch_command "$pnpm_bin")"
  path_value="${PATH:-/usr/bin:/bin:/usr/sbin:/sbin}"
  lang_value="${LANG:-en_US.UTF-8}"

  cat <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>$(xml_escape "$LABEL")</string>
  <key>WorkingDirectory</key>
  <string>$(xml_escape "$PROJECT_DIR")</string>
  <key>ProgramArguments</key>
  <array>
    <string>/bin/bash</string>
    <string>-lc</string>
    <string>$(xml_escape "$launch_cmd")</string>
  </array>
  <key>EnvironmentVariables</key>
  <dict>
    <key>HOME</key>
    <string>$(xml_escape "$HOME")</string>
    <key>PATH</key>
    <string>$(xml_escape "$path_value")</string>
    <key>LANG</key>
    <string>$(xml_escape "$lang_value")</string>
  </dict>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>ThrottleInterval</key>
  <integer>10</integer>
  <key>StandardOutPath</key>
  <string>$(xml_escape "$(stdout_log_path)")</string>
  <key>StandardErrorPath</key>
  <string>$(xml_escape "$(stderr_log_path)")</string>
</dict>
</plist>
EOF
}

install_service() {
  require_macos

  local target_plist tmp_plist domain
  target_plist="$(plist_path)"
  domain="$(launchctl_domain)"

  mkdir -p "$PLIST_DIR" "$LOG_DIR"
  tmp_plist="$(mktemp "${STATE_DIR%/}/plist.XXXXXX")"
  mkdir -p "$STATE_DIR"
  print_plist >"$tmp_plist"
  mv "$tmp_plist" "$target_plist"

  launchctl bootout "$domain" "$target_plist" >/dev/null 2>&1 || true
  launchctl bootstrap "$domain" "$target_plist"
  launchctl enable "$domain/$LABEL" >/dev/null 2>&1 || true
  launchctl kickstart -k "$domain/$LABEL"

  cat <<EOF
[clowder-launchd] Installed LaunchAgent
  Label: $LABEL
  Plist: $target_plist
  Logs:  $(stdout_log_path)
  Check: pnpm autostart:status
EOF
}

uninstall_service() {
  require_macos

  local target_plist domain
  target_plist="$(plist_path)"
  domain="$(launchctl_domain)"

  launchctl bootout "$domain" "$target_plist" >/dev/null 2>&1 || true
  rm -f "$target_plist"

  cat <<EOF
[clowder-launchd] Uninstalled LaunchAgent
  Label: $LABEL
  Removed: $target_plist
EOF
}

status_service() {
  require_macos

  local domain target_plist
  domain="$(launchctl_domain)"
  target_plist="$(plist_path)"

  echo "Label: $LABEL"
  echo "Plist: $target_plist"
  echo "Logs:  $(stdout_log_path)"

  if launchctl print "$domain/$LABEL" >/dev/null 2>&1; then
    echo "State: loaded"
    launchctl print "$domain/$LABEL"
  else
    echo "State: not loaded"
    exit 1
  fi
}

restart_service() {
  require_macos

  local domain target_plist
  domain="$(launchctl_domain)"
  target_plist="$(plist_path)"
  [ -f "$target_plist" ] || die "plist not found: $target_plist"

  if launchctl print "$domain/$LABEL" >/dev/null 2>&1; then
    launchctl kickstart -k "$domain/$LABEL"
  else
    launchctl bootstrap "$domain" "$target_plist"
    launchctl enable "$domain/$LABEL" >/dev/null 2>&1 || true
    launchctl kickstart -k "$domain/$LABEL"
  fi

  echo "[clowder-launchd] Restarted $LABEL"
}

while [ $# -gt 0 ]; do
  case "$1" in
    --runtime)
      MODE="runtime"
      ;;
    --memory)
      USE_MEMORY=true
      ;;
    --no-quick)
      PREFER_QUICK=false
      ;;
    --label)
      shift
      [ $# -gt 0 ] || die "--label requires a value"
      LABEL="$1"
      ;;
    -h|--help|help)
      usage
      exit 0
      ;;
    *)
      die "unknown option: $1"
      ;;
  esac
  shift
done

case "$ACTION" in
  print-plist)
    print_plist
    ;;
  install)
    install_service
    ;;
  uninstall)
    uninstall_service
    ;;
  status)
    status_service
    ;;
  restart)
    restart_service
    ;;
  help|-h|--help)
    usage
    ;;
  *)
    usage
    die "unknown action: $ACTION"
    ;;
esac
