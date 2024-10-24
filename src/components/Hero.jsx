// Import Swiper React components and required modules
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css"; // Base Swiper styles
import "swiper/css/pagination"; // Pagination styles
import "swiper/css/navigation"; // Navigation styles

function Hero() {
  const swiperData = [
    {
      subtitle: "Welcome",
      title: "To Food Place",
      description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti
              tenetur id debitis libero impedit nam pariatur itaque eveniet,
              repellendus, odio similique eos sed`,
      img: "../src/assets/images/Hero/img1.jpeg",
    },
    {
      subtitle: "The Elegent",
      title: "Resturant",
      description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti
              tenetur id debitis libero impedit nam pariatur itaque eveniet,
              repellendus, odio similique eos sed`,
      img: "../src/assets/images/Hero/img2.jpeg",
    },
    {
      subtitle: "Delicious",
      title: "Spicy Masalas",
      description: `Lorem, ipsum dolor sit amet consectetur adipisicing elit. Corrupti
              tenetur id debitis libero impedit nam pariatur itaque eveniet,
              repellendus, odio similique eos sed`,
      img: "../src/assets/images/Hero/img3.jpeg",
    },
  ];
  return (
    <Swiper
      modules={[Pagination, Navigation]} // Register both Pagination and Navigation
      pagination={{ clickable: true }} // Enable clickable pagination
      navigation={true} // Enable navigation (prev/next buttons)
      spaceBetween={50}
      slidesPerView={1}
      className=""
    >
      {swiperData.map((item, index) => (
        <SwiperSlide className="" key={index}>
          <div className="relative">
            <img src={item.img} className="brightness-[40%] " />
            <div className="absolute w-[80%] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center">
              <p className="leading-none text-[30px] md:text-[40px] lg:text-[80px] font-tertiary text-primary-hover mb-0">
                {item.subtitle}
              </p>
              <p className="leading-[1.5] text-white font-primary text-[20px] md:text-[30px] lg:text-[60px] mt-0">
                {item.title}
              </p>
              <p className="text-white text-[16px] md:text-[18px] lg:text-[20px]">
                {item.description}
              </p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Hero;
