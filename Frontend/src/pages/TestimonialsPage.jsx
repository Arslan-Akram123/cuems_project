// src/pages/TestimonialsPage.jsx
import UserLayout from '../components/UserLayout';
import { Link } from 'react-router-dom';
import TestimonialCard from '../components/TestimonialCard';
import { useState, useEffect } from 'react';
import { useLoader } from '../context/LoaderContext';
import Loader from '../components/Loader';
const TestimonialsPage = () => {
    const [testimonials, setTestimonials] = useState([]);
    const {showLoader, hideLoader,isLoading} = useLoader();

    useEffect(() => {
        showLoader();
        fetch('http://localhost:8001/comments/getAllComments', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                // Only show comments with rating 5
                // const filtered = (Array.isArray(data) ? data : []).filter(c => c.rating === 5);
                setTestimonials(data);
            })
            .catch(() => {
                setTestimonials([]);
            }).finally(() => {
                hideLoader();
            });
    }, []);

    return (
        <UserLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Testimonials</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Testimonials</p>
                </div>

                {isLoading ? <Loader /> : ( <div className="space-y-8">
                    {testimonials.length === 0 ? <p className="text-gray-500 text-center py-4">No testimonials found.</p> : testimonials.map(testimonial => (
                        <TestimonialCard key={testimonial._id} testimonial={testimonial} />
                    ))}
                </div>)}
            </div>
        </UserLayout>
    );
};

export default TestimonialsPage;