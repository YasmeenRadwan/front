import { useEffect, useState } from "react";
import { FaHeart, FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../context/Login/Login";
import axios from "axios";
import { toast } from "react-toastify";

const Cards = ({
  item,
  image,
  showDetails,
  category,
  favourite,
  setFavourite,
}) => {
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token, userCart, removeMealFromCart, addToCart } =
    useContext(LoginContext);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleHeartClick = async (mealId) => {
    try {
      let isAlreadyFavorite = false;
      if (favourite) {
        isAlreadyFavorite = favourite.some((fav) => fav._id === mealId);
      }
      const response = await axios.post(
        `${backendUrl}menu/favourite`,
        { itemId: mealId },
        {
          headers: {
            token: `resApp ${token}`,
          },
        }
      );
      if (response.status === 200) {
        if (isAlreadyFavorite) {
          // remove meal from array
          setFavourite(favourite.filter((fav) => fav._id !== mealId));
          toast.warning(response.data.message);
        } else {
          // add meal to array
          setFavourite([...favourite, { _id: mealId }]);
          toast.success(response.data.message);
        }
        setIsHeartFilled(!isAlreadyFavorite); // Toggle heart state
      } else {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      toast.error("Error adding or removing to Favourite", error.message);
    }
  };
  // Add meal to cart
  const handleAddToCart = async (mealId) => {
    setIsLoading(true);
    await addToCart(mealId, 1);
    setIsLoading(false);
    toast.success("Meal Added Succssefuly to cart");
  };
  // Remove meal from cart
  const removeFromCart = async (mealId) => {
    setIsLoading(true);
    await removeMealFromCart(mealId);
    setIsLoading(false);
  };
  // Set initial heart status when `favourite` changes
  useEffect(() => {
    if (favourite) {
      setIsHeartFilled(
        favourite.some((fav) => {
          return fav._id === item._id;
        })
      );
    }
  }, [favourite, item._id]);
  return (
    <div className="card shadow-xl relative md:my-5 rounded-xl">
      <div
        className={`rounded-full cursor-pointer z-10 rating gap-1 absolute right-0 top-0 p-4 heartStar bg-primary-hover ${
          isHeartFilled ? "text-rose-500" : "text-white"
        }`}
        onClick={() => handleHeartClick(item._id)}
      >
        <FaHeart className="w-5 h-5 cursor-pointer" />
      </div>
      <figure className="flex justify-center items-center">
        <img
          src={image}
          alt={item?.name}
          className="hover:scale-105 transition-all duration-300 md:h-72 w-[100%]"
        />
      </figure>
      <div className="card-body px-3 flex flex-col justify-between max-h-full">
        <h2 className="card-title">{item?.name}!</h2>
        <p>{item?.description}</p>
        <div className="flex justify-start items-center gap-2">
          {!showDetails && item?.ingredients && (
            <>
              <span className="text-label">Ingredients: </span>{" "}
              {/* Text before the map */}
              {item?.ingredients.map((ele, i) => (
                <span
                  key={i}
                  className="rounded p-2 bg-darkorange text-white mr-1"
                >
                  {ele}
                </span>
              ))}
            </>
          )}
        </div>
        <div className="card-actions">
          <div className="flex justify-between items-center mt-2 mb-4">
            <h5 className="font-semibold">
              <span className="text-sm text-red-500">LE </span> {item?.price}
            </h5>
            <div className="flex gap-2 justify-center items-center">
              {showDetails ? (
                <Link
                  to={`/menu/${category}/${item.name}`}
                  state={{ mealId: item._id }}
                >
                  <FaEye className="w-5 h-5 text-primary-hover cursor-pointer hover:text-darkorange" />
                </Link>
              ) : (
                ""
              )}
              {token && (
                <>
                  {userCart.find((ele) => ele.menuItem?._id == item._id) ? (
                    <button
                      className={`btn btn-primary ${isLoading ? "cursor-wait" : ""}`}
                      disabled={isLoading}
                      onClick={() => {
                        removeFromCart(item._id);
                      }}
                    >
                      {isLoading ? "Removing" : "Remove"}
                    </button>
                  ) : (
                    <button
                      className={`btn bg-primary-hover text-white ${isLoading ? "cursor-wait" : ""}`}
                      disabled={isLoading}
                      onClick={() => {
                        handleAddToCart(item._id);
                      }}
                    >
                      {isLoading ? "Adding" : "Add to Cart"}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
