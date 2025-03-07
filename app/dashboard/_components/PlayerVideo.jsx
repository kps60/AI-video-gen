import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog";
import dynamic from "next/dynamic";
import { Button } from '../../../components/ui/button';
import { db } from '../../../config/db';
import { VideoData } from '../../../config/schema';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
// import { ensureBrowser, OnBrowserDownload, DownloadBrowserProgressFn } from '@remotion/renderer';
// Load Remotion player only on client-side
// import Download from '';
const Download = dynamic(
    () => import("./Download").then(mod => mod.default),
    { ssr: false }
);
const RemotionPlayer = dynamic(
    () => import("@remotion/player").then(mod => mod.Player),
    { ssr: false }
);

// Dynamically load your Remotion video component
const RemotionVideo = dynamic(
    () => import("./RemotionVideo").then((mod) => mod.default),
    { ssr: false }
);

const PlayerVideo = ({ playerVideo, videoId }) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [videoData, setVideoData] = useState();
    const [durationInFrames, setDurationInFrames] = useState(120);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (playerVideo) {
            setOpenDialog(!openDialog);
            videoId && getVideoData();
        }
    }, [playerVideo]);

    const getVideoData = async () => {
        const result = await db.select().from(VideoData).where(eq(VideoData.id, videoId));
        const video = result[0];
        // console.log(video.captions);
        if (typeof video.captions == "string") {
            video.captions = await JSON.parse(video.captions);
        }
        // console.log(video);
        // if (video?.metadata) {
        //     try {
        //         video.metadata = JSON.parse(video.metadata);
        //         // Ensure captions exists and is an array
        //         if (!Array.isArray(video.metadata.captions)) {
        //             console.warn('Invalid captions format, defaulting to empty array');
        //             video.metadata.captions = [];
        //         }
        //     } catch (error) {
        //         console.error("Error parsing JSON", error);
        //         // Create safe fallback structure
        //         video.metadata = { captions: [] };
        //     }
        // } else {
        //     // Handle case where metadata doesn't exist
        //     video.metadata = { captions: [] };
        // }

        setVideoData(video);
    };
    const handleOnCancel = () => {
        router.replace("/dashboard")
        setOpenDialog(!openDialog)
        // setVideoData(null)
    }
    // const downloadVideo = async () => {
    //     setLoading(true);
    //     const onProgress = ({ percent, downloadedBytes, totalSizeInBytes }) => {
    //         console.log(`${Math.round(percent * 100)}% downloaded`);
    //     };

    //     const onBrowserDownload = () => {
    //         console.log('Downloading browser');

    //         return {
    //             // Pass `null` to use Remotion's recommendation.
    //             version: '123.0.6312.86',
    //             onProgress,
    //         };
    //     };

    //     await ensureBrowser({
    //         onBrowserDownload,
    //     });
    // };
    return (
        <Dialog open={openDialog} >
            <DialogContent className="bg-white flex flex-col items-center">
                <DialogHeader>
                    <DialogTitle className="text-3xl font-bold my-5">
                        Your Video is Ready
                    </DialogTitle>
                    <DialogDescription>
                        {openDialog && videoData && ( // Only render when dialog is open and videoData is available
                            <>
                                {console.log(durationInFrames)}
                                <RemotionPlayer
                                    component={RemotionVideo}
                                    durationInFrames={durationInFrames}
                                    compositionWidth={300}
                                    compositionHeight={450}
                                    fps={30}
                                    controls={true}
                                    inputProps={{
                                        ...videoData,
                                        // imageList: videoData?.metadata?.imageList || [],
                                        // captions: videoData?.metadata?.captions || [],
                                        setDurationInFrame: (duration) => {
                                            // console.log('Updating duration:', duration);
                                            setDurationInFrames(Math.ceil(duration));
                                        }
                                    }}
                                />
                                <div className="flex gap-10 mt-10">
                                    <Button variant="ghost" onClick={handleOnCancel} className="mt-5">
                                        Cancel
                                    </Button>
                                    <Download />
                                </div>
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default PlayerVideo;