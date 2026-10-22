import { useCallback, useEffect, useRef, useState } from "react";
import { Shell, Modal, ScoreField } from "./components/Common.jsx";
import { ExerciseDetail } from "./components/ExerciseDetail.jsx";
import Today from "./features/Today.jsx";
import Plan from "./features/Plan.jsx";
import Library from "./features/Library.jsx";
import Records from "./features/Records.jsx";
import Settings from "./features/Settings.jsx";
import Session from "./features/Session.jsx";
import {
  freshData,
  loadStore,
  persist,
  KEY,
  LEGACY_KEYS,
} from "./lib/storage.js";
import {
  localDay,
  planFor,
  makeTimer,
  sessionStatus,
  pauseTimer,
} from "./lib/domain.js";
const routes = ["today", "plan", "library", "records", "settings", "session"];
const readRoute = () =>
  routes.includes(location.hash.slice(1)) ? location.hash.slice(1) : "today";
export default function App() {
  const [initial] = useState(() => {
    try {
      return loadStore(localStorage);
    } catch {
      return {
        data: freshData(),
        error: "浏览器禁止本地存储，请允许存储后刷新。",
      };
    }
  });
  const [data, setData] = useState(initial.data);
  const dataRef = useRef(data);
  const [error, setError] = useState(initial.error);
  const [route, setRoute] = useState(readRoute);
  const [date, setDate] = useState(localDay());
  const [detail, setDetail] = useState(null);
  const [preflight, setPreflight] = useState(null);
  const [before, setBefore] = useState(null);
  const [newSymptoms, setNewSymptoms] = useState(false);
  const [replace, setReplace] = useState(false);
  const [rest, setRest] = useState(false);
  const commit = useCallback((next) => {
    try {
      const value = persist(localStorage, next, dataRef.current.revision);
      dataRef.current = value;
      setData(value);
      setError("");
      return true;
    } catch (e) {
      setError(
        e.message.includes("其他页面")
          ? e.message
          : "保存没有成功，输入仍保留。请检查存储空间/权限，或先在设置导出并修复数据后重试。",
      );
      return false;
    }
  }, []);
  const navigate = useCallback(
    (next) => {
      const current = dataRef.current;
      if (route === "session" && current.session && next !== "session") {
        if (
          !commit({
            ...current,
            session: {
              ...current.session,
              timer: pauseTimer(current.session.timer),
            },
          })
        )
          return;
      }
      location.hash = next;
      setRoute(next);
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [route, commit],
  );
  useEffect(() => {
    const listener = () => {
      const next = readRoute();
      const current = dataRef.current;
      if (
        route === "session" &&
        next !== "session" &&
        current.session &&
        current.session.timer.startedAt !== null
      ) {
        if (
          !commit({
            ...current,
            session: {
              ...current.session,
              timer: pauseTimer(current.session.timer),
            },
          })
        ) {
          location.hash = "session";
          return;
        }
      }
      setRoute(next);
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", listener);
    return () => window.removeEventListener("hashchange", listener);
  }, [route, commit]);
  useEffect(() => {
    const listener = (e) => {
      if (e.key === KEY)
        setError(
          "另一页面更改了训练数据。请先保存或复制当前输入，再刷新查看最新记录。",
        );
    };
    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  }, []);
  // A visible day selector should keep today's date fresh after returning from an overnight tab.
  useEffect(() => {
    let today = localDay();
    const refresh = () => {
      const next = localDay();
      if (next !== today) {
        setDate((d) => (d === today ? next : d));
        today = next;
      }
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, []);
  function start(items = null) {
    if (data.session) {
      navigate("session");
      return;
    }
    setBefore(null);
    setNewSymptoms(false);
    setReplace(false);
    setPreflight({ items });
  }
  function begin() {
    if (newSymptoms) return;
    const gentle = before !== null && before > 3;
    const plan = gentle
      ? planFor(localDay(), data.settings, true)
      : preflight.items || planFor(localDay(), data.settings);
    const session = {
      date: localDay(),
      plan,
      index: 0,
      setIndex: 1,
      sets: [],
      before,
      startedAt: Date.now(),
      mode: "exercise",
      timer: makeTimer(plan[0].seconds),
    };
    if (commit({ ...data, session })) {
      setPreflight(null);
      setDetail(null);
      navigate("session");
    }
  }
  function finish(reason, after, note) {
    const s = dataRef.current.session;
    if (!s) return;
    const record = {
      date: s.date,
      status: reason === "stopped" ? "stopped" : sessionStatus(s.plan, s.sets),
      plan: s.plan,
      sets: s.sets,
      before: s.before,
      after,
      nextMorning: "",
      note,
      updatedAt: Date.now(),
    };
    if (
      commit({
        ...dataRef.current,
        session: null,
        records: { ...dataRef.current.records, [s.date]: record },
      })
    )
      navigate("records");
  }
  function markRest() {
    const d = localDay();
    const record = {
      date: d,
      status: "rest",
      plan: planFor(d, data.settings),
      sets: [],
      before: null,
      after: null,
      nextMorning: "",
      note: "今天选择主动休息。",
      updatedAt: Date.now(),
    };
    if (commit({ ...data, records: { ...data.records, [d]: record } })) {
      setRest(false);
      navigate("records");
    }
  }
  function reset() {
    try {
      const next = freshData();
      next.revision = dataRef.current.revision + 1;
      localStorage.setItem(KEY, JSON.stringify(next));
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
      dataRef.current = next;
      setData(next);
      setError("");
      return true;
    } catch {
      setError("清空没有完成，请检查浏览器存储权限后重试。");
      return false;
    }
  }
  const common = { data, onSelect: setDetail, navigate };
  const page =
    route === "today" ? (
      <Today
        {...common}
        date={date}
        setDate={setDate}
        onStart={() => start()}
        onResume={() => navigate("session")}
        onRest={() => setRest(true)}
      />
    ) : route === "plan" ? (
      <Plan {...common} />
    ) : route === "library" ? (
      <Library settings={data.settings} onSelect={setDetail} />
    ) : route === "records" ? (
      <Records
        data={data}
        error={error}
        onUpdate={(r) =>
          commit({ ...data, records: { ...data.records, [r.date]: r } })
        }
      />
    ) : (
      <Settings
        data={data}
        onSave={(settings) => commit({ ...data, settings })}
        onImport={(imported) =>
          commit({
            ...imported,
            session: imported.session
              ? {
                  ...imported.session,
                  timer: pauseTimer(imported.session.timer),
                }
              : null,
          })
        }
        onReset={reset}
        error={error}
        setError={setError}
      />
    );
  return (
    <>
      {route === "session" && data.session ? (
        <Session
          session={data.session}
          settings={data.settings}
          commitSession={(session) => commit({ ...dataRef.current, session })}
          onExit={() => navigate("today")}
          onFinish={finish}
          error={error}
          onSelect={setDetail}
        />
      ) : (
        <Shell
          route={route === "session" ? "today" : route}
          navigate={navigate}
        >
          {error && (
            <div className="banner error" role="alert">
              {error}
              <button
                className="text-button"
                onClick={() => navigate("settings")}
              >
                管理数据
              </button>
            </div>
          )}
          {route === "session" ? (
            <Today
              {...common}
              date={date}
              setDate={setDate}
              onStart={() => start()}
              onResume={() => navigate("session")}
              onRest={() => setRest(true)}
            />
          ) : (
            page
          )}
        </Shell>
      )}
      {detail && (
        <ExerciseDetail
          item={detail}
          onClose={() => setDetail(null)}
          onStart={
            !data.session && (detail.id !== "row" || data.settings.phase === 3)
              ? (item) => {
                  setDetail(null);
                  start([item]);
                }
              : null
          }
        />
      )}{" "}
      {preflight && (
        <Modal title="先看看今天的状态" onClose={() => setPreflight(null)}>
          <ScoreField
            label="现在的颈肩痛感（0–10，可不填）"
            value={before}
            onChange={setBefore}
          />
          <label className="setting-row">
            <input
              type="checkbox"
              checked={newSymptoms}
              onChange={(e) => setNewSymptoms(e.target.checked)}
            />
            <span>新出现麻木、明显无力、刺痛或痛性卡住</span>
          </label>
          {newSymptoms ? (
            <p className="callout">
              今天先不要训练，建议及时联系专业人员。突发明显无力、行走不稳或严重头痛等应尽快就医。
            </p>
          ) : before !== null && before > 3 ? (
            <p className="callout">
              今天先只安排舒适步行。若步行也不舒服，可关闭此窗口，选择主动休息。
            </p>
          ) : (
            <p className="quiet-note">
              肩颈动作只在症状轻微、动作本身舒服时尝试。可以随时少做、跳过或停止；不必把计划做满。
            </p>
          )}
          {data.records[localDay()] && (
            <label className="setting-row">
              <input
                type="checkbox"
                checked={replace}
                onChange={(e) => setReplace(e.target.checked)}
              />
              <span>
                今天已有记录。确认本次保存后更新今天的记录；之前的记录会保留到本次保存。
              </span>
            </label>
          )}
          {error && (
            <p className="banner error" role="alert">
              {error}
            </p>
          )}
          <button
            className="primary-button"
            disabled={newSymptoms || (!!data.records[localDay()] && !replace)}
            onClick={begin}
          >
            {before !== null && before > 3 ? "开始舒适步行" : "进入跟练"}
          </button>
        </Modal>
      )}
      {rest && (
        <Modal title="今天，留一点恢复空间" onClose={() => setRest(false)}>
          <p>
            {data.records[localDay()]
              ? "今天已有记录，保存主动休息会替换今天的训练记录。"
              : "主动休息也可以留下记录。根据舒服的程度走动、换姿势，不必强迫自己完成动作。"}
          </p>
          {error && (
            <p className="banner error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button className="secondary-button" onClick={() => setRest(false)}>
              取消
            </button>
            <button className="primary-button" onClick={markRest}>
              记录主动休息
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
