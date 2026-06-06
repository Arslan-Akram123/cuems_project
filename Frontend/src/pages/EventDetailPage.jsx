// src/pages/EventDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import ReviewCard from '../components/ReviewCard';
import BookingModal from '../components/BookingModal';
import { FiStar, FiCalendar, FiClock, FiMapPin, FiUsers, FiTag } from 'react-icons/fi';
import { useLoader } from '../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import {useToast} from '../context/ToastContext';
const EventDetailPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comments, setComments] = useState([]);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const {showLoader, hideLoader,isLoading} = useLoader();
    const {showToast} = useToast();
  useEffect(() => {
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().slice(0, 10);
    };
    fetch(`http://localhost:8001/events/getEvent/${eventId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setEvent({
          title: data.name || '',
          price: data.price || '0',
          category: data.category || '',
          startDate: formatDate(data.startDate),
          endDate: formatDate(data.endDate),
          startTime: data.startTime || '',
          endTime: data.endTime || '',
          imageUrl: data.image || '',
          description: data.description || '',
          location: data.location || '',
          status: data.status || '',
          bookings: data.bookings || '0',
          reservedSeats: data.reservedSeats || '0',
          maxSubscribers: data.totalSubscribers || '',
          createdAt: data.createdAt || '',
        });
        setLoading(false);
      })
      .catch(err => {
        showToast('Event not found!', 'error');
        setLoading(false);
      });
    // Fetch comments for this event
    fetch(`http://localhost:8001/comments/getComment/${eventId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setComments(Array.isArray(data) ? data : []);
      })
      .catch(() => setComments([]));
  }, [eventId]);


  const handleBookingSubmit = async (bookingData) => {
    const { notes,setNotes } = bookingData;
    const payload = { notes, eventId };
    showLoader();
    fetch('http://localhost:8001/eventsbook/bookingEventrequest', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
        
          showToast('Booking successfully. Please wait for admin approval!', 'success');
          setNotes('');
          setTimeout(() => {
          
            setIsBookingModalOpen(false);
          }, 1500);
        } else {
          // Show specific error if already booked

          if (data && data.error === 'You have already booked this event') {
           
            showToast('You have already booked this event.', 'error');
          } else {
           
            showToast(data.error, 'error');
          }
        }
      })
      .catch((error) => {
       
        showToast('Error booking event.', 'error');
      }).finally(hideLoader);
    
  };


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    try {

      const response = await fetch('http://localhost:8001/comments/addComment', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          comment: newComment,
          rating: newRating,
        }),
      });
      if (response.ok) {
        showToast("Comment posted successfully!", 'success');
        setShowCommentBox(false);
        setNewComment("");
        setNewRating(0);
        fetch(`http://localhost:8001/comments/getComment/${eventId}`, { credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            setComments(Array.isArray(data) ? data : []);
          })
          .catch(() => setComments([]));
      } else {
        const data = await response.json();
        showToast(data.error, 'error');
      }
    } catch (err) {
      showToast('Network error.', 'error');
    } finally {
      hideLoader();
    }
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold flex items-center justify-center">Loading event...<FaSpinner className="animate-spin"/></h1>
        </div>
      </UserLayout>
    );
  }

  if (!event) {
    return (
      <UserLayout>
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold">Event not found!</h1>
          <Link to="/events" className="text-teal-600 hover:underline mt-4 inline-block">
            ← Back to all events
          </Link>
        </div>
      </UserLayout>
    );
  }




  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
      <div className="bg-teal-50 p-6 rounded-lg shadow-md mb-8 border-l-4 border-teal-500">
                    <h1 className="text-3xl font-bold text-gray-800">Event Details</h1>
                    <p className="text-gray-500"><Link to="/home">Dashboard</Link> / Event-Details</p>
                </div>
        <div className="bg-white p-6 rounded-lg shadow-md">

          {/* Top Section: Title and Price */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
              <p className="text-md text-gray-500 mt-1">Created At: {event.createdAt ? new Date(event.createdAt).toLocaleDateString() : ''}</p>
            </div>
            <p className="text-4xl font-bold text-teal-600 mt-4 md:mt-0">
              ${event.price}
            </p>
          </div>

          <hr className="my-4" />

          {/* Main Content: Image and Details */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {event.imageUrl && (
                <img src={event.imageUrl} alt={event.title} className="w-full h-auto object-cover rounded-lg" />
              )}
            </div>

            {/* Details Sidebar */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-3"><FiTag className="h-5 w-5 text-teal-600" /><p><span className="font-semibold">Category:</span> {event.category}</p></div>
              <div className="flex items-center gap-3"><FiClock className="h-5 w-5 text-teal-600" /><p><span className="font-semibold">Start Time:</span> {event.startTime}</p></div>

              <div className="flex items-center gap-3"><FiClock className="h-5 w-5 text-teal-600" /><p><span className="font-semibold">End Time:</span> {event.endTime}</p></div>
              <div className="flex items-center gap-3"><FiMapPin className="h-5 w-5 text-teal-600" /><p><span className="font-semibold">Location:</span> {event.location}</p></div>
              <div className="flex items-center gap-3"><FiCalendar className="h-5 w-5 text-teal-600" /><p><span className="font-semibold">Start Date:</span> {event.startDate}</p></div>
              <div className="flex items-center gap-3"><FiCalendar className="h-5 w-5 text-teal-600" /><p><span className="font-semibold">End Date:</span> {event.endDate}</p></div>
              {/* <div className="flex items-center gap-3"><FiUsers className="h-5 w-5 text-teal-600" /><p><span className="font-semibold">Sponsor:</span> {event.sponsor}</p></div> */}
              <p className="text-lg font-bold text-teal-600">Maximum Subscribers: {
                [event.maxSubscribers, event.bookings, event.reservedSeats]
                  .map(x => Number(x) || 0)
                  .reduce((a, b) => a + b, 0)
              }</p>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className={`w-full font-bold py-3 px-4 rounded-lg text-lg transition-colors ${(['completed', 'ongoing'].includes(event.status) || Number(event.maxSubscribers) === 0) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-teal-500 text-white hover:bg-teal-600'}`}
                disabled={['completed', 'ongoing'].includes(event.status) || Number(event.maxSubscribers) === 0}
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          <hr className="my-8" />

          {/* Booking & Comments Section */}
          <div className="text-center">
            <div className="text-xl">
              <span>Confirmed Bookings: <span className="font-bold text-red-500">{event.bookings}</span></span>
               <span className="mx-4">|</span>
              <span>Reserved Bookings: <span className="font-bold text-red-500">{event.reservedSeats}</span></span>
              <span className="mx-4">|</span>
              <span>Remaining Number: <span className="font-bold text-red-500">{event.maxSubscribers || 0}</span></span>
            </div>
            <button
              onClick={() => setShowCommentBox(true)}
              className="mt-4 bg-teal-500 text-white font-bold py-2 px-6 rounded-full hover:bg-teal-600 transition-colors"
            >
              Add Comment
            </button>

            {showCommentBox && (
              <>
                <form
                  onSubmit={handleCommentSubmit}
                  className="mt-6 p-6 border-2 border-teal-200 rounded-xl bg-gradient-to-br from-teal-50 to-white shadow-lg flex flex-col items-start gap-5 w-full max-w-lg mx-auto"
                >
                  <label className="font-semibold text-lg mb-1">Your Comment:</label>
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full border-2 border-teal-200 rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500 transition"
                    placeholder="Write your comment..."
                    required
                  />
                  <label className="font-semibold text-lg mt-2 mb-1">Your Rating:</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`cursor-pointer text-3xl transition-colors ${newRating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setNewRating(star)}
                      >
                        &#9733;
                      </span>
                    ))}
                    <span className="ml-2 text-teal-600 font-bold">{newRating > 0 ? `${newRating} Star${newRating > 1 ? 's' : ''}` : ''}</span>
                  </div>
                  <div className="flex gap-3 mt-4 self-end">
                    <button type="submit" className="bg-teal-500 text-white font-bold py-2 px-6 rounded-lg shadow hover:scale-105 transition-transform">
                      {isLoading ?(<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" />Posting... </span>) :'Post'}
                    </button>
                    <button type="button" className="bg-gray-200 text-gray-800 font-bold py-2 px-6 rounded-lg shadow hover:bg-gray-300 transition-colors" onClick={() => setShowCommentBox(false)}>Cancel</button>
                  </div>
                </form>
               
              </>
            )}
          </div>

          {/* Reviews Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-2">Reviews ({comments.length})</h2>
            {comments.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {comments.map(review => (
                  <ReviewCard
                    key={review._id || review.id}
                    review={{
                      user: review.user?.fullName || review.user || 'Anonymous',
                      time: review.createdAt ? new Date(review.createdAt).toLocaleString() : '',
                      rating: review.rating,
                      comment: review.comment,
                      userId: review.user?._id 
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No Reviews Found.</p>
            )}
          </div>
        </div>
      </div>
      <BookingModal
        eventName={event.title}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onSubmit={handleBookingSubmit}
        isloading={isLoading}
      />
    </UserLayout>
  );
};

export default EventDetailPage;