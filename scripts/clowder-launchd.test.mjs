import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

const testDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(testDir, '..');
const launchdScript = resolve(repoRoot, 'scripts', 'clowder-launchd.sh');

describe('clowder-launchd script', () => {
  it('prints a direct-mode plist with quick-start fallback and expected log paths', () => {
    const fakeHome = mkdtempSync(resolve(tmpdir(), 'clowder-launchd-home-'));
    const result = spawnSync('bash', [launchdScript, 'print-plist'], {
      encoding: 'utf8',
      env: {
        ...process.env,
        HOME: fakeHome,
        PATH: '/opt/homebrew/bin:/usr/bin:/bin',
        PNPM_BIN: '/opt/homebrew/bin/pnpm',
        CLOWDER_LAUNCHD_LABEL: 'com.cat-cafe.test',
      },
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /<string>com\.cat-cafe\.test<\/string>/);
    assert.match(result.stdout, /exec \/opt\/homebrew\/bin\/pnpm start:direct -- --quick/);
    assert.match(result.stdout, /exec \/opt\/homebrew\/bin\/pnpm start:direct/);
    assert.match(result.stdout, /packages\/web\/\.next\/BUILD_ID/);
    assert.match(result.stdout, new RegExp(`<string>${repoRoot.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/string>`));
    assert.match(
      result.stdout,
      new RegExp(
        `<string>${resolve(fakeHome, '.cat-cafe', 'launchd', 'logs', 'com.cat-cafe.test.log').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}<\\/string>`,
      ),
    );
  });

  it('prints a runtime-mode plist with memory flag when requested', () => {
    const fakeHome = mkdtempSync(resolve(tmpdir(), 'clowder-launchd-home-'));
    const result = spawnSync('bash', [launchdScript, 'print-plist', '--runtime', '--memory', '--no-quick'], {
      encoding: 'utf8',
      env: {
        ...process.env,
        HOME: fakeHome,
        PATH: '/opt/homebrew/bin:/usr/bin:/bin',
        PNPM_BIN: '/opt/homebrew/bin/pnpm',
      },
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /exec \/opt\/homebrew\/bin\/pnpm start --memory/);
    assert.doesNotMatch(result.stdout, /--quick/);
  });
});
