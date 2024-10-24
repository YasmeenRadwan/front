import "./App.css";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import Home from "./pages/HomeView";
import About from "./pages/AboutView";
import Layout from "./pages/Layout";
import LoginProvider from "./context/Login/Login";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminDash from "./pages/AdminDash/AdminDash";
import Usres from "./pages/AdminDash/Usres";
import Manue from "./pages/AdminDash/MangeItems";
import ManageItem from "./pages/AdminDash/Managecatogory";
import ManageOrders from "./pages/AdminDash/ManageOrders";
import MenuView from "./pages/MenuView";
import MealDetail from "./pages/MealDetail";
import Profile from "./pages/Profile";
import AccountView from "./pages/AccountView";
import SavedAddresses from "./pages/SavedAddresses";
import Orders from "./pages/Orders";
// import OrderSummary from "./components/OrderSummary";
import ForgetPassword from "./pages/ForgetPass";
import Checkout from "./pages/Checkout";
// toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cart from "./pages/Cart";
import { SocketProvider } from "./context/socket/socket";
function App() {
  return (
    <SocketProvider>
      <LoginProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="forgot-password" element={<ForgetPassword />} />

              {/* Admin dashboard */}
              <Route path="dash" element={<AdminDash />}>
                <Route index element={<Usres />} />
                <Route path="Manue" element={<Manue />} />
                <Route path="orders" element={<ManageOrders />} />
                <Route path="catogory" element={<ManageItem />} />
              </Route>
              {/* Account section */}
              <Route path="account" element={<AccountView />}>
                <Route path="profile" element={<Profile />} />
                <Route path="saved-addresses" element={<SavedAddresses />} />
                <Route path="orders" element={<Orders />} />
              </Route>
              {/* menu section */}
              <Route path="/menu" element={<Navigate to="/menu/all" />} />
              {/* Route based on category */}
              <Route path="/menu/:category" element={<MenuView />} />
              <Route path="menu/:category/:mealName" element={<MealDetail />} />

              {/* cart Route */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>
          </Routes>
          {/* Add ToastContainer */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </BrowserRouter>
      </LoginProvider>
    </SocketProvider>
  );
}

export default App;
