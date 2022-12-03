import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './../firebase';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [enableLoaction, setEnableLocation] = useState(true);
  const [loadding, setLoadding] = useState(false);
  const [formData, setFormData] = useState({
    type: "sale",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: true,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 50,
    discountedPrice: 40,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const { type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice, latitude, longitude, images } = formData;

  const onChange = (e) => {
    let bololean = null;
    if (e.target.value === 'true') {
      bololean = true;
    }
    if (e.target.value === 'false') {
      bololean = false;
    }
    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files
      }));
    }
    // Text/Boolean
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: bololean ?? e.target.value,
      }));
    }

    if (discountedPrice >= regularPrice) {
      toast.error("Regualr price need to be greater than discount price!");
    }

  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoadding(true);

    if (discountedPrice >= regularPrice) {
      setLoadding(false);
      toast.error("Regualr price need to be greater than discount price!");
      return;
    }

    if (images.length > 6) {
      setLoadding(false);
      toast.error("Maximum 6 image you can upload!");
      return;
    };

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            switch (snapshot.state) {
              case "paused":
                console.log("upload pause");
                break;
              case "running":
                console.log("upload running");
                break;
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            })
          }
        )
      })
    };

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))).catch((error) => {
        setLoadding(false);
        toast.error("Image not uploaded!");
        return;
      }
      );

    let geolocation = {};
    let location;
    if (enableLoaction) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
      );
      const data = await response.json();
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

      location = data.status === "ZERO_RESULTS" && undefined;

      if (location === undefined) {
        setLoadding(false);
        toast.error("please enter a correct address");
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoadding(false);
    toast.success("Listing Created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  };



  if (loadding) {
    return <Spinner />
  };

  return (
    <main className='max-w-md px-2 mx-auto my-6'>
      <h1 className='text-3xl text-center font-bold'>Create a Listing</h1>

      <form onSubmit={onSubmit}>
        {/* Listing Type */}
        <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
        <div className='flex'>
          <button onClick={onChange} type='button' id='type' value='sale' className={`mr-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Sell
          </button>
          <button onClick={onChange} type='button' id='type' value='rent' className={`ml-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Rent
          </button>
        </div>

        {/* Listing Name */}
        <p className='text-lg mt-6 font-semibold'>Name</p>
        <input onChange={onChange} type="text" id="name" value={name} placeholder="Name" maxLength="32" minLength="10" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' />

        {/* Beds / Bath */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <p className='text-lg font-semibold'>Beds</p>
            <input onChange={onChange} type="number" id="bedrooms" value={bedrooms} min="1" max="20" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
          </div>

          <div>
            <p className='text-lg font-semibold'>Bath</p>
            <input onChange={onChange} type="number" id="bathrooms" value={bathrooms} min="1" max="20" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
          </div>
        </div>

        {/* Parking Spot */}
        <p className='text-lg mt-6 font-semibold'>Parking Spot</p>
        <div className='flex'>
          <button onClick={onChange} type='button' id='parking' value={true} className={`mr-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Yes
          </button>
          <button onClick={onChange} type='button' id='parking' value={false} className={`ml-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            No
          </button>
        </div>

        {/* Furnished */}
        <p className='text-lg mt-6 font-semibold'>Furnished</p>
        <div className='flex'>
          <button onClick={onChange} type='button' id='furnished' value={true} className={`mr-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Yes
          </button>
          <button onClick={onChange} type='button' id='furnished' value={false} className={`ml-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            No
          </button>
        </div>

        {/* Address */}
        <p className='text-lg mt-6 font-semibold'>Address</p>
        <textarea onChange={onChange} type="text" id="address" value={address} placeholder="Address" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' />

        {/* Latitude Logitude */}
        {enableLoaction && (
          <div className='flex items-center justify-between space-x-6 mb-6'>
            <div>
              <p className='text-lg font-semibold'>Latitude</p>
              <input onChange={onChange} type="number" id="latitude" value={latitude} required={enableLoaction} min="-90" max="90" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
            </div>

            <div>
              <p className='text-lg font-semibold'>Logitude</p>
              <input onChange={onChange} type="number" id="longitude" value={longitude} required={enableLoaction} min="-180" max="180" className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
            </div>
          </div>
        )}

        {/* Description */}
        <p className='text-lg font-semibold'>Description</p>
        <textarea onChange={onChange} type="text" id="description" value={description} placeholder="Description" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' />

        {/* Offer */}
        <p className='text-lg font-semibold'>Offer</p>
        <div className='flex mb-6'>
          <button onClick={onChange} type='button' id='offer' value={true} className={`mr-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Yes
          </button>
          <button onClick={onChange} type='button' id='offer' value={false} className={`ml-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            No
          </button>
        </div>

        {/* Price */}
        <div className={`${type === "sale" ? "flex justify-between space-x-4" : ""}`}>
          {/* Regular Price */}
          <div className='flex items-center mb-6'>
            <div>
              <p className='text-lg font-semibold'>Regular Price</p>
              <div className='flex items-center justify-center space-x-6'>
                <input type="number" id="regularPrice" value={regularPrice} onChange={onChange} min="50" max="500000000" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                {type === "rent" && (
                  <div>
                    <p className='w-full whitespace-nowrap'>$ / Month</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Discounted Price */}
          {offer && (
            <div className='flex items-center mb-6'>
              <div>
                <p className='text-lg font-semibold'>Discounted Price</p>
                <div className='flex items-center justify-center space-x-6'>
                  <input type="number" id="discountedPrice" value={discountedPrice} onChange={onChange} min="40" max="500000000" required={offer} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                  {type === "rent" && (
                    <div>
                      <p className='w-full whitespace-nowrap'>$ / Month</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Image */}
        <div className='mb-6'>
          <p className='text-lg font-semibold'>Upload Images</p>
          <p className='text-gray-600'>The first image will be the cover (max 6)</p>

          <input type="file" id="images" onChange={onChange} accept=".jpg,.png,.jpeg" multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600' />
        </div>

        <button type='submit' className='w-full bg-blue-600 text-white px-6 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Create Listing</button>

      </form>
    </main>
  )
}

export default CreateListing;