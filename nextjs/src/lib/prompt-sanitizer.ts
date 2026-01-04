/**
 * Prompt injection sanitization utility.
 * Removes patterns that could manipulate AI model behavior.
 */

// Dangerous patterns for prompt injection detection
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
  /disregard\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
  /forget\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
  /override\s+(all\s+)?(previous|above|prior)\s+(instructions?|prompts?|context)/gi,
  /you\s+are\s+now\s+(a|an)\s+/gi,
  /your\s+new\s+(role|purpose|instructions?)\s+(is|are)/gi,
  /system\s*:\s*/gi,
  /\[\[system\]\]/gi,
  /<<system>>/gi,
  /assistant\s*:\s*/gi,
  /human\s*:\s*/gi,
  /\[INST\]/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
];

/**
 * Sanitize text to prevent prompt injection attacks.
 * Removes patterns that could manipulate AI behavior.
 */
export function sanitizeForPromptInjection(
  text: string | undefined,
  maxLength?: number
): string {
  if (!text) return '';

  // Truncate to max length if specified
  let sanitized = maxLength ? text.slice(0, maxLength) : text;

  // Remove potential prompt injection patterns
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REMOVED]');
  }

  return sanitized.trim();
}
