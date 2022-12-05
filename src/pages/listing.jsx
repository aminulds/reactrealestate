import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Spinner from './../components/Spinner';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import 'swiper/css/bundle';

const Listing = () => {
  const params = useParams();
  const [listing, setListing] = useState();
  const [loading, setLoading] = useState(true);

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

      {/* <Swiper slidesPerView={1} navigation pagination={{ type: "progressbar" }} effect="fade" modules={[EffectFade]} autoplay={{ delay: 3000 }}>
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div className="w-full overflow-hidden h-[300px]" style={{ background: `url(${listing.imgUrls[index]}) center no-repeat` }}>

            </div>
          </SwiperSlide>
        ))}
      </Swiper> */}

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
    </main>
  )
}

export default Listing