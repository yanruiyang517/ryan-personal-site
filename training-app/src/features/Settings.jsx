import { useRef, useState } from "react";
import { Download, Upload, Trash2, ShieldCheck } from "lucide-react";
import { Heading, Modal } from "../components/Common.jsx";
import { phases } from "../data.js";
import { KEY, downloadJSON, parseImport } from "../lib/storage.js";
import { localDay } from "../lib/domain.js";
export default function Settings({
  data,
  onSave,
  onImport,
  onReset,
  error,
  setError,
}) {
  const [draft, setDraft] = useState({ ...data.settings });
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(null);
  const [checks, setChecks] = useState([]);
  const fileRef = useRef();
  const conditions = [
    "近期总体改善，明显疼痛发作减少",
    "徒手活动可以正常呼吸，没有痛性卡住或进行性加重",
    "至少两次训练及第二天均稳定",
    "没有新麻木或明显无力",
  ];
  const change = (next) => {
    setSaved(false);
    setDraft(next);
  };
  const save = () => {
    if (onSave(draft)) setSaved(true);
  };
  function submit(e) {
    e.preventDefault();
    if (draft.phase > data.settings.phase) {
      setChecks([]);
      setPending({ type: "phase" });
    } else save();
  }
  async function readFile(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw Error("备份文件过大。");
      const imported = parseImport(await file.text());
      setPending({ type: "import", data: imported });
      setError("");
    } catch {
      setError("这个文件不是有效的 MOVE 备份，现有记录没有更改。");
    }
  }
  function exportData() {
    try {
      const raw = localStorage.getItem(KEY);
      downloadJSON(
        raw || JSON.stringify(data, null, 2),
        `move-backup-${localDay()}.json`,
      );
    } catch {
      setError("无法读取本地备份，请先检查浏览器存储权限。");
    }
  }
  return (
    <>
      <Heading
        title="按你的节奏来"
        subtitle="调整训练安排，也照顾好自己的记录。"
      />
      <div className="settings-grid">
        <form className="panel stack" onSubmit={submit}>
          <h2>训练偏好</h2>
          <label className="form-field">
            当前阶段
            <select
              value={draft.phase}
              onChange={(e) =>
                change({ ...draft, phase: Number(e.target.value) })
              }
              disabled={!!data.session}
            >
              {phases.map((p, i) => (
                <option key={p.name} value={i + 1}>
                  {i + 1}. {p.name}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="day-fieldset" disabled={!!data.session}>
            <legend>徒手加练日</legend>
            <div className="choice-grid">
              {[1, 2, 3, 4, 5, 6, 0].map((n) => (
                <button
                  type="button"
                  key={n}
                  aria-pressed={draft.extraDays.includes(n)}
                  className={`choice-button ${draft.extraDays.includes(n) ? "selected" : ""}`}
                  onClick={() =>
                    change({
                      ...draft,
                      extraDays: draft.extraDays.includes(n)
                        ? draft.extraDays.filter((x) => x !== n)
                        : [...draft.extraDays, n].sort(
                            (a, b) => ((a + 6) % 7) - ((b + 6) % 7),
                          ),
                    })
                  }
                >
                  周{"日一二三四五六"[n]}
                </button>
              ))}
            </div>
            <p className="footer-note">
              建议间隔一天。每日轻柔活动不受此设置影响。
            </p>
          </fieldset>
          <label className="form-field">
            组间休息
            <select
              value={draft.rest}
              onChange={(e) =>
                change({ ...draft, rest: Number(e.target.value) })
              }
            >
              {[45, 60, 90].map((n) => (
                <option key={n} value={n}>
                  {n} 秒
                </option>
              ))}
            </select>
          </label>
          <label className="setting-row">
            <span>
              <b>跟练时保持屏幕亮着</b>
              <small>支持时自动请求，退出跟练后释放。</small>
            </span>
            <input
              className="switch"
              type="checkbox"
              checked={draft.wake}
              onChange={(e) => change({ ...draft, wake: e.target.checked })}
            />
          </label>
          <label className="form-field">
            单只空哑铃杆重量（kg，选填）
            <input
              type="number"
              min="0"
              max="30"
              step="0.01"
              value={draft.handleWeight}
              placeholder="先称重，再填写"
              onChange={(e) =>
                change({ ...draft, handleWeight: e.target.value })
              }
            />
          </label>
          <p className="quiet-note">
            对称装配的最小加片为 2 ×
            1.25kg，再加杆重。即使这是最轻组合，也可能暂时偏重；当前阶段可以全程徒手。
          </p>
          {data.session && (
            <p className="callout">
              有未结束训练，请先结束再调整阶段和加练日。
            </p>
          )}
          {saved && (
            <p className="banner success" role="status">
              偏好已保存。
            </p>
          )}
          {error && (
            <p className="banner error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="primary-button">
            保存偏好
          </button>
        </form>
        <div className="stack">
          <section className="panel stack">
            <ShieldCheck size={26} />
            <h2>你的记录，留在你的设备</h2>
            <p>
              没有账号，也不会自动同步。浏览器清理、隐私模式结束或换设备可能丢失记录，请定期导出。
            </p>
            <button className="secondary-button" onClick={exportData}>
              <Download size={18} />
              导出备份
            </button>
            <button
              className="secondary-button"
              disabled={!!data.session}
              onClick={() => fileRef.current.click()}
            >
              <Upload size={18} />
              导入备份
            </button>
            <input
              className="sr-only"
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              onChange={readFile}
              aria-label="导入备份文件"
            />
            <p className="footer-note">
              导入会替换本站记录与设置，确认前可先导出。只接收本站版本 1 的
              JSON。
            </p>
          </section>
          <section className="panel stack">
            <h2>关于这份计划</h2>
            <p>
              目标是减少不适、恢复自然活动与力量。外观不对称不等于疾病，阶段和分数也不代表诊断。
            </p>
            <p>持续的明显疼痛值得专业评估。不要让打卡压力超过身体的感受。</p>
          </section>
          <details className="panel">
            <summary>重新开始</summary>
            <p className="quiet-note">
              仅删除此设备上 MOVE
              和旧锻炼站的数据，其他个人页面不受影响。不可撤销，建议先导出。
            </p>
            <button
              className="danger-button"
              onClick={() => setPending({ type: "reset" })}
            >
              <Trash2 size={17} />
              清空训练数据
            </button>
          </details>
        </div>
      </div>
      {pending && (
        <Modal
          title={
            pending.type === "phase"
              ? "先确认恢复条件"
              : pending.type === "import"
                ? "替换为备份中的记录？"
                : "清空此设备的训练数据？"
          }
          onClose={() => setPending(null)}
        >
          {pending.type === "phase" ? (
            <>
              <p>{phases[draft.phase - 1].gate}</p>
              <div className="stack consent-list">
                {conditions.map((c, i) => (
                  <label className="setting-row" key={c}>
                    <input
                      type="checkbox"
                      checked={checks.includes(i)}
                      onChange={() =>
                        setChecks(
                          checks.includes(i)
                            ? checks.filter((x) => x !== i)
                            : [...checks, i],
                        )
                      }
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
              <p className="quiet-note">
                这是自我观察清单，不是医学许可。仍不确定时可留在原阶段。
              </p>
            </>
          ) : (
            <p>
              {pending.type === "import"
                ? `备份中有 ${Object.keys(pending.data.records).length} 天记录。当前记录将被替换。`
                : "这会清除所有训练记录、进行中的训练和设置。其他网站数据不会被清除。"}
            </p>
          )}
          {error && (
            <p className="banner error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button
              className="secondary-button"
              onClick={() => setPending(null)}
            >
              取消
            </button>
            <button
              className={
                pending.type === "reset" ? "danger-button" : "primary-button"
              }
              disabled={
                pending.type === "phase" && checks.length !== conditions.length
              }
              onClick={() => {
                let ok = false;
                if (pending.type === "phase") {
                  ok = onSave(draft);
                  if (ok) setSaved(true);
                }
                if (pending.type === "import") ok = onImport(pending.data);
                if (pending.type === "reset") ok = onReset();
                if (ok) {
                  setPending(null);
                  if (pending.type !== "phase")
                    setDraft(
                      pending.type === "import"
                        ? pending.data.settings
                        : {
                            phase: 1,
                            extraDays: [1, 3, 6],
                            rest: 60,
                            wake: true,
                            handleWeight: "",
                          },
                    );
                }
              }}
            >
              {pending.type === "phase"
                ? "满足条件，保存阶段"
                : pending.type === "import"
                  ? "确认导入"
                  : "确认清空"}
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
