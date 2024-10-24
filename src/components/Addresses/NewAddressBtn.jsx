import { IoMdAddCircleOutline } from "react-icons/io";
import { useState, useContext } from "react";
import AddAddress from "../AddAddress";
import { LoginContext } from "../../context/Login/Login";
function NewAddressBtn({ setUserAddress, userAddress }) {
  const { userOpject, token, getUserAddress } = useContext(LoginContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [editeId, setEditeId] = useState(null);

  const openModal = (content) => {
    setModalOpen(true);
  };
  return (
    <div>
      <button
        className="text-green-500 
           items-center space-x-1 shadow border 
           border-gray-100 px-2 py-1 rounded-lg flex"
        onClick={() => openModal("add")}
      >
        <IoMdAddCircleOutline className="text-green-500" />
        <span>Add Address</span>
      </button>
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-md shadow-md w-1/3">
            <h3 className="text-xl mb-4">Add New Address</h3>
            <AddAddress
              setModalOpen={setModalOpen}
              modalOpen={modalOpen}
              newAddress={newAddress}
              modalContent="add"
              editeId={editeId}
              setUserAddress={setUserAddress}
              userAddress={userAddress}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default NewAddressBtn;
