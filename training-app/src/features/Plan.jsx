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
        <h2>围绕自然体态，逐步变强</h2>
        <p>
          日常练颈部控制，加练日练肩胛活动和腿部力量，恢复条件满足后再加入划船。动作量是起点，不是必须完成的任务。
        </p>
        <div className="two-column">
          <div>
            <h3>不用打分，看三个信号</h3>
            <ol className="tips-list">
              <li>动作能正常呼吸，不靠咬牙、憋气或明显扭身完成。</li>
              <li>练后没有持续更难受，休息后能回到原来的状态。</li>
              <li>第二天转头、抬手、睡眠和使用电脑没有更困难。</li>
            </ol>
            <p>
              同一剂量连续两次都稳定，再增加一个变量。出现加重就先减量或轻活动，暂不进阶。
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
        <p>
          每两周在相同机位、光线下复拍自然站姿和慢速抬臂，正常呼吸、自然站立，不刻意挺胸或夹紧肩胛。比较动作和日常活动是否更轻松，不追求固定的“标准姿势”。照片自行保存在手机即可。
        </p>
        <p className="quiet-note">
          网站按所选阶段显示预设安排，不会根据反馈自动升级。照片和动作外观不能用于确诊；这份计划不保证改变骨骼结构或消除所有疼痛。
        </p>
        <ExternalLink href="https://www.dynamichealth.nhs.uk/help-and-advice/shoulder-pain/">
          阅读 NHS 关于活动反应的建议
        </ExternalLink>
      </section>
    </>
  );
}
