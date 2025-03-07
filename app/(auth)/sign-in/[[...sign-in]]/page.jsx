import { SignIn } from '@clerk/nextjs'
import Image from 'next/image'

export default function Page() {
  return <div className='grid grid-cols-1 md:grid-cols-2'>
    <div>
      <Image src={'/sign-in.jpg'} layout='fill' objectFit='cover' className='rounded-lg shadow-md mx-auto my-10 md:w-full md:h-full' />
    </div>
    <div className='flex justify-center items-center h-screen'>
      <SignIn />
    </div>
  </div>
}