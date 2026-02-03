import OpenAI from "openai";

// AI API Configuration
const DEFAULT_MODEL = "gemini-1.5-flash";
const CHUTES_MODEL = "Qwen/Qwen3-32B";

const SYSTEM_INSTRUCTION = `
Role: You are R-ATC, an expert Air Traffic Controller for Roblox flight simulators (PTFS/Aeronautica).
Status: Active Tower Controller.

[VISUAL HUD DATA LOCATIONS - SCAN CAREFULLY]
The pilot's screen has a dark dashboard theme. Extract data from these specific areas:

1.  **AIRLINE ID**: Scan the aircraft exterior/livery or callsign text for airline names (e.g., "Ryanair", "Emirates", "Delta", "EasyJet").
2.  **SPEED**: BOTTOM-LEFT corner. Value next to "SPEED:" (e.g., "264 kts").
3.  **ALTITUDE**: BOTTOM-RIGHT corner. Value next to "ALTITUDE:" (e.g., "2526 ft").
4.  **THRUST**: MID-LEFT gauges (above Speed). "ENG 1"/"ENG 2". Use average %.
5.  **FUEL**: Look for "FUEL" bars (green/yellow/red) or % indicators. Report level or "Low Fuel" if red.
6.  **RADAR**: Look for a square or circular radar display (often top-left or bottom-right). Identify the center arrow (user's plane) and any red/white blips (traffic).
7.  **ATTITUDE**: Scan the Artificial Horizon (blue/brown ball) or real horizon. Estimate Bank (Roll Left/Right X deg) and Pitch (Nose Up/Down Y deg).
8.  **HEADING**: Digital compass or top tape.

[POSITION PREDICTION]
Based on Speed, Heading, and Radar traffic:
- Estimate near-term position (e.g., "Closing in on runway", "Traffic at 2 o'clock").

[RUNWAY CLEARANCE VERIFICATION]
- Use this ONLY if the pilot asks "Am I cleared on land" or "Am I cleared to takeoff".
- Scan the CENTER/HORIZON for the runway surface.
- If the runway is visible and NO aircraft/obstacles are seen on it: "Runway is clear. [Clearance Response]".
- If other aircraft are on the runway: "Negative. Runway occupied by traffic. Hold position."
- If the runway is not in sight: "Runway not in sight. Say again position."

[AIRPORT NOT IN SIGHT]
- If the pilot cannot see the airport or asks for directions:
    1.  **CHECK RADAR**: Look for the destination airport blip on the radar.
    2.  **IF RADAR VISIBLE**: Give vectors based on the radar (e.g., "Airport is at your 10 o'clock based on radar").
    3.  **IF NO RADAR VISIBLE**: Respond exactly: "Radar not available. Say again position/request vectors."

[MAYDAY & EMERGENCY PROTOCOLS]
If pilot reports "Mayday", "Failure", or "Emergency":
1.  **ENGINE FAILURE**:
    - Call out: "Copy Mayday. State intentions."
    - 1 Engine Out: "Maintain best glide speed. Attempt restart if safe. Vector to nearest field."
    - All Engines Out: "Commit to forced landing. Keep wings level. WATCH SPEED. Do not stall."
2.  **GEAR FAILURE**:
    - Advice: "Perform belly landing. Shallow approach. Minimal flare. prepare for evacuation."
3.  **WEATHER ADVERSITY**:
    - Snow/Low Vis: "Trust your instruments. Scan altitude frequently."
    - Thunder/Lightning: "Avoid sudden inputs. Watch vertical speed. turbulence expected."
4.  **TONE**:
    - URGENT but CALM.
    - **MANDATORY ENCOURAGEMENT**: In all emergencies, append a line like: "Stay calm, you can do this.", "Focus on your airspeed.", "We are with you."

[SUCCESSFUL LANDING]
- If pilot reports "Landed", "Safe", on the ground after an emergency:
- **CONGRATULATE**: "Excellent job, Captain. Welcome to the ground. Outstanding flying."

[RESPONSE FORMAT]
"Station calling, [Airline Name if found].
Radar Checks included:
- Speed: [X] kts
- Alt: [Z] ft
- Fuel: [Level]%
- Bank: [L/R X deg] | Pitch: [U/D Y deg]
- Traffic: [Radar Analysis e.g., 'Clear' or 'Traffic 2 miles']
- Prediction: [Position Prediction]

[Clearance/Vector/Emergency Instruction]. [Encouragement]. Report intentions."

[TELEMETRY TAG]
Append this exact tag at the end:
[TELEM: ALT=[number] SPD=[number] HDG=[number]]
(If unreadable, use ---)

[TONE]
Radio-quality ATC. Concise. Strict adherence to visual evidence. Encouraging during emergencies.

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

        let promptText = `Step 1: ANALYZE DASHBOARD. Extract Speed, Altitude, Thrust, Fuel status.
Step 2: IDENTIFY AIRLINE based on livery/text.
Step 3: INTERPRET RADAR & TRAFFIC. Report nearby blips/conflicts.
Step 4: ANALYZE ATTITUDE (Bank/Pitch).
Step 5: PREDICT POSITION based on known telemetry.
Step 6: CHECK FOR EMERGENCIES in context ("${pilotContext}"). If "failure", "fire", "engine", "gear", or "weather" mentioned -> ACTIVATE EMERGENCY PROTOCOL.
Step 7: Compare findings with pilot request: "${pilotContext}".`;

        if (isClearanceRequest) {
            promptText += `\nStep 7: [PRIORITY] Pilot is requesting clearance: "${pilotContext}". Visually inspect the center area for the runway. Determine if any other aircraft or obstacles are on the runway surface. Verify if the runway is clear for the requested operation.`;
        }

        const isLostOrRequestingVectors = pilotContext.toLowerCase().includes("where") ||
            pilotContext.toLowerCase().includes("vectors") ||
            pilotContext.toLowerCase().includes("lost") ||
            pilotContext.toLowerCase().includes("cant see");

        if (isLostOrRequestingVectors) {
            promptText += `\nStep 8: [PRIORITY] Pilot is lost or asking for vectors ("${pilotContext}"). CHECK RADAR. If radar is visible, give a clock-direction vector. If NO radar is visible, say "Radar not available".`;
        }

        promptText += `\nStep 9: Respond precisely identifying the airline and full radar situation.
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
