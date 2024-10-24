import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { LoginContext } from "../../context/Login/Login";
import { toast } from 'react-toastify';

function ChangeItems({
  setShowCay,
  catchng,
  item,
  setCatC,
  publicId,
  refresh,
  setCatchng,
  setSrefresh,
}) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [_id, setId] = useState(item._id);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(1);
  const [categoryId, setCategoryId] = useState("");
  const [available, setAvailable] = useState("");
  const [orderedTimes, setOrderedTimes] = useState("");
  const [averageRating, setAverageRating] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const { token } = useContext(LoginContext);

  function handle() {
    setShowCay(true);
    setCatchng([]);
    setSrefresh(!refresh);
  }

  useEffect(() => {
    if (JSON.stringify(item).length > 3 && item) {
      setPrice(item.price);
      setAvailable(item.available);
      setOrderedTimes(item.orderedTimes);
      setCategoryId(item.categoryId);
      setAverageRating(item.averageRating);
      setIngredients(item.ingredients || []);
      setImageUrl(item.image.secure_url);
      setName(item.name);
    }
  }, [item, publicId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleIngredientsChange = (e) => {
    const inputValue = e.target.value;
    const ingredientsArray = inputValue
      .split(",")
      .map((ingredient) => ingredient.trim());
    setIngredients(ingredientsArray);
    console.log(ingredients);
  };

  async function handleDelete(e) {
    e.preventDefault();
    try {
      const response = await axios.delete(`${backendUrl}menu/${item._id}`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      toast.success("Item deleted successfully!");
    } catch (error) {
      if (error.message === "Request failed with status code 404") 
        toast.error("Error deleting item. Please try again.");
      return [];
    }
  }

  async function update(e) {
    e.preventDefault();
    setAvailable(available === "true" ? true : false);
    const formData = new FormData();

    if (JSON.stringify(item).length > 3) {
      if (image) formData.append("image", image);

      formData.append("name", name);
      formData.append("price", price);
      formData.append("available", available);
    } else {
      formData.append("image", image);
      formData.append("name", name);
      formData.append("price", price);
      formData.append("available", available);
    }

    try {
      const response =
        JSON.stringify(item).length > 3
          ? await axios.patch(`${backendUrl}menu/${item._id}`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
                token: `resApp ${token}`,
              },
            })
          : await axios.post(
              `${backendUrl}menu?category=${publicId._id}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                  token: `resApp ${token}`,
                },
              }
            );
            toast.success("Item updated successfully!");

      handle();
    } catch (error) {
      console.error("Error uploading the image", error.response);
      toast.error("Error uploading the item. Please try again."); 
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <form onSubmit={update}>
        {/* Image preview */}
        {imageUrl && (
          <div className="mb-4 flex justify-center">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-40 h-40 object-cover rounded-md shadow-md"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
            />
          </div>

          {/* Item Price */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Item Price
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
            />
          </div>

          {/* Available */}
          <div className="col-span-1">
  <label className="block text-sm font-medium text-gray-700">
    Available?
  </label>
  <select
    value={available}
    onChange={(e) => setAvailable(e.target.value === "true")} // Convert string to boolean
    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
  >
    <option value="true">True</option>
    <option value="false">False</option>
  </select>
</div>

          {/* Ordered Times */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Ordered Times
            </label>
            <input
              type="text"
              value={orderedTimes}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              readOnly
            />
          </div>

          {/* Average Ratings */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Average Ratings
            </label>
            <input
              type="text"
              value={averageRating}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
              readOnly
            />
          </div>

          {/* Ingredients */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700">
              Ingredients (comma separated)
            </label>
            <input
              type="text"
              value={ingredients.join(", ")}
              onChange={handleIngredientsChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
            />
          </div>

          {/* Upload Image */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Upload Image
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-orange-500 focus:border-orange-500 shadow-sm"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center mt-6 space-x-4">
          <button
            type="submit"
            className="bg-orange-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-orange-600 transition-all duration-300"
          >
            Update
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-red-600 transition-all duration-300"
          >
            Delete
          </button>

          <button
            type="button"
            onClick={handle}
            className="bg-gray-500 text-white py-2 px-6 rounded-md shadow-md hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangeItems;
