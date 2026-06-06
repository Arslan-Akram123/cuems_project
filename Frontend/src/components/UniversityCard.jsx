// src/components/UniversityCard.jsx

import { Link } from 'react-router-dom';

const UniversityCard = ({ university }) => {
  const { shortName, name, description, logo } = university;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
      <div className="flex-shrink-0">
        <img 
          src={logo} 
          alt={`${name} Logo`} 
          className="h-24 w-24 object-contain"
        />
      </div>
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-2xl font-bold text-gray-800">{name}</h3>
        <p className="text-gray-600 my-2">{description}</p>
        <Link 
          to={`/universities/${shortName}`} 
          className="inline-block mt-2 bg-teal-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-600 transition-colors"
        >
          Explore {shortName}
        </Link>
      </div>
    </div>
  );
};

export default UniversityCard;