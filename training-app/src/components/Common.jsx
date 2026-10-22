import { useEffect, useRef } from "react";
import {
  Home,
  CalendarDays,
  Play,
  BookOpen,
  Settings,
  X,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { weekDays, parseDay, prettyDay, doseLabel } from "../lib/domain.js";
import { exercises } from "../data.js";
const navItems = [
  ["today", "今日", Home],
  ["plan", "计划", CalendarDays],
  ["library", "动作", Play],
  ["records", "记录", BookOpen],
];
export function Shell({ route, navigate, children }) {
  const links = navItems.map(([id, label, Icon]) => (
    <button
      key={id}
      className={`nav-item ${route === id ? "active" : ""}`}
      onClick={() => navigate(id)}
      aria-current={route === id ? "page" : undefined}
    >
      <Icon />
      <span>{label}</span>
    </button>
  ));
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        跳到主要内容
      </a>
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("today")}>
          <span className="brand-mark">MOVE</span>
          <span>我的训练</span>
        </button>
        <nav aria-label="主要导航">{links}</nav>
        <div className="sidebar-foot">
          <p>
            让活动回到生活里。
            <br />
            以舒服的节奏，慢慢来。
          </p>
          <button
            className={`nav-item ${route === "settings" ? "active" : ""}`}
            onClick={() => navigate("settings")}
          >
            <Settings />
            <span>设置</span>
          </button>
        </div>
      </aside>
      <header className="mobile-header">
        <button className="brand" onClick={() => navigate("today")}>
          <span className="brand-mark">MOVE</span>
        </button>
        <button
          className="icon-button"
          aria-label="设置"
          onClick={() => navigate("settings")}
        >
          <Settings />
        </button>
      </header>
      <main className="main-content" id="main" tabIndex={-1}>
        <div key={route} className="page-enter">
          {children}
        </div>
      </main>
      <nav className="bottom-nav" aria-label="底部导航">
        {links}
      </nav>
    </div>
  );
}
export function Heading({ title, subtitle, children }) {
  return (
    <header className="page-heading">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </header>
  );
}
export function WeekStrip({ date, onChange, records = {} }) {
  return (
    <div className="week-strip" aria-label="一周日期">
      {weekDays(date).map((day, i) => (
        <button
          key={day}
          className={`day-button ${day === date ? "selected" : ""}`}
          aria-label={prettyDay(day)}
          aria-pressed={day === date}
          onClick={() => onChange(day)}
        >
          <span className="day-name">周{"一二三四五六日"[i]}</span>
          <span className="day-number">{parseDay(day).getDate()}</span>
          {records[day] && <span className="day-dot" />}
        </button>
      ))}
    </div>
  );
}
export function ExerciseRows({ plan, onSelect, sets = [] }) {
  return (
    <div className="exercise-list">
      {plan.map((item, i) => {
        const e = exercises[item.id];
        const done = sets.filter(
          (s) => s.exerciseId === item.id && s.state === "done",
        ).length;
        return (
          <button
            className="exercise-row"
            key={item.id}
            onClick={() => onSelect(item)}
          >
            <span className="exercise-number">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="exercise-summary">
              <h3>{e.shortName || e.name}</h3>
              <p>{e.tag}</p>
            </span>
            <span className="exercise-dose">
              {doseLabel(item)}
              {done > 0 && <small>已完成 {done} 组</small>}
            </span>
            <ChevronRight className="chevron" size={17} />
          </button>
        );
      })}
    </div>
  );
}
export function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef();
  useEffect(() => {
    const d = ref.current;
    d.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      d.close();
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "modal-wide" : ""}`}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) {
          const r = ref.current.getBoundingClientRect();
          if (
            e.clientX < r.left ||
            e.clientX > r.right ||
            e.clientY < r.top ||
            e.clientY > r.bottom
          )
            onClose();
        }
      }}
      aria-labelledby="dialog-title"
    >
      <div className="modal-header">
        <h2 id="dialog-title">{title}</h2>
        <button className="icon-button" onClick={onClose} aria-label="关闭">
          <X />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
export function ExternalLink({ href, children }) {
  return (
    <a
      className="inline-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight size={15} />
    </a>
  );
}
export function ScoreField({ label, value, onChange }) {
  return (
    <label className="form-field">
      {label}
      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value === "" ? null : Number(e.target.value))
        }
      >
        <option value="">暂不填写</option>
        {Array.from({ length: 11 }, (_, i) => (
          <option key={i} value={i}>
            {i} 分{i === 0 ? " · 不痛" : i === 10 ? " · 最剧烈" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
