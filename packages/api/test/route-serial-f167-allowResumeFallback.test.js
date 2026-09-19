/**
 * F167: route-serial must propagate allowResumeFallback from options to invokeSingleCat.
 *
 * This test verifies that when routeSerial receives options.allowResumeFallback,
 * it correctly passes it through to the service invoke() call, which eventually
 * reaches CodexAgentService for recovery decisions.
 */

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

function createMockServiceForF167(catId, captureOptions) {
  return {
    async *invoke(prompt, options) {
      captureOptions.push({ catId, options });
      yield { type: 'text', catId, content: 'test response', timestamp: Date.now() };
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

describe('F167: route-serial allowResumeFallback propagation', () => {
  it('propagates allowResumeFallback=true to service invoke() options', async () => {
    const { routeSerial } = await import('../dist/domains/cats/services/agents/routing/route-serial.js');
    const capturedOptions = [];
    const deps = createMockDeps({
      opus: createMockServiceForF167('opus', capturedOptions),
    });

    const yielded = [];
    for await (const msg of routeSerial(deps, ['opus'], 'test prompt', 'user1', 'thread1', {
      allowResumeFallback: true,
    })) {
      yielded.push(msg);
    }

    assert.equal(capturedOptions.length, 1, 'service invoke must be called once');
    assert.equal(capturedOptions[0].options.allowResumeFallback, true, 'allowResumeFallback=true must propagate');
  });

  it('propagates allowResumeFallback=false to service invoke() options', async () => {
    const { routeSerial } = await import('../dist/domains/cats/services/agents/routing/route-serial.js');
    const capturedOptions = [];
    const deps = createMockDeps({
      opus: createMockServiceForF167('opus', capturedOptions),
    });

    const yielded = [];
    for await (const msg of routeSerial(deps, ['opus'], 'test prompt', 'user1', 'thread1', {
      allowResumeFallback: false,
    })) {
      yielded.push(msg);
    }

    assert.equal(capturedOptions.length, 1, 'service invoke must be called once');
    assert.equal(capturedOptions[0].options.allowResumeFallback, false, 'allowResumeFallback=false must propagate');
  });

  it('does not pass allowResumeFallback when options.allowResumeFallback is undefined', async () => {
    const { routeSerial } = await import('../dist/domains/cats/services/agents/routing/route-serial.js');
    const capturedOptions = [];
    const deps = createMockDeps({
      opus: createMockServiceForF167('opus', capturedOptions),
    });

    const yielded = [];
    for await (const msg of routeSerial(deps, ['opus'], 'test prompt', 'user1', 'thread1', {
      // No allowResumeFallback in options
    })) {
      yielded.push(msg);
    }

    assert.equal(capturedOptions.length, 1, 'service invoke must be called once');
    assert.equal(
      capturedOptions[0].options.allowResumeFallback,
      undefined,
      'allowResumeFallback must be undefined when not provided',
    );
  });
});
