import { useState, useEffect, useContext } from "react";
import axios from "axios";
import OrderSummary from "../components/OrderSummary";
import { LoginContext } from "../context/Login/Login";
// import { useSocket } from "../context/socket/socket";
import { toast } from "react-toastify";
function Orders() {
  // const { orderStatus } = useSocket();
  const { token } = useContext(LoginContext);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}order`, {
          headers: {
            token: `resApp ${token}`,
          },
        });

        if (response.data && response.data.orders) {
          setOrders(response.data.orders);
        } else {
          setError("No orders found");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      getOrders();
    }
  }, [token]);

  // useEffect(() => {
  //   if (orderStatus) {
  //     setOrders((prevOrders) =>
  //       prevOrders.map((order) => {
  //         if (order.status === "Canceled") {
  //           toast.warning('order have cancelled')
  //         }
  //         return order._id === orderStatus.orderId
  //           ? { ...order, status: orderStatus.status }
  //           : order;
  //       })
  //     );
  //   }
  // }, [orderStatus]);
  const fetchOrderDetails = async (orderId) => {
    console.log("Fetching details for order:", orderId);
    try {
      const response = await axios.get(`${backendUrl}order/${orderId}`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      return response.data.order;
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("Failed to fetch order details.");
      return null;
    }
  };

  const handleOrderClick = async (order) => {
    const orderDetails = await fetchOrderDetails(order._id);
    if (orderDetails) {
      setSelectedOrder(orderDetails);
    }
  };

  const handleBack = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="loader">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="p-4">
      {selectedOrder ? (
        <OrderSummary order={selectedOrder} onBack={handleBack} />
      ) : (
        <div className="grid grid-cols-1 gap-4 cursor-pointer">
          {orders.map((order) => (
            <div
              key={order._id}
              className="relative flex items-center w-full p-2 border rounded-lg shadow-lg hover:bg-gray-100 transition mx-auto"
              onClick={() => handleOrderClick(order)}
            >
              <img
                src={order.menuItems[0].menuItem.image.secure_url}
                alt={order.menuItems[0].menuItem.name}
                className="w-16 h-16 object-cover rounded-md mr-3"
              />
              <div className="flex-grow">
                <h3 className="text-sm font-bold">
                  On {new Date(order.updatedAt).toLocaleString()}
                </h3>
                <p
                  className={`text-xs ${
                    order.orderStatus.trim().toLowerCase() === "delivered"
                      ? "text-green-600"
                      : order.orderStatus.trim().toLowerCase() === "canceled"
                        ? "text-red-600"
                        : order.orderStatus.trim().toLowerCase() === "pending"
                          ? "text-yellow-600"
                          : "text-gray-500"
                  }`}
                >
                  {order.orderStatus}
                </p>
                <p className="text-sm font-bold mt-1">
                  Total: {order.total.toFixed(2)} LE
                </p>
              </div>
              <p className="absolute bottom-2 right-2 text-xs text-gray-600 w-24 truncate">
                Order ID: {order._id}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;
