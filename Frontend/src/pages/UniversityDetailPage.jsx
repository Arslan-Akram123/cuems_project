// src/pages/UniversityDetailPage.jsx

import { useParams, Link, useLocation, Outlet } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { useState, useEffect } from 'react';
// In a real app, this would be a single API call: /api/universities/:shortName
// const mockUniversities = [
//   { shortName: 'MUL', name: 'MUL University' },
//   { shortName: 'FAST', name: 'FAST University' },
//   { shortName: 'UCP', name: 'UCP University' }
// ];

const UniversityDetailPage = () => {
  const { universityId } = useParams();
  const location = useLocation(); // To check the current path
   const [universityData, setUniversityData] = useState([]);
    useEffect(() => {
    fetch('http://localhost:8001/universities/getUniversities', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setUniversityData(data);
       
      })
      .catch(error => {
        console.error('Error fetching universities:', error);
        setUniversities([]);
        
      });
  }, []);
  // Find the university data
  const university = universityData.find(uni => uni.shortName === universityId);

  if (!university) {
    return (
      <UserLayout>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold">University not found!</h1>
          <Link to="/universities" className="text-teal-600 hover:underline mt-4 inline-block">
            ← Back to all universities
          </Link>
        </div>
      </UserLayout>
    );
  }

  // Helper to style the active link
  const getLinkClass = (path) => {
    const fullPath = `/universities/${universityId}/${path}`;
    return location.pathname === fullPath || (path === 'events' && location.pathname === `/universities/${universityId}`)
      ? 'bg-teal-500 text-white'
      : 'bg-white text-teal-600 border border-teal-500 hover:bg-teal-50';
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8 flex  justify-center">
        
       
        {/* Right Main Content */}
        <main className="w-full md:w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{university.name}</h1>
              <p className="text-gray-500"><Link to='/home'>Dashboard</Link> / <Link to="/universities">Campuses</Link> / {university.shortName}</p>
            </div>
            <div className="flex flex-col gap-4 sm:gap-2 sm:flex-row sm:items-center sm:space-x-4">
              <Link to={`/universities/${universityId}/events`} className={`font-semibold py-2 px-6 rounded-lg transition-colors ${getLinkClass('events')}`}>
                Events-List
              </Link>
              
            </div>

            <div className="mt-8">
            
              <Outlet />
            </div>

          </div>
        </main>
      </div>
    </UserLayout>
  );
};

export default UniversityDetailPage;