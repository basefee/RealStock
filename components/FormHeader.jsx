"use client";
import Image from 'next/image'

import React from 'react';


const Form = () => {
  return (
    <div className='flex justify-center items-center w-full'>
      <div>
        <h1 className="font-poppins font-semibold ss:text-[40px] text-[35px] text-white ss:leading-[100.8px] leading-[75px]">Start <span className="text-gradient">Trading</span> Now
        </h1>
      </div>
      <div>
        <Image src='/down.svg' alt="down" width={50} height={50} className='ml-2 mt-5 animate-y-axis rotate-90'/>
      </div>
    </div>
  )
}

export default Form
