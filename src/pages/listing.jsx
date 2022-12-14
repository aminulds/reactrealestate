import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Spinner from './../components/Spinner';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/bundle';
import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import Contact from "../components/Contact";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

const Listing = () => {
  const auth = getAuth();
  const params = useParams();
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(true);
  const [shreLinkCopy, setShreLinkCopy] = useState(false);
  const [contactForm, setContactForm] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false);
      }
    }
    fetchListing();

  }, [listing, params.listingId]);
  if (loading) {
    return <Spinner />
  }

  return (
    <main>
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        slidesPerView={1}
        effect="fade"
        navigation
        pagination={{ clickable: true, type: 'progressbar' }}
        // scrollbar={{ draggable: true }}
        autoplay={{ delay: 3000 }}

      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full overflow-hidden h-[300px] md:h-[400px] lg:h-[500px]" style={{ background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: "cover" }}>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        setShreLinkCopy(true);
        setTimeout(() => {
          setShreLinkCopy(false);
        }, 2000)
      }} className="fixed top-[12%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full w-12 h-12 flex justify-center items-center">
        <FaShare className="text-lg text-slate-500" />
      </div>
      {shreLinkCopy && (
        <p className="fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2">Link Copied!</p>
      )}

      <div className="md:flex items-center max-w-6xl rounded-lg shadow-lg bg-white md:space-x-5 mx-auto m-4 p-4">
        <div className="w-full ">
          <p className="text-2xl font-bold mb-3 text-blue-900">
            {listing.name} - ${listing.offer ? listing.discountedPrice.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",") : listing.regularPrice.toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" ? " /month" : ""}
          </p>

          <p className="flex items-center mt-6 mb-3 font-bold">
            <FaMapMarkerAlt className="text-green-700 mr-1" />
            {listing.address}
          </p>

          <div className="flex space-x-4 items-center justify-start">
            <p className="bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold">{listing.type === "rent" ? "Rent" : "Sale"}</p>
            {listing.offer && (
              <p className="bg-green-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold">${listing.regularPrice - listing.discountedPrice}</p>
            )}
          </div>

          <p className="mt-3 mb-3">
            Description - {listing.description}
          </p>

          <ul className="flex items-center space-x-4 sm:space-x-10 text-sm font-semibold mb-6">
            <li className="flex items-center whitespace-nowrap">
              <FaBed className="text-lg mr-2" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaBath className="text-lg mr-2" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaParking className="text-lg mr-2" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="flex items-center whitespace-nowrap">
              <FaChair className="text-lg mr-2" />
              {listing.furnished ? "Furnished" : "No furnished"}
            </li>
          </ul>

          {listing.userRef !== auth.currentUser?.uid && !contactForm && (
            <div className="mt-6">
              <button onClick={() => setContactForm(true)} className="w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-slate-50 text-center transition duration-150 ease-in-out">Contact Landloard</button>
            </div>
          )}

          {contactForm && (
            <Contact
              userRef={listing.userRef} listing={listing} />
          )}
        </div>

        <div className="w-full h-[200px] md:h-[400px] z-10 overflow-x-hidden mt-6 md:mt-0 md:ml-2">
          <MapContainer
            center={[listing.latitude, listing.longitude]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.latitude, listing.longitude]}
            >
              <Popup>
                {listing.address}
              </Popup>
            </Marker>
          </MapContainer>
        </div>

      </div>

    </main>
  )
}

export default Listing