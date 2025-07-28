import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, ChevronRight, Minus, Plus, MapPin, LogOut } from 'lucide-react';
import axios from 'axios';
import logo from '../../LoginAssets/logo.png';


const PlantStore = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Plants');
  const navigateTo = useNavigate();


  // useEffect(() => {

  //   axios.get('http://localhost:3003/username')
  //     .then((response) => {
  //       setUsername(response.data.username);
  //     })
  //     .catch((error) => console.error('Error fetching username:', error));
  //   }, []);


  const useUsername = () => {
    const [username, setUsername] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchUsername = async () => {
        try {
          setIsLoading(true);
          setError(null);
          
          const response = await axios.get('http://localhost:3003/username');
          
          if (response.data && response.data.data) {
            setUsername(response.data.data.username);
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          let errorMessage = 'Failed to fetch username';
          
          if (error.response) {
            // Server responded with error
            errorMessage = error.response.data?.message || errorMessage;
          } else if (error.request) {
            // Request made but no response
            errorMessage = 'Server not responding';
          }
          
          setError(errorMessage);
          console.error('Error fetching username:', error);
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchUsername();
  
      // Optional: Add cleanup
      return () => {
        setUsername('');
        setIsLoading(false);
        setError(null);
      };
    }, []);
  
    return { username, isLoading, error };
  };
  
  

  const { username, isLoading, error } = useUsername();

  const categories = [
    "All Plants",
    "Indoor Plants",
    "Outdoor Plants",
    "Succulents",
    "Flowering Plants",
    "Medicinal Plants",
    "Plant Care"
  ];

  const products = [
    { id: 1, name: "Snake Plant", price: 299, category: "Indoor Plants", image: "https://hips.hearstapps.com/vader-prod.s3.amazonaws.com/1716209064-81SXDZveAL.jpg?crop=0.534xw:1.00xh;0.0849xw,0&resize=980:*", quantity: 1 },
    { id: 2, name: "Peace Lily", price: 399, category: "Indoor Plants", image: "https://seed2plant.in/cdn/shop/files/SPR-variegated-peace-lily-domino-7097188-hero-A-422d7faa152d42d3a4030ff8a2a33768.jpg?v=1692362762&width=416", quantity: 1 },
    { id: 3, name: "Money Plant", price: 199, category: "Indoor Plants", image: "https://rukminim2.flixcart.com/image/850/1000/k2urhjk0/plant-sapling/s/2/h/golden-money-plant-in-imported-plastic-pot-air-purifier-1-dr-original-imafm42nnbdpzrye.jpeg?q=90&crop=false", quantity: 1 },
    { id: 4, name: "Aloe Vera", price: 249, category: "Medicinal Plants", image: "https://m.media-amazon.com/images/I/81XWpVvk5AL._AC_UF1000,1000_QL80_.jpg", quantity: 1 },
    { id: 5, name: "Rose Plant", price: 349, category: "Flowering Plants", image: "https://rukminim2.flixcart.com/image/850/1000/kflftzk0/plant-sapling/c/c/m/red-rose-plant-rosa-multiflora-perennial-fragrant-1-m-original-imafwfy47hrnkcku.jpeg?q=90&crop=false", quantity: 1 },
    { id: 6, name: "Cactus", price: 199, category: "Succulents", image: "https://www.juneflowers.com/wp-content/uploads/2022/08/Cactus-Plant.jpg", quantity: 1 },
    { id: 7, name: "Bamboo Plant", price: 299, category: "Outdoor Plants", image: "https://himadriaquatics.b-cdn.net/wp-content/uploads/2022/02/Lucky-bamboo-plant-Dracaena-Sanderiana-Olive-Green.jpg", quantity: 1 },
    { id: 8, name: "Plant Food", price: 149, category: "Plant Care", image: "https://m.media-amazon.com/images/I/81G1+Et6aRL._AC_UF1000,1000_QL80_.jpg", quantity: 1 }
  ];

  const handleLogout = () => {
    navigateTo('/');
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowSidebar(false);
  };

  const filteredProducts = products.filter(product => 
    selectedCategory === 'All Plants' || product.category === selectedCategory
  );

  

  // Fixed addToCart function
  const addToCart = async (product) => {
    try {
      
      const existingItem = cart.find(item => item.id === product.id);
      let updatedCart;
      
      if (existingItem) {
        updatedCart = cart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        updatedCart = [...cart, { ...product, quantity: 1 }];
      }
      
      setCart(updatedCart);
      


      await axios.post('http://localhost:3003/cart', {
        username: username,
        pid: product.id,
        quantity: existingItem ? existingItem.quantity + 1 : 1,
        pname: product.name,
        price: product.price
      });


      
    } catch (error) {
      console.error('Error updating cart:', error);
      
    }


  };

  // Fixed updateQuantity function
  const updateQuantity = async (productId, delta) => {
    try {
      const updatedCart = cart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(0, item.quantity + delta);
          return newQuantity === 0 ? null : { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(Boolean);

      setCart(updatedCart);

      const item = updatedCart.find(item => item.id === productId);
      if (item) {
        await axios.post('http://localhost:3003/cart', {
          username: username,
          pid: item.id,
          quantity: item.quantity,
          pname: item.name,
          price: item.price
        });
      } else {
        // If item was removed (quantity = 0)
        await axios.delete(`http://localhost:3003/cart/${productId}`);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Fixed CartComponent with proper checkout handling
  const CartComponent = () => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryPerson = {
      name: "Shyam Raj",
      rating: 4.8,
      deliveryTime: "25-30 mins"
    };

    const handleCheckout = async () => {
      try {
        await axios.post('http://localhost:3003/checkout', {
          items: cart,
          totalAmount: total + 40, // Including delivery fee
          deliveryDetails: {
            address: 'Home',
            deliveryPerson: deliveryPerson
          }
        });
        
        // Clear cart after successful checkout
        setCart([]);
        setShowCart(false);
        // You might want to show a success message or redirect to a confirmation page
        
      } catch (error) {
        console.error('Error during checkout:', error);
        // Handle checkout error (show error message to user)
      }
    };

    return (
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-lg p-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <X className="cursor-pointer" onClick={() => setShowCart(false)} />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <MapPin size={20} />
            <span>Delivery to: Home</span>
          </div>
        
        {cart.length > 0 ? (
          <div className="space-y-4">
            {cart.map(item => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-1 rounded bg-gray-100"
                      onClick={() => updateQuantity(item.id, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      className="p-1 rounded bg-gray-100"
                      onClick={() => updateQuantity(item.id, 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
              
              <div className="mt-8 space-y-4">
                <h3 className="font-bold">Order Summary</h3>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹40</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total + 40}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h3 className="font-bold mb-2">Delivery Partner</h3>
                <div className="flex items-center gap-2">
                  <div>
                    <p className="font-medium">{deliveryPerson.name}</p>
                    <p className="text-sm text-gray-600">⭐ {deliveryPerson.rating} • {deliveryPerson.deliveryTime}</p>
                  </div>
                </div>
              </div>
            
            <button 
              className="w-full bg-green-600 text-white py-3 rounded-lg mt-4"
              onClick={handleCheckout}
            >
              Confirm Order
            </button>
            <button 
              className="w-full bg-gray-300 text-black py-3 rounded-lg mt-4"
              onClick={()=>navigateTo('/cart')}
            >
              Checkout
            </button>
          </div>
          
        ) : (
          <p className="text-center text-gray-500">Your cart is empty</p>
        )}
      </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
    {/* Navbar */}
    <nav className="bg-white shadow-sm fixed top-0 w-full z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Menu 
              className="cursor-pointer"
              onClick={() => setShowSidebar(!showSidebar)}
            />
            <span className="font-bold text-xl text-green-600">PlantStore</span>
          </div>
          
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for plants..."
                className="w-full px-4 py-2 rounded-lg bg-gray-100"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <User className="cursor-pointer" />
            <div className="relative cursor-pointer" onClick={() => setShowCart(true)}>
              <ShoppingCart />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>

    {/* Sidebar */}
    <div className={`fixed left-0 top-0 h-full bg-white w-64 shadow-lg transform transition-transform ${showSidebar ? 'translate-x-0' : '-translate-x-full'} z-50`}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Categories</h2>
            <X className="cursor-pointer" onClick={() => setShowSidebar(false)} />
          </div>
          <ul className="space-y-2">
            {categories.map(category => (
              <li 
                key={category} 
                className={`flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer ${selectedCategory === category ? 'bg-green-50 text-green-600' : ''}`}
                onClick={() => handleCategorySelect(category)}
              >
                {category}
                <ChevronRight size={20} className="text-gray-400" />
              </li>
            ))}
          </ul>
        </div>
        
        {/* Logout button at bottom of sidebar */}
        <div className="p-4 border-t">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>

    {/* Main Content */}
    <main className="max-w-7xl mx-auto px-4 pt-20">
      <h2 className="text-2xl font-bold my-6">{selectedCategory}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white p-4 rounded-lg shadow-sm">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="font-medium">{product.name}</h3>
            <p className="text-gray-600 mb-2">₹{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </main>
    {/* Footer */}
<footer className="bg-white mt-16 border-t">
<div className="max-w-7xl mx-auto px-4 py-8">
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* About Section */}
    
    <div>
    <img src={logo} style={{width: '150px', display: 'flex' ,flexDirection: 'row', }}></img>
      <h3 className="text-lg font-bold mb-4">PlantStore</h3>
      <p className="text-gray-600 text-sm">
        Your one-stop destination for all kinds of plants and gardening supplies. 
        Making your space greener, one plant at a time.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-bold mb-4">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <a href="#" className="text-gray-600 hover:text-green-600">About Us</a>
        </li>
        <li>
          <a href="#" className="text-gray-600 hover:text-green-600">Contact Us</a>
        </li>
        <li>
          <a href="#" className="text-gray-600 hover:text-green-600">Privacy Policy</a>
        </li>
        <li>
          <a href="#" className="text-gray-600 hover:text-green-600">Terms & Conditions</a>
        </li>
      </ul>
    </div>

    {/* Customer Service */}
    <div>
      <h3 className="text-lg font-bold mb-4">Customer Service</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <a href="#" className="text-gray-600 hover:text-green-600">Shipping Policy</a>
        </li>
        <li>
          <a href="#" className="text-gray-600 hover:text-green-600">Return Policy</a>
        </li>
        <li>
          <a href="#" className="text-gray-600 hover:text-green-600">FAQ</a>
        </li>
        <li>
          <a href="#" className="text-gray-600 hover:text-green-600">Track Order</a>
        </li>
      </ul>
    </div>

    {/* Contact Info */}
    <div>
      <h3 className="text-lg font-bold mb-4">Contact Us</h3>
      <ul className="space-y-2 text-sm text-gray-600">
        <li>Email: heet.shah123@spit.ac.in</li>
        <li>Phone: +91 1234567890</li>
        <li>Address: Bhavans Campus,</li>
        <li>Andheri City, 560001</li>
      </ul>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="mt-8 pt-8 border-t">
    <div className="flex flex-col md:flex-row justify-between items-center">
       
      <p className="text-sm text-gray-600">
        © 2024 PlantStore. All rights reserved.
      </p>
      {/* Social Media Links */}
      <div className="flex space-x-6 mt-4 md:mt-0">
        <a href="#" className="text-gray-600 hover:text-green-600">
          Facebook
        </a>
        <a href="#" className="text-gray-600 hover:text-green-600">
          Twitter
        </a>
        <a href="#" className="text-gray-600 hover:text-green-600">
          Instagram
        </a>
        <a href="#" className="text-gray-600 hover:text-green-600">
          Pinterest
        </a>
      </div>
    </div>
  </div>
</div>
</footer>

    {/* Cart Sidebar */}
    {showCart && <CartComponent />}
  </div>
  );
};

export default PlantStore;
