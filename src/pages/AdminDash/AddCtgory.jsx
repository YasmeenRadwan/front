import React, { useState, useContext, useEffect } from "react";

import { BrowserRouter } from "react-router-dom";

import axios from "axios";
import { LoginContext } from "../../context/Login/Login";
import { useNavigate } from "react-router-dom";

function AddCtgory({ setShowCay, catC, setCatC }) {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();
  const {
    token,
    setPublicId,
    publicId,
    catchng,
    setCatchng,
    refresh,
    setSrefresh,
    setShowItems,
  } = useContext(LoginContext);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [name, setName] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  function handle() {
    setShowCay(true);
    setCatC(false);
    setPreview(null);
    setImage(null);
    setName("");
    setCatchng([]);
    setPublicId([]);
  }

  function cahngeToitems() {
    setPublicId(catchng);
    navigate("/dash/Manue");
  }

  async function fetchData() {
    try {
      const response = await axios.get(
        `${backendUrl}menu/category/${catchng._id}`,

        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );
      console.log(response);

      return response.data.Menuitems;
    } catch (error) {
      set;
      console.error("Error uploading the image", error);
      return [];
    }
  }
  useEffect(() => {
    setPublicId([]);

    if (JSON.stringify(catchng).length > 3) {
      setPreview(catchng.image.secure_url);
      setImage(catchng.image.secure_url);
      setName(catchng.name);
      setShowItems(true);
    } else {
      setShowItems(false);
      setPreview(null);
      setImage(null);
      setName("");
    }
  }, []);

  async function delet() {
    try {
      const response = await axios.delete(
        `${backendUrl}category/${catchng._id}`,

        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );
      console.log(response.data);
      setUploadStatus("Image uploaded successfully!");
      setShowCay(true);
      setSrefresh(!refresh);
    } catch (error) {
      setUploadStatus("Failed to upload image.");
      console.error("Error uploading the image", error);
    }
  }

  // ///////////////////////////////////////////////////////////////////////

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(typeof image === "string");

    if (!(typeof image === "string")) formData.append("image", image);
    formData.append("name", name);
    console.log({ name, image });

    if (JSON.stringify(catchng).length < 3) {
      try {
        const response = await axios.post(`${backendUrl}category/`, formData, {
          headers: {
            token: `resApp ${token}`,
          },
        });
        console.log(response.data);
        setUploadStatus("Image uploaded successfully!");
        setShowCay(true);
        setSrefresh(!refresh);
      } catch (error) {
        setUploadStatus("Failed to upload image.");
        console.error("Error uploading the image", error);
      }
    } else {
      try {
        const response = await axios.patch(
          `category/${catchng._id}`,
          formData,
          {
            headers: {
              token: `resApp ${token}`,
            },
          }
        );
        console.log(response.data);
        setUploadStatus("Image uploaded successfully!");
        setShowCay(true);
        setSrefresh(!refresh);
      } catch (error) {
        setUploadStatus("Failed to upload image.");
        console.error("Error uploading the image", error);
      }
    }
  };

  const handleDeleteClick = () => {
    setShowPopup(true);
  };

  const confirmDelete = () => {

    setShowPopup(false);
  };

  const cancelDelete = () => {
    setShowPopup(false);
  };

    return (
      <div className="flex flex-col items-center">
        <h2>Upload Image</h2>
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-[40%] border border-gray-300 shadow-sm rounded p-2"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-[40%] border border-gray-300 shadow-sm rounded p-2"
          />
          <button
            type="submit"
            className="btn bg-orange-500 text-white w-[40%] py-2 rounded flex items-center justify-center mt-5"
          >
            Upload
          </button>
        </form>
  
        {preview && (
          <div className="mt-4">
            <h3>Image Preview:</h3> <i class="fa-solid fa-image"></i>
            <img
              src={preview}
              alt="Preview"
              className="w-[300px] sm:w-[300px] md:w-[300px] lg:w-[300px] mx-auto"
            />
          </div>
        )}
  
        {uploadStatus && <p>{uploadStatus}</p>}
  
        <button
          type="button"
          onClick={handle}
          className="btn bg-orange-500 text-white w-[40%] mx-auto py-2 rounded flex items-center justify-center mt-5"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDeleteClick}
          className="btn bg-orange-500 text-white w-[40%] mx-auto py-2 rounded flex items-center justify-center mt-5"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={cahngeToitems}
          className="btn bg-orange-500 text-white w-[40%] mx-auto py-2 rounded flex items-center justify-center mt-5"
        >
          Show the items
        </button>
  
        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-md">
              <h3>Are you sure you want to delete this item?</h3>
              <div className="flex justify-between mt-4">
                <button
                  onClick={confirmDelete}
                  className="btn bg-red-500 text-white rounded px-4 py-2"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="btn bg-gray-300 text-black rounded px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

export default AddCtgory;
