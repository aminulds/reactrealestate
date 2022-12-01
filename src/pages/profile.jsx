import { getAuth, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { async } from '@firebase/util';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Profile = () => {
  const navigate = useNavigate();
  const [changeProfile, setChangeProfile] = useState(false);
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });
  const { name, email } = formData;

  const onSignOut = () => {
    auth.signOut();
    navigate("/");
    toast.success("Sign Out!");
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  };

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update firestore user db
        const docRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        });

      }
    } catch (error) {
      toast.error("Couldn't Update Profile!");
    }
  };

  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold'>My Profile</h1>

        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form >
            <input type="text" id='name' value={name} disabled={!changeProfile} onChange={onChange} className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeProfile && "bg-red-200 focus:bg-red-200"}`} />

            <input type="email" id='email' value={email} disabled className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out`} />

            <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
              <p onClick={() => {
                changeProfile && onSubmit();
                setChangeProfile((prevState) => !prevState)
              }} className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer font-semibold'>{
                  changeProfile ? 'Apply Update' : 'Upate Profile'
                }</p>
              <p onClick={onSignOut} className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer font-semibold'>Sign out</p>
            </div>

          </form>
        </div>


      </section>
    </>
  )
}

export default Profile;