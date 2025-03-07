"use client";
import { AbsoluteFill, Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import React, { useEffect } from 'react';

const RemotionVideo = ({
  script,
  imageList = [],
  audioFileUrl,
  captions = [],
  setDurationInFrame
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();


  const getCurrentCaption = () => {
    const currentTime = frame / 30 * 1000;//convert frame to milliseconds 30fps
    const currentCaption = captions.find(caption => currentTime >= caption.start && currentTime <= caption.end);
    return currentCaption ? currentCaption.text : "";
  }
  // Calculate duration based on either captions or images
  const calculateDuration = () => {
    // If we have valid captions
    if (Array.isArray(captions) && captions.length > 0) {
      const lastCaption = captions[captions.length - 1];
      if (lastCaption?.end) {
        return Math.ceil((lastCaption.end / 1000) * fps);
      }
    }

    // If no captions but we have images, calculate based on image count
    if (imageList.length > 0) {
      const defaultPerImageDuration = 75; // 2.5 seconds per image at 30fps
      return imageList.length * defaultPerImageDuration;
    }

    // Fallback duration
    return 150; // 5 seconds at 30fps
  };

  const totalDuration = calculateDuration();

  useEffect(() => {
    setDurationInFrame(totalDuration);
  }, [totalDuration, setDurationInFrame]);

  // Calculate per-image duration
  const perImageDuration = imageList.length > 0
    ? Math.ceil(totalDuration / imageList.length)
    : totalDuration;

  console.log('Total duration:', totalDuration);
  console.log('Per image duration:', perImageDuration);

  return (
    <div>
      <AbsoluteFill className="bg-gray-900">
        {imageList.map((image, index) => {
          const startTime = index * perImageDuration  //start time of each image
          const duration = calculateDuration() //total duration of the video
          const scale = (index) => interpolate(frame, [startTime, startTime + duration / 2, startTime + duration], index % 2 == 0 ? [1, 1.8, 1] : [1.8, 1, 1.8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) //zoom in and zoom out
          // const opacity=interpolate(frame,[startTime,startTime+duration],[0,1]) //fade in the image
          return (
            <>
              <Sequence
                key={index}
                from={startTime}
                durationInFrames={perImageDuration}
              >
                <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
                  <Img
                    src={image}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transform: `scale(${scale(index)})`
                    }}
                  />
                  <AbsoluteFill style={{
                    color: 'white',
                    justifyContent: 'center',
                    top: undefined,
                    bottom: 50,
                    height: 150,
                    textAlign: 'center',
                    width: '100%'
                  }}>
                    <h2 className="text-2xl">{getCurrentCaption()}</h2>
                  </AbsoluteFill>
                </AbsoluteFill>
              </Sequence>
            </>
          )
        })}

        {audioFileUrl && (
          <Audio src={audioFileUrl} />
        )}
      </AbsoluteFill>
    </div>
  );
};

export default RemotionVideo;