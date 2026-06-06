import react from 'react';
import { createContext, useState, useEffect, useContext } from 'react';


const ProfileContext = createContext({
   fetchProfileData: () => {},
   fetchSiteSettingData: () => {}
});

  
export const ProfileProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    street: '',
    country: '',
    city: '',
    state: '',
    postalCode: '',
    phoneNumber: '',
    email: '',
    profileImage: ''
  });

  // Site Setting State (fields from siteSettingSchema)
  const [siteSetting, setSiteSetting] = useState({
    siteEmail: '',
    sitePhone: '',
    siteAddress: '',
    tiwitterLink: '',
    facebookLink: '',
    instagramLink: '',
    siteMainImage: '',
    siteLogo: '',
    description: '',
    siteCloseMessage: '',
    footerText: ''
  });


function fetchProfileData() {
  fetch('http://localhost:8001/settings/getProfileData', {
    credentials: 'include',
  })
    .then(async response => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }
      return response.json();
    })
    .then(data => {
      setFormData({
        fullName: data.fullName || '',
        street: data.address || '',
        country: data.country || '',
        city: data.city || '',
        state: data.province || '',
        postalCode: data.postalCode || '',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        profileImage: data.profileImageURL || ''
      });
    })
    .catch(error => {
      console.error('Error fetching profile data:', error.message);
      setStatusMessage({ type: 'error', text: error.message });
    });
}

// Function to fetch site setting data from DB and set into siteSetting
function fetchSiteSettingData() {
  fetch('http://localhost:8001/siteSettings/getSiteSetting', {
    credentials: 'include',
  })
    .then(async response => {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }
      return response.json();
    })
    .then(data => {
      setSiteSetting({
        siteEmail: data.siteEmail || '',
        sitePhone: data.sitePhone || '',
        siteAddress: data.siteAddress || '',
        tiwitterLink: data.tiwitterLink || '',
        facebookLink: data.facebookLink || '',
        instagramLink: data.instagramLink || '',
        siteMainImage: data.siteMainImage || '',
        siteLogo: data.siteLogo || '',
        description: data.description || '',
        siteCloseMessage: data.siteCloseMessage || '',
        footerText: data.footerText || ''
      });
    })
    .catch(error => {
      console.error('Error fetching site setting data:', error.message);
      // Optionally handle error state here
    });
}


  return (
    <ProfileContext.Provider value={{ formData, setFormData, fetchProfileData, siteSetting, setSiteSetting, fetchSiteSettingData }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}