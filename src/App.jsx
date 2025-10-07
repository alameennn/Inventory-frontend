import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./components/Header";
import ProductTable from "./components/ProductTable";
import SidebarHistory from "./components/SidebarHistory";
import "./index.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get("https://inventory-backend-xiod.onrender.com/api/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // listen to filteredProducts event if Header dispatches it
  useEffect(() => {
    const onFiltered = (e) => setProducts(e.detail);
    window.addEventListener("filteredProducts", onFiltered);
    return () => window.removeEventListener("filteredProducts", onFiltered);
  }, []);

  return (
    <div className="app-shell">
      <Header fetchProducts={fetchProducts} />

      <main className="main-layout">
        {/* main content area: table */}
        <section className="table-area">
          <ProductTable
            products={products}
            fetchProducts={fetchProducts}
            setSelectedProduct={setSelectedProduct}
          />
        </section>

        {/* history sidebar (fixed right). renders only when selectedProduct set */}
        {selectedProduct && (
          <SidebarHistory
            product={selectedProduct}
            close={() => setSelectedProduct(null)}
          />
        )}
      </main>
    </div>
  );
};

export default App;
