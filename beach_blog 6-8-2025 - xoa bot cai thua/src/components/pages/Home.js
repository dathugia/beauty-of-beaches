import FooterMarquee from "../common/FooterMarquee";
import Welcome from "./home/Welcome";
import FixedBackground from "./home/FixedBackground";
import LoveSection from "../shared/LoveSection";
import RegionSection from "../shared/RegionSection";
import FeaturedBeaches from "../shared/FeaturedBeaches";

const Home = () => {
  return (
    <>
      <FixedBackground />
      <Welcome />
      <FeaturedBeaches />
      <LoveSection />
      <RegionSection />
    </>
  );
};

export default Home;
