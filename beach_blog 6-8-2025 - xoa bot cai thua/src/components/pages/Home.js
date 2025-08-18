import FooterMarquee from "../common/FooterMarquee";
import Welcome from "./home/Welcome";
import FixedBackground from "./home/FixedBackground";
import LoveSection from "../shared/LoveSection";
import FeaturedBeaches from "../shared/FeaturedBeaches";
import FeedbackSection from "../shared/FeedbackSection";

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
