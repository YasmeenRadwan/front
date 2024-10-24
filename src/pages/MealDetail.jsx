import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import MealCard from "../components/MealCard";
import Rating from "@mui/material/Rating";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { LoginContext } from "../context/Login/Login";
function MealDetail() {
  const location = useLocation();
  const { mealId } = location.state || {};
  const [mealData, setMealData] = useState({});
  const [reviews, setReviews] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  let [loading, setLoading] = useState(true);
  const { favouritList, setFavouriteList, getAllFavourit } =
    useContext(LoginContext);
  const getMealData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}menu/${mealId}`);
      if (response.status == 200) {
        setMealData(response.data.menuItem);
        setLoading(false);
        setReviews(response.data.reviews);
      }
    } catch (error) {
      setMealData({});
      setLoading(false);
      toast.error("error fetching meal", error);
    }
  };

  useEffect(() => {
    getMealData();
  }, [mealId, location]);

  // favourite
  useEffect(() => {
    getAllFavourit();
  }, []);
  return (
    <div className="container flex justify-center items-center mx-auto px-[24px] mt-5 min-h-[70vh]">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <MealCard
            item={mealData}
            image={mealData.image.secure_url}
            showDetails={false}
            favourite={favouritList}
            setFavourite={setFavouriteList}
          />
          <div className="mt-8 w-full flex flex-col items-center max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
            {reviews.length > 0 ? (
              <ul className="space-y-4">
                {reviews.map((review, index) => (
                  <li key={index} className="p-4 border rounded-lg shadow-lg">
                    <h3 className="font-semibold">{`${review.userId.firstName} ${review.userId.lastName}`}</h3>
                    <Rating
                      name="read-only"
                      value={review.reviewRating}
                      readOnly
                    />
                    <h4 className="font-bold">{review.reviewTitle}</h4>
                    <p>{review.reviewText}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reviews available for this meal.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default MealDetail;
