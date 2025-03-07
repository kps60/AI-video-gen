"use client"
import React, { useEffect, useState } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import { VideoDataContext } from '../_context/VideoDataContext'
import { UserDetailContext } from '../_context/UserDetailContext'
import { db } from '../../config/db'
import { Users } from '../../config/schema'
import { eq } from 'drizzle-orm'
import { useUser } from '@clerk/nextjs'
function Layout({ children }) {
    const [videoData, setVideoData] = useState([])
    const [userDetail, setUserDetail] = useState([])
    const { user } = useUser()

    const getUserDetails = async () => {
        const result = await db.select().from(Users)
            .where(eq(Users.email, user.primaryEmailAddress.emailAddress))
        setUserDetail(result[0])
        console.log(result[0])
    }
    useEffect(() => {
        user && getUserDetails()
    }, [user])
    return (
        <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
            <VideoDataContext.Provider value={{ videoData, setVideoData }}>
                <div>
                    <div className='hidden md:block h-screen bg-white fixed mt-[65px] w-64'>
                        <SideNav />
                    </div>
                    <div>
                        <Header />
                        <div className="md:ml-64 p-10">
                            {children}
                        </div>
                    </div>
                </div>
            </VideoDataContext.Provider>
        </UserDetailContext.Provider>
    )
}

export default Layout
