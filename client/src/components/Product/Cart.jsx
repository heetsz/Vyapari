import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, MapPin, ChevronLeft, Clock } from 'lucide-react';
import axios from 'axios';

const OrderSummaryPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigateTo = useNavigate();
  const { orderId } = useParams(); // Assuming you're passing orderId in the URL

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3003/orders/${orderId}`);
        setOrderDetails(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch order details. Please try again later.');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const OrderStatus = () => (
    <div className="flex justify-between items-center max-w-2xl mx-auto mb-8">
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${orderDetails?.status >= 1 ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
          <CheckCircle className={orderDetails?.status >= 1 ? 'text-green-600' : 'text-gray-400'} />
        </div>
        <p className="text-sm mt-2">Confirmed</p>
      </div>
      <div className={`h-1 flex-1 ${orderDetails?.status >= 2 ? 'bg-green-200' : 'bg-gray-200'} mx-2`} />
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${orderDetails?.status >= 2 ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
          <Package className={orderDetails?.status >= 2 ? 'text-green-600' : 'text-gray-400'} />
        </div>
        <p className="text-sm mt-2">Packed</p>
      </div>
      <div className={`h-1 flex-1 ${orderDetails?.status >= 3 ? 'bg-green-200' : 'bg-gray-200'} mx-2`} />
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${orderDetails?.status >= 3 ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
          <Truck className={orderDetails?.status >= 3 ? 'text-green-600' : 'text-gray-400'} />
        </div>
        <p className="text-sm mt-2">On the way</p>
      </div>
      <div className={`h-1 flex-1 ${orderDetails?.status >= 4 ? 'bg-green-200' : 'bg-gray-200'} mx-2`} />
      <div className="flex flex-col items-center">
        <div className={`w-10 h-10 rounded-full ${orderDetails?.status >= 4 ? 'bg-green-100' : 'bg-gray-100'} flex items-center justify-center`}>
          <MapPin className={orderDetails?.status >= 4 ? 'text-green-600' : 'text-gray-400'} />
        </div>
        <p className="text-sm mt-2">Delivered</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <p className="text-gray-800">{error}</p>
          <button 
            onClick={() => navigateTo('/products')}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-800">Order not found</p>
          <button 
            onClick={() => navigateTo('/products')}
            className="mt-4 text-green-600 hover:text-green-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <button 
          onClick={() => navigateTo('/products')}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <ChevronLeft size={20} />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Order ID: {orderDetails.orderId}
          </p>
        </div>

        <OrderStatus />

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Delivery Partner</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={orderDetails.deliveryPerson.image || "/api/placeholder/48/48"}
                alt="Delivery Person" 
                className="rounded-full"
              />
              <div>
                <p className="font-medium">{orderDetails.deliveryPerson.name}</p>
                <p className="text-sm text-gray-600">
                  ⭐ {orderDetails.deliveryPerson.rating} • {orderDetails.deliveryPerson.phone}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>{orderDetails.deliveryPerson.estimatedTime} mins</span>
              </div>
              <p className="text-sm text-gray-500">Estimated delivery time</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Order Details</h2>
          
          <div className="space-y-4 mb-6">
            {orderDetails.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img 
                    src={item.image || "/api/placeholder/48/48"}
                    alt={item.name}
                    className="rounded-lg"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>₹{orderDetails.subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>₹{orderDetails.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{orderDetails.total}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Delivery Information</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Delivery Address</p>
              <p className="font-medium">{orderDetails.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium">{orderDetails.paymentMethod}</p>
            </div>
            <div>
              <p className="text-gray-600">Order Date</p>
              <p className="font-medium">{new Date(orderDetails.orderDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600">Need help with your order?</p>
          <button 
            onClick={() => window.location.href = `mailto:support@plantstore.com?subject=Help with Order ${orderDetails.orderId}`}
            className="text-green-600 font-medium hover:text-green-700 mt-1"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryPage;