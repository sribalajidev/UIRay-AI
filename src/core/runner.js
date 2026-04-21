import validate from "./validator.js";

export async function runValidation({
  pageUrl,
  figmaUrl,
  figmaFilePath,
  device,
  viewport,
  enableAI,
  token,
}) {
  const result = await validate({
    pageUrl,
    figmaUrl,
    figmaFilePath,
    device,
    viewport,
    enableAI,
    token,
  });

  return result;
}