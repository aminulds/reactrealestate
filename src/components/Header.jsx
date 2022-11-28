import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <header className='flex items-center justify-between max-w-6xl mx-auto px-3 bg-white border-b shadow-sm sticky top-0 z-50'>
      <div>
        <img onClick={() => navigate('/')} className='h-5 cursor-pointer' src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg" alt="logo" />
      </div>
      <div>
        <ul className='flex space-x-10'>
          <li onClick={() => navigate('/')} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathRoute('/') && 'text-black border-b-red-500'}`}>Home</li>
          <li onClick={() => navigate('/offers')} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathRoute('/offers') && 'text-black border-b-red-500'}`}>Offers</li>
          <li onClick={() => navigate('/sign-in')} className={`cursor-pointer py-3 text-sm font-semibold text-gray-400 border-b-[3px] border-b-transparent ${pathRoute('/sign-in') && 'text-black border-b-red-500'}`}>Signin</li>
        </ul>
      </div>
    </header>
  )
}

export default Header