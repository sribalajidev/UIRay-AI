# UIRay-AI
UIRay AI is a CLI tool for validating UI by comparing frontend implementation with design specifications and highlighting inconsistencies using AI-driven insights powered by Google Gemini.

## Features

-   Capture webpage screenshots (PC / Tablet / Mobile)
-   Fetch design from Figma or use local design files
-   Pixel-level comparison using image diff
-   AI-powered UI audit (Gemini)
-   Interactive CLI workflow
-   Fast and simple validation process

## Installation

Run using npx:

`npx uiray run`

Or install globally:

```text
npm install -g uiray-ai
uiray run
```

## Environment Setup

Create a `.env` file in the directory where you run the CLI:

```text
FIGMA_TOKEN=your_figma_token
GEMINI_API_KEY=your_gemini_api_key
```

Notes:

- FIGMA_TOKEN is required to fetch designs from Figma
- GEMINI_API_KEY is optional (used for AI UI audit)
- Make sure you run the CLI from the same folder where `.env` is present

## Usage

Run interactive CLI:

`npx designlens ui`

## CLI Flow

1.  Select device (Desktop (1920) / Tablet (991) / Mobile (375) / Custom Width)
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
```text
src/
├── cli/
│   └── interactive.js
├── core/
│   └── runner.js
│   └── validator.js
├── services/
│   ├── compare.js
│   ├── figmaService.js
│   ├── gemini.js
│   ├── screenshot.js
├── utils/
│   └── formatResult.js
│   └── parseFigmaUrl.js
├── index.js
```
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
