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
 *
 * The publisher must preserve the trusted invocation thread when it matches the
 * domain, fall back to the registered system thread for agent-key calls, reject
 * cross-thread publication before generation, and stamp the generated bundle
 * centrally without overwriting existing provenance.
 */

describe('resolveSourceThreadId', () => {
  it('uses a matching trusted invocation threadId verbatim', () => {
    const result = resolveSourceThreadId('thread_eval_a2a', 'thread_eval_a2a');
    assert.equal(result.ok, true);
    assert.equal(result.sourceThreadId, 'thread_eval_a2a');
  });

  it('falls back to the registered systemThreadId for agent-key calls', () => {
    const result = resolveSourceThreadId(undefined, 'thread_eval_a2a');
    assert.equal(result.ok, true);
    assert.equal(result.sourceThreadId, 'thread_eval_a2a');
  });

  it('rejects a cross-thread invocation with 403 instead of relabeling it', () => {
    const result = resolveSourceThreadId('thread_some_other', 'thread_eval_a2a');
    assert.equal(result.ok, false);
    assert.equal(result.error.status, 403);
    assert.equal(result.error.error, 'source_thread_mismatch');
    assert.match(result.error.detail, /thread_some_other/);
    assert.match(result.error.detail, /thread_eval_a2a/);
  });
});

describe('stampSourceThreadId', () => {
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

    const stamped = JSON.parse(readFileSync(resolvePath(bundleDir, 'provenance.json'), 'utf8'));
    assert.equal(stamped.sourceThreadId, 'thread_eval_a2a');
    assert.equal(stamped.verdictId, 'v1');
    assert.equal(stamped.generator.name, 'eval-a2a-live-verdict');
    assert.equal(stamped.rawInputs[0].sha256, 'abc');
    assert.equal(stamped.sanitizeRulesVersion, '1');
    rmSync(bundleDir, { recursive: true, force: true });
  });

  it('fails closed when provenance.json is missing', () => {
    const emptyDir = mkdtempSync(`${tmpdir()}/stamp-empty-`);
    assert.throws(() => stampSourceThreadId(emptyDir, 'thread_eval_a2a'), /provenance_stamp_failed/);
    rmSync(emptyDir, { recursive: true, force: true });
  });
});

function makeEmptyIsolatedWorktree() {
  return mkdtempSync(`${tmpdir()}/source-thread-iso-`);
}

describe('handlePublishVerdict sourceThreadId integration', () => {
  let root;

  before(() => {
    root = setupHarnessFeedback();
  });

  after(() => {
    rmSync(root, { recursive: true, force: true });
  });

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

  it('stamps provenance and the PR body through the agent-key fallback path', async () => {
    const isolatedWorktree = makeEmptyIsolatedWorktree();
    const capture = {};
    let capturedPrBody = '';
    const mockGitPublisher = {
      async publishOnIsolatedWorktree(options) {
        const stageResult = await options.stage(isolatedWorktree);
        capturedPrBody = stageResult.prBody;
        return {
          commitSha: 'sha1',
          prUrl: 'https://github.com/xu75/clowder-ai/pull/9999',
        };
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
        sourceRefs: { snapshotName: 'snap.yaml', attributionName: 'attr.yaml' },
      },
    );

    assert.ok(!('error' in result), `expected success, got ${JSON.stringify(result)}`);
    const provenance = JSON.parse(readFileSync(resolvePath(capture.bundleDir, 'provenance.json'), 'utf8'));
    assert.equal(provenance.sourceThreadId, 'thread_eval_a2a');
    assert.match(capturedPrBody, /Source thread: thread_eval_a2a/);
    rmSync(isolatedWorktree, { recursive: true, force: true });
  });

  it('uses a matching trusted invocation threadId', async () => {
    const isolatedWorktree = makeEmptyIsolatedWorktree();
    const capture = {};
    const mockGitPublisher = {
      async publishOnIsolatedWorktree(options) {
        await options.stage(isolatedWorktree);
        return {
          commitSha: 'sha1',
          prUrl: 'https://github.com/xu75/clowder-ai/pull/9999',
        };
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

  it('rejects cross-thread publication before the generator runs', async () => {
    let generatorRan = false;
    const mockGitPublisher = {
      async publishOnIsolatedWorktree(options) {
        await options.stage(makeEmptyIsolatedWorktree());
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
    assert.equal(generatorRan, false);
  });
});
