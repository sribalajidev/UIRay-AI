# DesignSync-AI
DesignSync AI automates UI validation by comparing frontend implementation with design specifications and highlighting inconsistencies using AI driven insights.

## Features

-   Capture webpage screenshots (PC / Tablet / Mobile)
-   Fetch design from Figma or use local design files
-   Pixel-level comparison using image diff
-   AI-powered UI audit (Gemini)
-   Interactive CLI workflow
-   Fast and simple validation process

## Installation

Clone the repository & Install dependencies

## Environment Setup

Create a .env file in the root:

FIGMA_TOKEN=your_figma_token 
GEMINI_API_KEY=your_gemini_api_key

## Usage

Run interactive CLI:

npm run validate ui

## CLI Flow

1.  Select device (pc / tab / mob)
2.  Enter website URL
3.  Choose reference:
    -   Figma URL
    -   Local file path
4.  Optional AI audit

## Output Example

### UI Validation Result:

Match Score: 90.82 percent (Excellent) Mismatch: 9.18 percent

Diff Image: temp/diff.png

AI UI Audit:
(Overall Summary)

## Project Structure

src/
├── core/
│   └── validator.js
├── services/
│   ├── screenshot.js
│   ├── figmaService.js
│   ├── compare.js
│   ├── gemini.js
├── utils/
│   └── parseFigmaUrl.js
├── cli/
│   └── interactive.js
├── index.js

## Notes

-   Figma API has rate limits (use local file fallback if needed)
-   AI audit is optional
-   Works best with publicly accessible pages

## Limitations

-   Does not support authenticated pages
-   AI output may be approximate
-   Figma API depends on token access

## Future Improvements

-   Authentication handling
-   Section-based issue detection
-   CI/CD integration
-   Config-based execution
-   Visual highlighting of mismatched areas

## Author

Sri Balaji

## License

MIT
