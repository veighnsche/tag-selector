import axios from 'axios';
import { ImageInputsType, ImageOutputType, TagType } from 'frontend/src/types';
import { ImageGenerateParams } from 'frontend/src/types/image-generate-params';
import { DynamicTagType, OptimizerTypes, PromptTagsType } from 'frontend/src/types/image-input';
import { SdProgressType } from 'frontend/src/types/sd-progress';
import seedrandom from 'seedrandom';
import { SD_URL } from '../constants';
import { getLlmPromptEnhancer } from './llm-completion';

function isTagBracketed(tag: string) {
  const trimmedTag = tag.trim();
  return trimmedTag.startsWith('{') && trimmedTag.endsWith('}');
}

function pickBracketedTag(tag: string, rng: seedrandom.PRNG) {
  const tagNames = tag.slice(1, -1).split('|').map(tag => tag.trim());
  const tagIndex = Math.floor(rng() * tagNames.length);
  return tagNames[tagIndex];
}

function pickDynamicTag(dynamicTag: DynamicTagType, rng: seedrandom.PRNG): string {
  const tagIndex = Math.floor(rng() * dynamicTag.length);
  const tag = dynamicTag[tagIndex];
  const positive = tag.positive.map(tag => tagToPrompt(rng)(tag)).join(', ');
  if (tag.negative.length === 0) {
    return `${positive}`;
  }

  const negative = tag.negative.map(tag => tagToPrompt(rng)(tag)).join(', ');
  return `[[${positive}!!${negative}]]`;
}

export function untangleDynamicTags(prompts: { prompt: string, negative: string }): {
  prompt: string,
  negative: string
} {
  const { prompt, negative } = prompts;

  const dynamicTagPattern = /\[\[(.*?)!!(.*?)]]/g;
  const match = prompt.match(dynamicTagPattern);

  if (!match) {
    return { prompt, negative };
  }

  const newPrompt = match.reduce((acc, dynamicTag) => {
    const removedBrackets = dynamicTag.slice(2, -2);
    const [dynamicPositive] = removedBrackets.split('!!');
    if (!dynamicPositive) {
      const withExtraComma = acc.replace(dynamicTag, '').trim();
      // Remove extra comma, could either be a trailing comma or a double comma (", ,")
      return withExtraComma.replace(/, ,/g, ',').replace(/,$/, '');
    }
    return acc.replace(dynamicTag, dynamicPositive.trim());
  }, prompt);

  const dynamicNegatives = match.map(dynamicTag => {
    const removedBrackets = dynamicTag.slice(2, -2);
    const [, dynamicNegative] = removedBrackets.split('!!');
    return dynamicNegative.trim();
  }).filter(Boolean);

  const newNegative = negative ? [...dynamicNegatives, negative].join(', ') : dynamicNegatives.join(', ');

  return { prompt: newPrompt, negative: newNegative };
}

const tagToPrompt = (rng: seedrandom.PRNG) => (tag: TagType): string | null => {
  if (tag.muted || tag.name === '') {
    return '';
  }

  if (tag.dynamic !== undefined) {
    return pickDynamicTag(tag.dynamic, rng);
  }

  if (tag.optimizer === OptimizerTypes.HYPERNETWORK) {
    const strength = tag.strength || 100;
    return `<hypernet:${tag.name}:${strength / 100}>`;
  }

  if (tag.optimizer === OptimizerTypes.LORA) {
    const strength = tag.strength || 100;
    return `<lora:${tag.name}:${strength / 100}>`;
  }

  if (tag.optimizer === OptimizerTypes.LYCORIS) {
    const strength = tag.strength || 100;
    return `<lyco:${tag.name}:${strength / 100}>`;
  }

  if (isTagBracketed(tag.name)) {
    tag.name = pickBracketedTag(tag.name, rng).trim();

    if (tag.name === '') {
      return null;
    }
  }

  if (tag.strength && tag.strength !== 100) {
    return `(${tag.name}:${tag.strength / 100})`;
  }

  return tag.name;
};

export const selectTagsForInputs = ({
  tags, negativeTags, scene, negativePrompt, rng,
}: {
  tags: TagType[]
  negativeTags: TagType[]
  scene: string
  negativePrompt: string
  rng: seedrandom.PRNG
}) => {
  const seededTagToPrompt = tagToPrompt(rng);
  const prompts = {
    prompt: [scene.trim(), ...tags.map(seededTagToPrompt)].filter(Boolean).join(', '),
    negative: [negativePrompt.trim(), ...negativeTags.map(seededTagToPrompt)].filter(Boolean).join(', '),
  };

  return untangleDynamicTags(prompts);
};

export async function imageGenerate({
  prompt: { scene, negativePrompt },
  options: { width, height, steps, cfg, seed, restoreFaces, samplingMethod, highResFix, refiner, llmEnhance },
}: ImageInputsType, {
  tags,
  negativeTags,
}: PromptTagsType): Promise<ImageOutputType> {
  const rng = seedrandom(seed.toString());

  console.time('generateImage');
  let { prompt, negative } = selectTagsForInputs({
    tags,
    negativeTags,
    scene,
    negativePrompt,
    rng,
  });

  if (llmEnhance.enabled) {
    try {
      prompt = await getLlmPromptEnhancer(llmEnhance.prompt, prompt);
    } catch (error) {
      console.error('Error fetching LLM completion:', error);
    }
  }

  const params: ImageGenerateParams = {
    prompt,
    negative_prompt: negative,
    steps,
    width,
    height,
    cfg_scale: cfg,
    seed,
    restore_faces: restoreFaces,
    sampler_index: samplingMethod,

    enable_hr: highResFix.enabled,
    hr_upscaler: highResFix.upscaler,
    hr_scale: highResFix.scale,
    hr_second_pass_steps: highResFix.steps,
    denoising_strength: highResFix.denoisingStrength,

    refiner_checkpoint: refiner.checkpoint,
    refiner_switch_at: refiner.switchAt / 100,
  };

  try {
    const response = await axios.post(`${SD_URL}/sdapi/v1/txt2img`, params);
    console.timeEnd('generateImage');
    const imageOutput = response.data;
    return ({
      ...imageOutput,
      info: JSON.parse(imageOutput.info as unknown as string),
    });
  } catch (error) {
    console.timeEnd('generateImage');
    throw error;
  }
}

export function getProgress(): Promise<SdProgressType> {
  return axios.get(`${SD_URL}/sdapi/v1/progress`)
  .then(response => response.data);
}

export function interruptImageGenerate(): Promise<void> {
  return axios.post(`${SD_URL}/sdapi/v1/interrupt`);
}

export function withSeedNumber(input: ImageInputsType): ImageInputsType {
  if (input.options.seed !== -1) {
    return input;
  }

  return {
    ...input,
    options: {
      ...input.options,
      seed: Math.floor(Math.random() * 4294967295), // max seed number is 2^32 - 1
    },
  };
}