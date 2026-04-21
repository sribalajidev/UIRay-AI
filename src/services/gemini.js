import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper to convert image file to Gemini generative content format
function fileToGenerativePart(path) {
  const imageData = fs.readFileSync(path);
  return {
    inlineData: {
      data: imageData.toString("base64"),
      mimeType: "image/png",
    },
  };
}

export async function generateUIAudit({
  figmaPath,
  pagePath,
  diffPath,
  matchScore,
}) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // fast + free tier friendly
    });

    const prompt = `
    You are an expert UI/UX auditor and frontend reviewer.

    You are given three inputs:
    1. Reference design (Figma): ${figmaPath}
    2. Implemented UI (Webpage): ${pagePath}
    3. Diff image (visual differences): ${diffPath}

    Match Score: ${matchScore}%

    Your task is to perform a structured UI audit comparing the implementation against the design.

    IMPORTANT INSTRUCTIONS:
    - Do NOT assume fixed sections like Navbar or Hero
    - Dynamically identify visual sections/components based on layout
    - Be precise, developer-focused, and actionable
    - Avoid generic statements
    - Focus only on visible UI differences
    - Keep output concise and structured using bullet points

    ---

    OUTPUT FORMAT:

    ### Overall Summary
    - 2–4 bullet points summarizing key differences
    - Mention overall quality (e.g., "Close match", "Noticeable inconsistencies")

    ---

    ### Detected Sections / Components

    For EACH visually distinct section:

    #### [Section Name or Description]
    - Issues:
      - Specific issue (e.g., "Heading misaligned by ~8px")
      - Specific issue
    - Details:
      - Spacing: ...
      - Alignment: ...
      - Typography: ...
      - Colors: ...
    - Suggestions:
      - Clear actionable fix
      - Clear actionable fix

    ---

    ### Global Issues

    - Typography:
      - Font size mismatches
      - Font weight inconsistencies
    - Colors:
      - Background / text color deviations
    - Spacing:
      - Inconsistent margins/padding
    - Layout:
      - Structural misalignment or width issues

    ---

    ### Priority Fixes (Top 5)

    - Most impactful issue 1
    - Most impactful issue 2
    - Most impactful issue 3
    - Most impactful issue 4
    - Most impactful issue 5

    ---

    ### Final Verdict

    - UI Match Quality: (Excellent / Good / Needs Improvement)
    - Brief closing remark
    `;

    const result = await model.generateContent([
      prompt,
      fileToGenerativePart(figmaPath),
      fileToGenerativePart(pagePath),
      fileToGenerativePart(diffPath),
    ]);

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("AI audit failed: " + error.message);
  }
}