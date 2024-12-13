"use client";
import React, { useEffect } from 'react';

const HomePage: React.FC = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".animate-class");
    elements.forEach((el) => {
      el.classList.add("show");
    });
  }, []);
  
  return (
    <div className='flex w-screen h-screen items-center justify-center flex-col text-black'>
      <div className="background">
        <style jsx>{`
        .background {
          background-image: url('../background/bg.svg');
          background-size: cover;
          background-position: center;
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: -1;
        }
      `}</style>
      </div>
      <div className='flex flex-col md:flex-row xl:flex-row justify-center items-center animate-class'>
        <div className='xl:border-r-2 border-black p-2 '>
            <img src="../logo/removebg.png" alt="Logo" className='w-[200px] xl:w-[400px]' />
        </div>
        <div className='flex flex-col justify-center p-2 mb-4 xl:mb-12 xl:items-start items-center ml-4'>
          <p className='text-xl '>Welcome to</p>
          <h1 className='xl:text-[72px] text-[28px] font-semibold items-center'>Simple Account Manager</h1>
          <p className='text-[13px] xl:text-xl '>This project is for T.T. Software Solution Assignment</p>
        <div className='pt-2 xl:pt-4'>
          <button 
          className='bg-orange-500 p-2 rounded-lg text-white border-white border-2'
          onClick={() => window.location.href = '/dashboard'}>
            Get Started
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;