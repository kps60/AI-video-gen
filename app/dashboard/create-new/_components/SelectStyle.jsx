import Image from 'next/image'
import React, { useState } from 'react'

const SelectStyle = ({ onUserSelect }) => {
  const styleOptions = [
    {
      name: 'Realistic',
      image: '/realistic.jpg'
    },
    {
      name: 'Cartoon',
      image: '/cartoon.jpg'
    },
    {
      name: 'Comic',
      image: '/Comic.jpeg'
    },
    {
      name: 'Watercolor',
      image: '/watercolor.webp'
    },
    {
      name: 'Gta',
      image: '/Gta.png'
    }
  ]

  const [selectedOption, setSelectedOption] = useState()
  // console.log(selectedOption)
  return (
    <div className="mt-7">
      <h2 className="font-bold text-2xl text-primary">Style</h2>
      <p className="text-gray-500">what is your prefered Style on your video? </p>
      <div className="grid grid-cols-2 mt-3 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
        {styleOptions.map((item, index) => (
          <div key={index} className={`relative hover:scale-105 transition-all cursor-pointer rounded-xl ${selectedOption == item.name && 'border-4 border-primary'}`}>
            <Image src={item.image} alt={item.name} width={100} height={100} className='h-48 object-cover rounded-lg w-full'
              onClick={() => {
                setSelectedOption(item.name)
                onUserSelect('style', item.name)
              }} />
            <h2 className='text-white text-center absolute p-1 bg-black bottom-0 w-full rounded-b-lg'>{item.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SelectStyle
