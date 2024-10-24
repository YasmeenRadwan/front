import React, { useState, useContext } from "react";
import axios from "axios";
import { LoginContext } from "../../context/Login/Login";
const OrderCard = ({ order }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [orderStatus, setOrderStatus] = useState(order.orderStatus);
  const { token } = useContext(LoginContext);
  const handleStatusChange = (e) => {
    setOrderStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      await axios.patch(
        `${backendUrl}order/admin/${order._id}`,
        { status: orderStatus },
        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );
      console.log("Order status updated successfully.");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  console.log(order.menuItems);

  return (
    <div className="border border-orange-300 shadow-md p-4 mb-4 rounded">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Order ID: {order._id}</h2>
          <p>
            Customer: {order.userId.firstName} {order.userId.lastName}
          </p>
          <p>Contact: {order.contactNumber}</p>
          <p>
            Status:
            <select
              value={orderStatus}
              onChange={handleStatusChange}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {[
                "pending",
                "confirmed",
                "placed",
                "preparing",
                "cancelled",
                "on the way",
                "delivered",
              ].map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </p>
        </div>
        <button
          onClick={handleUpdateStatus}
          className="bg-orange-500 text-white mx-auto py-2 rounded flex items-center justify-center mt-2"
        >
          Update Status
        </button>
      </div>
      <h3 className="mt-4 font-semibold">Ordered Items:</h3>
      <div className="grid grid-cols-1 gap-4">
        {order.menuItems.map((item) =>
          item.menuItem ? (
            <div
              key={item._id}
              className="border border-gray-200 shadow-sm p-2 rounded"
            >
              <img
                src={item.menuItem.image.secure_url}
                alt={item.menuItem.name}
                className="w-20 h-20 object-cover"
              />
              <div>
                <p className="font-semibold">{item.menuItem.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total Price: ${item.totalPrice}</p>
              </div>
            </div>
          ) : (
            <div>loding</div>
          )
        )}
      </div>
      <p className="mt-4 text-center text-sm">Total: ${order.total}</p>
    </div>
  );
};

export default OrderCard;
