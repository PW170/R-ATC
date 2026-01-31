import OpenAI from "openai";

// AI API Configuration
// AI API Configuration
const DEFAULT_MODEL = "gemini-1.5-flash";
const CHUTES_MODEL = "Qwen/Qwen3-32B";

const SYSTEM_INSTRUCTION = `
Role: You are R-ATC, an expert Air Traffic Controller for Roblox flight simulators (PTFS/Aeronautica).
Status: Active Tower Controller.

[CRITICAL MISSION]
1. A pilot has just identified their aircraft.
2. You MUST analyze the screen to extract:
   - SPEED (in Knots)
   - THRUST (in %)
   - ALTITUDE (in ft)
3. You MUST then ask the pilot for:
   - DESTINATION
   - FLIGHT CODE

[RESPONSE FORMAT]
"Copy [Aircraft Type]. Radar Checks: Speed [X] knots, Thrust [Y]%, Altitude [Z] ft. Report your destination and flight code."

[TELEMETRY TAG]
Append this exact tag at the end for the HUD:
[TELEM: ALT=[number] SPD=[number]]
(If instruments are unreadable, use ---)

[TONE]
Professional, radio-quality, concise. Do NOT hallucinate. If you can't see the instruments, say "Instruments unreadable, report altitude and speed."
`;

export const analyzeFlightFrame = async (
    base64Image: string,
    pilotContext: string,
    apiKey: string
): Promise<string> => {
    try {
        if (!apiKey) {
            console.error("Missing API Key");
            return "System failure. API configuration error.";
        }

        const promptText = `Pilot reports aircraft: "${pilotContext}". Analyze the dashboard instruments now. Identify Speed, Thrust, and Altitude. Ask for destination and flight code.`;

        let baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";
        let currentModel = DEFAULT_MODEL;

        // Route based on API Key
        if (apiKey.startsWith("cpk_")) {
            console.log("Routing to Chutes AI");
            baseURL = "https://llm.chutes.ai/v1";
            currentModel = CHUTES_MODEL;
        } else if (apiKey.startsWith("ghp_") || apiKey.startsWith("github_pat_")) {
            console.log("Routing to GitHub Models (OpenAI-Compatible endpoint)");
            baseURL = "https://models.inference.ai.azure.com";
            // DeepSeek-R1 does not support vision, so we use gpt-4o for this mission
            currentModel = "gpt-4o";
        } else if (apiKey.startsWith("AIza")) {
            console.log("Routing to Google Direct API");
            baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";
            currentModel = "gemini-1.5-flash";
        } else if (apiKey.startsWith("sk-")) {
            console.log("Routing to DeepSeek Direct API");
            baseURL = "https://api.deepseek.com";
            currentModel = "deepseek-chat";
        } else {
            console.log("Routing to Generic OpenAI API");
            baseURL = "https://api.openai.com/v1";
            currentModel = "gpt-4o-mini";
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : '',
                "X-Title": "R-ATC",
            }
        });

        console.log(`Sending transmission to model: ${currentModel} at ${baseURL}`);

        const response = await openai.chat.completions.create({
            model: currentModel,
            messages: [
                {
                    role: "system",
                    content: SYSTEM_INSTRUCTION
                },
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: promptText,
                        } as any,
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        } as any
                    ]
                }
            ],
            max_tokens: 150,
            temperature: 0.7,
        });

        const content = response.choices?.[0]?.message?.content;
        console.log("Response received from AI Service.");
        return content || "Station calling, say again. Visual signal weak.";
    } catch (error: any) {
        console.error("AI Service CRITICAL Error:", error);

        // Include status if available
        const status = error?.status || error?.response?.status;
        const msg = error?.message || error?.toString() || '';

        // Handle Rate Limits specifically
        if (status === 429 || msg.includes('429') || msg.includes('Resource has been exhausted')) {
            return "RADAR OFFLINE: Daily Quota Exceeded for this API Key. Please switch to a GitHub Personal Access Token (Free GPT-4o) or a Paid Google Key in Settings.";
        }

        // Handle Payment Required specifically
        if (status === 402 || msg.includes('402')) {
            return "RADAR OFFLINE: Payment Required. Your Chutes AI balance may be zero or the model requires a subscription. Please check your account at chutes.ai.";
        }

        return `Radar contact lost. [Error ${status || 'Unknown'}]: ${msg}`;
    }
};
