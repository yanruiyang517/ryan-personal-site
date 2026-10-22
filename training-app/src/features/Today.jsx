import {
  ArrowRight,
  Leaf,
  CalendarDays,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Heading, WeekStrip, ExerciseRows } from "../components/Common.jsx";
import {
  planFor,
  localDay,
  prettyDay,
  shiftDay,
  PHASE_NAMES,
  STATUS_LABELS,
} from "../lib/domain.js";
export default function Today({
  data,
  date,
  setDate,
  onSelect,
  onStart,
  onResume,
  onRest,
  navigate,
}) {
  const plan = planFor(date, data.settings);
  const record = data.records[date];
  const isToday = date === localDay();
  return (
    <>
      <Heading title="今天的训练" subtitle="留一点时间，让活动回到生活里。">
        <span className="date-label">{prettyDay(date)}</span>
      </Heading>
      <div className="week-controls">
        <button
          className="icon-button"
          aria-label="上一周"
          onClick={() => setDate(shiftDay(date, -7))}
        >
          <ChevronLeft />
        </button>
        <button className="text-button" onClick={() => setDate(localDay())}>
          回到今天
        </button>
        <button
          className="icon-button"
          aria-label="下一周"
          onClick={() => setDate(shiftDay(date, 7))}
        >
          <ChevronRight />
        </button>
      </div>
      <WeekStrip date={date} onChange={setDate} records={data.records} />
      <div className="today-grid">
        <section className="hero-panel">
          <div className="hero-copy">
            <span className="phase-label">
              {PHASE_NAMES[data.settings.phase - 1]}
            </span>
            <h2>从轻松一点开始</h2>
            <p>
              今日舒缓练习
              <br />
              按身体的状态，找到自己的节奏。
            </p>
            <button
              className="primary-button"
              disabled={!isToday}
              onClick={data.session ? onResume : onStart}
            >
              {data.session ? "继续未结束的训练" : "开始今日跟练"}
              <ArrowRight size={18} />
            </button>
            <span className="hero-meta">
              {isToday
                ? "不必追求满分，舒服地完成就好。"
                : "这是所选日期的安排，跟练请回到今天。"}
            </span>
          </div>
          <img
            className="hero-image"
            src="./media/room.webp"
            width="640"
            height="853"
            alt="清晨窗光下安静的房间"
            fetchPriority="high"
          />
        </section>
        <aside className="week-aside">
          <h3>本周安排</h3>
          <div className="aside-line">
            <Leaf size={21} />
            <div>
              <b>每天轻柔活动</b>
              <p>保持一点活动，常常换个姿势。</p>
            </div>
          </div>
          <div className="aside-line">
            <CalendarDays size={21} />
            <div>
              <b>每周 {data.settings.extraDays.length} 天加练</b>
              <p>
                {data.settings.extraDays
                  .map((n) => "周" + "日一二三四五六"[n])
                  .join("、") || "本周仅每日活动"}
              </p>
            </div>
          </div>
          <div className="aside-line">
            <SlidersHorizontal size={21} />
            <div>
              <b>按次日反应调整</b>
              <p>不自动加量，始终以舒适为先。</p>
            </div>
          </div>
          <button className="text-button" onClick={() => navigate("plan")}>
            查看完整计划 <ArrowRight size={15} />
          </button>
        </aside>
      </div>
      <div className="section-heading">
        <h2>{isToday ? "今日动作" : "当天动作"}</h2>
        <span className="category-label">
          {record
            ? STATUS_LABELS[record.status]
            : `${plan.length} 个动作 · 先了解，再开始`}
        </span>
      </div>
      <ExerciseRows plan={plan} onSelect={onSelect} sets={record?.sets} />
      <div className="today-footer">
        <p className="quiet-note">
          疼痛明显时，先走动、换姿势；肩颈动作只在症状轻微时尝试。
        </p>
        {isToday && !data.session && (
          <button className="text-button" onClick={onRest}>
            今天主动休息
          </button>
        )}
      </div>
    </>
  );
}
