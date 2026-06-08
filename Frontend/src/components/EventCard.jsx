// src/components/EventCard.jsx

import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  
  const { _id, name, price, category, startDate, startTime, image,status,location } = event;
 
  let formattedStartDate = 'N/A';
  if (startDate) {
    const d = new Date(startDate);
    if (!isNaN(d.getTime())) {
      formattedStartDate = d.toLocaleDateString();
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col">
      <div className="relative">
        <img 
          className="h-48 w-full object-cover" 
          src={image} 
          alt={`Image for ${name}`} 
        />
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        
        <div className='flex justify-end items-center'>
          <span className="inline-block bg-teal-500 text-white text-sm font-semibold px-3 py-1 rounded-full">{status}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 truncate">{name}</h3>
        <div className="mt-2 space-y-1 text-sm text-gray-600 flex-grow">
          <p><span className="font-semibold">Price:</span>${price}</p>
          <p><span className="font-semibold">Category:</span> {category}</p>
          <p><span className="font-semibold">Location:</span> {location}</p>
          <p><span className="font-semibold">Start Date:</span> {formattedStartDate}</p>
          <p><span className="font-semibold">Start Time:</span> {startTime}</p>
          {/* <p><span className="font-semibold me-2">Status:</span> {status}</p> */}
        </div>

        <div className="mt-4">
          <Link 
            to={`/events/${_id}`} 
            className="w-full block text-center bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors"
          >
            More Info
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;