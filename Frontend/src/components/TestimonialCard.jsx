// src/components/TestimonialCard.jsx
import { Link } from 'react-router-dom';
import { FiStar, FiCalendar, FiUser } from 'react-icons/fi';

const TestimonialCard = ({ testimonial }) => {
    // Helper to render star ratings
    const renderStars = (rating) => (
        Array.from({ length: 5 }, (_, index) => (
            <FiStar key={index} className={`inline-block h-5 w-5 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ))
    );

    return (
        <div className="relative pl-8">
            {/* Timeline icon */}
            <div className="absolute left-0 top-0 -translate-x-1/2 bg-white border-2 border-teal-500 rounded-full h-8 w-8 flex items-center justify-center">
                <FiUser className="text-teal-500"/>
            </div>
            {/* Timeline vertical line */}
            <div className="absolute left-0 top-4 bottom-0 w-0.5 bg-teal-500"></div>

            {/* Card content */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 ml-4">
                <h3 className="font-bold text-lg">{testimonial.user?.fullName}</h3>
                <div className="my-2">{renderStars(testimonial?.rating)}</div>
                <p className="text-gray-600 italic break-words">"{testimonial?.comment}"</p>
                <div className="mt-4 flex items-center gap-2 text-sm text-gray-800">
                    <FiCalendar />
                    <span>Event: </span>
                    <Link to={`/events/${testimonial.event?._id}`} className="text-teal-600 hover:underline font-semibold">
                        {testimonial.event?.name}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TestimonialCard;