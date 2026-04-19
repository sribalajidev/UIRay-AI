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
You are a senior UI/UX reviewer.

Compare these:
1. Figma design (expected UI) ${figmaPath}
2. Implemented webpage (actual UI) ${pagePath}
3. Diff image (highlighting differences) ${diffPath}

Match Score: ${matchScore}%

Give a detailed UI audit:

- Section-wise issues (Navbar, Hero, Content, Footer if applicable)
- Mention spacing, alignment, typography, color differences
- Be specific and actionable (like a developer review)
- Keep it structured and clean
- Avoid generic statements

Output format:

Overall Summary
...

Each Section of the page (Navbar, Hero, Content, Footer, etc.)
- Issues found
- Details on spacing, alignment, typography, colors
- Actionable feedback
...

Typography
...

Colors
...

Spacing & Layout
...

Final Summary
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