/**
 * F167 P2: CLI version resolution utilities
 *
 * Provides cached CLI version detection for audit trails.
 * Injectable for testing; caches per-command in production.
 */

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createModuleLogger } from '../infrastructure/logger.js';

const log = createModuleLogger('cli-version');
const execFileAsync = promisify(execFile);

/**
 * In-memory cache: cliPath -> version string
 * Cleared on process restart (intentional - CLI updates are rare)
 */
const versionCache = new Map<string, string>();

/**
 * CLI version resolver interface for dependency injection
 */
export interface CliVersionResolver {
  getVersion(cliPath: string): Promise<string>;
}

/**
 * Default production CLI version resolver
 * Executes `<cliPath> --version` once per process and caches result
 */
export const defaultCliVersionResolver: CliVersionResolver = {
  async getVersion(cliPath: string): Promise<string> {
    const cached = versionCache.get(cliPath);
    if (cached) return cached;

    try {
      // Most CLIs support --version; 2s timeout for network-free local exec
      const { stdout, stderr } = await execFileAsync(cliPath, ['--version'], {
        timeout: 2000,
        encoding: 'utf8',
      });
      // Take first line, trim, limit to 100 chars (version strings are short)
      const version = (stdout || stderr).split('\n')[0].trim().slice(0, 100) || 'unknown';
      versionCache.set(cliPath, version);
      return version;
    } catch (err) {
      // Don't fail the recovery if version detection fails
      // Log at warn level for troubleshooting but return safe fallback
      log.warn({ cliPath, err: (err as Error).message }, '[F167] CLI version detection failed, using fallback');
      const fallback = 'version-unknown';
      versionCache.set(cliPath, fallback);
      return fallback;
    }
  },
};

/**
 * Test-injectable CLI version resolver that returns fixed values
 */
export function createMockCliVersionResolver(versionMap: Record<string, string>): CliVersionResolver {
  return {
    async getVersion(cliPath: string): Promise<string> {
      return versionMap[cliPath] ?? 'mock-version-unknown';
    },
  };
}
