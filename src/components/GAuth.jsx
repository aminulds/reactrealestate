import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';

const GAuth = () => {
  const navigate = useNavigate();

  const onGoogleSignUpHandler = async () => {
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // check user exist
      const docRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists()) {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });

        toast.success("Congrate! Signup Successfully!");
        navigate('/');

      } else if (docSnap.exists()) {
        toast.error("User already exist!");
      }

    } catch (error) {
      toast.error("Google authorized failed!");
    }
  };

  return (
    <button onClick={onGoogleSignUpHandler} type='button' className='mb-6 flex items-center justify-center w-full bg-red-700 text-white px-6 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-red-800 active:bg-red-900 transition duration-150 ease-in-out hover:shadow-lg'>
      <FcGoogle className='mr-2 text-xl bg-white rounded-full p-[1px]' /> Continue with Google
    </button>
  )
}

export default GAuth