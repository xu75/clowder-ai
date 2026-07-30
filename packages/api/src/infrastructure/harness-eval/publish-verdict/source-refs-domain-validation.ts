import type { CapabilityWakeupSourceSelector } from '../capability-wakeup/capability-wakeup-trial-provider.js';
import { validateCapabilityWakeupSelector } from '../capability-wakeup/capability-wakeup-trial-provider.js';
import type { HandlerError, VerdictSourceRefs } from './types.js';
import {
  inferSourceRefsKind,
  isA2aSourceRefs,
  isAnchorTelemetrySourceRefs,
  isFrictionSourceRefs,
  isKnownSourceRefsKind,
  isMemorySourceRefs,
  isQcMetricsSourceRefs,
  isSopSourceRefs,
  isTaskOutcomeSourceRefs,
  validateAnchorTelemetrySelector,
  validateFrictionRollupSelector,
  validateMemoryRecallSelector,
  validateQcMetricsSelector,
  validateSopTraceSelector,
  validateSourceRefsFormat,
  validateTaskOutcomeSourceRefs,
} from './validation.js';

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
  expectedKind: string | undefined,
  sourceRefs: VerdictSourceRefs | undefined,
): HandlerError | null {
  const refsKind = inferSourceRefsKind(sourceRefs);

  // cloud R8 P2: cross-check sourceRefs.kind ↔ domain's expected kind
  if (expectedKind && expectedKind !== refsKind) {
    return {
      status: 400,
      error: 'sourceRefs_kind_mismatch',
      detail: `Domain '${domainId}' expects sourceRefs.kind='${expectedKind}', got '${refsKind}'. Registry sourceRefsKind is the contract; explicit validator/generator wiring must still exist for the domain to publish.`,
    };
  }

  if (!isKnownSourceRefsKind(refsKind)) {
    return {
      status: 501,
      error: 'unsupported_source_refs_kind',
      detail: `Domain '${domainId}' declares sourceRefs.kind='${refsKind}', but publish-verdict has no validator wiring for that selector kind yet. Add explicit validator/generator wiring before using this kind.`,
    };
  }

  // Per-kind structural validation
  if (isSopSourceRefs(sourceRefs)) {
    const selectorError = validateSopTraceSelector(sourceRefs);
    return selectorError ? { status: 400, error: 'invalid_source_ref', detail: selectorError } : null;
  }

  if (isMemorySourceRefs(sourceRefs)) {
    const selectorError = validateMemoryRecallSelector(sourceRefs);
    return selectorError ? { status: 400, error: 'invalid_source_ref', detail: selectorError } : null;
  }

  if (isFrictionSourceRefs(sourceRefs)) {
    // ⚠️ friction branch MUST precede the a2a branch: isA2aSourceRefs returns true
    // for undefined/missing-kind refs (backward-compat default).
    const selectorError = validateFrictionRollupSelector(sourceRefs);
    return selectorError ? { status: 400, error: 'invalid_source_ref', detail: selectorError } : null;
  }

  if (isAnchorTelemetrySourceRefs(sourceRefs)) {
    // F236 Track-2: anchor-telemetry-snapshot selector.
    const selectorError = validateAnchorTelemetrySelector(sourceRefs);
    return selectorError ? { status: 400, error: 'invalid_source_ref', detail: selectorError } : null;
  }

  if (isQcMetricsSourceRefs(sourceRefs)) {
    // F253 Phase C: qc-metrics-rollup selector.
    const selectorError = validateQcMetricsSelector(sourceRefs);
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

  // Capability wakeup selector (default fallback)
  const cwSelector = sourceRefs as unknown as CapabilityWakeupSourceSelector;
  const selectorError = validateCapabilityWakeupSelector(cwSelector);
  if (selectorError) {
    return { status: 400, error: 'invalid_source_ref', detail: selectorError };
  }

  // trial-ids selector remains unsupported until a durable trial store ships.
  if (cwSelector.kind !== 'capability-wakeup-trial-window') {
    return {
      status: 400,
      error: 'invalid_source_ref',
      detail: `PR-2 wired only 'capability-wakeup-trial-window' kind for capability-wakeup domain (got '${cwSelector.kind}'; trial-ids selector reserved for future durable trial store PR)`,
    };
  }

  return null;
}
