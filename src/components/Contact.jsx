
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './../firebase';
import { toast } from 'react-toastify';

const Contact = ({ userRef, listing }) => {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const getlandloard = async () => {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could no get landlord data!");
      }
    }
    getlandloard();
  }, [userRef]);

  const onChange = (e) => {
    setMessage(e.target.value)

  };

  return (
    <>
      {landlord !== null && (
        <div className='flex flex-col w-full mb-6'>
          <p>Contact <span className='font-semibold'>{landlord.name}</span> for the <span className='font-semibold'>{listing.name.toLowerCase()}</span></p>

          <div className="mt-2 mb-6">
            <textarea onChange={onChange} name="message" id="message" rows="2" value={message} className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"></textarea>
          </div>

          <a href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}>
            <button className="w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-slate-50 text-center transition duration-150 ease-in-out" type='button'>Send Message</button>
          </a>

        </div>
      )}

    </>
  )
}

export default Contact