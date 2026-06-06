// src/pages/UniversitiesListPage.jsx

import UserLayout from '../components/UserLayout';
import UniversityCard from '../components/UniversityCard';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import Loader from '../components/Loader';

const UniversitiesListPage = () => {
  const [universities, setUniversities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUniversities, setFilteredUniversities] = useState([]);
  const {showLoader, hideLoader,isLoading} = useLoader();
  useEffect(() => {
    showLoader();
    fetch('http://localhost:8001/universities/getUniversities', { credentials: 'include' })
      .then(response => response.json())
      .then(data => {
        setUniversities(data);
        setFilteredUniversities(data);
      })
      .catch(error => {
        console.error('Error fetching universities:', error);
        setUniversities([]);
        setFilteredUniversities([]);
      }).finally(() => {
        hideLoader();
      });
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUniversities(universities);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUniversities(
        universities.filter(uni =>
          uni.shortName?.toLowerCase().includes(term) ||
          uni.name?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, universities]);

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar */}
        <aside className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-lg shadow-md ">
            <h2 className="text-xl font-bold mb-4">Campus Discovery</h2>
            <input
              type="text"
              placeholder="Search for universities by name..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border-gray-300 rounded-md py-2 px-2 shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-teal-500"
            />
            <Link to="/home" className="mt-6 w-full block text-center bg-teal-600 text-white  py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors">
              ← Back to Dashboard
            </Link>
          </div>
        </aside>

        {/* Right Main Content */}
        <main className="w-full md:w-3/4 space-y-6">
          <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-4 border-l-4 border-teal-500 flex flex-col sm:flex-row gap-4 sm:gap-2 sm:justify-between sm:items-center">
             <div>
                <h1 className="text-2xl font-bold text-gray-800">Explore Universities</h1>
                <p className="text-gray-500"><Link to='/home'>Dashboard</Link> / Campuses</p>
             </div>
             <Link to="/compare-data" className="bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-700">
                University-Comparative-Data
             </Link>
          </div>

          {isLoading ? <Loader /> : ( <div className="space-y-6">
            {filteredUniversities.map(uni => (
              <UniversityCard key={uni._id} university={uni} />
            ))}
          </div>)}
        </main>
      </div>
    </UserLayout>
  );
};

export default UniversitiesListPage;