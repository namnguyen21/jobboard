import winston, { createLogger, format, transports } from "winston";

const newLineAfterMessage = format.printf((info) => {
  const { level, message, timestamp, ...logMetaData } = info;
  return `[${timestamp}] ${level}: ${message}\n${JSON.stringify(
    logMetaData,
    null,
    2
  )}\n`;
});

export const logger = createLogger({
  level: "info",
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    newLineAfterMessage
  ),
  transports: [new transports.Console()],
});
