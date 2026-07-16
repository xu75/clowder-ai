import type { CapabilityWakeupSourceSelector } from '../capability-wakeup/capability-wakeup-trial-provider.js';
import { validateCapabilityWakeupSelector } from '../capability-wakeup/capability-wakeup-trial-provider.js';
import type { HandlerError, VerdictSourceRefs } from './types.js';
import {
  inferSourceRefsKind,
  isA2aSourceRefs,
  isMemorySourceRefs,
  isSopSourceRefs,
  isTaskOutcomeSourceRefs,
  validateMemoryRecallSelector,
  validateSopTraceSelector,
  validateSourceRefsFormat,
  validateTaskOutcomeSourceRefs,
} from './validation.js';

/** Expected sourceRefs.kind per registered domain (cloud R8 P2 cross-check table). */
const EXPECTED_REFS_KIND_BY_DOMAIN: Partial<Record<string, string>> = {
  'eval:a2a': 'a2a-snapshot-attribution',
  'eval:capability-wakeup': 'capability-wakeup-trial-window',
  'eval:sop': 'sop-trace-eval',
  'eval:task-outcome': 'task-outcome-snapshot',
  'eval:memory': 'memory-recall-snapshot',
};

/**
 * F192 Phase H — validate sourceRefs shape for a domain (extracted from
 * publish-verdict.ts to keep the handler under the AGENTS.md 350-line hard limit
 * without growing validation.ts past its own budget). Two stages:
 *  1. cloud R8 P2: cross-check inferred kind ↔ domain's expected kind (400 kind_mismatch)
 *     — better UX than letting a wrong-shape input dispatch to an adapter → 500.
 *  2. per-kind structural validation (400 invalid_source_ref).
 * Returns a HandlerError to reject, or null to proceed.
 */
export function validateSourceRefsForDomain(
  domainId: string,
  sourceRefs: VerdictSourceRefs | undefined,
): HandlerError | null {
  const refsKind = inferSourceRefsKind(sourceRefs);
  const expectedKind = EXPECTED_REFS_KIND_BY_DOMAIN[domainId];
  if (expectedKind && expectedKind !== refsKind) {
    return {
      status: 400,
      error: 'sourceRefs_kind_mismatch',
      detail: `Domain '${domainId}' expects sourceRefs.kind='${expectedKind}', got '${refsKind}'. Each domain has a specific evidence shape: eval:a2a → {snapshotName, attributionName}; eval:capability-wakeup → {kind:'capability-wakeup-trial-window', ...}; eval:memory → {kind:'memory-recall-snapshot', ...}; eval:sop → {kind:'sop-trace-eval', sopDefinitionId, trace}; eval:task-outcome → {kind:'task-outcome-snapshot', ...}.`,
    };
  }

  if (isSopSourceRefs(sourceRefs)) {
    const selectorError = validateSopTraceSelector(sourceRefs);
    return selectorError ? { status: 400, error: 'invalid_source_ref', detail: selectorError } : null;
  }
  if (isMemorySourceRefs(sourceRefs)) {
    const selectorError = validateMemoryRecallSelector(sourceRefs);
    return selectorError ? { status: 400, error: 'invalid_source_ref', detail: selectorError } : null;
  }
  if (isA2aSourceRefs(sourceRefs)) {
    const refsCheck = validateSourceRefsFormat(sourceRefs);
    return refsCheck.ok ? null : refsCheck.error;
  }
  if (isTaskOutcomeSourceRefs(sourceRefs)) {
    const refsCheck = validateTaskOutcomeSourceRefs(sourceRefs);
    return refsCheck.ok ? null : refsCheck.error;
  }
  const cwSelector = sourceRefs as unknown as CapabilityWakeupSourceSelector;
  // PR-1a structural validator (capability non-empty / no newlines / window edges finite + ordered).
  const selectorError = validateCapabilityWakeupSelector(cwSelector);
  if (selectorError) return { status: 400, error: 'invalid_source_ref', detail: selectorError };
  // trial-ids selector remains unsupported until a durable trial store ships.
  // Window selectors may omit sessionIds: provider resolves an unbiased runtime-session scan.
  if (cwSelector.kind !== 'capability-wakeup-trial-window') {
    return {
      status: 400,
      error: 'invalid_source_ref',
      detail: `PR-2 wired only 'capability-wakeup-trial-window' kind for capability-wakeup domain (got '${cwSelector.kind}'; trial-ids selector reserved for future durable trial store PR)`,
    };
  }
  return null;
}
