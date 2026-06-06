import { useState } from 'react';
import UserLayout from '../components/UserLayout';
import {Link} from 'react-router-dom'
import { useLoader } from '../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
const UniversityComparativeDataPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
  const {showLoader, hideLoader,isLoading} = useLoader();
  const handleSearch = async (e) => {
    e.preventDefault();
    setHasSearched(true);
    showLoader();
    if (searchTerm) {
        try {
            const response = await fetch(`http://localhost:8001/scraping/comparativeEventsSearch/${searchTerm}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setResults(data);
        } catch (error) {
            console.error('Error fetching search results:', error);
            setResults([]);
        } finally {
            hideLoader();
        }
    } else {
        setResults([]);
    }
};

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-teal-50 p-6 rounded-lg border-l-4 border-teal-500 shadow-md mb-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        {/* Title Section */}
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">University Comparative Data</h1>
                            <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Comparative-Data</p>
                        </div>
                        {/* Search Form Section */}
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row sm:items-center gap-2 w-auto md:w-auto">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for events..."
                                className="flex-grow border-teal-500 px-2 py-2 rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500 focus:outline-teal-500 border-1"
                            />
                            <button type="submit" className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600">
                               {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Searching... </span>):(<span>Search</span>)}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Table */}
                <div className="bg-white rounded-lg shadow-md border border-gray-200 h-auto max-h-[400px] overflow-auto">
                    <table className="min-w-[900px] w-full text-sm">
                        <thead className="bg-gray-100 border-b-2 border-gray-200 sticky top-0 z-10">
                            <tr>
                                <th className="py-3 px-2 md:px-4 text-left font-semibold text-gray-600 whitespace-nowrap">No.</th>
                                <th className="py-3 px-2 md:px-4 text-left font-semibold text-gray-600 whitespace-nowrap">campus</th>
                                <th className="py-3 px-2 md:px-4 text-left font-semibold text-gray-600 whitespace-nowrap">title</th>
                                <th className="py-3 px-2 md:px-4 text-left font-semibold text-gray-600 whitespace-nowrap">date</th>
                                <th className="py-3 px-2 md:px-4 text-left font-semibold text-gray-600 whitespace-nowrap">description</th>
                                <th className="py-3 px-2 md:px-4 text-left font-semibold text-gray-600 whitespace-nowrap">links</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {results.length > 0 ? (
                                results.map((item,index) => (
                                    <tr key={item._id}>
                                        <td className="py-2 px-2 md:px-4 font-mono text-xs border-r break-all max-w-[80px] md:max-w-xs">{index+1}</td>
                                        <td className="py-2 px-2 md:px-4 font-semibold border-r break-words max-w-[80px] md:max-w-xs">{item.name}</td>
                                        <td className="py-2 px-2 md:px-4 border-r break-words max-w-[120px] md:max-w-sm">{item.title}</td>
                                        <td className="py-2 px-2 md:px-4 whitespace-nowrap border-r">{item.date ?item.date : "null"}</td>
                                        <td className="py-2 px-2 md:px-4 border-r break-words max-w-[160px] md:max-w-md">{item.description}</td>
                                        <td className="py-2 px-2 md:px-4">
                                            <a href={item.link} target="_blank" className="text-blue-600 hover:underline">View Info</a>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-10 text-gray-500 text-base">
                                        {hasSearched ? "No results found for your query." : "search for events..."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </UserLayout>
    );
};

export default UniversityComparativeDataPage;