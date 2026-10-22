export const EXERCISE_IDS = [
  "neck",
  "nod",
  "walk",
  "reach",
  "squat",
  "calf",
  "row",
];
export const PHASE_NAMES = ["舒适活动", "逐步恢复", "回归力量"];
export const READINESS_LABELS = {
  "": "未记录",
  ready: "可以轻松活动",
  gentle: "今天先轻活动",
};
export const FEELING_LABELS = {
  "": "待观察",
  better: "更轻松",
  same: "和平时差不多",
  worse: "更难受",
};
export function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function parseDay(day) {
  return new Date(`${day}T12:00:00`);
}
export function validDay(day) {
  return (
    typeof day === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(day) &&
    localDay(parseDay(day)) === day
  );
}
export function shiftDay(day, n) {
  const d = parseDay(day);
  d.setDate(d.getDate() + n);
  return localDay(d);
}
export function weekDays(day) {
  const first = shiftDay(day, -((parseDay(day).getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => shiftDay(first, i));
}
export function prettyDay(day) {
  return parseDay(day).toLocaleDateString("zh-CN", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}
export function planFor(date, settings, gentleOnly = false) {
  const day = parseDay(date).getDay();
  if (gentleOnly) return [{ id: "walk", reps: 10, sets: 1, seconds: 600 }];
  const daily = [
    { id: "neck", reps: 5, sets: 1, seconds: 60 },
    { id: "nod", reps: 5, sets: 1, seconds: 40 },
    { id: "walk", reps: 10, sets: 1, seconds: 600 },
  ];
  if (settings.extraDays.includes(day))
    daily.push(
      {
        id: "reach",
        reps: settings.phase >= 2 ? 8 : 6,
        sets: 1,
        seconds: settings.phase >= 2 ? 48 : 36,
      },
      { id: "squat", reps: 8, sets: 2, seconds: 48 },
      { id: "calf", reps: 10, sets: 2, seconds: 50 },
    );
  // Two fixed nonconsecutive days, independent of the optional bodyweight days.
  if (settings.phase === 3 && [1, 4].includes(day))
    daily.push({ id: "row", reps: 6, sets: 1, seconds: 72 });
  return daily;
}
export function doseLabel(item) {
  if (item.id === "walk") return "10–15 分钟 · 可分段";
  return `${["neck", "row"].includes(item.id) ? "每侧 " : ""}${item.reps} 次 × ${item.sets} 组`;
}
export function timerReading(timer, now = Date.now()) {
  if (!timer) return 0;
  return Math.max(
    0,
    timer.remaining -
      (timer.startedAt === null
        ? 0
        : Math.max(0, (now - timer.startedAt) / 1000)),
  );
}
export function pauseTimer(timer, now = Date.now()) {
  return { ...timer, remaining: timerReading(timer, now), startedAt: null };
}
export function makeTimer(seconds, running = false) {
  return {
    duration: seconds,
    remaining: seconds,
    startedAt: running ? Date.now() : null,
  };
}
export function clockLabel(seconds) {
  const n = Math.ceil(seconds);
  return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
}
export function sessionStatus(plan, sets) {
  return plan.every((p) =>
    Array.from({ length: p.sets }, (_, i) =>
      sets.some(
        (s) =>
          s.exerciseId === p.id &&
          s.set === i + 1 &&
          s.state === "done" &&
          s.reps >= p.reps,
      ),
    ).every(Boolean),
  )
    ? "complete"
    : "partial";
}
export const STATUS_LABELS = {
  complete: "完成训练",
  partial: "部分完成",
  rest: "主动休息",
  stopped: "因不适停止",
};
