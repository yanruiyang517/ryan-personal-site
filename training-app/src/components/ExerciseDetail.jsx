import { useEffect, useState } from "react";
import { Play, ExternalLink as LinkIcon } from "lucide-react";
import { exercises } from "../data.js";
import { doseLabel } from "../lib/domain.js";
import { Modal, ExternalLink } from "./Common.jsx";
export function Video({ exercise }) {
  const [loaded, setLoaded] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [connection, setConnection] = useState("waiting");
  useEffect(() => {
    if (!loaded) return;
    setConnection("waiting");
    const id = setTimeout(
      () => setConnection((value) => (value === "waiting" ? "slow" : value)),
      12000,
    );
    return () => clearTimeout(id);
  }, [loaded, attempt]);
  const e = exercise;
  return (
    <>
      <div className="video-panel">
        <div className={e.youtube ? "video-stage" : undefined}>
          {loaded && e.youtube ? (
            <iframe
              key={attempt}
              className="video-frame"
              title={`${e.name} 原始示范视频`}
              src={`https://www.youtube-nocookie.com/embed/${e.youtube}?rel=0&playsinline=1`}
              onLoad={() => setConnection("connected")}
              onError={() => setConnection("slow")}
              allow="encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <div className="video-placeholder">
              <Play />
              <h3>
                {e.youtube || e.externalVideo ? "查看动作示范" : "舒适地走一走"}
              </h3>
              <p>
                {e.id === "reach"
                  ? "当前空手练习，请勿跟随视频加重量。"
                  : e.videoNote || "先看一遍，再按自己的节奏练习。"}
              </p>
              {e.youtube ? (
                <button
                  className="secondary-button"
                  onClick={() => setLoaded(true)}
                >
                  加载示范视频
                </button>
              ) : e.externalVideo ? (
                <a
                  className="secondary-button"
                  href={e.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  在原站播放 <LinkIcon size={16} />
                </a>
              ) : null}
            </div>
          )}
        </div>
        <div className="video-caption">来源：{e.source} · 第三方视频需联网</div>
      </div>
      {e.youtube && loaded && (
        <div className="video-tools">
          <span role="status">
            {connection === "waiting"
              ? "正在连接播放器…"
              : connection === "slow"
                ? "连接较慢，可重试或打开原站。"
                : "点击画面播放；空白或报错时可重试。"}
          </span>
          <button
            className="text-button"
            onClick={() => setAttempt((value) => value + 1)}
          >
            重新加载
          </button>
          <button className="text-button" onClick={() => setLoaded(false)}>
            收起视频
          </button>
        </div>
      )}
      <p className="video-fallback">
        <ExternalLink
          href={
            e.youtube
              ? `https://www.youtube.com/watch?v=${e.youtube}`
              : e.sourceUrl
          }
        >
          {e.youtube || e.externalVideo
            ? "播放不了？打开原始来源"
            : "阅读官方步行指南"}
        </ExternalLink>
      </p>
    </>
  );
}
export function ExerciseDetail({ item, onClose, onStart }) {
  const e = { ...exercises[item.id], id: item.id };
  return (
    <Modal title={e.name} onClose={onClose} wide>
      <div className="detail-grid">
        <div className="detail-content">
          <p className="category-label">{e.tag}</p>
          <Video key={item.id} exercise={e} />
          <h2>怎么做</h2>
          <ol className="step-list">
            {e.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>
        <aside className="stack">
          <div className="panel">
            <p>{e.frequency}</p>
            <h2>{doseLabel(item)}</h2>
            {item.id === "nod" && <p>保持 3 秒 · 放松 5 秒</p>}
            <p>{e.cue}</p>
          </div>
          {item.id === "reach" && (
            <p className="callout">
              原片使用哑铃，你当前做徒手版本。只参考肩胛移动方向。
            </p>
          )}
          <div>
            <h3>常见错误与调整</h3>
            <ul className="tips-list">
              {e.mistakes.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p className="quiet-note">{e.adjust}</p>
          </div>
          <ExternalLink href={e.sourceUrl}>查看机构说明</ExternalLink>
          {onStart && (
            <button className="primary-button" onClick={() => onStart(item)}>
              练习这个动作
            </button>
          )}
        </aside>
      </div>
    </Modal>
  );
}
