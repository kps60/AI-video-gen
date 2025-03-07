// components/DownloadButton.jsx
'use client';

import { useState } from 'react';
import CustomLoading from '../create-new/_components/CustomLoading';
import { getCompositions, renderMedia, ensureBrowser } from '@remotion/browser';


export default function DownloadButton() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [videoUrl, setVideoUrl] = useState('');


    const handleDownload = async () => {
        setLoading(true);
        setMessage('Rendering...');

         const onProgress = ({ percent, downloadedBytes, totalSizeInBytes }) => {
             console.log(`${Math.round(percent * 100)}% downloaded`);
         };

         const onBrowserDownload = () => {
             console.log('Downloading browser');

             return {
                 // Pass `null` to use Remotion's recommendation.
                 version: '123.0.6312.86',
                 onProgress,
             };
         };

        await ensureBrowser({
            onBrowserDownload,
        });
        try{
             // Retrieve all available compositions
             const compositions = await getCompositions();

             // Find your composition by its id; replace 'RemotionVideo' with your composition's id if different
             const composition = compositions.find(c => c.id === 'Empty');
             if (!composition) {
                 throw new Error('Composition not found');
             }

             const buffer = await renderMedia({
                composition,
                // codec: 'vp9',
               inputProps:{},
                fps: 30
              });

              // create blob url to download
               const blob = new Blob([buffer], { type: 'video/webm' });
               const url = URL.createObjectURL(blob);
               setVideoUrl(url)

             setMessage('Video Rendered successfully');
        }catch(err){
             setMessage("Something went wrong")
            console.log("Error while renderinng video",err)
        }
        setLoading(false);

    };

    return (
        <div>
            <button onClick={handleDownload} disabled={loading}>
                {loading ? 'Rendering...' : 'Download'}
            </button>
             {videoUrl && (
              <a href={videoUrl} download="my-video.webm">
               Download Video
              </a>
             )}
             {message && <p>{message}</p>}
            <CustomLoading loading={loading} />
        </div>
    );
}