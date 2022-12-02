import React, { useState } from 'react';

const CreateListing = () => {
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
  });
  const { type, name, bedrooms, bathrooms, parking, furnished, address, description, offer, regularPrice, discountedPrice } = formData;

  const onChange = () => {

  };

  return (
    <main className='max-w-md px-2 mx-auto my-6'>
      <h1 className='text-3xl text-center font-bold'>Create a Listing</h1>

      <form >
        {/* Listing Type */}
        <p className='text-lg mt-6 font-semibold'>Sell / Rent</p>
        <div className='flex'>
          <button onChange={onChange} type='button' id='type' value='sale' className={`mr-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "sale" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Sell
          </button>
          <button onChange={onChange} type='button' id='type' value='sale' className={`ml-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
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
          <button onChange={onChange} type='button' id='parking' value={true} className={`mr-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Yes
          </button>
          <button onChange={onChange} type='button' id='parking' value={false} className={`ml-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            No
          </button>
        </div>

        {/* Furnished */}
        <p className='text-lg mt-6 font-semibold'>Furnished</p>
        <div className='flex'>
          <button onChange={onChange} type='button' id='furnished' value={true} className={`mr-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Yes
          </button>
          <button onChange={onChange} type='button' id='furnished' value={false} className={`ml-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            No
          </button>
        </div>

        {/* Address */}
        <p className='text-lg mt-6 font-semibold'>Address</p>
        <textarea onChange={onChange} type="text" id="address" value={address} placeholder="Address" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' />

        {/* Description */}
        <p className='text-lg font-semibold'>Description</p>
        <textarea onChange={onChange} type="text" id="description" value={description} placeholder="Description" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6' />

        {/* Offer */}
        <p className='text-lg font-semibold'>Offer</p>
        <div className='flex mb-6'>
          <button onChange={onChange} type='button' id='offer' value={true} className={`mr-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${!offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            Yes
          </button>
          <button onChange={onChange} type='button' id='furnished' value={false} className={`ml-3 px-7 py-2 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer ? "bg-white text-black" : "bg-slate-600 text-white"}`}>
            No
          </button>
        </div>

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
                <input type="number" id="discountedPrice" value={discountedPrice} onChange={onChange} min="50" max="500000000" required={offer} className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center' />
                {type === "rent" && (
                  <div>
                    <p className='w-full whitespace-nowrap'>$ / Month</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Upload Image */}
        <div className='mb-6'>
          <p className='text-lg font-semibold'>Images</p>
          <p className='text-gray-600'>The first image will be the cover (max 6)</p>

          <input type="file" id="images" onChange={onChange} accept=".jpg,.png,.jpeg" multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600' />
        </div>

        <button type='submit' className='w-full bg-blue-600 text-white px-6 py-3 text-sm font-medium uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-800'>Create Listing</button>

      </form>
    </main>
  )
}

export default CreateListing;