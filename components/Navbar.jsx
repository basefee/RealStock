"use client";

import { useState } from "react";
import Connect from "./Connect";
import Image from 'next/image'

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="flex justify-between items-center w-[89vw] max-w-screen-lg mx-auto fixed z-[6] backdrop-blur-sm">
      <a href="#" className="flex justify-start items-center flex-shrink-0 cursor-pointer ">
        <Image src='logo.svg' alt='logo' width={90} height={90} />
        <h1 className="font-normal font-poppins text-[24px] text-white leading-loose">RealStock</h1>
      </a>
      <div>
        <ul className="hidden sm:flex items-center">
          <a className="font-normal font-poppins text-[16px] text-white leading-loose cursor-pointer mr-8">How it Works</a>
          <a className="font-normal font-poppins text-[16px] text-white leading-loose cursor-pointer mr-8">About Us</a>
          <Connect />
        </ul>
      </div>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <Image
          src={toggle ? '/close.svg' : 'menu.svg'}
          alt="menu"
          className="object-contain"
          width={28} height={28}
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${!toggle ? "hidden" : "flex"
            } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            <a className='font-poppins font-medium cursor-pointer text-[16px] text-white mb-4'>How it Works</a>
            <a className='font-poppins font-medium cursor-pointer text-[16px] text-white mb-4'>About Us</a>
            <Connect />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
