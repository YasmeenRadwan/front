import Catagories from "../components/Categories";
import Hero from "../components/Hero";
import Testimonials from "../components/Testimonials";
import OurServices from "../components/OurServices";
function HomeView() {
  return (
    <div>    
      <Hero />
      <Catagories />
      <Testimonials />
      <OurServices />
    </div>
  );
}

export default HomeView;
