import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { IoIosArrowBack } from "react-icons/io";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Rating,
} from "@mui/material";
import axios from "axios";
import { LoginContext } from "../context/Login/Login";

function OrderSummary({ order, onBack }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { token } = useContext(LoginContext);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewContent, setReviewContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setReviewTitle("");
    setReviewContent("");
    setRating(0);
  };

  const handleSubmit = async () => {
    const reviewData = {
      itemId: selectedItem.menuItem._id,
      rating: rating,
      title: reviewTitle,
      text: reviewContent,
    };

    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}review`, reviewData, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      console.log("Review submitted successfully:", response.data);
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={onBack}
        className="mb-4 text-orange-500 rounded flex items-center gap-2 transition-colors duration-300 hover:text-orange-400"
      >
        <IoIosArrowBack className="transition-colors duration-300 hover:text-orange-400" />
        Back to Orders
      </button>

      <h1 className="text-3xl font-bold mb-6">Order Summary</h1>
      <p className="mb-6">
        Find order invoice, payment, and shipping details here
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 p-4 border rounded-lg shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2 break-words">
              Order ID {order._id}
            </h2>
            {order.orderStatus && (
              <p
                className={`text-lg font-semibold mb-2 
                ${
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
            )}
            <p className="text-sm text-gray-500">
              Order placed on: {new Date(order.updatedAt).toLocaleString()}
            </p>
            {order.orderStatus.trim().toLowerCase() === "delivered" &&
              order.updatedAt && (
                <p className="text-sm text-gray-500">
                  Delivered on: {new Date(order.updatedAt).toLocaleString()}
                </p>
              )}
          </div>

          <h3 className="text-lg font-bold mb-4">Delivery Details</h3>
          <p className="text-sm text-gray-500 mb-4">
            Delivery Option: {order.deliveryOption}
          </p>

          <ul className="space-y-4">
            {order.menuItems.map((item, index) => (
              <li key={index} className="flex gap-4 items-start border-b pb-4">
                <img
                  src={item.menuItem.image.secure_url}
                  alt={item.menuItem.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex flex-col justify-between">
                  <p className="font-bold text-lg">{item.menuItem.name}</p>
                  <p className="text-gray-500 mb-2">
                    {item.menuItem.description}
                  </p>
                  <p>
                    Quantity: {item.quantity} | Price:{" "}
                    {item.menuItem.price.toFixed(2)} LE
                  </p>
                  {order.orderStatus.trim().toLowerCase() === "delivered" && (
                    <button
                      className="text-orange-500 hover:underline"
                      onClick={() => handleOpen(item)}
                    >
                      Add Review
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold">
            Total Price: {order.total.toFixed(2)} LE
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 border rounded-lg shadow-lg">
            <h3 className="text-lg break-words font-bold mb-4">
              Delivery address{" "}
            </h3>
            <p className="break-words">{`${order.userId.firstName} ${order.userId.lastName}`}</p>
            {order.deliveryOption === "delivery" && order.address ? (
              <p>
                Address:{" "}
                {`${order.address.addressLabel}, Building ${order.address.buildingNumber}, Floor ${order.address.floorNumber}, ${order.address.city}, ${order.address.country}`}
              </p>
            ) : (
              <p>Pickup Order</p>
            )}
            <p className="break-words">{order.contactNumber}</p>
          </div>

          <div className="p-3 border rounded-lg shadow-lg">
            <h4 className="font-bold mb-2">Payment Method:</h4>
            <p>{order.paymentMethod}</p>
            <p>Total: {order.total.toFixed(2)} LE</p>
          </div>

          <div className="p-3 border rounded-lg shadow-lg">
            <h4 className="font-bold mb-2">Fees and Charges:</h4>
            <p>Subtotal: {order.subTotal.toFixed(2)} LE</p>
            <p>Delivery Fee: {order.deliveryFee.toFixed(2)} LE</p>
            <p>Total: {order.total.toFixed(2)} LE</p>
          </div>
        </div>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Review</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <>
              <img
                src={selectedItem.menuItem.image.secure_url}
                alt={selectedItem.menuItem.name}
                className="w-24 h-24 object-cover rounded-md mb-4"
              />
              <p className="font-bold mb-4">{selectedItem.menuItem.name}</p>
            </>
          )}
          <Rating
            name="item-rating"
            value={rating}
            precision={0.5}
            onChange={(event, newValue) => setRating(newValue)}
          />
          <TextField
            label="Title"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Review"
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

OrderSummary.propTypes = {
  order: PropTypes.object.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default OrderSummary;
