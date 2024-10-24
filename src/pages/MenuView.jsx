import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import MealCard from "../components/MealCard";
import { FaFilter } from "react-icons/fa";
import Pagination from "../components/Pagination";
import { useParams } from "react-router-dom";
import { LoginContext } from "../context/Login/Login";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

function MenuView() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const {
    getAllCategories,
    category: categoryList,
    token,
    getAllFavourit,
    favouritList,
    setFavouriteList,
  } = useContext(LoginContext);
  const location = useLocation();
  const { catId } = location.state || {}; // Access the state safely
  const { category } = useParams();
  const [menu, setMenu] = useState([]);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const [filteredMenu, setFilteredMenu] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOprion] = useState("default");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of items per page

  // Filter Menu data According to Category
  const getFilterdData = (category, id) => {
    const cat = category.split(" ");
    navigate(`/menu/${cat.join("_")}`, { state: { catId: id } });
  };

  //Sort Menu According to A-z / Z-A / High to Low Price / Low to High Pric
  const handleSortMenu = (option) => {
    setSortOprion(option);

    // Logic for sorting based on the selected option
    let sortedItems = [...filteredMenu];

    switch (option) {
      case "A-Z":
        sortedItems.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Z-A":
        sortedItems.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "low-to-high":
        sortedItems.sort((a, b) => a.price - b.price);
        break;
      case "high-to-low":
        sortedItems.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    setFilteredMenu(sortedItems);
    setCurrentPage(1); // Reset page to 1 when sorting is done
  };
  // gat All Category
  //get category according to category id
  const getCategoryMeals = async () => {
    try {
      const response = await axios.get(`${backendUrl}menu/category/${catId}`);
      if (response.status == 200) {
        setMenu(response.data);
        setFilteredMenu(response.data.Menuitems);
        setCurrentPage(1);
      } else {
        setMenu([]);
        setFilteredMenu([]);
        setCurrentPage(1);
        throw new Error("no meals found");
      }
    } catch (error) {
      setMenu([]);
      setFilteredMenu([]);
      setCurrentPage(1);
      toast.error(error.response.data.error);
    }
  };
  //get All meals
  const getAllMeals = async () => {
    try {
      const response = await axios.get(`${backendUrl}menu`);
      if (response.status == 200) {
        setMenu(response.data.allMenu);
        setFilteredMenu(response.data.allMenu);
        setCurrentPage(1);
      } else {
        setMenu([]);
        setFilteredMenu([]);
        setCurrentPage(1);
        throw new Error("no meals found");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    const getCategories = async () => {
      setLoadingCategory(true);
      await getAllCategories();
      setLoadingCategory(false);
    };
    getCategories();
  }, []);
  useEffect(() => {
    setLoadingMenu(true);
    const getData = async () => {
      if (catId) {
        await getCategoryMeals();
        setSelectedCategory(category);
        setLoadingMenu(false);
      } else {
        await getAllMeals();
        setSelectedCategory("all");
        setLoadingMenu(false);
      }
    };
    getData();
  }, [category, location]);

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMenu.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMenu.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // favourite
  useEffect(() => {
    getAllFavourit();
  }, []);
  return (
    <div>
      {/* header */}
      {/* <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4">
        <div className="py-24 flex flex-col items-center justify-center">
          <div className=" text-center px-4 space-y-7">
            <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
              For the Love of Delicious{" "}
              <span className="text-primary-hover">Food</span>
            </h2>
            <p className="text-[#4A4A4A] text-xl md:w-4/5 mx-auto">
              Come with family & feel the joy of mouthwatering food such as
              Greek Salad, Lasagne, Butternut Pumpkin, Tokusen Wagyu, Olivas
              Rellenas and more for a moderate cost
            </p>
            <button className="bg-primary-hover hover:bg-darkorange font-semibold btn text-white px-8 py-3 rounded-full">
              Order Now
            </button>
          </div>
        </div>
      </div> */}
      {/* menu content */}
      <div className="container mx-auto ">
        <div className="">
          {/* Filtering & Sorting */}
          <div className="flex flex-col md:flex-row flex-wrap md:justify-between items-center space-y-3 mb-8">
            {/* category buttons */}
            <div className="flex flex-row justify-start md:items-center md:gap-8 gap-4  flex-wrap">
              <button
                onClick={() => getFilterdData("all")}
                className={selectedCategory === "all" ? "text-darkorange" : ""}
              >
                All
              </button>
              {/* <button> {selectedCategory}</button> */}
              {categoryList.map((item) => (
                <button
                  key={item._id}
                  onClick={() => getFilterdData(item.name, item._id)}
                  className={
                    selectedCategory === item.name.split(" ").join("_")
                      ? "text-darkorange"
                      : ""
                  }
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* filter options */}
            <div className="flex justify-end mb-4 rounded-sm">
              <div className="bg-black p-2 ">
                <FaFilter className="text-white h-4 w-4" />
              </div>
              <select
                id="sort"
                onChange={(e) => handleSortMenu(e.target.value)}
                value={sortOption}
                className="bg-black text-white px-2 py-1 rounded-sm"
              >
                <option value="default"> Default</option>
                <option value="A-Z">A-Z</option>
                <option value="Z-A">Z-A</option>
                <option value="low-to-high">Low to High</option>
                <option value="high-to-low">High to Low</option>
              </select>
            </div>
          </div>
          {!loadingMenu ? (
            currentItems.length > 0 ? (
              <>
                <div className="meals-cards grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentItems.map((item) => (
                    <MealCard
                      key={item._id}
                      item={item}
                      image={item.image?.secure_url}
                      category={selectedCategory}
                      showDetails={true}
                      favourite={favouritList}
                      setFavourite={setFavouriteList}
                    />
                  ))}
                </div>
                {/* Pagination Controls in Separate Component */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  paginate={paginate}
                />
              </>
            ) : (
              <div className="flex justify-center items-center py-[100px] text-primary font-primary">
                {" "}
                No meals Available in this Category
              </div>
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </div>
  );
}

export default MenuView;
