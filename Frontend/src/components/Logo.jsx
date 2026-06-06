// src/components/Logo.jsx
import React from 'react';
import { useProfile } from '../context/ProfileContext/ProfileContext';
const Logo = () => {
  const { siteSetting } = useProfile();
  if (siteSetting.siteLogo) {
    return <img src={siteSetting.siteLogo} alt="Site Logo" className="h-28 w-48 object-contain" />;
  }
  return <img src={`/uploads/SiteLogo.png`} alt="CUEMS Logo" className="h-28 w-48 object-contain" />;
};

export default Logo;