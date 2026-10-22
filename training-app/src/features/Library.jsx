import { useState } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Heading } from "../components/Common.jsx";
import { exercises } from "../data.js";
import { planFor, localDay, doseLabel } from "../lib/domain.js";
export default function Library({ settings, onSelect }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("全部");
  const base = planFor(localDay(), {
    ...settings,
    extraDays: [0, 1, 2, 3, 4, 5, 6],
  });
  const list = Object.entries(exercises).filter(
    ([, e]) =>
      (filter === "全部" || e.category === filter) &&
      (e.name + e.summary + e.category).includes(q.trim()),
  );
  return (
    <>
      <Heading
        title="把每个动作，做得从容"
        subtitle="先看原始示范，再读要点。次数和负荷以当前阶段为准。"
      />
      <label className="search-field">
        <Search size={18} />
        <span className="sr-only">搜索动作</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜索动作或部位"
        />
      </label>
      <div className="filter-row">
        {["全部", "颈肩", "肩胛", "下肢", "全身", "力量"].map((t) => (
          <button
            key={t}
            className={filter === t ? "active" : ""}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="exercise-grid">
        {list.map(([id, e]) => {
          const item = base.find((x) => x.id === id) || {
            id,
            reps: 6,
            sets: 1,
            seconds: 72,
          };
          return (
            <button
              className="exercise-card"
              key={id}
              onClick={() => onSelect(item)}
            >
              <span className="category-label">
                {e.category} ·{" "}
                {id === "row"
                  ? "恢复条件满足后"
                  : id === "walk"
                    ? "活动指南"
                    : "原始示范"}
              </span>
              <h3>{e.name}</h3>
              <p>{e.summary}</p>
              <p>{doseLabel(item)}</p>
              <ChevronRight className="chevron" size={18} />
            </button>
          );
        })}
      </div>
      {list.length === 0 && (
        <div className="empty-state">
          <h2>没有找到这个动作</h2>
          <p>试试“肩”“颈”或清空搜索。</p>
        </div>
      )}
    </>
  );
}
