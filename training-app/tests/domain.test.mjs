import test from "node:test";
import assert from "node:assert/strict";
import {
  planFor,
  localDay,
  weekDays,
  timerReading,
  pauseTimer,
  sessionStatus,
} from "../src/lib/domain.js";
import {
  freshData,
  validateData,
  loadStore,
  persist,
  KEY,
  LEGACY_KEYS,
} from "../src/lib/storage.js";
const memory = () => {
  const m = new Map();
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => m.set(k, v),
    removeItem: (k) => m.delete(k),
  };
};
test("weekly and recovery plans use the chosen date; progression is manual", () => {
  const s = freshData().settings;
  assert.equal(planFor("2026-10-21", s).length, 6);
  assert.equal(planFor("2026-10-22", s).length, 3);
  assert.equal(planFor("2026-10-21", s, true).length, 1);
  assert.equal(planFor("2027-10-20", s).find((x) => x.id === "reach").reps, 6);
  assert.equal(
    planFor("2026-10-21", { ...s, phase: 2 }).find((x) => x.id === "reach")
      .reps,
    8,
  );
});
test("local calendar stays stable across DST and starts Monday", () => {
  assert.equal(localDay(new Date(2026, 9, 22, 0, 5)), "2026-10-22");
  assert.equal(weekDays("2026-10-25")[0], "2026-10-19");
});
test("timer catches up after backgrounding but never completes a set", () => {
  const t = { duration: 60, remaining: 60, startedAt: 1000 };
  assert.equal(timerReading(t, 31000), 30);
  assert.equal(timerReading(t, 100000), 0);
  const paused = pauseTimer(t, 21000);
  assert.equal(timerReading(paused, 900000), 40);
});
test("less than planned reps are partial even when the set was marked finished", () => {
  const plan = [{ id: "walk", reps: 10, sets: 1, seconds: 600 }];
  assert.equal(
    sessionStatus(plan, [
      { exerciseId: "walk", set: 1, state: "done", reps: 5 },
    ]),
    "partial",
  );
  assert.equal(
    sessionStatus(plan, [
      { exerciseId: "walk", set: 1, state: "done", reps: 10 },
    ]),
    "complete",
  );
  assert.equal(
    sessionStatus(plan, [
      { exerciseId: "walk", set: 1, state: "skipped", reps: 0 },
    ]),
    "partial",
  );
});
test("migration removes only known old training keys after successful initial save", () => {
  const s = memory();
  LEGACY_KEYS.forEach((k) => s.setItem(k, "old"));
  s.setItem("resume", "keep");
  const result = loadStore(s);
  assert.equal(result.error, "");
  assert.equal(s.getItem("resume"), "keep");
  LEGACY_KEYS.forEach((k) => assert.equal(s.getItem(k), null));
  assert.equal(JSON.parse(s.getItem(KEY)).version, 1);
});
test("corrupt new data is preserved and is not silently overwritten", () => {
  const s = memory();
  s.setItem(KEY, "{broken");
  assert.ok(loadStore(s).error);
  assert.equal(s.getItem(KEY), "{broken");
  assert.throws(() => persist(s, freshData(), 0));
});
test("storage failure is visible and never deletes legacy data", () => {
  const s = memory();
  s.setItem("rehabRecords", "old");
  s.setItem = () => {
    throw Error("QuotaExceededError");
  };
  assert.ok(loadStore(s).error);
  assert.equal(s.getItem("rehabRecords"), "old");
});
test("stale tab updates cannot silently overwrite a new revision", () => {
  const s = memory();
  const d = loadStore(s).data;
  const next = persist(s, d, 0);
  assert.equal(next.revision, 1);
  assert.throws(() => persist(s, d, 0), /其他页面/);
  s.removeItem(KEY);
  assert.throws(() => persist(s, next, 1), /清除了记录/);
});
test("reload durably pauses a running timer, including a second reload", () => {
  const s = memory();
  const d = freshData();
  d.session = {
    date: localDay(),
    plan: [{ id: "nod", reps: 5, sets: 1, seconds: 40 }],
    index: 0,
    setIndex: 1,
    sets: [],
    before: null,
    mode: "exercise",
    startedAt: Date.now() - 10000,
    timer: { duration: 40, remaining: 40, startedAt: Date.now() - 10000 },
  };
  s.setItem(KEY, JSON.stringify(d));
  const first = loadStore(s);
  assert.equal(first.error, "");
  assert.equal(first.data.session.timer.startedAt, null);
  const persisted = JSON.parse(s.getItem(KEY));
  assert.equal(persisted.session.timer.startedAt, null);
  assert.equal(
    loadStore(s).data.session.timer.remaining,
    first.data.session.timer.remaining,
  );
  assert.equal(persisted.revision, 1);
});
test("imported complete records must contain the actual prescribed repetitions", () => {
  const d = freshData();
  const date = localDay();
  d.records[date] = {
    date,
    status: "complete",
    plan: [{ id: "walk", reps: 10, sets: 1, seconds: 600 }],
    sets: [
      { exerciseId: "walk", set: 1, reps: 5, state: "done", weight: null },
    ],
    before: null,
    after: null,
    nextMorning: "",
    note: "",
    updatedAt: Date.now(),
  };
  assert.throws(() => validateData(d));
  d.records[date].sets[0].reps = 10;
  assert.equal(validateData(d).records[date].status, "complete");
});
test("import validation rejects invalid dates, unknown IDs and prototype payloads", () => {
  assert.equal(validateData(freshData()).version, 1);
  assert.throws(() => validateData({ ...freshData(), version: 2 }));
  assert.throws(() =>
    validateData(JSON.parse('{"__proto__":{"polluted":true}}')),
  );
  assert.throws(() =>
    validateData({ ...freshData(), records: { "2026-02-30": {} } }),
  );
  assert.throws(() =>
    validateData({
      ...freshData(),
      settings: { ...freshData().settings, extraDays: [8] },
    }),
  );
});
