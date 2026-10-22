import { useState } from "react";
import {
  Heading,
  WeekStrip,
  ExerciseRows,
  ExternalLink,
} from "../components/Common.jsx";
import { planFor, localDay } from "../lib/domain.js";
import { phases } from "../data.js";
export default function Plan({ data, onSelect, navigate }) {
  const [tab, setTab] = useState("week");
  const [date, setDate] = useState(localDay());
  return (
    <>
      <Heading
        title="循序渐进，慢慢来"
        subtitle="用身体的反应决定下一步，而不是日历。"
      />
      <div className="tabs">
        <button
          className={`tab ${tab === "week" ? "active" : ""}`}
          onClick={() => setTab("week")}
        >
          本周计划
        </button>
        <button
          className={`tab ${tab === "all" ? "active" : ""}`}
          onClick={() => setTab("all")}
        >
          总训练计划
        </button>
      </div>
      {tab === "week" ? (
        <>
          <WeekStrip date={date} onChange={setDate} records={data.records} />
          <ExerciseRows
            plan={planFor(date, data.settings)}
            onSelect={onSelect}
          />
          <p className="quiet-note">
            组间休息 {data.settings.rest}{" "}
            秒。每日活动不必一次完成；久坐不适出现前，起来走 1–2 分钟。
          </p>
          <button className="text-button" onClick={() => navigate("settings")}>
            调整加练日与休息时间 →
          </button>
        </>
      ) : (
        <div className="phase-list">
          {phases.map((p, i) => (
            <section
              className={`phase-card ${data.settings.phase === i + 1 ? "current" : ""}`}
              key={p.name}
            >
              <span className="phase-number">0{i + 1}</span>
              <h3>
                {p.name}
                {data.settings.phase === i + 1 ? " · 当前阶段" : ""}
              </h3>
              <p>{p.subtitle}</p>
              <p>{p.description}</p>
              <ul>
                {p.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <div className="phase-gate">进阶依据：{p.gate}</div>
            </section>
          ))}
          <button
            className="secondary-button"
            onClick={() => navigate("settings")}
          >
            查看恢复条件与阶段设置
          </button>
        </div>
      )}
      <section className="panel plan-guidance">
        <h2>怎样知道今天练得合适</h2>
        <div className="two-column">
          <div>
            <h3>观察当下和第二天</h3>
            <p>
              这里只采用保守的起始量。当前痛感约 0–3
              分时才尝试肩颈动作；出现新的不适就减小幅度或停止。结束后约 45–60
              分钟应回到原来水平，次日不应更差。
            </p>
          </div>
          <div>
            <h3>什么时候需要现场检查</h3>
            <p>
              长期反复、明显疼痛，或试行 1–2
              周没有改善，建议康复医学科或运动医学科评估。出现新麻木、明显无力、痛性卡住应停止训练并及时咨询；突发严重头痛、行走不稳等需尽快就医。
            </p>
          </div>
        </div>
        <p className="quiet-note">
          这是活动管理与记录工具，不根据体态外观诊断疾病，也不保证仅靠训练解决所有疼痛。
        </p>
        <ExternalLink href="https://www.dynamichealth.nhs.uk/help-and-advice/shoulder-pain/">
          阅读 NHS 关于活动反应的建议
        </ExternalLink>
      </section>
    </>
  );
}
