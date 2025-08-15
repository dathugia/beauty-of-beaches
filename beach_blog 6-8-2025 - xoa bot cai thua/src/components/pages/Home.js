import FooterMarquee from "../common/FooterMarquee";
import Welcome from "./home/Welcome";
import FixedBackground from "./home/FixedBackground";
import LoveSection from "../shared/LoveSection";
import FeedbackSection from "../shared/FeedbackSection";
import FeaturedBeaches from "../shared/FeaturedBeaches";

const Home = () => {
  return (
    <>
      <FixedBackground />
      <Welcome />
      <FeaturedBeaches />
      <LoveSection />
      <FeedbackSection />
    </>
  );
};

export default Home;
