import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/getClientIp";
import { getAuthenticatedUser } from "@/lib/auth";
import { jsonResponse, errorResponse } from "@/lib/serverApi";

const SYSTEM_PROMPT = `You are an expert computer science assistant specialized in algorithmic analysis and DSA. Your task is to analyze the given code snippet for Time Complexity (Best, Average, and Worst cases using Big-O, Big-Theta, or Big-Omega notation) and Space Complexity. Additionally, if the code is sub-optimal (e.g., O(n^2) nested loops that can be optimized to O(n) using a hash map or sorting), provide a refactored version of the code in the same language along with a brief explanation of the optimization.

Guidelines:
1. "timeBest": Estimate the best-case time complexity (e.g., "O(1)", "O(log n)", "O(n)").
2. "timeAverage": Estimate the average-case time complexity (e.g., "O(n)", "O(n log n)").
3. "timeWorst": Estimate the worst-case time complexity (e.g., "O(n²)", "O(2ⁿ)").
4. "space": Estimate the auxiliary space complexity (excluding input size unless extra memory is directly proportional, e.g., "O(1)", "O(n)").
5. "explanation": Provide a step-by-step breakdown explaining the math and logic behind these complexity estimates. Use clean Markdown formatting, bullet points, and short, beginner-friendly explanations.
6. "optimizedCode": If the code is sub-optimal and can be optimized, provide the fully functional optimized code. If the code is already optimal or cannot be improved, leave this field as an empty string ("").
7. "optimizationJustification": Explain why the optimized code is better, or leave it empty if the code is already optimal.`;

export async function POST(req) {
  try {
    // 1. Parse Request Body
    let body;
    try {
      body = await req.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON request body." }, 400);
    }

    const { code, language } = body || {};

    if (!code || typeof code !== "string" || !code.trim()) {
      return jsonResponse({ error: "Missing or invalid 'code' string." }, 400);
    }
    if (code.length > 50000) {
      return jsonResponse({ error: "Code exceeds maximum allowed length (50,000 characters)." }, 400);
    }
    if (!language || typeof language !== "string") {
      return jsonResponse({ error: "Missing or invalid 'language' string." }, 400);
    }

    const ip = getClientIp(req.headers);

    // 2. Rate Limiting Check
    const { allowed } = await checkRateLimit(`complexity:estimate:${ip}`);
    if (!allowed) {
      return jsonResponse(
        { error: "Too many requests. Please wait a minute and try again." },
        429
      );
    }

    // 3. Authentication Check
    const authResult = await getAuthenticatedUser();

    if (!authResult.success) {
      if (authResult.type === "CONFIG_ERROR" || authResult.type === "AUTH_PROVIDER_ERROR") {
        return jsonResponse({ error: "Authentication service unavailable" }, 500);
      }
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    // 4. Gemini API Integration
    if (!process.env.GEMINI_API_KEY) {
      return jsonResponse(
        { error: "Gemini API Key is missing. Please add GEMINI_API_KEY to your env configuration." },
        500
      );
    }

    const userPrompt = `Language: ${language}\n\nCode to analyze:\n\`\`\`${language.toLowerCase()}\n${code}\n\`\`\``;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                timeBest: { type: "STRING" },
                timeAverage: { type: "STRING" },
                timeWorst: { type: "STRING" },
                space: { type: "STRING" },
                explanation: { type: "STRING" },
                optimizedCode: { type: "STRING" },
                optimizationJustification: { type: "STRING" },
              },
              required: [
                "timeBest",
                "timeAverage",
                "timeWorst",
                "space",
                "explanation",
                "optimizedCode",
                "optimizationJustification",
              ],
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Gemini API request failed:", response.status, errorText);
      return jsonResponse(
        { error: "Gemini API request failed. Please check your key or try again." },
        502
      );
    }

    const data = await response.json();
    const modelTextResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!modelTextResponse) {
      return jsonResponse(
        { error: "Received empty response from the AI model." },
        500
      );
    }

    try {
      const jsonResult = JSON.parse(modelTextResponse.trim());
      return jsonResponse(jsonResult);
    } catch (parseError) {
      console.error("Failed to parse Gemini JSON output:", parseError, modelTextResponse);
      return jsonResponse(
        { error: "Failed to parse complexity result from AI model." },
        500
      );
    }
  } catch (error) {
    console.error("Complexity Estimator API error:", error);
    return errorResponse(error);
  }
}
