import React from 'react'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className='flex justify-center mt-10 mb-10'>
        <h1 className='flex items-center font-normal font-poppins text-white leading-relaxed'>Made with <Image src='/heart.svg' alt='heart' width={20} height={20} className='ml-2 mr-2'/> at ETHDelhi.</h1>
    </div>
  )
}

export default Footer