import { StableDiffusionGenData } from "@/data-processor/StableDiffusionGenData";

// for generated by @GitHubCopilot
// sample data:
// Prompt: particle effects small breasts, 1 girl, solo, {{masterpiece}}, {best quality},{highres}, original, extremely detailed 8K wallpaper, greasy skin, realistic and delicate facial features, slim waist, overexposure,ultra-detailed,illustration,incredibly_absurdres,ray tracing,intricate detail, colored tips,colored inner hair,aquagradient eyes,gradient eyes,eyelashes,finely detail, depth of field, in gentle breeze dance from ethereal chance. An aura of peace,beyond compare, cinematic lighting, dramatic angle, upper body, long dresses
// Negative prompt: obese, (ugly:1.3), (duplicate:1.3), (morbid), (mutilated), out of frame, extra fingers, mutated hands, (poorly drawn hands), (poorly drawn face), (mutation:1.3), (deformed:1.3), (amputee:1.3), blurry,( bad anatomy), bad proportions, (extra limbs), cloned face, (disfigured:1.3), gross proportions, (malformed limbs), (missing arms), (missing legs), ((extra arms)), (extra legs), mutated hands, (fused fingers), (too many fingers), (long neck:1.3), lowres, text, error, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, black and white, monochrome, censored,empty,lingerie,, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry
// Steps: 20, Sampler: Euler a, CFG scale: 7, Seed: 1338233768, Size: 512x512, Model hash: f773383dbc, Model: anything-v4.5-pruned-fp16
export function parseStableDiffusionData(prompt: string): StableDiffusionGenData {
  // first line is prompt, second line is negative prompt, third line is other infos which split by comma
  const lines = prompt.split("\n");
  const promptLine = lines[0];
  const negativePromptLine = lines[1];
  const otherInfosLine = lines[2];

  // parse prompt
  const promptRegex = /Prompt: (.*)/;
  const promptMatch = promptLine.match(promptRegex) ?? ["", promptLine];

  // 1. split promptMatch by comma
  // 2. match lora name by regex, lora full name: <lora:japaneseDollLikeness_v10:0.1>,
  // 3. push lora name to loras array
  const loras = promptMatch[1]
    .split(",")
    .map((item) => {
      const match = item.match(/<lora:(.+):.+/);
      return match ? match[1] : "";
    })
    .filter((item) => item !== "");

  // parse negative prompt
  const negativePromptRegex = /Negative prompt: (.*)/;
  const negativePromptMatch = negativePromptLine ? negativePromptLine.match(negativePromptRegex) ?? ["", ""] : ["", ""];

  // parse other infos by split comma
  const otherInfosMatch = otherInfosLine
    ? otherInfosLine.split(",").map((item) => {
        const match = item.match(/(.+): (.*)/);
        if (!match) {
          return;
        }
        return match[2];
      })
    : [];

  // return result
  return {
    prompt: promptMatch[1],
    negativePrompt: negativePromptMatch[1],
    steps: otherInfosMatch[0] ? parseInt(otherInfosMatch[0]) : undefined,
    sampler: otherInfosMatch[1],
    cfgScale: otherInfosMatch[2] ? parseInt(otherInfosMatch[2]) : undefined,
    seed: otherInfosMatch[3] ? parseInt(otherInfosMatch[3]) : undefined,
    size: otherInfosMatch[4],
    modelHash: otherInfosMatch[5],
    model: otherInfosMatch[6],
    lora: loras,
  };
}

export function StableDiffusionDataToString(prompt: StableDiffusionGenData): string {
  const otherInfo = [];
  if (prompt.steps) otherInfo.push("Steps: " + prompt.steps);
  if (prompt.sampler) otherInfo.push("Sampler: " + prompt.sampler);
  if (prompt.cfgScale) otherInfo.push("CFG Scale: " + prompt.cfgScale);
  if (prompt.seed) otherInfo.push("Seed: " + prompt.seed);
  if (prompt.size) otherInfo.push("Size: " + prompt.size);
  if (prompt.modelHash) otherInfo.push("Model hash: " + prompt.modelHash);
  if (prompt.model) otherInfo.push("Model: " + prompt.model);
  return `${prompt.prompt}\nNegative prompt: ${prompt.negativePrompt}\n${otherInfo.join(", ")}`;
}