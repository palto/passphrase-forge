/**
 * Configuration and control for AI quality testing
 */

export class AITestController {
  /**
   * Check if AI tests should run
   * Requires both RUN_AI_TESTS=true and a valid OPENAI_API_KEY
   */
  static shouldRunAITests(): boolean {
    return (
      process.env.RUN_AI_TESTS === "true" &&
      typeof process.env.OPENAI_API_KEY === "string" &&
      process.env.OPENAI_API_KEY.length > 0
    );
  }

  /**
   * Get the reason why AI tests are disabled (for helpful error messages)
   */
  static getDisabledReason(): string {
    if (process.env.RUN_AI_TESTS !== "true") {
      return "RUN_AI_TESTS environment variable is not set to 'true'";
    }
    if (!process.env.OPENAI_API_KEY) {
      return "OPENAI_API_KEY environment variable is not set";
    }
    return "AI tests are disabled";
  }
}
