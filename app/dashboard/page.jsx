"use client"
import { Button } from '../../components/ui/button'
import React, { useEffect, useState } from 'react'
import Emptystate from './_components/Emptystate'
import Link from 'next/link'
import { db } from '../../config/db'
import { VideoData } from '../../config/schema'
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import { useRouter } from 'next/navigation'
import VideoList from './_components/VideoList'
const page = () => {
  const [videoList, setVideoList] = useState([])
  const { user } = useUser()
  const router = useRouter()
  useEffect(() => {
    user && getVideoList()
  }, [user])
  const getVideoList = async () => {
    // Fetch video list from database
    const response = await db.select().from(VideoData).where(eq(VideoData.createdBy, user.primaryEmailAddress.emailAddress))

    console.log(response);
    setVideoList(response)
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
        <Link href={'/dashboard/create-new'}>
          <Button>+ Create New</Button>
        </Link>

      </div>
      {/* Empty State */}
      {videoList?.length === 0 && <div>
        <Emptystate />
      </div>}
      {/* Video List */}
      <VideoList videoList={videoList} />
    </div>
  )
}

export default page

