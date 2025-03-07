import { NextResponse } from 'next/server';
import Replicate from "replicate";
import { v4 as uuidv4 } from 'uuid';
import { dbx } from '../../../config/dropboxConfig';
import axios from 'axios';

// Initialize Replicate client
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

const generateImagePrediction = async (prompt) => {
    return await replicate.predictions.create({
        version: "5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
        input: {
            width: 1024,
            height: 1280,
            prompt: prompt,
            num_outputs: 1,
            negative_prompt: "worst quality, low quality",
            num_inference_steps: 4
        }
    });
}

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        // Create prediction
        const prediction = await generateImagePrediction(prompt);

        // Poll for prediction completion
        let completedPrediction;
        for (let i = 0; i < 30; i++) { // Try for up to 30*2 = 60 seconds
            completedPrediction = await replicate.predictions.get(prediction.id);

            if (completedPrediction.status === 'succeeded') break;
            if (completedPrediction.status === 'failed') {
                throw new Error('Prediction failed');
            }

            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        if (!completedPrediction.output?.[0]) {
            throw new Error('No image generated');
        }

        // Get the actual image URL from the prediction output
        const imageUrl = completedPrediction.output[0];
        // console.log(imageUrl);

        // Download and process image
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) {
            throw new Error(`Failed to fetch image: ${imageResponse.status}`);
        }

        // Upload to Dropbox
        const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
        const filename = `${uuidv4()}.png`;
        const dropboxPath = `/images/${filename}`;

        await dbx.filesUpload({
            path: dropboxPath,
            contents: imageBuffer,
            mode: { '.tag': 'overwrite' },
        });

        const sharedLinkResult = await dbx.sharingCreateSharedLinkWithSettings({
            path: dropboxPath,
            settings: { requested_visibility: 'public' }
        });

        const sharedUrl = sharedLinkResult.result.url.replace('?dl=0', '?dl=1')
        return NextResponse.json({ "result": sharedUrl });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ "message": error.message }, { status: 500 });
    }
}