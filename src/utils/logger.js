const LOG_LEVELS = { trace: 0, debug: 1, info: 2, warn: 3, error: 4, fatal: 5 };

const MIN_LOG_LEVEL =
  process.env.NODE_ENV === "production" ? LOG_LEVELS.info : LOG_LEVELS.debug;

class LokiLogger {
  #queue = [];
  #timer = null;
  #MAX_BATCH = 10;
  #INTERVAL = 1000;

  #getUserContext() {
    if (typeof window === "undefined") return null;

    try {
      const userData = localStorage.getItem("userData");
      const ip = localStorage.getItem("clientIP") || "unknownIP";

      if (userData) {
        const parsed = JSON.parse(userData);
        return {
          userId: parsed.userID || 0,
          userName: parsed.userName || "unknown-user",
          ipAddress: ip,
        };
      }

      return { userId: 0, userName: "guest", ipAddress: ip };
    } catch (e) {
      return { userId: 0, userName: "error-parsing", ipAddress: "unknown" };
    }
  }

  log(level, message, action, meta = {}) {
    if (LOG_LEVELS[level] < MIN_LOG_LEVEL) return;

    const user = this.#getUserContext();

    const entry = {
      level: level.toUpperCase(),
      message,
      action,
      user,
      meta,
      ts: Date.now(),
    };

    if (level === "error" || level === "fatal") {
      this.#send([entry]);
    } else {
      this.#queue.push(entry);
      if (this.#queue.length >= this.#MAX_BATCH) this.#flush();
      else if (!this.#timer)
        this.#timer = setTimeout(() => this.#flush(), this.#INTERVAL);
    }
  }

  trace(message, action, meta) {
    this.log("trace", message, action, meta);
  }
  debug(message, action, meta) {
    this.log("debug", message, action, meta);
  }
  info(message, action, meta) {
    this.log("info", message, action, meta);
  }
  warn(message, action, meta) {
    this.log("warn", message, action, meta);
  }
  error(message, action, meta) {
    this.log("error", message, action, meta);
  }
  fatal(message, action, meta) {
    this.log("fatal", message, action, meta);
  }

  #flush() {
    if (this.#queue.length === 0) return;
    const batch = [...this.#queue];
    this.#queue = [];
    clearTimeout(this.#timer);
    this.#timer = null;
    this.#send(batch);
  }

  #send(logs) {
    if (typeof window === "undefined") return;

    const blob = new Blob([JSON.stringify({ logs })], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/logs", blob);
    } else {
      fetch("/api/logs", { method: "POST", body: blob, keepalive: true }).catch(
        console.error
      );
    }
  }

  flush() {
    this.#flush();
  }
}

export const logger = new LokiLogger();

if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") logger.flush();
  });
}

// const LOG_LEVELS = { trace: 0, debug: 1, info: 2, warn: 3, error: 4, fatal: 5 };
// const MIN_LOG_LEVEL =
//   process.env.NODE_ENV === "production" ? LOG_LEVELS.info : LOG_LEVELS.debug;
// const IP_ADDRESS = localStorage.getItem("clientIP") || "unknownIP";
// const userData = localStorage.getItem("userData");
// const userId = userData ? JSON.parse(userData).userID : 0;
// const userName = userData ? JSON.parse(userData).userName : "unknown-user";

// const user = {
//   userId: userId,
//   userName,
//   ipAddress: IP_ADDRESS,
// };

// class LokiLogger {
//   #queue = [];
//   #timer = null;
//   #MAX_BATCH = 10;
//   #INTERVAL = 1000;

//   log(level, message, action, meta = {}) {
//     if (LOG_LEVELS[level] < MIN_LOG_LEVEL) return;

//     const entry = {
//       level: level.toUpperCase(),
//       message,
//       action,
//       user,
//       meta,
//       ts: Date.now(),
//     };

//     if (level === "error" || level === "fatal") {
//       this.#send([entry]);
//     } else {
//       this.#queue.push(entry);
//       if (this.#queue.length >= this.#MAX_BATCH) this.#flush();
//       else if (!this.#timer)
//         this.#timer = setTimeout(() => this.#flush(), this.#INTERVAL);
//     }
//   }

//   // --- Explicit Methods (Restores IntelliSense/Suggestions) ---

//   trace(message, action, user, meta) {
//     this.log("trace", message, action, user, meta);
//   }
//   debug(message, action, user, meta) {
//     this.log("debug", message, action, user, meta);
//   }
//   info(message, action, user, meta) {
//     this.log("info", message, action, user, meta);
//   }
//   warn(message, action, user, meta) {
//     this.log("warn", message, action, user, meta);
//   }
//   error(message, action, user, meta) {
//     this.log("error", message, action, user, meta);
//   }
//   fatal(message, action, user, meta) {
//     this.log("fatal", message, action, user, meta);
//   }

//   #flush() {
//     if (this.#queue.length === 0) return;
//     const batch = [...this.#queue];
//     this.#queue = [];
//     clearTimeout(this.#timer);
//     this.#timer = null;
//     this.#send(batch);
//   }

//   #send(logs) {
//     const blob = new Blob([JSON.stringify({ logs })], { type: "application/json" });
//     if (navigator.sendBeacon) {
//       navigator.sendBeacon("/api/logs", blob);
//     } else {
//       fetch("/api/logs", { method: "POST", body: blob, keepalive: true }).catch(
//         console.error
//       );
//     }
//   }

//   flush() {
//     this.#flush();
//   }
// }

// export const logger = new LokiLogger();

// if (typeof window !== "undefined") {
//   document.addEventListener("visibilitychange", () => {
//     if (document.visibilityState === "hidden") logger.flush();
//   });
// }
