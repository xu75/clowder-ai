import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve as resolvePath } from 'node:path';
import { after, before, describe, it } from 'node:test';

import { handlePublishVerdict } from '../../dist/infrastructure/harness-eval/publish-verdict/publish-verdict.js';
import {
  resolveSourceThreadId,
  stampSourceThreadId,
} from '../../dist/infrastructure/harness-eval/publish-verdict/source-thread-provenance.js';
import { setupHarnessFeedback } from './eval-manual-trigger-fixtures.js';
import { buildPacket } from './publish-verdict-fixtures.js';

/**
 * F192 — provenance.json → sourceThreadId traceability contract.
 * codex (eval:a2a) closed evidence PR #2: generated provenance.json + PR body
 * omitted the mandatory domain-thread id. Root cause = publisher split-contract:
 * CallbackPrincipal has trusted threadId, registry has systemThreadId, but the
 * route dropped both and PublishVerdictInput/GeneratorDeps carried no thread
 * provenance. This proves the central fix: resolve (fail-closed) + stamp.
 *
 * Red→Green: on origin/main (pre-fix) resolveSourceThreadId / stampSourceThreadId
 * do not exist and the pipeline never writes sourceThreadId — every assertion
 * below fails. Post-fix they pass.
 */

// --- Unit: the three branches codex's spec centers on (pure, no I/O) ---
describe('resolveSourceThreadId — invocation auth / agent-key fallback / cross-thread mismatch', () => {
  it('invocation auth: principal threadId that matches systemThreadId is used verbatim', () => {
    const r = resolveSourceThreadId('thread_eval_a2a', 'thread_eval_a2a');
    assert.equal(r.ok, true);
    assert.equal(r.sourceThreadId, 'thread_eval_a2a');
  });

  it('agent-key fallback: undefined principal thread → registry systemThreadId is canonical', () => {
    const r = resolveSourceThreadId(undefined, 'thread_eval_a2a');
    assert.equal(r.ok, true);
    assert.equal(r.sourceThreadId, 'thread_eval_a2a');
  });

  it('cross-thread mismatch: invocation thread ≠ systemThreadId fails closed (403), no silent relabel', () => {
    const r = resolveSourceThreadId('thread_some_other', 'thread_eval_a2a');
    assert.equal(r.ok, false);
    assert.equal(r.error.status, 403);
    assert.equal(r.error.error, 'source_thread_mismatch');
    assert.match(r.error.detail, /thread_some_other/);
    assert.match(r.error.detail, /thread_eval_a2a/);
  });
});

