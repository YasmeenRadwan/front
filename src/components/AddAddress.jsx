import React from "react";
import { LoginContext } from "../context/Login/Login";
import axios from "axios";
import { useState, useEffect, useContext, id } from "react";
import { toast } from "react-toastify";
function AddAddress({
  setModalOpen,
  modalOpen,
  edit,
  modalContent,
  editeId,
  setUserAddress,
  userAddress,
}) {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [buildingNumber, setBuildingNumber] = useState(1);
  const [floorNumber, setFloorNumber] = useState(1);
  const [addressLabel, setAddressLabel] = useState("");
  const [addressEerro, setAddressError] = useState(null);
  const [firstNameError, setIsFirstNameError] = useState(false);
  const { userOpject, token } = useContext(LoginContext);
  const [newAddress, setNewAddress] = useState(
    JSON.parse(localStorage.getItem("adress"))
  );
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    if (modalContent === "edit") {
      const address = userAddress.find((ele) => ele._id == editeId);
      setCity(address.city);
      setCountry(address.country);
      setBuildingNumber(address.buildingNumber);
      setFloorNumber(address.floorNumber);
      setAddressLabel(address.addressLabel);
    }
  }, [editeId]);

  function cancel(e) {
    e.preventDefault();
    setModalOpen(false);
  }
  const subform = async (e) => {
    e.preventDefault();
    const validateAdress = () => {
      if (typeof city !== "string" || city.length < 3 || city.length > 50) {
        setAddressError(
          "City must be a string and between 3 and 50 characters."
        );
        return false;
      } else if (
        typeof country !== "string" ||
        country.length < 3 ||
        country.length > 50
      ) {
        setAddressError(
          "Country must be a string and between 3 and 50 characters."
        );
        return false;
      } else if (
        typeof addressLabel !== "string" ||
        addressLabel.length < 3 ||
        addressLabel.length > 50
      ) {
        setAddressError(
          "Address label must be a string and between 3 and 50 characters."
        );
        return false;
      } else if (
        isNaN(Number(buildingNumber)) ||
        Number(buildingNumber) < 1 ||
        Number(buildingNumber) > 100
      ) {
        setAddressError("Building number must be a number between 1 and 100.");
        return false;
      } else if (
        isNaN(Number(floorNumber)) ||
        Number(floorNumber) < 1 ||
        Number(floorNumber) > 15
      ) {
        setAddressError("Floor number must be a number between 1 and 15.");
        return false;
      } else {
        setAddressError(null);
        return true;
      }
    };

    if (validateAdress() && !addressEerro) {
      if (modalContent === "add") {
        try {
          const response = await axios.post(
            `${backendUrl}address`,
            {
              city,
              country,
              buildingNumber,
              floorNumber,
              addressLabel,
            },
            {
              headers: {
                token: `resApp ${token}`,
              },
            }
          );
          setUserAddress((prev) => [...prev, response.data.address]);
          console.log(response.data.address);
          setModalOpen(false);
          toast.success("Address Added Successfuly");
          return response.data;
        } catch (error) {
          toast.error("Error Adding Address ", error.message);
        }
      } else {
        try {
          const response = await axios.put(
            `${backendUrl}address/${editeId}`,
            {
              city,
              country,
              buildingNumber,
              floorNumber,
              addressLabel,
            },
            {
              headers: {
                token: `resApp ${token}`,
              },
            }
          );
          setUserAddress((prev) =>
            prev.map((address) =>
              address._id === editeId ? response.data.address : address
            )
          );
          setModalOpen(false);
          toast.success("Address Edited Successfuly");
          return response.data;
        } catch (error) {
          toast.error("Error Editing Address ", error.message);
        }
      }

      localStorage.removeItem("adress");
    }
  };
  return (
    <>
      <form onSubmit={subform}>
        <div className="formgroup flex flex-col">
          <label htmlFor="city" className="mb-2">
            {" "}
            city
          </label>
          <input
            type="text"
            placeholder="city"
            name="city"
            id="city"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="formgroup flex flex-col">
          <label htmlFor="country" className="mb-2">
            {" "}
            country
          </label>
          <input
            type="text"
            placeholder="country"
            name="country"
            id="country"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
          {firstNameError && <p className="text-red-500">{firstNameError}</p>}
        </div>
        <div className="formgroup flex flex-col">
          <label htmlFor="bulding number" className="mb-2">
            {" "}
            bulding number
          </label>
          <input
            type="text"
            placeholder="bulding number"
            name="bulding number"
            id="bulding number"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            value={buildingNumber}
            onChange={(e) => setBuildingNumber(e.target.value)}
          />
        </div>
        <div className="formgroup flex flex-col">
          <label htmlFor="floor number" className="mb-2">
            {" "}
            floor number
          </label>
          <input
            type="text"
            placeholder="floor number"
            name="floor number"
            id="floor number"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
          />
        </div>
        <div className="formgroup flex flex-col">
          <label htmlFor="adress" className="mb-2">
            {" "}
            adress label
          </label>
          <input
            type="text"
            placeholder="adress label"
            name="adress label"
            id="adress label"
            className="p-2 border border-blue-200 focus:border-blue-500 outline-none rounded"
            value={addressLabel}
            onChange={(e) => setAddressLabel(e.target.value)}
          />
          {addressEerro && <p className="text-red-500">{addressEerro}</p>}
        </div>
        <button
          type="submit"
          className="btn bg-orange-500 text-white w-[50%] mx-auto py-2 rounded flex items-center justify-center mt-5"
        >
          save
        </button>
        <button
          onClick={cancel}
          className="btn bg-orange-500 text-white w-[50%] mx-auto py-2 rounded flex items-center justify-center mt-5"
        >
          cancel
        </button>
      </form>
    </>
  );
}

export default AddAddress;
