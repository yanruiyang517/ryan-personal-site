import test from "node:test";
import assert from "node:assert/strict";
import { freshData, validateData } from "../src/lib/storage.js";

function fixture() {
  const d = freshData();
  const plan = [{ id: "nod", reps: 5, sets: 1, seconds: 40 }];
  d.session = {
    date: "2026-10-22",
    plan,
    index: 0,
    setIndex: 1,
    sets: [],
    before: null,
    mode: "exercise",
    startedAt: 1000,
    timer: { duration: 40, remaining: 40, startedAt: null },
  };
  d.records["2026-10-22"] = {
    date: "2026-10-22",
    status: "partial",
    plan,
    sets: [],
    before: 6,
    after: 4,
    nextMorning: "same",
    note: "原有记录",
    updatedAt: 1000,
  };
  return d;
}

test("existing records keep scores and notes when qualitative feedback is absent", () => {
  const d = validateData(fixture());
  assert.equal(d.records["2026-10-22"].before, 6);
  assert.equal(d.records["2026-10-22"].note, "原有记录");
  assert.equal(d.records["2026-10-22"].readiness, "");
  assert.equal(d.records["2026-10-22"].afterFeeling, "");
  assert.equal(d.session.readiness, "");
});

test("qualitative feedback survives serialization and invalid values are rejected", () => {
  const d = fixture();
  d.session.readiness = "gentle";
  d.records["2026-10-22"].readiness = "ready";
  d.records["2026-10-22"].afterFeeling = "worse";
  const restored = validateData(JSON.parse(JSON.stringify(validateData(d))));
  assert.equal(restored.session.readiness, "gentle");
  assert.equal(restored.records["2026-10-22"].afterFeeling, "worse");
  assert.equal(restored.records["2026-10-22"].readiness, "ready");
  for (const value of ["unknown", null, {}, 3]) {
    assert.throws(() =>
      validateData({ ...d, session: { ...d.session, readiness: value } }),
    );
    assert.throws(() =>
      validateData({
        ...d,
        records: {
          "2026-10-22": { ...d.records["2026-10-22"], afterFeeling: value },
        },
      }),
    );
  }
});
