import { BrowserRouter, Routes, Route } from "react-router-dom";
import Menu from "./components/menu/Menu";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import useIsMobile from "./hooks/useIsMobile";

// Pages
import Home from "./pages/Home";
import Work from "./pages/Work";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Lab from "./pages/Lab";

function App() {
  const isMobile = useIsMobile(); // 👈 default 767px breakpoint

  return (
    <BrowserRouter>
      {isMobile ? <Menu /> : <NavBar />}
      <main className="relative min-h-screen w-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<Work />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/lab" element={<Lab />} />
        </Routes>
        <Footer />
      </main>
    </BrowserRouter>
  );
}

export default App;
