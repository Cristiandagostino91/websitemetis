import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "./components/ui/toaster";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import ChiSiamo from "./pages/ChiSiamo";
import Servizi from "./pages/Servizi";
import Prodotti from "./pages/Prodotti";
import Blog from "./pages/Blog";
import Contatti from "./pages/Contatti";
import Carrello from "./pages/Carrello";
import Checkout from "./pages/Checkout";
import Prenota from "./pages/Prenota";
import Admin from "./pages/Admin";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="App">
          <ScrollToTop />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chi-siamo" element={<ChiSiamo />} />
            <Route path="/servizi" element={<Servizi />} />
            <Route path="/prodotti" element={<Prodotti />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<Blog />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/carrello" element={<Carrello />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/prenota" element={<Prenota />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
          <Footer />
          <Toaster />
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
