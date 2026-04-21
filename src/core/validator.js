import parseFigmaUrl from "../utils/parseFigmaUrl.js";
import getFigmaImageUrl from "../services/figmaService.js";
import takeScreenshot from "../services/screenshot.js";
import compareImages from "../services/compare.js";
import { generateUIAudit } from "../services/gemini.js";

import fs from 'fs';
import path from 'path';

async function validateUI({ figmaUrl, figmaFilePath, pageUrl, token, device, viewport, enableAI }) {
  try {
    console.log('Starting validation process...');

    // Ensure temp directory exists
    const tempDir = "temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Validate inputs
    let figmaPath;
    // Case 1: Figma URL
    if (figmaUrl) {
      console.log("Fetching Figma design...");

      // 1. Parse Figma URL
      const { fileKey, nodeId } = parseFigmaUrl(figmaUrl);
      // console.log("Parsed Figma URL:", { fileKey, nodeId });

      // 2. Get Figma image URL
      const figmaImageUrl = await getFigmaImageUrl({
        fileKey,
        nodeId,
        token,
      });
      console.log("Figma image URL:", figmaImageUrl);

      // 3. Download Figma image
      figmaPath = "temp/figma.png";
      const response = await fetch(figmaImageUrl);
      const buffer = Buffer.from(await response.arrayBuffer());

      fs.writeFileSync(figmaPath, buffer);
      console.log("Figma image downloaded to:", figmaPath);
    }

    // Case 2: Local file
    else if (figmaFilePath) {
      console.log("Using local design file...");

      // Step 1: normalize input FIRST
      const cleanPath = figmaFilePath
        .trim()
        .replace(/^['"]|['"]$/g, "")
        .replace(/\\ /g, " "); // handles escaped spaces

      // Step 2: validate AFTER cleaning
      if (!fs.existsSync(cleanPath)) {
        throw new Error(`Invalid file path provided: ${cleanPath}`);
      }
      const tempFigmaPath = "temp/figma.png";
      fs.copyFileSync(cleanPath, tempFigmaPath);

      figmaPath = tempFigmaPath;
      console.log("Using file:", figmaPath);
    }

    // No input
    else {
      throw new Error("No reference provided (Figma URL or file)");
    }

    // Take screenshot of page
    const pagePath = await takeScreenshot({ url: pageUrl, outputPath: 'temp/page.png', device, viewport });
    // console.log('Page screenshot saved to:', pagePath);

    // Compare images
    const result = compareImages({
      img1Path: figmaPath,
      img2Path: pagePath,
      diffPath: "temp/diff.png",
    });

    // AI Audit
    let aiAudit = null;

    if (enableAI) {
      console.log("Generating AI UI audit...");

      aiAudit = await generateUIAudit({
        figmaPath,
        pagePath,
        diffPath: "temp/diff.png",
        matchScore: result.matchScore,
      });
    }

    // Final result
    return {
      ...result,
      aiAudit,
    };
  }
  catch (error) {
    throw new Error(`Validation failed: ${error.message}`);
  }
}

export default validateUI