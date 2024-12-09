import { createLogger, format, transports } from "winston";

export const logger = createLogger({
  transports: [
    new transports.Console({
      format: format.combine(
        format.errors({ stack: true }),
        format.timestamp(),
        format.printf((info) => {
          let message = `[${new Date(info.timestamp as any).toLocaleString()}] ${
            info.level
          }: ${
            typeof info.message === "object"
              ? JSON.stringify(info.message, null, 3)
              : info.message
          }`;

          if (info.stack) {
            message += "\n" + info.stack;
          }

          return message;
        }),
        format.colorize({ all: true })
      ),
      level: "debug",
    }),
  ],
});
