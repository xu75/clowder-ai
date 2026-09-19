/**
 * F167: route-parallel must propagate allowResumeFallback from options to all parallel invokeSingleCat calls.
 *
 * This test verifies that when routeParallel receives options.allowResumeFallback,
 * it correctly passes it through to each parallel service invoke() call.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

function createMockServiceForF167(catId, captureOptions) {
  return {
    async *invoke(_prompt, options) {
      captureOptions.push({ catId, options });
      yield { type: 'text', catId, content: `response from ${catId}`, timestamp: Date.now() };
      yield { type: 'done', catId, timestamp: Date.now() };
    },
  };
}

function createMockDeps(services) {
  let invocationSeq = 0;
  let messageSeq = 0;

  return {
    services,
    invocationDeps: {
      registry: {
        create: () => ({ invocationId: `inv-${++invocationSeq}`, callbackToken: `tok-${invocationSeq}` }),
        verify: () => ({ ok: false, reason: 'unknown_invocation' }),
      },
      sessionManager: {
        get: async () => null,
        getOrCreate: async () => ({}),
        resolveWorkingDirectory: () => '/tmp/test',
      },
      threadStore: null,
      apiUrl: 'http://127.0.0.1:3004',
    },
    messageStore: {
      append: async (msg) => ({
        id: `msg-${++messageSeq}`,
        ...msg,
        threadId: msg.threadId ?? 'default',
      }),
      getById: async () => null,
      getRecent: () => [],
      getMentionsFor: () => [],
      getRecentMentionsFor: () => [],
    },
    socketManager: {
      broadcastToRoom: () => {},
    },
    draftStore: {
      delete: () => Promise.resolve(),
      touch: () => Promise.resolve(),
      upsert: () => Promise.resolve(),
    },
    voiceMode: false,
  };
}

describe('F167: route-parallel allowResumeFallback propagation', () => {
  it('propagates allowResumeFallback=true to all parallel service invoke() calls', async () => {
    const { routeParallel } = await import('../dist/domains/cats/services/agents/routing/route-parallel.js');
    const capturedOptions = [];
    const deps = createMockDeps({
      opus: createMockServiceForF167('opus', capturedOptions),
      codex: createMockServiceForF167('codex', capturedOptions),
    });

    const yielded = [];
    for await (const msg of routeParallel(deps, ['opus', 'codex'], 'test prompt', 'user1', 'thread1', {
      allowResumeFallback: true,
    })) {
      yielded.push(msg);
    }

    assert.equal(capturedOptions.length, 2, 'both services must be invoked');
    assert.equal(
      capturedOptions[0].options.allowResumeFallback,
      true,
      'first parallel call must have allowResumeFallback=true',
    );
    assert.equal(
      capturedOptions[1].options.allowResumeFallback,
      true,
      'second parallel call must have allowResumeFallback=true',
    );
  });

  it('propagates allowResumeFallback=false to all parallel service invoke() calls', async () => {
    const { routeParallel } = await import('../dist/domains/cats/services/agents/routing/route-parallel.js');
    const capturedOptions = [];
    const deps = createMockDeps({
      opus: createMockServiceForF167('opus', capturedOptions),
      codex: createMockServiceForF167('codex', capturedOptions),
    });

    const yielded = [];
    for await (const msg of routeParallel(deps, ['opus', 'codex'], 'test prompt', 'user1', 'thread1', {
      allowResumeFallback: false,
    })) {
      yielded.push(msg);
    }

    assert.equal(capturedOptions.length, 2, 'both services must be invoked');
    assert.equal(
      capturedOptions[0].options.allowResumeFallback,
      false,
      'first parallel call must have allowResumeFallback=false',
    );
    assert.equal(
      capturedOptions[1].options.allowResumeFallback,
      false,
      'second parallel call must have allowResumeFallback=false',
    );
  });

  it('does not pass allowResumeFallback when options.allowResumeFallback is undefined', async () => {
    const { routeParallel } = await import('../dist/domains/cats/services/agents/routing/route-parallel.js');
    const capturedOptions = [];
    const deps = createMockDeps({
      opus: createMockServiceForF167('opus', capturedOptions),
      codex: createMockServiceForF167('codex', capturedOptions),
    });

    const yielded = [];
    for await (const msg of routeParallel(deps, ['opus', 'codex'], 'test prompt', 'user1', 'thread1', {
      // No allowResumeFallback in options
    })) {
      yielded.push(msg);
    }

    assert.equal(capturedOptions.length, 2, 'both services must be invoked');
    assert.equal(
      capturedOptions[0].options.allowResumeFallback,
      undefined,
      'first parallel call must have undefined allowResumeFallback',
    );
    assert.equal(
      capturedOptions[1].options.allowResumeFallback,
      undefined,
      'second parallel call must have undefined allowResumeFallback',
    );
  });
});
