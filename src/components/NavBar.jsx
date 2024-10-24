import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUser, FaShoppingCart } from "react-icons/fa";
import { LoginContext } from "../context/Login/Login";

import Search from "./Search";

function MainNavBar() {
  const [dis, setDis] = useState(false);
  const [dis1, setDis1] = useState(false);
  const [showS, setShowS] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const accountMenuRef = useRef(null);

  const isActive = (path) => location.pathname === path;
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, isLoggedIn, logout, cartCount, userCart, getUserCart } =
    useContext(LoginContext);

  const toggleAccountMenu = () => {
    setShowAccountMenu((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
  };

  let width = useWindowDimensions();

  useEffect(() => {
    if (width.width > 768) {
      setDis1(false);
      setDis(false);
    } else {
      setDis1(true);
    }
  }, [width]);

  useEffect(() => {
    setDis(false);
    setShowS(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountMenuRef.current &&
        !accountMenuRef.current.contains(event.target)
      ) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //   get cart count
  useEffect(() => {
    getUserCart();
  }, [isLoggedIn]);

  return (
    <>
      <nav className=" bg-blue-50 flex justify-between gap-[20px] py-[20px] px-[20px] items-center h-24">
        <img src={`${import.meta.env.BASE_URL}da logo.png`} className="w-32" />
        <ul className={"hidden md:flex justify-between gap-[30px] "}>
          <li>
            <Link
              to="/"
              className={
                isActive("/")
                  ? "text-primary-hover"
                  : "hover:animate-colorTravel"
              }
            >
              Home
            </Link>
          </li>

          <li>
            <Link
              to="/menu"
              className={isActive("/menu") ? "text-primary-hover" : ""}
            >
              Menu
            </Link>
          </li>
          {admin && (
            <li>
              <Link
                to="/dash"
                className={isActive("/services") ? "text-primary-hover" : ""}
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        <div className="w-[30%]">
          <div className="btnsGroup ml-auto flex gap-[20px] justify-end items-center ">
            <button onClick={() => setShowS(!showS)}>
              <i className="fa-solid fa-magnifying-glass hover:text-primary-hover"></i>
            </button>

            {isLoggedIn ? (
              <>
                <Link to="/cart">
                  <div className="shoppingCart relative">
                    <FaShoppingCart className="" />
                    <div className="absolute top-[-14px] right-[-10px] rounded-full font-light px-1 text-sm bg-red-400 text-white">
                      {cartCount}
                    </div>
                  </div>
                </Link>

                <div className="relative" ref={accountMenuRef}>
                  <button
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-orange-500  transition duration-200 ease-in-out"
                    onClick={toggleAccountMenu}
                  >
                    <FaUser className="text-md" />
                  </button>

                  {/* Account menu dropdown */}
                  {showAccountMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <Link
                        to="/account/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Account Info
                      </Link>
                      <Link
                        to="/account/saved-addresses"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Saved Addresses
                      </Link>
                      <Link
                        to="/account/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login">
                <button className="flex items-center gap-2 rounded-full px-4 py-2 bg-orange-500 text-white hover:bg-orange-600 transition duration-200 ease-in-out">
                  <FaUser className="text-sm" /> Login
                </button>
              </Link>
            )}
          </div>
        </div>

        <button onClick={() => setDis(!dis)}>
          <i className="fa-solid fa-bars md:hidden"></i>
        </button>
      </nav>

      {showS && !dis && <Search />}

      {dis1 && (
        <div className="relative">
          {dis && (
            <div className="absolute bg-black z-50 w-screen h-screen -top-[100px] bg-opacity-50 flex justify-end">
              <div className="bg-white w-1/2">
                <ul
                  className={
                    "flex gap-[50px] flex-col items-center p-10 h-screen align-middle"
                  }
                >
                  <button onClick={() => setDis(false)} className="self-end">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  {showS && dis && <Search />}
                  <li>
                    <Link
                      to="/"
                      className={isActive("/") ? "text-primary-hover" : ""}
                    >
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link
                      to="/menu"
                      className={isActive("/menu") ? "text-primary-hover" : ""}
                    >
                      Menu
                    </Link>
                  </li>
                  {admin && (
                    <li>
                      <Link
                        to="/dash"
                        className={
                          isActive("/services") ? "text-primary-hover" : ""
                        }
                      >
                        Dashboard
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default MainNavBar;
