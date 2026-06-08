// src/pages/CheckoutPage.jsx
import { useLocation, Link, useNavigate } from 'react-router-dom';
import UserLayout from '../components/UserLayout';
import { FiLock, FiCreditCard, FiCalendar, FiChevronLeft } from 'react-icons/fi';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { useLoader } from '../context/LoaderContext';
import { FaSpinner } from 'react-icons/fa';
import {useToast} from '../context/ToastContext';
// Initialize Stripe with your test publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ booking, onSuccessfulPayment }) => {
  const stripe = useStripe();
  const elements = useElements();
  const {showToast} = useToast();
  const [processing, setProcessing] = useState(false);
  const [nameOnCard, setNameOnCard] = useState('');
  const {showLoader, hideLoader,isLoading} = useLoader();
  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoader();
    if (!stripe || !elements) {
      return; // Stripe.js hasn't loaded yet
    }

    setProcessing(true);
   

    try {
      // 1. Create payment intent on backend
      const response = await fetch('http://localhost:8001/stripe/create-payment-intent', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(booking.event.price * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            bookingId: booking._id,
            eventName: booking.event.name
          }
        }),
      });

      if (!response.ok) {
         showToast('Failed to create payment intent', 'error');
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // 2. Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: nameOnCard,
          },
        }
      });

      if (stripeError) {
        showToast(stripeError.message, 'error');
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Payment succeeded!
        onSuccessfulPayment();
      }
    } catch (err) {

      showToast(err.message, 'error');
      setProcessing(false);
    }finally{
      hideLoader();
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
       
      <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="card-name" className="block text-sm font-medium text-gray-700">
            Name on Card
          </label>
          <input 
            type="text" 
            id="card-name" 
            placeholder="John M. Doe" 
            required 
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
            className="mt-1 block w-full border-teal-500 focus:outline-teal-500 focus:ring-teal-500 px-2 py-2 border-1 rounded-md shadow-sm"
          />
        </div>
        
        {/* Stripe Card Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Card Details</label>
          <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
                hidePostalCode: false // Set to true if you don't want to collect postal code
              }}
            />
          </div>
        </div>
      </div>
      
    

      <div className="mt-8">
        <button 
          type="submit" 
          disabled={!stripe || processing}
          className={`w-full flex items-center justify-center gap-3 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 ${(!stripe || processing) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <FiLock />
          {processing ? (<span className='flex items-center justify-center gap-3'><FaSpinner className="animate-spin h-5 w-5" /> Processing... </span>) : `Pay $${(booking.event.price || 0).toFixed(2)}`}
        </button>
      </div>
    </form>
  );
};


const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { booking } = location.state || {};
  const {showToast} = useToast();
  if (!booking) {
    return (
      <UserLayout>
        <div className="container mx-auto text-center py-20">
          <h1 className="text-2xl font-bold">Booking information is missing.</h1>
          <Link to="/my-bookings" className="text-teal-600 hover:underline mt-4 inline-block">
            &larr; Go back to My Bookings
          </Link>
        </div>
      </UserLayout>
    );
  }

  async function handleSuccessfulPayment() {
    fetch('http://localhost:8001/eventsbook/complete-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        bookingId: booking._id,
        eventId: booking.event._id,
      })
    })
    .then(response => response.json())
    .then(data => {
      showToast(`Payment successful for "${booking.event.name}"!`, 'success');
      setTimeout(() => navigate('/my-bookings'), 1500);
    })
    .catch(error => {
      showToast('Payment failed. Please try again.', 'error');
      console.error(error);
    });
  }

  return (
    <UserLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
            <Link to="/my-bookings" className="flex items-center gap-2 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">
              <FiChevronLeft /> Back to Bookings
            </Link>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Order Summary */}
            <div className="border-b pb-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
              <div className="flex justify-between items-center text-gray-600">
                <p>Event: <span className="font-medium text-gray-800">{booking.event.name}</span></p>
                <p className="font-bold text-xl text-gray-800">${booking.event.price}</p>
              </div>
            </div>

            {/* Stripe Elements Provider */}
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                booking={booking} 
                onSuccessfulPayment={handleSuccessfulPayment}
              />
            </Elements>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default CheckoutPage;

// import { useLocation, Link, useNavigate } from 'react-router-dom';
// import UserLayout from '../components/UserLayout';
// import { FiLock, FiCreditCard, FiChevronLeft } from 'react-icons/fi';
// import { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
// import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
// import axios from 'axios';

// // Stripe Configuration
// const stripePromise = loadStripe('pk_test_51RwvGYRo8LdWoFWrUiYbAYKBh0HehUgcGry8oA2oCIJakF2SZG5DzznHWYdPpLNZnBAV05tzcTuUxQOAjVHR4a9K00xsyQfRG1');

// const CheckoutPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { booking } = location.state || {};
//   const [paymentMethod, setPaymentMethod] = useState('stripe');
//   const [successMsg, setSuccessMsg] = useState('');
//   const [errorMsg, setErrorMsg] = useState('');

//   if (!booking) {
//     return (
//       <UserLayout>
//         <div className="container mx-auto text-center py-20">
//           <h1 className="text-2xl font-bold">Booking information missing</h1>
//           <Link to="/my-bookings" className="text-teal-600 hover:underline mt-4 inline-block">
//             &larr; Back to bookings
//           </Link>
//         </div>
//       </UserLayout>
//     );
//   }

//   // Handle Paymob Payment
//   const handlePaymobPayment = async () => {
//     try {
//       const response = await axios.post('http://localhost:8001/paymob/initiate', {
//         amount: booking.event.price,
//         bookingId: booking._id,
//         userData: {
//           firstName: 'User',
//           lastName: 'Name',
//           email: 'user@example.com',
//           phone: '+9660123456789'
//         }
//       }, {
//         withCredentials: true
//       });
//       window.location.href = response.data.url;
//     } catch (error) {
//       setErrorMsg('Failed to initiate Paymob payment');
//       setTimeout(() => setErrorMsg(''), 3000);
//     }
//   };

//   // Handle successful payment (both methods)
//   const handleSuccessfulPayment = async () => {
//     try {
//       await axios.post('http://localhost:8001/eventsbook/complete-booking', {
//         bookingId: booking._id,
//         eventId: booking.event._id
//       }, { withCredentials: true });
      
//       setSuccessMsg(`Payment successful for "${booking.event.name}"!`);
//       setTimeout(() => navigate('/my-bookings'), 2000);
//     } catch (error) {
//       setErrorMsg('Payment verification failed');
//       setTimeout(() => setErrorMsg(''), 3000);
//     }
//   };

//   return (
//     <UserLayout>
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-2xl mx-auto">
//           <div className="flex justify-between items-center mb-6">
//             <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
//             <Link to="/my-bookings" className="flex items-center gap-2 bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-200">
//               <FiChevronLeft /> Back
//             </Link>
//           </div>

//           {/* Messages */}
//           {successMsg && (
//             <div className="mb-4 p-3 bg-green-100 text-green-800 rounded text-center">
//               {successMsg}
//             </div>
//           )}
//           {errorMsg && (
//             <div className="mb-4 p-3 bg-red-100 text-red-800 rounded text-center">
//               {errorMsg}
//             </div>
//           )}

//           <div className="bg-white p-8 rounded-lg shadow-md">
//             {/* Order Summary */}
//             <div className="border-b pb-6 mb-6">
//               <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
//               <div className="flex justify-between items-center text-gray-600">
//                 <p>Event: <span className="font-medium text-gray-800">{booking.event.name}</span></p>
//                 <p className="font-bold text-xl text-gray-800">${booking.event.price}</p>
//               </div>
//             </div>

//             {/* Payment Method Selection */}
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
//               <div className="flex gap-4">
//                 <button
//                   onClick={() => setPaymentMethod('stripe')}
//                   className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'stripe' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}
//                 >
//                   Credit Card (Stripe)
//                 </button>
//                 <button
//                   onClick={() => setPaymentMethod('paymob')}
//                   className={`flex-1 py-2 px-4 rounded-lg border ${paymentMethod === 'paymob' ? 'border-teal-500 bg-teal-50' : 'border-gray-300'}`}
//                 >
//                   Paymob
//                 </button>
//               </div>
//             </div>

//             {/* Stripe Payment Form */}
//             {paymentMethod === 'stripe' && (
//               <Elements stripe={stripePromise}>
//                 <StripeCheckoutForm 
//                   booking={booking} 
//                   onSuccessfulPayment={handleSuccessfulPayment}
//                   setErrorMsg={setErrorMsg}
//                 />
//               </Elements>
//             )}

//             {/* Paymob Payment Button */}
//             {paymentMethod === 'paymob' && (
//               <button
//                 onClick={handlePaymobPayment}
//                 className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700"
//               >
//                 <FiLock />
//                 Pay with Paymob
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </UserLayout>
//   );
// };

// // Stripe Checkout Component
// const StripeCheckoutForm = ({ booking, onSuccessfulPayment, setErrorMsg }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [processing, setProcessing] = useState(false);
//   const [nameOnCard, setNameOnCard] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;

//     setProcessing(true);
//     try {
//       const response = await axios.post('http://localhost:8001/stripe/create-payment-intent', {
//         amount: Math.round(booking.event.price * 100),
//         currency: 'usd',
//         metadata: {
//           bookingId: booking._id,
//           eventName: booking.event.name
//         }
//       });

//       const { error, paymentIntent } = await stripe.confirmCardPayment(
//         response.data.clientSecret, {
//           payment_method: {
//             card: elements.getElement(CardElement),
//             billing_details: { name: nameOnCard }
//           }
//         }
//       );

//       if (error) throw error;
//       if (paymentIntent.status === 'succeeded') onSuccessfulPayment();
//     } catch (err) {
//       setErrorMsg(err.message || 'Payment failed');
//       setTimeout(() => setErrorMsg(''), 3000);
//     } finally {
//       setProcessing(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Name on Card
//           </label>
//           <input
//             type="text"
//             placeholder="John Doe"
//             required
//             value={nameOnCard}
//             onChange={(e) => setNameOnCard(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Card Details
//           </label>
//           <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
//             <CardElement options={{ hidePostalCode: false }} />
//           </div>
//         </div>
//       </div>
//       <button
//         type="submit"
//         disabled={!stripe || processing}
//         className={`mt-6 w-full flex justify-center items-center gap-2 bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 ${processing ? 'opacity-70' : ''}`}
//       >
//         <FiLock />
//         {processing ? 'Processing...' : `Pay $${booking.event.price}`}
//       </button>
//     </form>
//   );
// };

// export default CheckoutPage;