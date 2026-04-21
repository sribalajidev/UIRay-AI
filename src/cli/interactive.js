import inquirer from 'inquirer';
import fs from "fs";

export async function getUserInput() {
  const answers = await inquirer.prompt([

    // Viewport selection
    {
      type: 'list',
      name: 'device',
      message: 'Select viewport:',
      choices: [
        { name: 'Desktop (1920)', value: 'pc' },
        { name: 'Tablet (991)', value: 'tab' },
        { name: 'Mobile (375)', value: 'mob' },
        { name: 'Custom width', value: 'custom' },
      ],
    },

    // Custom width
    {
      type: 'input',
      name: 'customWidth',
      message: 'Enter custom width (px):',
      when: (ans) => ans.device === 'custom',
      filter: (input) => input.trim(),
      validate: (val) => {
        if (!val) return 'Width is required';
        if (isNaN(val)) return 'Enter a valid number';
        if (Number(val) < 320) return 'Minimum width is 320px';
        return true;
      },
    },

    // Website URL
    {
      type: 'input',
      name: 'url',
      message: 'Enter website URL:',
      filter: (input) => input.trim(),
      validate: (input) => {
        if (!input) return 'URL is required';

        try {
          new URL(input);
          return true;
        } catch {
          return 'Enter a valid URL (e.g. https://example.com)';
        }
      },
    },

    // Reference type
    {
      type: 'list',
      name: 'referenceType',
      message: 'Select reference type:',
      choices: [
        { name: 'Figma URL', value: 'figma' },
        { name: 'Local file', value: 'file' },
      ],
    },

    // Figma URL
    {
      type: 'input',
      name: 'figmaUrl',
      message: 'Enter Figma URL:',
      when: (ans) => ans.referenceType === 'figma',
      filter: (input) => input.trim(),
      validate: (input) => {
        if (!input) return 'Figma URL is required';
        if (!input.includes('figma.com')) return 'Enter a valid Figma URL';
        return true;
      },
    },

    // Local file path
    {
      type: 'input',
      name: 'filePath',
      message: 'Enter local file path:',
      when: (ans) => ans.referenceType === 'file',
      filter: (input) => input.trim(),
      validate: (input) => {
        const clean = input
          .trim()
          .replace(/^['"]|['"]$/g, "")
          .replace(/\\ /g, " ");

        if (!clean) return "File path is required";

        return fs.existsSync(clean) || "File does not exist";
      },
    },

    // AI option
    {
      type: 'list',
      name: 'enableAI',
      message: 'Generate AI UI audit?',
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ]
    },

  ]);

  return answers;
}