import { getAuth, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { collection, doc, orderBy, query, updateDoc, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FcHome } from 'react-icons/fc';
import ListingItem from '../components/ListingItem';

const Profile = () => {
  const navigate = useNavigate();
  const [changeProfile, setChangeProfile] = useState(false);
  const [listings, setListings] = useState(null);
  const [loadding, setLoadding] = useState(true);
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

  // Fetch Data
  useEffect(() => {
    const fetchUserListings = async () => {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoadding(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  const onDelete = async (listingID) => {
    if (window.confirm("Delete this listing?")) {
      await deleteDoc(doc(db, "listings", listingID));
      const updatedListings = listings.filter((listing) => listing.id !== listingID);
      setListings(updatedListings)
      toast.success("Successfully listing deleted!");
    }
  };

  const onEdite = (listingID) => {
    navigate(`/edit-listing/${listingID}`)
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

          <button type="submit" className='w-full bg-blue-600 text-white uppercase px-7 py-2 text-sm font-medium rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>
            <Link to="/create-listing" className='flex items-center justify-center'>
              <FcHome className='mr-2 text-4xl bg-red-200 rounded-full p-1 border-2' /> Sell or Rent you home
            </Link>
          </button>

        </div>

      </section>

      {/* My Listing */}
      <section className='max-w-6xl px-3 mt-6 mx-auto'>
        {!loadding && listings.length > 0 && (
          <>
            <h2 className='text-2xl text-center font-semibold'>My Listings</h2>

            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mt-6 mb-6'>
              {listings.map((item) => (
                <ListingItem key={item.id} id={item.id} listing={item.data}
                  onDelete={() => onDelete(item.id)}
                  onEdite={() => onEdite(item.id)}
                />
              ))}
            </ul>
          </>
        )}
      </section>

    </>
  )
}

export default Profile;