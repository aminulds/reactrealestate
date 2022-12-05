import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Spinner from './../components/Spinner';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/bundle';
import { FaShare } from 'react-icons/fa';

const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(true);
  const [shreLinkCopy, setShreLinkCopy] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setListing(docSnap.data())
        setLoading(false);
        console.log(listing)
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


    </main>
  )
}

export default Listing