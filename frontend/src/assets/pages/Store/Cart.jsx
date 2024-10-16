import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
//import ItemCard from "./ItemCard"; // Assuming you have an ItemCard component
import Spinner from "../../components/Spinner"; // Assuming you have a Spinner component
//import ItemCard from "./ItemCard"; // Assuming you have an Hcard component
import NavBar from './../Navbar/Navbar'
import Footer from './../footer/Footer'

const Cart = () => {
  const { Name } = useParams(); // Extract CusID from route parameters
  const [cartItems, setCartItems] = useState([]);
  const [store, setStore] = useState([]);
  const [total, setTotal] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8077/Store')
      .then((response) => {
        const data = response.data;
        if (Array.isArray(data)) {
          setStore(data);
        } else {
          console.warn('Data is not an array:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching store data:', error);
      })
      .finally(() => setLoading(false));

    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cartData);
    calculateTotal(cartData);
  }, [Name]);

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((acc, item) => acc + item.Price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const handleIncreasequantity = (Name) => {
    const updatedCart = cartItems.map((item) =>
      item.Name === Name ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleDecreasequantity = (Name) => {
    const updatedCart = cartItems.map((item) =>
      item.Name === Name && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const handleApplyPromo = () => {
    if (promoCode === "WASANA") {
      setDiscount(total * 0.1);
    } else {
      setDiscount(0);
      Swal.fire({
        title: 'Invalid promo code!',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleCheckout = () => {
    const checkoutData = {
      userId: Name,
      items: cartItems,
      total: total - discount, // Ensure total is calculated correctly
    };
    navigate(`/Checkout/${Name}`, { state: checkoutData });
  };

  const handleRemoveItem = (Name) => {
    const updatedCart = cartItems.filter(item => item.Name !== Name);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const recommendedItems = store.filter(
    (item) => !cartItems.some((cartItem) => cartItem.Name === item.Name)
  );

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="">
      <NavBar/>
    <div className="min-h-screen p-8 flex flex-col items-center bg-white">
      <div className="w-full lg:w-3/4 flex flex-col lg:flex-row space-y-6 lg:space-y-0 lg:space-x-10">
        <div className="w-full lg:w-2/3 space-y-6">
          <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item.Name} className="flex items-center justify-between p-4 border-b">
                <img src={item.photoURL} alt={item.Name} className="w-16 rounded" />
                <div className="flex-1 px-4">
                  <h3 className="text-xl font-semibold">{item.Name}</h3>
                  <p className="text-gray-600">Price: Rs.{item.SPrice}</p>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleDecreasequantity(item.Name)}
                      className="text-gray-500 border px-2 rounded hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span>quantity: {item.quantity}</span>
                    <button
                      onClick={() => handleIncreasequantity(item.Name)}
                      className="text-gray-500 border px-2 rounded hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-gray-800 font-semibold">
                    Total: Rs.{(item.Price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.Name)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
        </div>

        <div className="w-full lg:w-1/3 p-6 bg-gray-100 rounded-lg space-y-4">
          <h2 className="text-2xl font-semibold">Order Summary</h2>
          {discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>Rs.{discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Total:</span>
            <span>Rs.{(total - discount).toFixed(2)}</span>
          </div>
          <input
            type="text"
            placeholder="Promo Code"
            className="w-full p-2 border rounded"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
          />
          <button
            onClick={handleApplyPromo}
            className="w-full bg-green-500 text-white py-2 rounded-full hover:bg-green-600 transition duration-300"
          >
            Apply Promo Code
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 rounded-full hover:bg-red-600 transition duration-300"
            onClick={handleCheckout}
          >
            Checkout
          </button>
        </div>
      </div>

      <div className="w-full lg:w-2/3 mt-16">
        <h2 className="text-2xl font-semibold mb-4">Recommended for You</h2>
        <div className="overflow-x-hidden whitespace-nowrap mb-5">
          {/* <div className="flex space-x-4 animate-marquee">
            {recommendedItems.length > 0 ? (
            //   <div className="flex flex-wrap gap-8 justify-center">
            //     {recommendedItems.map((item) => (
            //     //   <ItemCard
            //     //     key={item.Name}
            //     //     ItemNo={item.ItemNo}
            //     //     image={item.image}
            //     //     Name={item.Name}
            //     //     SPrice={item.SPrice}
            //     //     CusID={CusID} // Pass CusID to the Hcard component
            //     //   />
            //     )
            //     )}
            //   </div>
            ) : (
              <div>No recommended items found</div>
            )}
          </div> */}
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default Cart;
