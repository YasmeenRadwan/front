import { FaStar } from "react-icons/fa";

function Testimonials() {
  return (
    <div className="section-container px-10 mt-10">
      <div className="grid md:grid-cols-2 place-items-center justify-items-center grid-cols-1 md:gap-12 gap-2">
        <div>
          <img
            src="/src/assets/images/home/testimonials/testimonials.png"
            alt=""
          />
        </div>
        <div>
          <div className="text-left md:w-4/5">
            <p className="subtitle">Testimonials</p>
            <h2 className="title">What Our Customers Say About Us</h2>
            <blockquote className="my-5 text-secondary leading-[30px]">
              “I had the pleasure of dining at Foodi last night, and I'm still
              raving about the experience! The attention to detail in
              presentation and service was impeccable”
            </blockquote>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex">
                <div className="avatar">
                  <div className="w-12 cursor-pointer">
                    <img src="/src/assets/images/home/testimonials/testimonial1.png" />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-12 cursor-pointer">
                    <img src="/src/assets/images/home/testimonials/testimonial2.png" />
                  </div>
                </div>
                <div className="avatar">
                  <div className="w-12 cursor-pointer">
                    <img src="/src/assets/images/home/testimonials/testimonial3.png" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-lg font-semibold">Customer Feedback</h5>
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />{" "}
                  <span className="font-medium">4.9</span>{" "}
                  <span className="text-[#807E7E]">(18.6k Reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Testimonials;
