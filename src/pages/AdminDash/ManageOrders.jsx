import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { LoginContext } from "../../context/Login/Login";
import OrderCard from "./OrederCard";

function ManageOrders() {
  const [allOrders, setAllOrders] = useState([]);
  const { token } = useContext(LoginContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const allCato = async () => {
      try {
        const response = await axios.get(`${backendUrl}order/admin`, {
          headers: {
            token: `resApp ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data.orders)) {
          setAllOrders(response.data.orders);
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    allCato();
  }, []);

  return (
    <div>
      {allOrders.length ? (
        allOrders.map((order) => <OrderCard key={order._id} order={order} />)
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default ManageOrders;
