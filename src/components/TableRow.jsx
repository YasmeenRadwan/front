import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

import { useState, useContext } from "react";
import { LoginContext } from "../context/Login/Login";
import { toast } from "react-toastify";
function TableRow({ mealData, quantity, totalPrice, updateCart }) {
  const { removeMealFromCart, addToCart } = useContext(LoginContext);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [changeQuantity, setChangeQuantity] = useState(false);
  // remove meal from cart
  const deleteItem = async () => {
    setRemoveLoading(true);
    await removeMealFromCart(mealData._id);
    setRemoveLoading(false);
  };
  const handleDecrease = async () => {
    setChangeQuantity(true);
    await addToCart(mealData._id, -1);
    setChangeQuantity(false);
    toast.success("Quantity Updated Successfuly");
  };

  //   Increase Meal quantity in cart
  const handleIncrease = async () => {
    setChangeQuantity(true);
    await addToCart(mealData._id, 1);
    setChangeQuantity(false);
    toast.success("Quantity Updated Successfuly");
  };

  return (
    <>
      <td className="border border-gray-300 py-2">
        <p>{mealData?.name}</p>
        <img
          src={mealData?.image?.secure_url}
          alt=""
          className="w-[100px] mx-auto rounded"
        />
      </td>
      <td className="align-middle">
        <div className="flex justify-center items-center">
          <CiCircleMinus
            size={20}
            className={`${changeQuantity ? "cursor-wait" : "cursor-pointer"}`}
            onClick={handleDecrease}
            disabled={changeQuantity}
          />
          {quantity}
          <CiCirclePlus
            size={20}
            className={`${changeQuantity ? "cursor-wait" : "cursor-pointer"}`}
            onClick={handleIncrease}
            disabled={changeQuantity}
          />
        </div>
      </td>
      <td className="border border-gray-300">{totalPrice} LE</td>
      <td className="border border-gray-300">
        <MdDelete
          onClick={deleteItem}
          className={`text-red-500 cursor-pointer mx-auto ${removeLoading ? "cursor-wait" : ""}`}
          disabled={removeLoading}
        />
      </td>
    </>
  );
}

export default TableRow;
