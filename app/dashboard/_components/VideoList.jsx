import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
const PlayerVideo = dynamic(() => import('./PlayerVideo'), { ssr: false });


const Thumbnail = dynamic(
    () => import("@remotion/player").then(mod => mod.Thumbnail),
    { ssr: false }
);

const RemotionVideo = dynamic(
    () => import("./RemotionVideo").then((mod) => mod.default),
    { ssr: false }
);

const VideoList = ({ videoList }) => {
    const [processedVideos, setProcessedVideos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [videoId, setVideoId] = useState();

    const handleVideo = (id) => {
        setOpenDialog(Date.now());
        setVideoId(id);
    };

    useEffect(() => {
        const processVideos = async () => {
            const results = await Promise.all(
                videoList.map(async (video) => {
                    try {
                        return {
                            ...video,
                            captions: await JSON.parse(video.captions)
                        };
                    } catch (error) {
                        console.log(error.message);
                        return video;
                    }
                })
            );
            setProcessedVideos(results);
        };

        if (videoList?.length > 0) {
            processVideos();
        }
    }, [videoList]);

    return (
        <div className='grid mt-10 grid-cols-2 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4'>
            {processedVideos.map((video, index) => (
                <div
                    key={video.id || index}
                    onClick={() => { handleVideo(video.id) }} // Fixed here
                    className='cursor-pointer hover:scale-110 transition-all'
                >
                    <Thumbnail
                        component={RemotionVideo}
                        compositionWidth={250}
                        compositionHeight={400}
                        frameToDisplay={30}
                        durationInFrames={120}
                        fps={30}
                        style={{ borderRadius: 15 }}
                        inputProps={{
                            ...video,
                            setDurationInFrame: (duration) => console.log('Duration:', duration)
                        }}
                    />
                </div>
            ))}
            {openDialog && <PlayerVideo playerVideo={openDialog} videoId={videoId} />}
        </div>
    );
};

export default VideoList;