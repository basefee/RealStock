"use client";
import Image from 'next/image';

const Hero = () => {
  return (
    <section id="home" className={`flex md:flex-row flex-col sm:py-16 py-6 mt-20`}>
      <div className={`flex-1 flex justify-center items-start flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="flex-1 font-poppins font-semibold ss:text-[72px] text-[52px] text-white ss:leading-[100.8px] leading-[75px]">
            Join The <br className="sm:block hidden" />{" "}
            <span className="text-gradient">Revolution</span>{" "}
          </h1>
        </div>

        <h1 className="font-poppins font-semibold ss:text-[52px] text-[52px] text-white ss:leading-[100.8px] leading-[75px] w-full">
          of Real World Assets.
        </h1>
        <p className={`font-poppins font-normal text-white text-[18px] leading-[30.8px] max-w-[470px] mt-5`}>
        Start trading directly backed real-world assets today and revolutionize your investment journey. Embrace the future of finance, redefine ownership, and let your portfolio thrive on-chain. Discover a new way to invest in stocks, commodities, and ETFs with unparalleled security and transparency.
        </p>
      </div>

      <div className={`flex-1 flex justify-center items-center md:my-0 my-10 relative`}>
        <Image src='/robot.avif' alt="nft" className="relative z-[5]" width={1000} height={1000}/>

        {/* gradient start */}
        <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" />
        <div className="absolute z-[1] w-[100%] h-[80%] rounded-full white__gradient bottom-40" />
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>

    </section>
  );
};

export default Hero;