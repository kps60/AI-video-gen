import { Button } from '../../../components/ui/button'
import Image from 'next/image'
// import React from 'react'
import { UserButton } from "@clerk/nextjs"
import { useContext } from 'react'
import { UserDetailContext } from '../../_context/UserDetailContext'
const Header = () => {

    const { userDetail, setUserDetail } = useContext(UserDetailContext)
    return (
        <div className="p-3 px-5 flex justify-between items-center shadow-md">
            <div className='flex gap-3 items-center'>
                <Image src={'/logo.png'} width={30} height={30} />
                <h2 className="font-bold text-xl">Ai short video</h2>
            </div>
            <div className='flex gap-3 items-center'>
                <div className='flex gap-1 items-center'>
                    <Image src={'/star.png'} width={20} height={20} />
                    <h2>{userDetail.credits}</h2>
                </div>

                <Button>Dashboard</Button>
                <UserButton />
            </div>
        </div>
    )
}

export default Header
