import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../context/Login/Login";

const Catagories = () => {
  const { getAllCategories, category } = useContext(LoginContext);
  const navigate = useNavigate();

  const navigateToCatMenu = (category, id) => {
    console.log(category);
    const cat = category.split(" ");
    navigate(`/menu/${cat.join("_")}`, { state: { catId: id } });
  };
  useEffect(() => {
    getAllCategories();
  }, []);
  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="max-w-screen-xl container mx-auto xl:px-24 p-4 mt-10">
      <div className="text-center mb-8">
        <p className="subtitle">Discover</p>
        <h2 className="title h2">Our Catagories</h2>
      </div>

      <div className="slider-container lg:px-16 px-4">
        <Slider {...settings} className="">
          {category.map((item, i) => (
            <div
              onClick={() => navigateToCatMenu(item.name, item._id)}
              to={`/menu/${item.name}`}
              key={i}
              className="w-[250px] py-5"
            >
              <div className="mx-auto link-content py-6 px-2 text-center cursor-pointer  shadow-md rounded-md bg-white hover:-translate-y-4 transition-all duration-300 z-10 w-[95%]">
                <div className="w-full mx-auto flex items-center justify-center">
                  <img
                    src={item.image.secure_url}
                    alt=""
                    className="bg-[#C1F1C6] p-5 rounded-full w-28 h-28"
                  />
                </div>
                <div className="mt-5 space-y-1">
                  <h5 className="text-[#1E1E1E] font-semibold">{item.name}</h5>
                  {/* <p className="text-secondary text-sm">{item.despriction}</p> */}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 ">
        {categories.map((item, i) => (
          <Link
            to="/menu"
            key={i}
            className="shadow-lg rounded-md bg-white py-6 px-5 w-[250px] mx-auto text-center cursor-pointer hover:-translate-y-4 transition-all duration-300 z-10"
          >
            <div className="w-full mx-auto flex items-center justify-center">
              <img
                src={item.image.secure_url}
                alt=""
                className="bg-[#C1F1C6] p-5 rounded-full w-28 h-28"
              />
            </div>
            <div className="mt-5 space-y-1">
              <h5 className="text-[#1E1E1E] font-semibold">{item.name}</h5>
            </div>
          </Link>
        ))}
      </div> */}
    </div>
  );
};

export default Catagories;
