import { useCallback, useEffect, useRef, useState } from "react";
import { createWakeLockController } from "./wakeLock.js";

export function useWakeLock(active, enabled) {
  const controller = useRef(null);
  const [status, setStatus] = useState("未开启");
  const supported = typeof navigator !== "undefined" && "wakeLock" in navigator;
  const request = useCallback(() => controller.current?.request(), []);
  useEffect(() => {
    if (!active || !enabled) {
      setStatus("未开启");
      return;
    }
    const c = createWakeLockController({
      requestLock: supported
        ? () => navigator.wakeLock.request("screen")
        : null,
      isVisible: () => document.visibilityState === "visible",
      onStatus: setStatus,
    });
    controller.current = c;
    const visible = () =>
      document.visibilityState === "visible" ? c.request() : c.release();
    const show = () => c.request();
    const hide = () => c.release();
    c.request();
    document.addEventListener("visibilitychange", visible);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    return () => {
      controller.current = null;
      c.dispose();
      document.removeEventListener("visibilitychange", visible);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
    };
  }, [active, enabled, supported]);
  return { status, request, supported };
}
