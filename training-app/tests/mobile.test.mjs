import test from "node:test";
import assert from "node:assert/strict";
import {
  createSetEntry,
  allSetsRecorded,
  watchCountdown,
} from "../src/lib/session.js";
import { createWakeLockController } from "../src/lib/wakeLock.js";

test("skip ignores invalid draft values; finishing requires an explicit valid count", () => {
  const item = { id: "squat", reps: 8, sets: 2 };
  assert.deepEqual(createSetEntry(item, 1, "skipped", "999", "-4"), {
    exerciseId: "squat",
    set: 1,
    state: "skipped",
    reps: 0,
    weight: null,
  });
  for (const value of ["", " ", "999", "-1", "1.5"])
    assert.throws(() => createSetEntry(item, 1, "done", value, ""));
  assert.equal(createSetEntry(item, 1, "done", "0", "").reps, 0);
});
test("finished-session recovery includes skipped sets but requires every distinct set", () => {
  const plan = [{ id: "squat", sets: 2 }];
  const sets = [
    { exerciseId: "squat", set: 1, state: "skipped" },
    { exerciseId: "squat", set: 2, state: "done" },
  ];
  assert.equal(allSetsRecorded(plan, sets), true);
  assert.equal(allSetsRecorded(plan, [sets[0], sets[0]]), false);
});
test("countdown stops scheduling after zero and unsubscribes when hidden", () => {
  let now = 1000,
    next,
    cancelled = 0;
  const values = [];
  const adapter = {
    now: () => now,
    schedule: (fn) => {
      next = fn;
      return 1;
    },
    cancel: () => {
      next = null;
      cancelled++;
    },
  };
  const stop = watchCountdown(
    { duration: 2, remaining: 2, startedAt: 1000 },
    (n) => values.push(n),
    adapter,
  );
  now = 5000;
  const tick = next;
  next = null;
  tick();
  assert.equal(values.at(-1), 5000);
  assert.equal(next, null);
  stop();
  const stopActive = watchCountdown(
    { duration: 60, remaining: 60, startedAt: 1000 },
    () => {},
    adapter,
  );
  stopActive();
  assert.equal(next, null);
  assert.ok(cancelled > 0);
});
function lock() {
  let listener;
  return {
    released: false,
    releases: 0,
    addEventListener: (_, fn) => {
      listener = fn;
    },
    async release() {
      this.released = true;
      this.releases++;
      listener?.();
    },
  };
}
test("wake requests coalesce and late permission results are released after exit", async () => {
  let resolve,
    calls = 0;
  const statuses = [];
  const c = createWakeLockController({
    requestLock: () => {
      calls++;
      return new Promise((r) => (resolve = r));
    },
    isVisible: () => true,
    onStatus: (s) => statuses.push(s),
  });
  const first = c.request();
  c.request();
  await Promise.resolve();
  assert.equal(calls, 1);
  c.dispose();
  const late = lock();
  resolve(late);
  await first;
  assert.equal(late.releases, 1);
  assert.notEqual(statuses.at(-1), "已开启");
});
test("wake resumes after a page lifecycle release and avoids hidden requests", async () => {
  let visible = true,
    calls = 0;
  const statuses = [];
  const c = createWakeLockController({
    requestLock: async () => {
      calls++;
      return lock();
    },
    isVisible: () => visible,
    onStatus: (s) => statuses.push(s),
  });
  await c.request();
  assert.equal(statuses.at(-1), "已开启");
  visible = false;
  c.release();
  await c.request();
  assert.equal(calls, 1);
  visible = true;
  await c.request();
  assert.equal(calls, 2);
  assert.equal(statuses.at(-1), "已开启");
  c.dispose();
});
test("wake denial is truthful and a manual retry can succeed", async () => {
  let denied = true;
  const statuses = [];
  const c = createWakeLockController({
    requestLock: async () => {
      if (denied) throw Error("NotAllowedError");
      return lock();
    },
    isVisible: () => true,
    onStatus: (s) => statuses.push(s),
  });
  await c.request();
  assert.match(statuses.at(-1), /未能开启/);
  denied = false;
  await c.request();
  assert.equal(statuses.at(-1), "已开启");
  c.dispose();
});
test("unsupported wake API remains a readable fallback", async () => {
  const statuses = [];
  const c = createWakeLockController({
    requestLock: null,
    isVisible: () => true,
    onStatus: (s) => statuses.push(s),
  });
  await c.request();
  assert.match(statuses.at(-1), /不支持/);
  c.dispose();
});
