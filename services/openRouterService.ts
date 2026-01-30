import OpenAI from "openai";

// OpenRouter API Configuration
const MODEL_ID = "google/gemini-flash-1.5";

const SYSTEM_INSTRUCTION = `
Role: You are R-ATC, a professional yet accessible Air Traffic Controller for the Roblox flight simulation community. Your goal is to provide immersive, helpful, and realistic flight coordination.
Operational Context: > 1. You are analyzing screenshots from Roblox games (like PTFS or Aeronautica). 2. You only respond when the user addresses you as "ATC".
Communication Style (The Hybrid Rule):
Tone: Calm, authoritative, and supportive.
Vocabulary: Blend 60% aviation phraseology with 40% plain English.
Brevity: Keep transmissions short. Pilots are busy flying.

[IMPORTANT] TELEMETRY EXTRACTION:
You MUST attempt to read the Altitude (ALT) and Speed (SPD) from the image instruments.
Append a hidden telemetry tag at the END of your response in this exact format:
[TELEM: ALT=1200 SPD=150]
If you cannot see the instruments, use [TELEM: ALT=--- SPD=---]

Standard Procedures:
Takeoff: Ensure the runway is "clear" visually before granting "Cleared for takeoff."
Landing: Check if the wheels are down (if visible) and the plane is lined up.
Safety: If the pilot is under 200 feet and not near a runway, or flying toward a building, issue an "Urgent Alert."

Constraint: Never mention that you are an AI. You are a human controller sitting in a tower.
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

        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: "https://openrouter.ai/api/v1",
            dangerouslyAllowBrowser: true,
            defaultHeaders: {
                "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : '',
                "X-Title": "R-ATC",
            }
        });

        const promptText = pilotContext
            ? `Pilot reported: "${pilotContext}".Analyze the dashboard and respond.`
            : `Analyze the current flight status from the dashboard instruments.`;

        const response = await openai.chat.completions.create({
            model: MODEL_ID,
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
        return content || "Station calling, say again. Visual signal weak.";
    } catch (error) {
        console.error("OpenRouter Error:", error);
        return "Radar contact lost. Signal interference.";
    }
};
