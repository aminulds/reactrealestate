import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Header = () => {
  const [pageState, setPageState] = useState("Sign in");
  const navigate = useNavigate();
  const location = useLocation();
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState("Profile");
      } else {
        setPageState("Sign in");
      }
    });
  }, [auth]);

  const pathRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <section className=' bg-white border-b shadow-sm sticky top-0 z-50'>
      <header className='flex items-center justify-between max-w-6xl mx-auto px-3'>
        <div>
          <img onClick={() => navigate('/')} className='h-14 cursor-pointer' src={logo} alt="logo" />
        </div>
        <div>
          <ul className='flex space-x-8'>
            <li onClick={() => navigate('/')} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathRoute('/') && 'text-black border-b-red-500'}`}>Home</li>
            <li onClick={() => navigate('/offers')} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathRoute('/offers') && 'text-black border-b-red-500'}`}>Offers</li>
            <li className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${(pathRoute('/sign-in') || pathRoute('/profile')) && 'text-black border-b-red-500'}`} onClick={() => navigate('/profile')}>{pageState}</li>
          </ul>
        </div>
      </header>
    </section>
  )
}

export default Header