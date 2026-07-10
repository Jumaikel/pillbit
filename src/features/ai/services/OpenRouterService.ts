import { CreateMedicationAiInformationDTO } from "@/database/dto";

interface OpenRouterConfig {
  apiKey: string;
  model: string;
  baseUrl: string;
}

export class OpenRouterService {
  static getConfig(): OpenRouterConfig {
    const apiKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || "";
    const baseUrl =
      process.env.EXPO_PUBLIC_OPENROUTER_BASE_URL ||
      "https://openrouter.ai/api/v1/chat/completions";
    const model =
      process.env.EXPO_PUBLIC_OPENROUTER_MODEL ||
      "meta-llama/llama-3.3-70b-instruct:free";

    return { apiKey, baseUrl, model };
  }

  static async generateMedicationInfo(
    medicationName: string
  ): Promise<Omit<CreateMedicationAiInformationDTO, "medicationId">> {
    const config = this.getConfig();

    if (!config.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const prompt = `You are a medical assistant providing factual, educational information about medications.
Generate information for the medication: "${medicationName}".
Provide the output strictly in valid JSON format with exactly these keys:
{
  "description": "string",
  "commonUses": "string",
  "contraindications": "string",
  "sideEffects": "string",
  "warnings": "string",
  "interactions": "string"
}
Do not include any markdown, backticks, or extra text. Just the JSON object.`;

    try {
      const response = await fetch(config.baseUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "HTTP-Referer": "https://github.com/pillbit",
          "X-Title": "PillBit",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        const errorText = await response.text();
        throw new Error(
          `OpenRouter API error: ${response.status} - ${errorText}`,
        );
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("Empty response from AI model");
      }

      try {
        // Some models return markdown code blocks anyway, clean it up
        let cleanContent = content;
        if (cleanContent.startsWith("\`\`\`json")) {
          cleanContent = cleanContent
            .replace(/^\`\`\`json/, "")
            .replace(/\`\`\`$/, "");
        }
        const parsed = JSON.parse(cleanContent.trim());
        return {
          description: parsed.description || null,
          commonUses: parsed.commonUses || null,
          contraindications: parsed.contraindications || null,
          sideEffects: parsed.sideEffects || null,
          warnings: parsed.warnings || null,
          interactions: parsed.interactions || null,
        };
      } catch (parseError) {
        console.error(
          "AI response parse error:",
          parseError,
          "Raw content:",
          content,
        );
        throw new Error("Failed to parse AI response into structured data");
      }
    } catch (error: any) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        throw new Error("Network failure. Please check your connection.");
      }
      throw error;
    }
  }
}
