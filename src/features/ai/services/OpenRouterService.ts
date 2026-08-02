import { CreateMedicationAiInformationDTO } from "@/database/dto";
import { ApplicationSettingRepository } from "@/database/repositories/ApplicationSettingRepository";

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
    medicationName: string,
    language: string = "es"
  ): Promise<Omit<CreateMedicationAiInformationDTO, "medicationId">> {
    const config = this.getConfig();

    if (!config.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const languageName = language.startsWith("es") ? "Spanish" : "English";

    const isProd = process.env.EXPO_PUBLIC_ISDEV === "prod";
    if (isProd) {
      const settings = await ApplicationSettingRepository.get();
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      if (settings?.lastAiRequestDate === today) {
        throw new Error("Límite de peticiones diarias a la IA alcanzado.");
      }
    }

    const prompt = `You are a medical assistant providing factual, educational information about medications.
If the input "${medicationName}" is a misspelled version of a real medication, you MUST provide the full information for the intended medication and mention the spelling correction at the beginning of the "description" field.
If the input "${medicationName}" is completely unrecognizable, NOT a real medication, or if the request is inappropriate, YOU MUST return exactly this JSON: { "error": "NOT_A_MEDICATION" } and nothing else.
Otherwise, generate information for the medication: "${medicationName}".
The response MUST be written in the following language: ${languageName}.
Provide the output strictly in valid JSON format with exactly these keys:
{
  "description": "string",
  "commonUses": "string",
  "dosageAdministration": "string (include possible doses and method of administration)",
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

      let parsed: any = null;
      try {
        // Some models return markdown code blocks anyway, clean it up
        let cleanContent = content;
        if (cleanContent.startsWith("\`\`\`json")) {
          cleanContent = cleanContent
            .replace(/^\`\`\`json/, "")
            .replace(/\`\`\`$/, "");
        }
        parsed = JSON.parse(cleanContent.trim());
      } catch (parseError) {
        console.error(
          "AI response parse error:",
          parseError,
          "Raw content:",
          content,
        );
        throw new Error("Failed to parse AI response into structured data");
      }
        
      if (isProd) {
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        await ApplicationSettingRepository.update({ lastAiRequestDate: today });
      }

      if (parsed.error === 'NOT_A_MEDICATION') {
          const errorMsg = language.startsWith("es")
              ? "El término ingresado no parece ser un medicamento válido o la consulta está fuera de lugar."
              : "The entered term does not appear to be a valid medication or the request is out of scope.";
          throw new Error(errorMsg);
      }

      return {
        description: parsed.description || null,
        commonUses: parsed.commonUses || null,
        dosageAdministration: parsed.dosageAdministration || null,
        contraindications: parsed.contraindications || null,
        sideEffects: parsed.sideEffects || null,
        warnings: parsed.warnings || null,
        interactions: parsed.interactions || null,
      };
    } catch (error: any) {
      if (error.name === "TypeError" && error.message === "Failed to fetch") {
        throw new Error("Network failure. Please check your connection.");
      }
      throw error;
    }
  }
}
