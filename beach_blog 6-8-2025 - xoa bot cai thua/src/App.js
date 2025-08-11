import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import ScrollToTop from "./components/common/ScrollToTop";

import Home from "./components/pages/Home";
import Gallery from "./components/pages/Gallery";
import Regions from "./components/pages/Regions";
import AboutUs from "./components/pages/about/AboutUs";
import Feedback from "./components/pages/feedback/Feedback";
import ContactUs from "./components/pages/contact/ContactUs";
import SiteMap from "./components/pages/sitemap/SiteMap";
import BeachDetail from "./components/pages/BeachDetail";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <ScrollToTop />
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/regions" element={<Regions />} />
          <Route path="/regions/:direction" element={<Regions />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/top50" element={<Gallery />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/sitemap" element={<SiteMap />} />
          <Route path="/beach/:id" element={<BeachDetail />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
