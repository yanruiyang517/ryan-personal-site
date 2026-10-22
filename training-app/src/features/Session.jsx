import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Pause,
  Play,
  Check,
  Monitor,
  SkipForward,
} from "lucide-react";
import { exercises } from "../data.js";
import {
  timerReading,
  pauseTimer,
  makeTimer,
  clockLabel,
  doseLabel,
  FEELING_LABELS,
} from "../lib/domain.js";
import { useWakeLock } from "../lib/useWakeLock.js";
import { Modal, ScoreField } from "../components/Common.jsx";
import { Video } from "../components/ExerciseDetail.jsx";
import {
  allSetsRecorded,
  createSetEntry,
  watchCountdown,
} from "../lib/session.js";
function Timer({ timer, item, mode }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    let stop = () => {};
    const refresh = () => {
      stop();
      if (document.visibilityState === "visible")
        stop = watchCountdown(timer, setNow);
    };
    refresh();
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("pageshow", refresh);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("pageshow", refresh);
    };
  }, [timer]);
  const remaining = timerReading(timer, now);
  const nod = item.id === "nod" && mode === "exercise";
  const elapsed = timer.duration - remaining;
  const rep = Math.min(5, Math.floor(elapsed / 8) + 1);
  const phase = elapsed % 8 < 3 ? "轻轻保持" : "放松休息";
  return (
    <div className="timer-block">
      <p className="timer-label">
        {remaining === 0
          ? "计时结束，请确认实际完成情况"
          : mode === "rest"
            ? "组间休息"
            : nod
              ? phase
              : "按自己的节奏完成"}
      </p>
      <div
        className="timer-display"
        aria-label={`剩余 ${Math.ceil(remaining)} 秒`}
      >
        {nod && remaining > 0
          ? String(
              Math.ceil((elapsed % 8 < 3 ? 3 : 8) - (elapsed % 8)),
            ).padStart(2, "0")
          : clockLabel(remaining)}
      </div>
      {nod && remaining > 0 ? (
        <>
          <p>节奏参考 · 第 {rep} / 5 次</p>
          <div className="rep-dots" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <i
                className={i < rep - 1 ? "done" : i === rep - 1 ? "active" : ""}
                key={i}
              />
            ))}
          </div>
        </>
      ) : (
        <p>
          {mode === "rest"
            ? "呼吸放松，准备好后再继续。"
            : "计时仅供参考，实际完成后再记下一组。"}
        </p>
      )}
    </div>
  );
}
export default function Session({
  session,
  settings,
  commitSession,
  onExit,
  onFinish,
  error,
  onSelect,
}) {
  const item = session.plan[session.index];
  const e = exercises[item.id];
  const resolved = allSetsRecorded(session.plan, session.sets);
  const [actual, setActual] = useState(item.reps);
  const [weight, setWeight] = useState("");
  const [finish, setFinish] = useState(() => (resolved ? "normal" : null));
  const [after, setAfter] = useState(null);
  const [afterFeeling, setAfterFeeling] = useState("");
  const [note, setNote] = useState("");
  const actionTime = useRef(0);
  const allowAction = () => {
    const now = Date.now();
    if (now - actionTime.current < 400) return false;
    actionTime.current = now;
    return true;
  };
  let inputError = "";
  try {
    createSetEntry(item, session.setIndex, "done", actual, weight);
  } catch (e) {
    inputError = e.message;
  }
  const wake = useWakeLock(true, settings.wake);
  useEffect(() => {
    setActual(item.reps);
    setWeight("");
  }, [session.index, session.setIndex, item.reps]);
  const update = (next) => commitSession(next);
  function toggle() {
    const t = session.timer;
    update({
      ...session,
      timer:
        t.startedAt === null
          ? {
              ...t,
              remaining: timerReading(t) === 0 ? t.duration : t.remaining,
              startedAt: Date.now(),
            }
          : pauseTimer(t),
    });
  }
  function record(state) {
    if (resolved || !allowAction() || (state === "done" && inputError)) return;
    const entry = createSetEntry(item, session.setIndex, state, actual, weight);
    const sets = [
      ...session.sets.filter(
        (s) => !(s.exerciseId === item.id && s.set === session.setIndex),
      ),
      entry,
    ];
    const last =
      session.setIndex === item.sets &&
      session.index === session.plan.length - 1;
    if (last) {
      if (update({ ...session, sets, timer: pauseTimer(session.timer) }))
        setFinish("normal");
      return;
    }
    const index =
      session.setIndex < item.sets ? session.index : session.index + 1;
    const setIndex = session.setIndex < item.sets ? session.setIndex + 1 : 1;
    update({
      ...session,
      sets,
      index,
      setIndex,
      mode: "rest",
      timer: makeTimer(settings.rest, true),
    });
  }
  function finishRequest(status) {
    if (update({ ...session, timer: pauseTimer(session.timer) }))
      setFinish(status);
  }
  return (
    <div className="session-page">
      <header className="session-header">
        <button
          className="text-button"
          onClick={() => {
            if (update({ ...session, timer: pauseTimer(session.timer) }))
              onExit();
          }}
        >
          <ArrowLeft size={18} />
          保存进度并退出
        </button>
        <span>
          {session.index + 1} / {session.plan.length} 个动作
        </span>
      </header>
      {error && (
        <p className="banner error" role="alert">
          {error}
        </p>
      )}
      <div className="session-layout">
        <section className="session-main">
          <span className="category-label">
            {session.mode === "rest" ? "接下来" : "正在练习"}
          </span>
          <h1>{e.name}</h1>
          <p className="set-label">
            第 {session.setIndex} / {item.sets} 组 · {doseLabel(item)}
          </p>
          {resolved ? (
            <div className="session-resolved">
              <Check size={32} />
              <h2>组数已记录</h2>
              <p>可以直接保存本次记录，不用重复完成最后一组。</p>
            </div>
          ) : (
            <Timer timer={session.timer} item={item} mode={session.mode} />
          )}
          <div className="session-actions">
            {resolved ? (
              <button
                className="primary-button"
                onClick={() => setFinish("normal")}
              >
                查看并保存本次记录
              </button>
            ) : (
              <>
                <button className="secondary-button" onClick={toggle}>
                  {session.timer.startedAt === null ? (
                    <Play size={18} />
                  ) : (
                    <Pause size={18} />
                  )}{" "}
                  {session.timer.startedAt === null ? "开始计时" : "暂停计时"}
                </button>
                {session.mode === "rest" ? (
                  <button
                    className="primary-button"
                    onClick={() => {
                      if (!allowAction()) return;
                      update({
                        ...session,
                        mode: "exercise",
                        timer: makeTimer(item.seconds, true),
                      });
                    }}
                  >
                    准备好了，开始下一组
                  </button>
                ) : (
                  <button
                    className="primary-button"
                    onClick={() => record("done")}
                    disabled={!!inputError}
                  >
                    <Check size={18} />
                    完成这一组
                  </button>
                )}
              </>
            )}
          </div>
          {!resolved && session.mode === "exercise" && (
            <div className="actual-fields">
              <label className="form-field">
                实际
                {item.id === "walk"
                  ? "分钟"
                  : item.id === "neck" || item.id === "row"
                    ? "每侧次数"
                    : "次数"}
                <input
                  type="number"
                  min="0"
                  max="200"
                  inputMode="numeric"
                  aria-invalid={!!inputError}
                  aria-describedby={inputError ? "actual-error" : undefined}
                  value={actual}
                  onChange={(event) => setActual(event.target.value)}
                />
              </label>
              {item.id === "row" && (
                <label className="form-field">
                  单只哑铃总重（kg，选填）
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.25"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </label>
              )}
            </div>
          )}
          {!resolved && inputError && (
            <p id="actual-error" className="input-error" role="status">
              {inputError}
            </p>
          )}
          <div className="session-secondary">
            {!resolved && (
              <>
                <button
                  className="text-button"
                  onClick={() => record("skipped")}
                >
                  <SkipForward size={16} />
                  跳过这一组
                </button>
                <button
                  className="text-button"
                  onClick={() => finishRequest("normal")}
                >
                  结束本次训练
                </button>
              </>
            )}
            <button
              className="text-button danger-text"
              onClick={() => finishRequest("stopped")}
            >
              不适，停止训练
            </button>
          </div>
          <div className="wake-status">
            <Monitor size={16} />
            <span>屏幕常亮：{wake.status}</span>
            {settings.wake && wake.supported && wake.status !== "已开启" && (
              <button
                className="text-button"
                onClick={wake.request}
                disabled={wake.status === "正在开启…"}
              >
                重试
              </button>
            )}
          </div>
          <p className="footer-note">
            页面需保持前台。系统省电或手动锁屏时可能暂停常亮。
          </p>
        </section>
        <aside className="session-side stack">
          <p className="callout">{e.cue}</p>
          {!finish && <Video key={item.id} exercise={{ ...e, id: item.id }} />}
          <button
            className="text-button"
            onClick={() => {
              if (update({ ...session, timer: pauseTimer(session.timer) }))
                onSelect(item);
            }}
          >
            查看完整动作要点
          </button>
          <p className="quiet-note">
            出现刺痛、麻木、无力或痛性卡住时，立即停止。休息后仍明显不适，请寻求专业评估。
          </p>
        </aside>
      </div>
      {finish && (
        <Modal
          title={
            finish === "stopped" ? "先停下来，照顾身体" : "为这次活动留个记录"
          }
          onClose={() => setFinish(null)}
        >
          <p className="quiet-note">
            已逐组保存的进度会保留。完成多少就记录多少。
          </p>
          <form
            onSubmit={(ev) => {
              ev.preventDefault();
              onFinish(finish, after, note, afterFeeling);
            }}
          >
            <label className="form-field">
              和开始前相比，现在感觉如何？（选填）
              <select
                value={afterFeeling}
                onChange={(e) => setAfterFeeling(e.target.value)}
              >
                {Object.entries(FEELING_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {afterFeeling === "worse" && (
              <p className="callout">
                先不加量，观察休息后是否恢复；下次减小幅度或次数。明显不适持续或影响日常活动时，寻求专业评估。
              </p>
            )}
            <details className="optional-score">
              <summary>数字痛感记录（选填）</summary>
              <ScoreField
                label="结束后的痛感"
                value={after}
                onChange={setAfter}
              />
            </details>
            <label className="form-field">
              一句备注（选填）
              <textarea
                maxLength="1000"
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="今天什么感觉舒服，什么需要调整？"
              />
            </label>
            {error && (
              <p className="banner error" role="alert">
                {error}
              </p>
            )}
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setFinish(null)}
              >
                继续保留训练
              </button>
              <button className="primary-button" type="submit">
                保存本次记录
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
