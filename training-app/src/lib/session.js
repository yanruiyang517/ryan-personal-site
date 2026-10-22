import { timerReading } from "./domain.js";

export function createSetEntry(item, set, state, actual, weight) {
  if (state === "skipped")
    return { exerciseId: item.id, set, state, reps: 0, weight: null };
  const reps = Number(actual);
  const kg = weight === "" ? null : Number(weight);
  if (
    String(actual).trim() === "" ||
    !Number.isInteger(reps) ||
    reps < 0 ||
    reps > 200
  )
    throw Error("请填写 0–200 之间的整数；想少做可以直接跳过。");
  if (kg !== null && (!Number.isFinite(kg) || kg < 0 || kg > 100))
    throw Error("哑铃重量请填写 0–100 kg，或留空。");
  return { exerciseId: item.id, set, state, reps, weight: kg };
}

export function allSetsRecorded(plan, sets) {
  return plan.every((item) =>
    Array.from({ length: item.sets }, (_, i) =>
      sets.some(
        (s) =>
          s.exerciseId === item.id &&
          s.set === i + 1 &&
          ["done", "skipped"].includes(s.state),
      ),
    ).every(Boolean),
  );
}

// Only the visible countdown subscribes. Time itself stays timestamp-based.
export function watchCountdown(
  timer,
  onTick,
  { now = Date.now, schedule = setTimeout, cancel = clearTimeout } = {},
) {
  let handle = null,
    stopped = false;
  const tick = () => {
    handle = null;
    if (stopped) return;
    const time = now();
    onTick(time);
    const remaining = timerReading(timer, time);
    if (timer.startedAt !== null && remaining > 0)
      handle = schedule(tick, Math.min(1000, Math.max(16, remaining * 1000)));
  };
  tick();
  return () => {
    stopped = true;
    if (handle !== null) cancel(handle);
  };
}
