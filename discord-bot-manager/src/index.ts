import { BotManager } from "./BotManager.js";

const manager = new BotManager();
void manager.start();

process.on("unhandledRejection", (reason) => {
  console.error("[Process] unhandledRejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("[Process] uncaughtException:", error);
});
