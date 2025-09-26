"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import FormHeader from "@/components/FormHeader";
import Form from "@/components/Form";

export default function Home() {
  return (
    <div className="bg-black w-full overflow-hidden">
    <div className={`sm:px-16 px-6 flex justify-center items-center`}>
      <div className={`xl:max-w-[1280px] w-full`}>
        <Navbar />
      </div>
    </div>

    <div className={`bg-black flex justify-center items-start`}>
      <div className={`xl:max-w-[1280px] w-full`}>
        <Hero />
      </div>
    </div>
    
    <div className={`bg-black flex justify-center items-start`}>
      <div className={`xl:max-w-[1280px] w-full`}>
        <FormHeader />
      </div>
    </div>

    <div className={`bg-black flex justify-center items-start`}>
      <div className={`xl:max-w-[1280px] w-full`}>
        <Form />
      </div>
    </div>

    <div className={`bg-primary sm:px-16 px-6 flex justify-center items-center`}>
      <div className={`xl:max-w-[1280px] w-full`}>
       <Footer />
      </div>
    </div>
  </div>
  );
}
