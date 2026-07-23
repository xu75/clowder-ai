import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { HandlerError } from './types.js';

/**
 * F192 — resolve the canonical `sourceThreadId` for a verdict publish, honoring the
 * `provenance.json → sourceThreadId` traceability contract advertised in the
 * cat_cafe_publish_verdict MCP tool ("which thread produced this PR").
 *
 * Contract (source-confirmed against CallbackPrincipal + eval-domain registry):
 *  - `invocation` principal carries a server-trusted `threadId` → it MUST match the
 *    domain's registered `systemThreadId`. A mismatch fails closed (403) — we never
 *    silently relabel a foreign thread as the source of a domain's evidence.
 *  - `agent_key` principal (shared persistent MCP) has NO `threadId` → fall back to
 *    the registry `systemThreadId` as the canonical domain working-home thread.
 *
 * Pure function: no I/O, so the three branches (invocation-match / agent-key-fallback /
 * cross-thread-mismatch) are directly unit-testable.
 *
 * @param principalThreadId trusted invocation threadId, or `undefined` for agent_key
 * @param systemThreadId    registry-canonical domain thread (`domainEntry.systemThreadId`)
 */
export function resolveSourceThreadId(
	principalThreadId: string | undefined,
	systemThreadId: string,
): { ok: true; sourceThreadId: string } | { ok: false; error: HandlerError } {
	if (principalThreadId !== undefined && principalThreadId !== systemThreadId) {
		return {
			ok: false,
			error: {
				status: 403,
				error: 'source_thread_mismatch',
				detail: `Publish principal thread '${principalThreadId}' does not match domain systemThreadId '${systemThreadId}'. Eval verdicts must be published from the domain's registered working-home thread (registry is SoT). A legitimate cross-thread publish should preserve trusted invocation provenance instead of being relabeled.`,
			},
		};
	}
	return { ok: true, sourceThreadId: principalThreadId ?? systemThreadId };
}

/**
 * F192 — stamp `sourceThreadId` into a freshly generated bundle's `provenance.json`
 * so the advertised traceability contract holds for EVERY newly published domain.
 *
 * Central stamp (runs once in the publish stage callback, after the generator returns)
 * instead of editing all 8 per-domain generators. Raw JSON read-modify-write preserves
 * every generator-written key and adds a single top-level `sourceThreadId`; the read
 * schema accepts it as optional, so old bundles stay backward-compatible.
 *
 * Fails closed if `provenance.json` is absent — every publishable bundle writes it
 * (`resolveA2aEvidenceBundle` already requires it), so a missing file is a real defect,
 * never something to paper over with a fabricated provenance record.
 */
export function stampSourceThreadId(bundleDir: string, sourceThreadId: string): void {
	const provenancePath = join(bundleDir, 'provenance.json');
	if (!existsSync(provenancePath)) {
		throw new Error(
			`provenance_stamp_failed: provenance.json not found in bundleDir '${bundleDir}' — cannot stamp sourceThreadId (every publishable bundle must write provenance.json).`,
		);
	}
	const provenance = JSON.parse(readFileSync(provenancePath, 'utf8')) as Record<string, unknown>;
	provenance.sourceThreadId = sourceThreadId;
	writeFileSync(provenancePath, `${JSON.stringify(provenance, null, 2)}\n`, 'utf8');
}
