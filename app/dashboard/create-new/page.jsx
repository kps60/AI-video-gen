"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from '../../../components/ui/button'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import CustomLoading from './_components/CustomLoading'
// import Image from 'next/image'
import { VideoDataContext } from '../../_context/VideoDataContext'
import { db } from '../../../config/db'
import { useUser } from '@clerk/nextjs'
import { Users, VideoData } from '../../../config/schema';
import PlayerVideo from '../_components/PlayerVideo'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { UserDetailContext } from '../../_context/UserDetailContext'
import { eq } from 'drizzle-orm'

// const videosrc = [
//   {
//     "context": "Introduction: Open with an engaging visual that hints at historical mysteries. Text overlay: 'Unbelievable Historical Facts'",
//     "ImagePrompt": "A photorealistic, slightly blurred image of an ancient artifact half-buried in sand. Dramatic lighting, golden hour. Hint of a hidden chamber in the background. Mystery, adventure. 8k resolution."
//   }
// ]
const page = () => {
  const [Formdata, setFormData] = useState([])
  const [loading, setLoading] = useState(false)
  const [videoscript, setVideoScript] = useState()
  const [audioFileUrl, setAudioFileUrl] = useState()
  const [captions, setCaptions] = useState();
  const [imageList, setImageList] = useState()
  const [playerVideo, setPlayerVideo] = useState(false)
  // const [VideoId, setVideoId] = useState(14)
  const [VideoId, setVideoId] = useState()
  const { videoData, setVideoData } = useContext(VideoDataContext)
  const { user } = useUser()
  const onHandleInputChange = (fieldName, fieldValue) => {
    console.log(fieldName, fieldValue)
    setFormData(prev => ({ ...prev, [fieldName]: fieldValue }))
  }
  const { userDetail, setUserDetail } = useContext(UserDetailContext)


  const onCreateClickHandler = () => {
    if (userDetail.credits >= 110) {
      toast('You dont have enough credits to create video.Please buy credits')
      return
    } else {
      getvideoscript()
    }
    // const uri = 'https://www.dropbox.com/scl/fi/x7vs3n9g81sl7s8xz0cr9/audio.mp3?rlkey=blv8jvrfr2ps9on6dcwp864w0&dl=1'
    // generateCaption(uri)
    // generateImage()
  }
  const getvideoscript = async () => {
    setLoading(true)
    const prompt = `write a script to generate ${Formdata.duration} video on topic : ${Formdata.topic} along with AI images prompt  in ${Formdata.style} format for each scene give me result in JSON format ImagePrompt and context as field.`
    // console.log(prompt);
    const res = await axios.post('/api/get-video-script', {
      prompt: prompt
    })
      .then(({ data }) => {
        console.log(data.result)
        setVideoData(prev => ({
          ...prev,
          'videoscript': data.result.scenes
        }))
        // setVideoScript(data.result.scenes)
        console.log(data.result.scenes)
        setVideoScript(data.result.scenes);
        // console.log(videoscript);
        generateAudioFile(data.result.scenes)
      }).catch(error => console.log(error.message))
    // setLoading(false)
  }

  const generateAudioFile = async (videoscriptdata) => {
    let script = '';
    const id = uuidv4();
    videoscriptdata.forEach(item => {
      script = script + item.Context + ' '
    });
    console.log(script)
    await axios.post('/api/generate-audio', { text: script, id: id })
      .then(({ data }) => {
        console.log(data)
        setAudioFileUrl(data.result)
        setVideoData(prev => ({
          ...prev,
          'audioFileUrl': data.result
        }))
        generateCaption(data.result, videoscriptdata)
      }).catch(error => console.log(error.message))
  }

  const generateCaption = async (audioFile, videoscriptdata) => {
    try {
      const { data } = await axios.post('/api/generate-caption', {
        audioFileUrl: audioFile
      });

      setCaptions(data?.result);
      const JSONdata = JSON.stringify(data?.result);
      setVideoData(prev => ({
        ...prev,
        'captions': JSONdata
      }));

      // Wait for image generation to complete
      await generateImage(videoscriptdata);

    } catch (error) {
      console.error("Caption generation failed:", error.message);
    }
  }

  const generateImage = async (videoscrip) => {
    try {
      // Add null check and empty array fallback
      if (!videoscrip?.length) {
        console.error("No video script available");
        setLoading(false);
        return;
      }

      let images = [];
      for (const element of videoscrip) {
        try {
          const res = await axios.post('/api/generate-image', {
            prompt: element?.ImagePrompt
          });
          images.push(res.data?.result);
        } catch (error) {
          console.error("Image error:", error.message);
        }
      }

      setVideoData(prev => ({
        ...prev,
        'imageList': images
      }));
      setImageList(images);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {

    console.log(videoData);
    if (Object.keys(videoData).length == 4) {
      saveVideoData(videoData);
    }
  }, [videoData])
  const saveVideoData = async (videoData) => {
    setLoading(true)
    try {
      const result = await db.insert(VideoData).values({
        script: videoData?.videoscript,
        audioFileUrl: videoData?.audioFileUrl,
        captions: videoData?.captions,
        imageList: videoData?.imageList,
        createdBy: user?.primaryEmailAddress?.emailAddress
      }).returning({ id: VideoData?.id })
      await updateCradits()
      setVideoId(result[0].id);
      setPlayerVideo(true);
      console.log(result);

    } catch (error) {
      console.error("Video data save failed:", error.message);
    } finally {
      setLoading(false);
    }
  }
  const updateCradits = async () => {
    try {
      const result = await db.update(Users).set({ credits: userDetail.credits - 10 }).where(eq(Users.email, user.primaryEmailAddress.emailAddress))
      console.log(result);
      setUserDetail(prev => ({ ...prev, "credits": userDetail.credits - 10 }))
      setVideoData(null)
    } catch (error) {
      console.log("Error", error.message);
    }
  }

  
  // console.log(videoscript)
  return <div className="md:px-20">
    <h2 className="font-bold text-primary text-4xl text-center">Create New</h2>
    <div className="mt-10 shadow-md p-10">
      {/* select Topic  */}
      <SelectTopic onUserSelect={onHandleInputChange} />
      {/* select Style  */}
      <SelectStyle onUserSelect={onHandleInputChange} />
      {/* Duration  */}
      <SelectDuration onUserSelect={onHandleInputChange} />
      {/* Create Button  */}
      {/* {image && <image src={image} width={500} height={500} className='w-full object-contain' />} */}
      <Button className="mt-10 w-full" onClick={onCreateClickHandler}>Create short video</Button>
      {/* {videoscript && <SpeechSynthesisExample videoscript={videoscript} />} */}
    </div>
    <CustomLoading loading={loading} />
    <PlayerVideo playerVideo={playerVideo} videoId={VideoId} />
    <Button className="" onClick={() => setPlayerVideo(true)} />
  </div>
}

export default page
