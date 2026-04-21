#!/usr/bin/env node
import "dotenv/config";
import { getUserInput } from "./cli/interactive.js";
import { runValidation } from "./core/runner.js";
import formatResult from "./utils/formatResult.js";

async function main() {
  // Check for required environment variables
  if (!process.env.FIGMA_TOKEN) {
    console.log("⚠️ FIGMA_TOKEN is missing.");
    console.log("Create a .env file and add:");
    console.log("FIGMA_TOKEN=your_token_here\n");
  }
  if (!process.env.GEMINI_API_KEY) {
    console.log("⚠️ GEMINI_API_KEY is missing.");
    console.log("AI audit will be skipped.\n");
  }

  const mode = process.argv[2];

  if (mode === "ui") {
    const input = await getUserInput();

    const VIEWPORTS = {
      pc: 1920,
      tab: 991,
      mob: 375,
    };

    const viewport =
      input.device === "custom"
        ? { width: Number(input.customWidth) }
        : { width: VIEWPORTS[input.device] };

    const result = await runValidation({
      pageUrl: input.url,
      figmaUrl: input.figmaUrl,
      figmaFilePath: input.filePath,
      device: input.device,
      viewport,
      enableAI: input.enableAI,
      token: process.env.FIGMA_TOKEN, // Pass Figma token from env
    });

    formatResult(result);
  } else {
    console.log("Use: npm run validate ui");
  }
}

main();