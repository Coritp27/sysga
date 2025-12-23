type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const DEFAULT_LEVEL: LogLevel = (process.env.LOG_LEVEL as LogLevel) || "info";

function shouldLog(level: LogLevel) {
  return LEVELS[level] >= LEVELS[DEFAULT_LEVEL];
}

function timestamp() {
  return new Date().toISOString();
}

function format(level: LogLevel, ctx: string | undefined, args: any[]) {
  const ctxPart = ctx ? `[${ctx}] ` : "";
  const msg = args
    .map((a) => {
      if (typeof a === "string") return a;
      try {
        return JSON.stringify(a);
      } catch (e) {
        return String(a);
      }
    })
    .join(" ");
  return `${timestamp()} ${level.toUpperCase()} ${ctxPart}${msg}`;
}

export const logger = {
  debug: (ctx: string | undefined, ...args: any[]) => {
    if (!shouldLog("debug")) return;
    console.debug(format("debug", ctx, args));
  },
  info: (ctx: string | undefined, ...args: any[]) => {
    if (!shouldLog("info")) return;
    console.info(format("info", ctx, args));
  },
  warn: (ctx: string | undefined, ...args: any[]) => {
    if (!shouldLog("warn")) return;
    console.warn(format("warn", ctx, args));
  },
  error: (ctx: string | undefined, ...args: any[]) => {
    if (!shouldLog("error")) return;
    console.error(format("error", ctx, args));
  },
};

export default logger;
