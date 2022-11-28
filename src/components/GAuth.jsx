import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GAuth = () => {
  return (
    <button className='mb-6 flex items-center justify-center w-full bg-red-700 text-white px-6 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-red-800 active:bg-red-900 transition duration-150 ease-in-out hover:shadow-lg'>
      <FcGoogle className='mr-2 text-xl bg-white rounded-full p-[1px]' /> Continue with Google
    </button>
  )
}

export default GAuth