import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1.0,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};

// async function run() {
export const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
        {
            role: "user",
            parts: [
                { text: "write a script to generate 30 seconds video on topic : Interesting story along with AI images prompt  in Realistic format for each scene give me result in JSON format ImagePrompt and context as field." },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "## 30-Second Video Script: The Lost Treasure of El Dorado\n\n**Duration:** 30 seconds\n\n**Genre:** Adventure, Mystery\n\n**Synopsis:** A young adventurer stumbles upon a cryptic map leading to the lost treasure of El Dorado, sparking an exciting chase through a perilous jungle.\n\n**Scene 1:** (0-5 seconds)\n\n**Image Prompt:** \"A young, determined adventurer with a weathered map in hand, standing at the edge of a dense, overgrown jungle. Sunlight filters through the canopy, casting long shadows.\"\n\n**Context:** The adventurer, Elena, is shown examining the map, her eyes filled with excitement and determination.  \n\n**Scene 2:** (5-10 seconds)\n\n**Image Prompt:** \"A lush, overgrown jungle with ancient ruins hidden amongst the thick foliage. Vines crawl over crumbling walls and ancient statues, hinting at a forgotten civilization.\"\n\n**Context:**  Elena steps into the jungle, the thick foliage swallowing her whole. The camera pans over the ruins, emphasizing the ancient, forgotten nature of the place.\n\n**Scene 3:** (10-15 seconds)\n\n**Image Prompt:** \"Elena, navigating through a treacherous, winding path in the jungle. The air is thick with humidity, sunlight barely reaching the ground. She looks over her shoulder, her face tense with anticipation.\"\n\n**Context:** Elena walks cautiously, her hand gripping a machete, navigating the treacherous paths. Her expression shows fear and determination as she presses forward.\n\n**Scene 4:** (15-20 seconds)\n\n**Image Prompt:** \"Elena, standing before a massive stone door, carved with intricate patterns and symbols. Vines are growing around the door, obscuring the entrance.\"\n\n**Context:** Elena arrives at the final location, a large stone door guarded by ancient vines. The door seems to hold the secret to the treasure of El Dorado.\n\n**Scene 5:** (20-25 seconds)\n\n**Image Prompt:** \"A close-up of Elena's hand, slowly pulling back the vines to reveal a glimmering gold object behind the door. The object is partially hidden in the shadows.\"\n\n**Context:** Elena, with a mixture of trepidation and hope, pulls back the vines to reveal a glimpse of something golden and precious beyond the door.\n\n**Scene 6:** (25-30 seconds)\n\n**Image Prompt:** \"A wide shot of Elena, standing before the open door, a look of wonder and disbelief on her face. Sunlight floods through the doorway, illuminating the interior of the hidden chamber. The camera pans to reveal a room full of glistening gold treasures.\"\n\n**Context:** Elena stands in awe, the hidden chamber revealed. The room shines with gold, confirming the legend of El Dorado.\n\n**JSON Output:**\n\n```json\n{\n  \"scenes\": [\n    {\n      \"ImagePrompt\": \"A young, determined adventurer with a weathered map in hand, standing at the edge of a dense, overgrown jungle. Sunlight filters through the canopy, casting long shadows.\",\n      \"Context\": \"The adventurer, Elena, is shown examining the map, her eyes filled with excitement and determination.\"\n    },\n    {\n      \"ImagePrompt\": \"A lush, overgrown jungle with ancient ruins hidden amongst the thick foliage. Vines crawl over crumbling walls and ancient statues, hinting at a forgotten civilization.\",\n      \"Context\": \"Elena steps into the jungle, the thick foliage swallowing her whole. The camera pans over the ruins, emphasizing the ancient, forgotten nature of the place.\"\n    },\n    {\n      \"ImagePrompt\": \"Elena, navigating through a treacherous, winding path in the jungle. The air is thick with humidity, sunlight barely reaching the ground. She looks over her shoulder, her face tense with anticipation.\",\n      \"Context\": \"Elena walks cautiously, her hand gripping a machete, navigating the treacherous paths. Her expression shows fear and determination as she presses forward.\"\n    },\n    {\n      \"ImagePrompt\": \"Elena, standing before a massive stone door, carved with intricate patterns and symbols. Vines are growing around the door, obscuring the entrance.\",\n      \"Context\": \"Elena arrives at the final location, a large stone door guarded by ancient vines. The door seems to hold the secret to the treasure of El Dorado.\"\n    },\n    {\n      \"ImagePrompt\": \"A close-up of Elena's hand, slowly pulling back the vines to reveal a glimmering gold object behind the door. The object is partially hidden in the shadows.\",\n      \"Context\": \"Elena, with a mixture of trepidation and hope, pulls back the vines to reveal a glimpse of something golden and precious beyond the door.\"\n    },\n    {\n      \"ImagePrompt\": \"A wide shot of Elena, standing before the open door, a look of wonder and disbelief on her face. Sunlight floods through the doorway, illuminating the interior of the hidden chamber. The camera pans to reveal a room full of glistening gold treasures.\",\n      \"Context\": \"Elena stands in awe, the hidden chamber revealed. The room shines with gold, confirming the legend of El Dorado.\"\n    }\n  ]\n}\n``` \n" },
            ],
        },
    ],
});

//     const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
//     console.log(result.response.text());
// }

// run();