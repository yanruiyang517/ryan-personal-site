import { useCallback, useEffect, useRef, useState } from "react";
export function useWakeLock(active, enabled) {
  const ref = useRef(null);
  const generation = useRef(0);
  const desired = useRef(false);
  desired.current = active && enabled;
  const [status, setStatus] = useState("未开启");
  const release = useCallback(() => {
    generation.current++;
    const lock = ref.current;
    ref.current = null;
    if (lock) lock.release().catch(() => {});
  }, []);
  const request = useCallback(async () => {
    if (!desired.current) return;
    if (!("wakeLock" in navigator)) {
      setStatus("此浏览器不支持，请在系统中调整锁屏时间");
      return;
    }
    if (ref.current && !ref.current.released) {
      setStatus("已开启");
      return;
    }
    const gen = ++generation.current;
    try {
      const lock = await navigator.wakeLock.request("screen");
      if (gen !== generation.current || !desired.current) {
        await lock.release();
        return;
      }
      ref.current = lock;
      setStatus("已开启");
      lock.addEventListener("release", () => {
        if (ref.current === lock) {
          ref.current = null;
          setStatus("已暂停，保持页面可见后重试");
        }
      });
    } catch {
      if (gen === generation.current)
        setStatus("未能开启，可重试或调整系统锁屏时间");
    }
  }, []);
  useEffect(() => {
    if (active && enabled) request();
    else {
      release();
      setStatus("未开启");
    }
    const onVisibility = () => {
      if (document.visibilityState === "visible" && desired.current) request();
    };
    const onHide = () => release();
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onHide);
    return () => {
      release();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onHide);
    };
  }, [active, enabled, request, release]);
  return { status, request };
}
