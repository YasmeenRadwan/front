import { Link } from "react-router-dom";
import { FaClipboardUser, FaMapLocationDot, FaCartShopping } from "react-icons/fa6";

function Sidebar() {
  return (
    <div className="drawer-side border-l border-gray-300 bg-white">
      <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
        <li className="mb-4 hover:bg-gray-100 transition duration-200 rounded-lg">
          <Link
            to="/account/profile"
            className="flex items-center p-2 space-x-2"
          >
            <FaClipboardUser className="text-lg" />
            <span>Account Info</span> 
          </Link>
        </li>
        <li className="mb-4 hover:bg-gray-100 transition duration-200 rounded-lg">
          <Link
            to="/account/saved-addresses"
            className="flex items-center p-2 space-x-2"
          >
            <FaMapLocationDot className="text-lg" />
            <span>Saved Addresses</span> 
          </Link>
        </li>
        <li className="hover:bg-gray-100 transition duration-200 rounded-lg">
          <Link
            to="/account/orders"
            className="flex items-center p-2 space-x-2"
          >
            <FaCartShopping className="text-lg" />
            <span>Orders</span> 
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
