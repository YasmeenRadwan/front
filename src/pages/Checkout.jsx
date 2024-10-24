import Payment from "../components/Payment";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//! change the id to the actual order id

import { useState, useContext, useEffect } from "react";
import { LoginContext } from "../context/Login/Login";
import Spinner from "../components/Spinner";
import NewAddressBtn from "../components/Addresses/NewAddressBtn";
import RadioBtns from "../components/Addresses/RadioBtns";
const Checkout = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const {
    getUserCart,
    userCart,
    totalPrice,
    calculateTotalCartPrice,
    token,
    setUserCart,
    setCartCount,
    setTotalPrice,
  } = useContext(LoginContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userAddress, setUserAddress] = useState([]);
  const [showPaymentBtns, setShowPaymentBtns] = useState(false);
  const [selectAddress, setSelectAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("cash");
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] =
    useState("pickup");
  const [displayAddress, setDisplayAddress] = useState(false);
  const [contactPhone, setContactPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [orderId, setOrderId] = useState(0);
  const [comment, setComment] = useState("");
  const [savingData, setSavingData] = useState(false);
  useEffect(() => {
    if (selectedDeliveryMethod == "delivery") {
      setDisplayAddress(true);
    } else {
      setDisplayAddress(false);
    }
  }, [selectedDeliveryMethod]);

  const handleSelectedMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };
  const handleSelectedDeliveryChange = (e) => {
    setSelectedDeliveryMethod(e.target.value);
  };
  const orderDetails = {
    items: userCart,
    totalAmount: () => {
      let total = 0;
      userCart.forEach((item) => (total += item.totalPrice));
      return total;
    }, // Total Price of the Cart Items
    currency: "EGP", // Can be dynamic
  };

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        await getUserCart();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.warning("Error fetching cart data", error.message);
      }
    };

    fetchCart();
  }, []);

  // calculate total price
  useEffect(() => {
    calculateTotalCartPrice();
  }, [userCart]);
  useEffect(() => {
    getUserAddresses();
  }, []);
  const ValidatePhoneNumber = () => {
    const phoneRegex = /^01[0-2,5][0-9]{8}$/;
    if (!phoneRegex.test(contactPhone)) {
      setPhoneError("pleaze Enter Valid Phone Number");
      return false;
    } else {
      setPhoneError("");
      return true;
    }
  };
  const resetFields = () => {
    setContactPhone("");
    setUserAddress("");
    setComment("");
  };
  const completePlaceOrder = async () => {
    //validate phone number
    if (!ValidatePhoneNumber(contactPhone)) return;
    //specialInstructions
    const orderData = {
      contactNumber: contactPhone,
      addressId: selectAddress,
      paymentMethod: selectedMethod,
      deliveryOption: selectedDeliveryMethod,
      specialInstructions: comment,
    };
    // Make API call to save the order data
    try {
      setSavingData(true);
      const response = await axios.post(`${backendUrl}order/`, orderData, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      console.log(response);
      if (response.status === 200) {
        setSavingData(false);
        toast.success("Order placed successfully");
        // Optionally, you could reset the state or redirect the user here
        if (selectedMethod == "card") {
          setShowPaymentBtns(true);
          setOrderId(response.data.order._id);
        } else {
          setShowPaymentBtns(false);
          setUserCart([]);
          setCartCount(0);
          setTotalPrice(0);
          navigate(`/account/orders`);
        }
        resetFields();
      } else {
        toast.error("Error Placing Order", response.data.error);
      }
    } catch (error) {
      toast.error("Error Placing Order", error.message);
    }
  };

  //get user Adresses
  const getUserAddresses = async () => {
    const response = await axios.get(`${backendUrl}address`, {
      headers: {
        token: `resApp ${token}`,
      },
    });
    if (response.status == 200) {
      setUserAddress(response.data.addresses);
      setSelectAddress(response.data.addresses[0]._id);
    }
  };
  return (
    <div className="checkout-container mx-auto px-4 py-8 w-[90%] lg:w-[50%]">
      <h1 className="text-3xl font-semibold mb-8 text-center">Checkout</h1>

      {/* Order Summary */}
      <div className="order-summary p-4 mb-6 bg-gray-100 rounded-md shadow-lg z-50">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {loading ? (
          <Spinner />
        ) : (
          <div className="orderData">
            <ul className="order-items-list mb-4">
              {orderDetails.items.map((item, index) => (
                <li
                  key={item.menuItem?._id || index}
                  className="flex justify-between mb-2"
                >
                  <span>{item.menuItem?.name}</span>
                  <span>LE {item.menuItem?.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>LE {totalPrice}</span>
            </div>
          </div>
        )}
        {!showPaymentBtns && !loading && (
          <div className="requiredData">
            <h3 className="h3 my-5">Required Data</h3>
            {/* contact phone Number */}
            {/* Phone number input */}
            <div className="mb-4">
              <label
                htmlFor="contactPhone"
                className="text-lg font-semibold mb-4"
              >
                Contact Phone
              </label>
              <input
                type="tel"
                id="contactPhone"
                className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm focus:outline-none focus:border-indigo-600"
                placeholder="Enter your phone number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                required
              />
              <p className="text-red-500">{phoneError}</p>
            </div>
            {/* payment method */}
            <RadioBtns
              selected={selectedMethod}
              setSelected={setSelectedMethod}
              handleChange={handleSelectedMethodChange}
              header="payment"
              data={[
                { value: "cash", label: "Cash on Delivery" },
                { value: "card", label: "pay with card" },
              ]}
            />
            {/* delivery Option */}
            <RadioBtns
              selected={selectedDeliveryMethod}
              setSelected={setSelectedDeliveryMethod}
              handleChange={handleSelectedDeliveryChange}
              header="Delivery"
              data={[
                { value: "delivery", label: "Delivery" },
                { value: "pickup", label: "pickup" },
              ]}
            />

            {/* address section */}
            {displayAddress && (
              <div className={`${displayAddress ? "block" : "none"}`}>
                <div className="relative w-full lg:max-w-sm">
                  <select
                    className="w-full p-2.5 text-gray-500 bg-white border rounded-md 
                shadow-sm outline-none appearance-none focus:border-indigo-600"
                    value={selectAddress}
                    onChange={(e) => {
                      setSelectAddress(e.target.value);
                    }}
                  >
                    {userAddress.map((address) => (
                      <option key={address._id} value={address._id}>
                        {address.street}, {address.city}, {address.country}
                      </option>
                    ))}
                  </select>
                </div>
                <NewAddressBtn
                  setUserAddress={setUserAddress}
                  userAddress={userAddress}
                />
              </div>
            )}

            {/* Comments section */}
            <div className="mt-4">
              <label htmlFor="comments" className="text-lg font-semibold mb-4">
                Comments
              </label>
              <textarea
                id="comments"
                name="comments"
                rows="4"
                className="mt-1 p-2.5 w-full shadow-sm border rounded-md"
                placeholder="Add any special instructions or comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button
              onClick={completePlaceOrder}
              className={`w-full p-2.5 text-white bg-indigo-600 
                rounded-md shadow-sm hover:bg-indigo-700 
                focus:outline-none ${savingData ? "cursor-not-allowed" : "cursor-pointer"}`}
              disabled={savingData}
            >
              Place Order {showPaymentBtns && "Complete Payment"}
            </button>
          </div>
        )}
      </div>

      {/* PayPal Section */}
      {showPaymentBtns && (
        <div className="z-10">
          <Payment orderId={orderId} />
        </div>
      )}
    </div>
  );
};

export default Checkout;
