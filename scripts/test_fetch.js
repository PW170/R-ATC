const apiKey = "cpk_03e9d420b568434abc2675b0e172a107.7546a7b97d2f53499f44977b0b77854a.T5kTFZrKRkPxrIKJHPvA4JXL3dRpUXsn";
const model = "Qwen/Qwen3-32B";

async function testFetch() {
    console.log("Testing Chutes AI with fetch...");
    try {
        const response = await fetch("https://llm.chutes.ai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: "Hi" }],
                max_tokens: 10
            })
        });

        const status = response.status;
        console.log("Status:", status);
        const text = await response.text();
        console.log("Response Body:", text);
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testFetch();
