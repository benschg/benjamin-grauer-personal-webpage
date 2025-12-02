// Available Gemini models with pricing (per 1M tokens, USD)
// Pricing from: https://ai.google.dev/pricing
// Note: API calls are now handled by Cloud Functions - this config is for UI display only
export const GEMINI_MODELS = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Best price-performance with thinking',
    thinking: true,
    freeTier: true,
    pricing: { input: 0.15, output: 0.6 },
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'State-of-the-art reasoning',
    thinking: true,
    freeTier: true,
    pricing: { input: 1.25, output: 10.0 },
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Fast, cost-efficient',
    thinking: false,
    freeTier: true,
    pricing: { input: 0.1, output: 0.4 },
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro (Preview)',
    description: 'Most advanced model (~50 req/day free)',
    thinking: true,
    freeTier: true,
    pricing: { input: 1.25, output: 10.0 },
  },
] as const;

export type GeminiModelId = (typeof GEMINI_MODELS)[number]['id'];

// Estimate tokens for a typical CV generation request
// ~3000 input tokens (prompt + job posting) + ~1500 output tokens
export const ESTIMATED_TOKENS = { input: 3000, output: 1500 };

export const estimateCost = (modelId: GeminiModelId): string => {
  const model = GEMINI_MODELS.find((m) => m.id === modelId);
  if (!model) return 'Unknown';

  const inputCost = (ESTIMATED_TOKENS.input / 1_000_000) * model.pricing.input;
  const outputCost = (ESTIMATED_TOKENS.output / 1_000_000) * model.pricing.output;
  const totalCost = inputCost + outputCost;

  if (totalCost < 0.001) return '< $0.001';
  return `~$${totalCost.toFixed(4)}`;
};

// Default model
export const DEFAULT_GEMINI_MODEL: GeminiModelId = 'gemini-2.5-flash';
