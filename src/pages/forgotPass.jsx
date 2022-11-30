import { async } from '@firebase/util';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import GAuth from '../components/GAuth';

const ForgotPass = () => {
  const [email, setEmail] = useState("");

  const onChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const onForgotPassHandler = async (e) => {
    e.preventDefault();

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success("Please check email!");
    } catch (error) {
      toast.error("Email dosen't match!");
    }

  };

  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold'>Forgot Password</h1>

      <div className='flex justify-center flex-wrap items-center px-3 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img className='w-full rounded-2xl' src="https://images.unsplash.com/photo-1584433144859-1fc3ab64a957?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1030&q=80" alt="Forgot password" />
        </div>

        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form onSubmit={onForgotPassHandler}>
            <input className='mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' type="email" id='email' value={email} onChange={onChangeHandler} placeholder="Email address" />

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
              <p className='mb-6'>Don't have an account?
                <Link to="/sign-up" className='text-red-500 hover:text-red-700 transition duration-200 ease-in-out ml-1'>Sign Up</Link>
              </p>
              <p>
                <Link to="/sign-in" className="text-blue-500 hover:text-blue-700 transition duration-200 ease-in-out">Sign in instead</Link>
              </p>
            </div>

            <button type='submit' className='w-full bg-blue-600 text-white px-6 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Send reset password</button>

            <div className='flex items-center my-4 before:border-t before:flex-1 before:border-gray-300 after:border-t after:flex-1 after:border-gray-300'>
              <p className='text-center font-semibold mx-4'>OR</p>
            </div>

            <GAuth />

          </form>

        </div>

      </div>

    </section>
  )
}

export default ForgotPass;