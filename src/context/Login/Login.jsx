import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const LoginContext = createContext();

import { toast } from "react-toastify";
function LoginProvider({ children }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [userName, setUserName] = useState("");
  const [admin, setAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userOpject, setUserOpject] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [userAddress, setUserAddress] = useState([]);
  const [refresh, setSrefresh] = useState(false);
  const [category, setCategories] = useState([]);

  const userID = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [userCart, setUserCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState();
  const [publicId, setPublicId] = useState([]);
  const [favouritList, setFavouriteList] = useState([]);
  const [catchng, setCatchng] = useState([]);
  const [showItems, setShowItems] = useState([]);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUserOpject(userData);

    if (userID && token) {
      setIsLoggedIn(true);
      setAdmin(userData?.role === "Admin");
    }
  }, [userID, token]);
  //geet user address
  const getUserAddress = async () => {
    try {
      const response = await axios.get(`${backendUrl}address`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      if (response.status === 200) {
        setUserAddress(response.data?.addresses || []);
      } else {
        setUserAddress([]);
      }
    } catch (error) {
      // toast.warning(error.message);
    }
  };
  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${backendUrl}category`);
      if (response.status === 200) {
        setCategories(response.data?.categories || []);
      } else {
        setCategories([]);
      }
    } catch (error) {
      toast.warning(error.message);
    }
  };

  const login = (name) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  const logout = () => {
    setUserName("");
    setUserOpject(null);
    setAdmin(false);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setCartCount(0);
  };

  const isAdmin = () => {
    setAdmin(false);
  };
  const getUserCart = async () => {
    try {
      const response = await axios.get(`${backendUrl}cart`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      if (response.status === 200 && response.data?.cart?.cart) {
        const cartData = response.data.cart.cart;
        if (cartData.length > 0) {
          setUserCart(cartData);
          setCartCount(cartData.length);
          calculateTotalCartPrice();
          return;
        }
      } else {
        setUserCart([]);
        setCartCount(0);
        return;
      }
    } catch (error) {
      return setUserCart([]);
    }
  };
  const calculateTotalCartPrice = () => {
    let total = 0;
    userCart.forEach((item) => {
      total += item.totalPrice;
    });
    setTotalPrice(total);
  };
  const getCartCount = () => {
    if (userCart.length) {
      return setCartCount(userCart.length);
    }
    return setCartCount(0);
  };
  const removeMealFromCart = async (mealId) => {
    try {
      const response = await axios.delete(`${backendUrl}cart/${mealId}`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      if (response.status === 200) {
        const cartData = response.data.cart.cart;
        setCartCount(cartData.length);
        setUserCart(cartData);
        toast.warning("Meal removed from cart");
      } else {
        throw new Error(
          "error occured when removing item from cart  pleaze try again"
        );
      }
    } catch (error) {
      toast.error("Error removing from cart:", error.message);
    }
  };
  // increae or decress meal in cart
  const addToCart = async (mealId, quantity) => {
    try {
      const response = await axios.post(
        `${backendUrl}cart/update`,
        { itemId: mealId, count: quantity },
        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const cartData = response.data.cart.cart;
        setCartCount(cartData.length);
        setUserCart(cartData);
      } else {
        throw new Error(
          "error occured when adding item to cart  pleaze try again"
        );
      }
    } catch (error) {
      toast.error("Error processing cart:", error.message);
    }
  };
  const removeAllCartMeals = async () => {
    try {
      const response = await axios.delete(`${backendUrl}cart/clear`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      if (response.status === 200) {
        setCartCount(0);
        setUserCart([]);
        toast.warning("All items removed from cart");
      } else {
        throw new Error(
          "error occured when removing all cart items pleaze try again"
        );
      }
    } catch (error) {
      toast.error("Error removing all cart items:", error.message);
    }
  };

  // get user favourite
  const getAllFavourit = async () => {
    try {
      const response = await axios.get(`${backendUrl}menu/favourite`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      if (response.status === 200) {
        setFavouriteList(response.data.user.favourite);
      } else {
        setFavouriteList([]);
        throw new Error("No favourites found");
      }
    } catch (error) {
      // toast.error("Error getting all favourites:", error.message);
    }
  };
  return (
    <LoginContext.Provider
      value={{
        userID,
        userName,
        login,
        logout,
        admin,
        token,
        isLoggedIn,
        getAllCategories,
        category,
        userOpject,
        setUserOpject,
        setAdmin,
        getUserCart,
        userCart,
        cartCount,
        getCartCount,
        setUserCart,
        setCartCount,
        removeMealFromCart,
        totalPrice,
        setTotalPrice,
        addToCart,
        removeAllCartMeals,
        calculateTotalCartPrice,
        getAllFavourit,
        favouritList,
        setFavouriteList,
        getUserAddress,
        userAddress,
        setUserAddress,
        setIsLoggedIn,
        publicId,
        setPublicId,
        refresh,
        setSrefresh,
        catchng,
        setCatchng,
        showItems,
        setShowItems,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;