// --- Unit: central stamp writes the field, preserves generator keys, fails closed ---
describe('stampSourceThreadId — bundle provenance.json stamping', () => {
  let dir;
  before(() => {
    dir = mkdtempSync(`${tmpdir()}/stamp-test-`);
  });
  after(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('adds sourceThreadId while preserving every existing provenance key', () => {
    const bundleDir = mkdtempSync(`${tmpdir()}/stamp-bundle-`);
    const original = {
      verdictId: 'v1',
      rawInputs: [{ path: 'snapshots/x.yaml', sha256: 'abc' }],
      generatedAt: '2026-07-16T03:00:00.000Z',
      generator: { name: 'eval-a2a-live-verdict', version: '1' },
      sanitizeRulesVersion: '1',
    };
    writeFileSync(resolvePath(bundleDir, 'provenance.json'), JSON.stringify(original, null, 2));

    stampSourceThreadId(bundleDir, 'thread_eval_a2a');

    const after = JSON.parse(readFileSync(resolvePath(bundleDir, 'provenance.json'), 'utf8'));
    assert.equal(after.sourceThreadId, 'thread_eval_a2a');
    // preserved keys
    assert.equal(after.verdictId, 'v1');
    assert.equal(after.generator.name, 'eval-a2a-live-verdict');
    assert.equal(after.rawInputs[0].sha256, 'abc');
    assert.equal(after.sanitizeRulesVersion, '1');
    rmSync(bundleDir, { recursive: true, force: true });
  });

  it('fails closed when provenance.json is missing (never fabricates)', () => {
    const emptyDir = mkdtempSync(`${tmpdir()}/stamp-empty-`);
    assert.throws(() => stampSourceThreadId(emptyDir, 'thread_eval_a2a'), /provenance_stamp_failed/);
    rmSync(emptyDir, { recursive: true, force: true });
  });
});

// --- Integration: full pipeline stamps generated provenance.json + PR body ---
function makeEmptyIsolatedWorktree() {
  return mkdtempSync(`${tmpdir()}/source-thread-iso-`);
}

describe('handlePublishVerdict — sourceThreadId end-to-end', () => {
  let root;
  before(() => {
    root = setupHarnessFeedback();
  });
  after(() => {
    rmSync(root, { recursive: true, force: true });
  });

  /** Generator that writes a real provenance.json into bundleDir (mirrors every domain generator). */
  function makeProvenanceWritingGenerator(isolatedWorktree, capture) {
    return async (packet) => {
      const bundleDir = resolvePath(isolatedWorktree, 'docs/harness-feedback/bundles', packet.id);
      mkdirSync(bundleDir, { recursive: true });
      writeFileSync(
        resolvePath(bundleDir, 'provenance.json'),
        JSON.stringify(
          {
            verdictId: packet.id,
            rawInputs: [{ path: 'snapshots/x.yaml', sha256: 'abc' }],
            generatedAt: '2026-07-16T03:00:00.000Z',
            generator: { name: 'test-gen', version: '1' },
          },
          null,
          2,
        ),
      );
      capture.bundleDir = bundleDir;
      return {
        verdictPath: resolvePath(isolatedWorktree, 'docs/harness-feedback/verdicts', `${packet.id}.md`),
        bundleDir,
      };
    };
  }

  it('stamps provenance.json + PR body with systemThreadId when publishing (agent-key fallback path)', async () => {
    const isolatedWorktree = makeEmptyIsolatedWorktree();
    const capture = {};
    let capturedPrBody = '';
    const mockGitPublisher = {
      async publishOnIsolatedWorktree(opts) {
        const stageResult = await opts.stage(isolatedWorktree);
        capturedPrBody = stageResult.prBody;
        return { commitSha: 'sha1', prUrl: 'https://github.com/xu75/clowder-ai/pull/9999' };
      },
    };
    const result = await handlePublishVerdict(
      {
        harnessFeedbackRoot: root,
        gitPublisher: mockGitPublisher,
        generator: makeProvenanceWritingGenerator(isolatedWorktree, capture),
      },
      {
        packet: buildPacket({ id: 'vhp-thread-test', domainId: 'eval:a2a' }),
        domain: 'eval:a2a',
        catId: 'codex',
        // no principalThreadId → agent-key fallback → registry systemThreadId
        sourceRefs: { snapshotName: 'snap.yaml', attributionName: 'attr.yaml' },
      },
    );

    assert.ok(!('error' in result), `expected success, got ${JSON.stringify(result)}`);
    // provenance.json got the stamp
    const provenance = JSON.parse(readFileSync(resolvePath(capture.bundleDir, 'provenance.json'), 'utf8'));
    assert.equal(provenance.sourceThreadId, 'thread_eval_a2a');
    // PR body carries the traceability line
    assert.match(capturedPrBody, /Source thread: thread_eval_a2a/);
    rmSync(isolatedWorktree, { recursive: true, force: true });
  });

  it('uses the trusted invocation threadId when it matches the domain', async () => {
    const isolatedWorktree = makeEmptyIsolatedWorktree();
    const capture = {};
    const mockGitPublisher = {
      async publishOnIsolatedWorktree(opts) {
        await opts.stage(isolatedWorktree);
        return { commitSha: 'sha1', prUrl: 'https://github.com/xu75/clowder-ai/pull/9999' };
      },
    };
    const result = await handlePublishVerdict(
      {
        harnessFeedbackRoot: root,
        gitPublisher: mockGitPublisher,
        generator: makeProvenanceWritingGenerator(isolatedWorktree, capture),
      },
      {
        packet: buildPacket({ id: 'vhp-thread-match', domainId: 'eval:a2a' }),
        domain: 'eval:a2a',
        catId: 'codex',
        principalThreadId: 'thread_eval_a2a',
        sourceRefs: { snapshotName: 'snap.yaml', attributionName: 'attr.yaml' },
      },
    );
    assert.ok(!('error' in result), `expected success, got ${JSON.stringify(result)}`);
    const provenance = JSON.parse(readFileSync(resolvePath(capture.bundleDir, 'provenance.json'), 'utf8'));
    assert.equal(provenance.sourceThreadId, 'thread_eval_a2a');
    rmSync(isolatedWorktree, { recursive: true, force: true });
  });

  it('rejects with 403 source_thread_mismatch when invocation thread ≠ domain thread (fail-closed, generator never runs)', async () => {
    let generatorRan = false;
    const mockGitPublisher = {
      async publishOnIsolatedWorktree(opts) {
        await opts.stage(makeEmptyIsolatedWorktree());
        return { commitSha: 'unreachable', prUrl: 'unreachable' };
      },
    };
    const result = await handlePublishVerdict(
      {
        harnessFeedbackRoot: root,
        gitPublisher: mockGitPublisher,
        generator: async () => {
          generatorRan = true;
          return { verdictPath: '/x', bundleDir: '/x' };
        },
      },
      {
        packet: buildPacket({ id: 'vhp-thread-mismatch', domainId: 'eval:a2a' }),
        domain: 'eval:a2a',
        catId: 'codex',
        principalThreadId: 'thread_wrong',
        sourceRefs: { snapshotName: 'snap.yaml', attributionName: 'attr.yaml' },
      },
    );
    assert.ok('error' in result);
    assert.equal(result.status, 403);
    assert.equal(result.error, 'source_thread_mismatch');
    assert.equal(generatorRan, false, 'fail-closed must reject BEFORE running the generator');
  });
});
