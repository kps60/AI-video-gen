import { NextResponse } from 'next/server';
import path from 'path';
import say from 'say';
import fs from 'fs';
import os from 'os';
import { dbx } from '../../../config/dropboxConfig';

export async function POST(req) {
    try {
        const { text, id } = await req.json();

        // Check for undefined values (ID is no longer needed)
        if (!text) {
            return NextResponse.json({ error: 'Text must be provided.' }, { status: 400 });
        }

        // Use the OS temporary directory for the audio file.
        const outputDirectory = os.tmpdir();
        const filename = `${id}.mp3`; // constant filename
        const audioPath = path.join(outputDirectory, filename);

        // (Optional) Log available voices.
        say.getInstalledVoices((err, voices) => {
            if (err) {
                console.error('Error fetching voices:', err);
            } else {
                console.log('Available voices:', voices);
            }
        });

        // Export the audio to the temporary file
        await new Promise((resolve, reject) => {
            // Try default OS voice, or change this to test other voices.
           say.export(text, null, 1.4, audioPath, (err) => {
                if (err) return reject(err);
                resolve();
            });
        });

        // Ensure the Dropbox access token exists
        if (!process.env.NEXT_PUBLIC_DROPBOX_API_KEY) {
            return NextResponse.json({ error: 'Dropbox access token is required.' }, { status: 400 });
        }

        // Read the generated audio file
        const fileContent = fs.readFileSync(audioPath);
        const dropboxPath = `/audio/${filename}`; // fixed Dropbox path

        // Upload the file to Dropbox (overwrite if it exists)
        const uploadResult = await dbx.filesUpload({
            path: dropboxPath,
            contents: fileContent,
            mode: { '.tag': 'overwrite' }
        });
        console.log('Dropbox upload result:', uploadResult.result);

         // Create a shared link for the file
         const sharedLinkResult = await dbx.sharingCreateSharedLinkWithSettings({
            path: dropboxPath,
            settings: { requested_visibility: 'public' },
        });
        console.log('Shared Link Result:', sharedLinkResult.result)

       // Get direct download link from sharedLinkResult
        const sharedUrl = sharedLinkResult.result.url.replace('?dl=0', '?dl=1')
        console.log('Shared link:', sharedUrl);


        // Delete the temporary audio file
        fs.unlinkSync(audioPath);

        return NextResponse.json({ "result": sharedUrl });
    } catch (error) {
        console.error('Error in audio generation or Dropbox upload:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}