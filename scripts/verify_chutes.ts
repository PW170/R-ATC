import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testChutes() {
    const apiKey = process.env.VITE_AI_API_KEY;
    const model = process.env.VITE_CHUTES_MODEL || "Qwen/Qwen3-32B";

    console.log(`Testing Chutes AI with model: ${model}`);

    if (!apiKey || !apiKey.startsWith('cpk_')) {
        console.error("Invalid or missing Chutes API key in .env.local");
        return;
    }

    const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://llm.chutes.ai/v1",
    });

    try {
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                { role: "user", content: "Say 'Chutes AI is online' if you can hear me." }
            ],
            max_tokens: 50,
        });

        console.log("Response:", response.choices[0].message.content);
    } catch (error) {
        console.error("Error connecting to Chutes AI:", error);
    }
}

testChutes();
