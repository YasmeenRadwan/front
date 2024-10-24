import { useState, useContext, useEffect } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { LoginContext } from "../context/Login/Login";
import AddAddress from "../components/AddAddress";
import axios from "axios";
import { toast } from "react-toastify";

function SavedAddresses() {
  const { userOpject, token, getUserAddress, userAddress, setUserAddress } =
    useContext(LoginContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [newAddress, setNewAddress] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [editeId, setEditeId] = useState(null);
  useEffect(() => {
    getUserAddress();
  }, []);
  const temp = {
    country: "New Country",
    city: "city",
    addressLabel: "New Address Label",
    buildingNumber: 1,
    floorNumber: 1,
  };

  const openModal = (content, id = null, adress = temp) => {
    setModalContent(content);
    // localStorage.setItem("adress", JSON.stringify(adress));
    if (content === "delete") {
      setDeleteId(id);
    }
    if (content === "edit") {
      setEditeId(id);
    }
    setModalOpen(true);
    // setSelectedEdit(adress);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent("");
    setDeleteId(null);
  };

  const handleDeleteAddress = async () => {
    try {
      const response = await axios.delete(`${backendUrl}address/${deleteId}`, {
        headers: {
          token: `resApp ${token}`,
        },
      });
      if (response.status == 200) {
        setUserAddress(
          userAddress.filter((address) => address._id !== deleteId)
        );
        toast.warning("Address Deleted Successfuly");
      }
      closeModal();
    } catch (error) {
      toast.error("Error deleting address", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-end mb-4">
        <button
          className="text-green-500 
           items-center space-x-1 shadow border 
           border-gray-100 px-2 py-1 rounded-lg flex items-center"
          onClick={() => openModal("add")}
        >
          <IoMdAddCircleOutline className="text-green-500" />
          <span>Add Address</span>
        </button>
      </div>

      <div className="bg-white p-4">
        {userAddress.length > 0 ? (
          userAddress.map((address) => (
            <div
              key={address._id}
              className="mb-4 flex justify-between items-center border-b border-gray-200 pb-4"
            >
              <div>
                <p className="font-semibold">
                  Address:{" "}
                  <span className="font-normal">
                    {address.country +
                      " " +
                      address.city +
                      " " +
                      address.addressLabel +
                      " " +
                      address.buildingNumber +
                      " " +
                      address.floorNumber}
                  </span>
                </p>
                <p className="text-gray-600 font-semibold">
                  Mobile Number:{" "}
                  <span className="font-normal">{userOpject.mobileNumber}</span>
                </p>
              </div>
              <div className="space-x-2">
                <button
                  className="text-green-500 border-none"
                  onClick={() => openModal("edit", address._id, address)}
                >
                  Edit
                </button>
                <button
                  className="text-gray-500 border-none"
                  onClick={() => openModal("delete", address._id, address)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center text-center font-primary text-3xl py-[100px]">
            <p>Pleaze Add New Address</p>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h3 className="text-xl mb-4">
              {modalContent === "edit"
                ? "Edit Address"
                : modalContent === "delete"
                  ? "Delete Address"
                  : "Add New Address"}
            </h3>
            {modalContent !== "delete" ? (
              <AddAddress
                setModalOpen={setModalOpen}
                modalOpen={modalOpen}
                newAddress={newAddress}
                modalContent={modalContent}
                editeId={editeId}
                setUserAddress={setUserAddress}
                userAddress={userAddress}
              />
            ) : (
              <div>
                <p>Are you sure you want to delete this address?</p>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2 mt-4"
                  onClick={handleDeleteAddress}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SavedAddresses;
