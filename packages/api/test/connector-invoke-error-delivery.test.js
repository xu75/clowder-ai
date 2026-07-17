import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import './helpers/setup-cat-registry.js';
import { ConnectorInvokeTrigger } from '../dist/infrastructure/email/ConnectorInvokeTrigger.js';

function noopLog() {
  const noop = () => {};
  return {
    info: noop,
    warn: noop,
    error: noop,
    debug: noop,
    trace: noop,
    fatal: noop,
    child: () => noopLog(),
  };
}

function mockInvocationRecordStore() {
  return {
    async create(opts) {
      return { outcome: 'created', invocationId: 'inv-test-001' };
    },
    async update() {},
  };
}

function mockInvocationTracker() {
  return {
    has: () => false,
    start: () => ({ signal: { aborted: false } }),
    complete: () => {},
  };
}

function mockInvocationQueue() {
  return {
    hasQueuedUserMessagesForThread: () => false,
    hasActiveOrQueuedAgentForCat: () => false,
  };
}

function mockSocketManager() {
  const messages = [];
  return {
    messages,
    broadcastToRoom() {},
    broadcastAgentMessage(msg) {
      messages.push(msg);
    },
  };
}

describe('ConnectorInvokeTrigger error delivery', () => {
  let outboundDelivered;
  let placeholdersCleaned;
  let trigger;
  let socketManager;

  beforeEach(() => {
    outboundDelivered = [];
    placeholdersCleaned = [];
    socketManager = mockSocketManager();
  });

  function createTrigger(routerBehavior) {
    const router = {
      async *routeExecution() {
        if (routerBehavior === 'throw') throw new Error('CLI session unavailable');
        if (routerBehavior === 'empty') return;
      },
      async ackCollectedCursors() {},
    };

    return new ConnectorInvokeTrigger({
      router,
      socketManager,
      invocationRecordStore: mockInvocationRecordStore(),
      invocationTracker: mockInvocationTracker(),
      invocationQueue: mockInvocationQueue(),
      outboundHook: {
        async deliver(threadId, content, catId) {
          outboundDelivered.push({ threadId, content, catId });
        },
      },
      streamingHook: {
        async onStreamStart() {},
        async onStreamChunk() {},
        async onStreamEnd() {},
        async cleanupPlaceholders(threadId, invocationId) {
          placeholdersCleaned.push({ threadId, invocationId });
        },
        async notifyDeliveryBatchDone() {},
      },
      log: noopLog(),
    });
  }

  it('delivers error message to connector when invocation throws', async () => {
    trigger = createTrigger('throw');
    trigger.trigger('thread-1', 'opus', 'user-1', 'hello', 'msg-1');
    // Wait for background execution
    await new Promise((r) => setTimeout(r, 100));

    assert.equal(outboundDelivered.length, 1);
    assert.match(outboundDelivered[0].content, /抱歉/);
    assert.equal(outboundDelivered[0].threadId, 'thread-1');
  });

  it('cleans up placeholder when invocation throws', async () => {
    trigger = createTrigger('throw');
    trigger.trigger('thread-1', 'opus', 'user-1', 'hello', 'msg-1');
    await new Promise((r) => setTimeout(r, 100));

    assert.equal(placeholdersCleaned.length, 1);
    assert.equal(placeholdersCleaned[0].threadId, 'thread-1');
  });

  it('delivers fallback message when invocation produces no content', async () => {
    trigger = createTrigger('empty');
    trigger.trigger('thread-2', 'opus', 'user-1', 'hello', 'msg-2');
    await new Promise((r) => setTimeout(r, 100));

    assert.equal(outboundDelivered.length, 1);
    assert.match(outboundDelivered[0].content, /未能生成回复/);
    assert.equal(outboundDelivered[0].threadId, 'thread-2');
  });

  it('cleans up placeholder when invocation produces no content', async () => {
    trigger = createTrigger('empty');
    trigger.trigger('thread-2', 'opus', 'user-1', 'hello', 'msg-2');
    await new Promise((r) => setTimeout(r, 100));

    assert.equal(placeholdersCleaned.length, 1);
    assert.equal(placeholdersCleaned[0].threadId, 'thread-2');
  });
});
