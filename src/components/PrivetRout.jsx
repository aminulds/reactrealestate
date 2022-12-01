import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStatus } from '../hooks/useAuthStatus';

const PrivetRout = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();
  if (checkingStatus) {
    return <h3>Loadding ...</h3>
  }

  return loggedIn ? <Outlet /> : <Navigate to="/sign-in" />
}

export default PrivetRout;