// Browser access is injected so lifecycle races can be tested without browser injection.
export function createWakeLockController({ requestLock, isVisible, onStatus }) {
  let current = null,
    pending = null,
    generation = 0,
    disposed = false;
  const status = (value) => {
    if (!disposed) onStatus(value);
  };
  function release() {
    generation++;
    pending = null;
    const lock = current;
    current = null;
    if (lock) Promise.resolve(lock.release()).catch(() => {});
    status("已暂停，返回页面后重试");
  }
  function request() {
    if (disposed || !isVisible()) return Promise.resolve();
    if (!requestLock) {
      status("此浏览器不支持，请在系统中调整锁屏时间");
      return Promise.resolve();
    }
    if (current && !current.released) {
      status("已开启");
      return Promise.resolve();
    }
    if (pending) return pending;
    const gen = ++generation;
    status("正在开启…");
    pending = Promise.resolve()
      .then(requestLock)
      .then(async (lock) => {
        if (disposed || gen !== generation || !isVisible()) {
          await lock.release();
          return;
        }
        current = lock;
        status("已开启");
        lock.addEventListener("release", () => {
          if (current === lock) {
            current = null;
            status("已暂停，可点击重试");
          }
        });
      })
      .catch(() => {
        if (gen === generation) status("未能开启，可重试或调整系统锁屏时间");
      })
      .finally(() => {
        if (gen === generation) pending = null;
      });
    return pending;
  }
  return {
    request,
    release,
    dispose() {
      disposed = true;
      release();
    },
  };
}
