// npm install assemblyai
import { NextResponse } from 'next/server';
import { AssemblyAI } from 'assemblyai'
export async function POST(req) {
    try {
        const client = new AssemblyAI({
            apiKey: process.env.NEXT_PUBLIC_ASSEMBLE_API_KEY
        })

        const { audioFileUrl } = await req.json();

        const config = {
            audio_url: audioFileUrl
        }
        const transcript = await client.transcripts.transcribe(config)
        // console.log(transcript)
        return NextResponse.json({ "result": transcript.words })
    } catch (error) {
        return NextResponse.json({ 'error': error.message })
    }
}