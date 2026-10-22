import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Minus,
  BookOpen,
} from "lucide-react";
import { Heading, ScoreField, Modal } from "../components/Common.jsx";
import {
  localDay,
  parseDay,
  shiftDay,
  STATUS_LABELS,
  prettyDay,
  READINESS_LABELS,
  FEELING_LABELS,
} from "../lib/domain.js";
import { exercises } from "../data.js";
export default function Records({ data, onUpdate, error }) {
  const [selected, setSelected] = useState(localDay());
  const [month, setMonth] = useState(localDay().slice(0, 7));
  const [edit, setEdit] = useState(null);
  const first = `${month}-01`;
  const offset = (parseDay(first).getDay() + 6) % 7;
  const days = new Date(
    Number(month.slice(0, 4)),
    Number(month.slice(5)),
    0,
  ).getDate();
  const record = data.records[selected];
  const changeMonth = (n) => {
    const d = parseDay(first);
    d.setMonth(d.getMonth() + n);
    setMonth(localDay(d).slice(0, 7));
  };
  return (
    <>
      <Heading
        title="每一点活动，都值得记录"
        subtitle="完成、少做一点或主动休息，都是真实的一天。"
      />
      <div className="two-column">
        <section className="panel">
          <div className="title-row">
            <button
              className="icon-button"
              onClick={() => changeMonth(-1)}
              aria-label="上个月"
            >
              <ChevronLeft />
            </button>
            <h2>{month.replace("-", " 年 ")} 月</h2>
            <button
              className="icon-button"
              onClick={() => changeMonth(1)}
              aria-label="下个月"
            >
              <ChevronRight />
            </button>
          </div>
          <div className="record-calendar">
            {[..."一二三四五六日"].map((d) => (
              <span className="calendar-weekday" key={d}>
                {d}
              </span>
            ))}
            {Array.from({ length: offset }, (_, i) => (
              <span key={`space${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const day = shiftDay(first, i);
              return (
                <button
                  key={day}
                  className={`calendar-day ${day === selected ? "selected" : ""} ${data.records[day] ? "has-record" : ""}`}
                  aria-label={`${prettyDay(day)}${data.records[day] ? " " + STATUS_LABELS[data.records[day].status] : ""}`}
                  onClick={() => setSelected(day)}
                >
                  {i + 1}
                  {data.records[day] && <i />}
                </button>
              );
            })}
          </div>
          <p className="footer-note">
            小圆点表示有记录，并不代表完成了所有训练。
          </p>
        </section>
        <section className="panel record-detail">
          <h2>{prettyDay(selected)}</h2>
          {record ? (
            <>
              <span className="phase-label">
                {STATUS_LABELS[record.status]}
              </span>
              {record.sets.length > 0 ? (
                <div className="record-list">
                  {record.sets.map((s) => (
                    <div
                      key={`${s.exerciseId}${s.set}`}
                      className={`set-row ${s.state}`}
                    >
                      <span>
                        {s.state === "done" ? (
                          <Check size={16} />
                        ) : (
                          <Minus size={16} />
                        )}{" "}
                        {exercises[s.exerciseId].shortName ||
                          exercises[s.exerciseId].name}{" "}
                        · 第 {s.set} 组
                      </span>
                      <span>
                        {s.state === "skipped"
                          ? "已跳过"
                          : `${s.reps} ${s.exerciseId === "walk" ? "分钟" : "次"}${s.weight !== null ? ` · ${s.weight}kg` : ""}`}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>这一天给自己留了恢复的空间。</p>
              )}
              <dl className="feedback-list">
                <div>
                  <dt>开始前状态</dt>
                  <dd>{READINESS_LABELS[record.readiness || ""]}</dd>
                </div>
                <div>
                  <dt>结束后感受</dt>
                  <dd>{FEELING_LABELS[record.afterFeeling || ""]}</dd>
                </div>
                {(record.before !== null || record.after !== null) && (
                  <div>
                    <dt>数字痛感（开始前 / 结束后）</dt>
                    <dd>
                      {record.before ?? "未填"} / {record.after ?? "未填"}
                    </dd>
                  </div>
                )}
                <div>
                  <dt>第二天反应</dt>
                  <dd>
                    {
                      {
                        better: "更舒服",
                        same: "差不多",
                        worse: "更不舒服",
                        "": "待填写",
                      }[record.nextMorning]
                    }
                  </dd>
                </div>
              </dl>
              {record.note && <p className="record-note">{record.note}</p>}
              <button
                className="secondary-button"
                onClick={() => setEdit({ ...record })}
              >
                补充反馈与备注
              </button>
            </>
          ) : (
            <div className="empty-state">
              <BookOpen size={28} />
              <h3>这一天还没有记录</h3>
              <p>完成跟练或选择主动休息后，记录会出现在这里。</p>
            </div>
          )}
        </section>
      </div>
      <p className="quiet-note">
        记录只保存在当前浏览器。换设备前，请在设置里导出备份。
      </p>
      {edit && (
        <Modal title="补充身体的反馈" onClose={() => setEdit(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (onUpdate({ ...edit, updatedAt: Date.now() })) setEdit(null);
            }}
          >
            <label className="form-field">
              结束后感受
              <select
                value={edit.afterFeeling || ""}
                onChange={(e) =>
                  setEdit({ ...edit, afterFeeling: e.target.value })
                }
              >
                {Object.entries(FEELING_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <details className="optional-score">
              <summary>数字痛感记录（选填）</summary>
              <ScoreField
                label="训练后的痛感"
                value={edit.after}
                onChange={(after) => setEdit({ ...edit, after })}
              />
            </details>
            <label className="form-field">
              第二天反应
              <select
                disabled={edit.date >= localDay()}
                value={edit.nextMorning}
                onChange={(e) =>
                  setEdit({ ...edit, nextMorning: e.target.value })
                }
              >
                <option value="">待填写</option>
                <option value="better">更舒服</option>
                <option value="same">差不多</option>
                <option value="worse">更不舒服</option>
              </select>
              {edit.date >= localDay() && <small>到第二天再回来填写。</small>}
            </label>
            {edit.nextMorning === "worse" && (
              <p className="callout">
                下次先减量或轻活动，暂不进阶。持续加重或影响转头、抬手、睡眠时，安排现场评估。
              </p>
            )}
            <label className="form-field">
              备注
              <textarea
                rows="4"
                maxLength="1000"
                value={edit.note}
                placeholder="例如：抬臂更轻松、电脑前能舒服待多久。"
                onChange={(e) => setEdit({ ...edit, note: e.target.value })}
              />
            </label>
            {error && (
              <p className="banner error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="primary-button">
              保存反馈
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
