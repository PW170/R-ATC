import OpenAI from "openai";

// AI API Configuration
const DEFAULT_MODEL = "gemini-1.5-flash";
const CHUTES_MODEL = "Qwen/Qwen3-32B";

const SYSTEM_INSTRUCTION = `
Role: You are R-ATC, an expert Air Traffic Controller for Roblox flight simulators (PTFS/Aeronautica).
Status: Active Tower Controller.

[VISUAL HUD DATA LOCATIONS - SCAN CAREFULLY]
The pilot's screen has a dark dashboard theme. Extract numbers from these specific areas:
1. BOTTOM-LEFT: Look for "SPEED:". The value is next to it (e.g., "0 kts", "264 kts").
2. BOTTOM-RIGHT: Look for "ALTITUDE:". The value is next to it (e.g., "500 ft", "2526 ft").
3. MID-LEFT (Above Speed): Two circular gauges "ENG 1" and "ENG 2". Extract the % values (e.g., "100%", "Idle"). Use the average as THRUST.
4. CENTER/HORIZON: Look for floating white text labels indicating airports and distances (e.g., "Doha Hamad Airport", "Distance: 34357 studs").

[RUNWAY CLEARANCE VERIFICATION]
- Use this ONLY if the pilot asks "Am I cleared on land" or "Am I cleared to takeoff".
- Scan the CENTER/HORIZON for the runway surface.
- If the runway is visible and NO aircraft/obstacles are seen on it: "Runway is clear. [Clearance Response]".
- If other aircraft are on the runway: "Negative. Runway occupied by traffic. Hold position."
- If the runway is not in sight: "Runway not in sight. Say again position."

[RESPONSE FORMAT]
"Copy [Aircraft Type]. Radar Checks: Speed [X] knots, Thrust [Y]%, Altitude [Z] ft. [Heading Verification Confirmation/Warning]. [Runway Clearance Verification if applicable]. Report your destination and flight code."

[TELEMETRY TAG]
Append this exact tag at the end:
[TELEM: ALT=[number] SPD=[number]]
(If unreadable, use ---)

[TONE]
Radio-quality ATC. Concise. Strict adherence to visual evidence.

[LANGUAGE]
ENGLISH ONLY.
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

        const isClearanceRequest = pilotContext.toLowerCase().includes("cleared on land") ||
            pilotContext.toLowerCase().includes("cleared to takeoff");

        let promptText = `Step 1: Locate the SPEED (bottom-left), THRUST (mid-left gauges), and ALTITUDE (bottom-right).
Step 2: Scan the HORIZON for floating airport names and distances.
Step 3: Compare visible airport labels with pilot's intent: "${pilotContext}".`;

        if (isClearanceRequest) {
            promptText += `\nStep 4: [PRIORITY] Pilot is requesting clearance: "${pilotContext}". Visually inspect the center area for the runway. Determine if any other aircraft or obstacles are on the runway surface. Verify if the runway is clear for the requested operation.`;
        }

        promptText += `\nStep 5: Respond to pilot with radar check, heading verification, and runway clearance status if requested.
If digits are unreadable, report "Instruments unreadable".`;

        let baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";
        let currentModel = DEFAULT_MODEL;

        // Route based on API Key prefix (Highest Priority)
        if (apiKey.startsWith("sk-or-")) {
            console.log("AI Service: Routing to OpenRouter (Detected from Key)");
            baseURL = "https://openrouter.ai/api/v1";
            currentModel = import.meta.env.VITE_AI_MODEL || "google/gemini-2.0-flash-001";
        } else if (apiKey.startsWith("cpk_")) {
            console.log("AI Service: Routing to Chutes AI");
            baseURL = "https://llm.chutes.ai/v1";
            currentModel = CHUTES_MODEL;
        } else if (apiKey.startsWith("ghp_") || apiKey.startsWith("github_pat_")) {
            console.log("AI Service: Routing to GitHub Models");
            baseURL = "https://models.inference.ai.azure.com";
            currentModel = "gpt-4o";
        } else if (apiKey.startsWith("AIza")) {
            console.log("AI Service: Routing to Google Direct API");
            baseURL = "https://generativelanguage.googleapis.com/v1beta/openai/";
            currentModel = "gemini-1.5-flash";
        } else if (apiKey.startsWith("sk-") && !apiKey.includes("or-")) {
            console.log("AI Service: Routing to DeepSeek Direct API");
            baseURL = "https://api.deepseek.com";
            currentModel = "deepseek-chat";
        } else if (import.meta.env.VITE_AI_BASE_URL) {
            // Fallback to Env-configured Base URL if key is generic or unknown
            console.log("AI Service: Routing to Custom Provider (Env Configured)");
            baseURL = import.meta.env.VITE_AI_BASE_URL;
            currentModel = import.meta.env.VITE_AI_MODEL || currentModel;
        } else {
            console.log("AI Service: Routing to Generic OpenAI API");
            baseURL = "https://api.openai.com/v1";
            currentModel = "gpt-4o-mini";
        }

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseURL,
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "X-Title": "SkyCommand AI-ATC",
            }
        });

        console.log(`Sending transmission to model: ${currentModel} at ${baseURL}`);

        const isVisionSupported = !currentModel.includes('deepseek') && !currentModel.includes('o1-') || (apiKey.startsWith("sk-or-") && (currentModel.includes('flash') || currentModel.includes('vision') || currentModel.includes('pro')));

        let finalPrompt = promptText;
        let messages: any[] = [
            {
                role: "system",
                content: SYSTEM_INSTRUCTION
            }
        ];

        if (!isVisionSupported) {
            console.log("Vision not supported for this model. Sending text only.");
            finalPrompt += " [SYSTEM WARNING: VISION OFFLINE. IMAGE DATA NOT AVAILABLE. You cannot see the dashboard. Ask the pilot for readings.]";
            messages.push({
                role: "user",
                content: finalPrompt
            });
        } else {
            messages.push({
                role: "user",
                content: [
                    {
                        type: "text",
                        text: promptText,
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:image/png;base64,${base64Image}`
                        }
                    }
                ]
            });
        }

        const response = await openai.chat.completions.create({
            model: currentModel,
            messages: messages,
            max_tokens: 150,
            temperature: 0.2,
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
