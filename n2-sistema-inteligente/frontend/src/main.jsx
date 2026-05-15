import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import PageAnalise from "./pages/PageAnalise";
import PageFuzzy from "./pages/PageFuzzy";
import PageRecomendacao from "./pages/PageRecomendacao";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PageAnalise />} />
          <Route path="fuzzy" element={<PageFuzzy />} />
          <Route path="recomendacao" element={<PageRecomendacao />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
