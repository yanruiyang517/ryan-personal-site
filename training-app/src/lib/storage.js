import {
  EXERCISE_IDS,
  validDay,
  localDay,
  pauseTimer,
  sessionStatus,
  READINESS_LABELS,
  FEELING_LABELS,
} from "./domain.js";
export const KEY = "move.personal.v1";
export const LEGACY_KEYS = [
  "rehabPro.v4",
  "rehabPro.v3",
  "rehabPro.v2",
  "rehabRecords",
  "rehabGuideSeen",
  "rehabWakeLockEnabled",
];
export function freshData() {
  return {
    version: 1,
    revision: 0,
    settings: {
      phase: 1,
      extraDays: [1, 3, 6],
      rest: 60,
      wake: true,
      handleWeight: "",
    },
    records: {},
    session: null,
  };
}
const fail = () => {
  throw Error("数据格式不正确，原有记录未被替换。");
};
function num(v, min, max) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < min || v > max)
    fail();
  return v;
}
function int(v, min, max) {
  num(v, min, max);
  if (!Number.isInteger(v)) fail();
  return v;
}
function str(v, max = 1000) {
  if (typeof v !== "string" || v.length > max) fail();
  return v;
}
function obj(v) {
  if (
    !v ||
    Array.isArray(v) ||
    typeof v !== "object" ||
    Object.keys(v).some((k) =>
      ["__proto__", "prototype", "constructor"].includes(k),
    )
  )
    fail();
  return v;
}
function day(v) {
  if (!validDay(v) || v > localDay() || v < "2020-01-01") fail();
  return v;
}
function score(v) {
  return v === null ? null : num(v, 0, 10);
}
function feedback(v, labels) {
  if (v === undefined) return "";
  if (typeof v !== "string" || !Object.hasOwn(labels, v)) fail();
  return v;
}
function items(v) {
  if (!Array.isArray(v) || v.length > 7 || v.length < 1) fail();
  const ids = new Set();
  return v.map((x) => {
    obj(x);
    if (!EXERCISE_IDS.includes(x.id) || ids.has(x.id)) fail();
    ids.add(x.id);
    return {
      id: x.id,
      reps: int(x.reps, 1, 100),
      sets: int(x.sets, 1, 5),
      seconds: int(x.seconds, 1, 3600),
    };
  });
}
function setList(v, plan) {
  if (!Array.isArray(v) || v.length > 35) fail();
  const seen = new Set();
  return v.map((x) => {
    obj(x);
    const p = plan.find((p) => p.id === x.exerciseId);
    if (!p || !["done", "skipped"].includes(x.state)) fail();
    const index = int(x.set, 1, p.sets);
    const key = `${x.exerciseId}-${index}`;
    if (seen.has(key)) fail();
    seen.add(key);
    return {
      exerciseId: x.exerciseId,
      set: index,
      reps: int(x.reps, 0, 200),
      state: x.state,
      weight: x.weight === null ? null : num(x.weight, 0, 100),
    };
  });
}
export function validateData(value) {
  const v = obj(value);
  if (v.version !== 1) fail();
  const s = obj(v.settings);
  if (
    !Array.isArray(s.extraDays) ||
    s.extraDays.length > 7 ||
    new Set(s.extraDays).size !== s.extraDays.length
  )
    fail();
  if (typeof s.wake !== "boolean" || ![45, 60, 90].includes(s.rest)) fail();
  const settings = {
    phase: int(s.phase, 1, 3),
    extraDays: s.extraDays.map((n) => int(n, 0, 6)),
    rest: s.rest,
    wake: s.wake,
    handleWeight: str(s.handleWeight, 10),
  };
  if (
    settings.handleWeight !== "" &&
    (!Number.isFinite(Number(settings.handleWeight)) ||
      Number(settings.handleWeight) < 0 ||
      Number(settings.handleWeight) > 30)
  )
    fail();
  const records = {};
  obj(v.records);
  if (Object.keys(v.records).length > 5000) fail();
  for (const [key, r] of Object.entries(v.records)) {
    day(key);
    obj(r);
    if (
      r.date !== key ||
      !["complete", "partial", "rest", "stopped"].includes(r.status)
    )
      fail();
    const plan = items(r.plan);
    records[key] = {
      date: key,
      status: r.status,
      plan,
      sets: setList(r.sets, plan),
      before: score(r.before),
      after: score(r.after),
      readiness: feedback(r.readiness, READINESS_LABELS),
      afterFeeling: feedback(r.afterFeeling, FEELING_LABELS),
      nextMorning: str(r.nextMorning, 20),
      note: str(r.note),
      updatedAt: num(r.updatedAt, 0, 1e15),
    };
    if (!["", "better", "same", "worse"].includes(r.nextMorning)) fail();
    if (
      r.status === "complete" &&
      sessionStatus(plan, records[key].sets) !== "complete"
    )
      fail();
  }
  let session = null;
  if (v.session !== null) {
    const x = obj(v.session);
    const plan = items(x.plan);
    const t = obj(x.timer);
    if (!["exercise", "rest"].includes(x.mode)) fail();
    session = {
      date: day(x.date),
      plan,
      index: int(x.index, 0, plan.length - 1),
      setIndex: int(x.setIndex, 1, plan[x.index].sets),
      sets: setList(x.sets, plan),
      before: score(x.before),
      readiness: feedback(x.readiness, READINESS_LABELS),
      mode: x.mode,
      startedAt: num(x.startedAt, 0, 1e15),
      timer: {
        duration: num(t.duration, 1, 3600),
        remaining: num(t.remaining, 0, 3600),
        startedAt: t.startedAt === null ? null : num(t.startedAt, 0, 1e15),
      },
    };
  }
  return {
    version: 1,
    revision: int(v.revision, 0, Number.MAX_SAFE_INTEGER),
    settings,
    records,
    session,
  };
}
export function loadStore(storage) {
  try {
    const raw = storage.getItem(KEY);
    if (raw !== null) {
      const data = validateData(JSON.parse(raw));
      if (data.session && data.session.timer.startedAt !== null) {
        data.session.timer = pauseTimer(data.session.timer);
        data.revision += 1;
        storage.setItem(KEY, JSON.stringify(data));
      }
      return { data, error: "" };
    }
    const data = freshData();
    storage.setItem(KEY, JSON.stringify(data));
    LEGACY_KEYS.forEach((k) => storage.removeItem(k));
    return { data, error: "" };
  } catch {
    return {
      data: freshData(),
      error:
        "本地数据暂时无法读取或保存。请先到设置导出原始数据；修复或重置前不会覆盖它。",
    };
  }
}
export function persist(storage, next, expectedRevision) {
  const raw = storage.getItem(KEY);
  if (raw === null && expectedRevision !== 0)
    throw Error("其他页面清除了记录。请刷新后重试，当前输入仍保留。");
  if (raw !== null) {
    const existing = validateData(JSON.parse(raw));
    if (existing.revision !== expectedRevision)
      throw Error("其他页面更新了记录。请刷新后重试，当前输入仍保留。");
  }
  const data = validateData({ ...next, revision: expectedRevision + 1 });
  storage.setItem(KEY, JSON.stringify(data));
  return data;
}
export function parseImport(text) {
  if (text.length > 2_000_000)
    throw Error("备份文件过大，请选择本站导出的 JSON。");
  return validateData(JSON.parse(text));
}
export function downloadJSON(text, filename) {
  const url = URL.createObjectURL(
    new Blob([text], { type: "application/json" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
