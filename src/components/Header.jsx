import React, { useState, useEffect } from "react";
import axios from "axios";
import ImportExportButtons from "./ImportExportButtons";

const Header = ({ fetchProducts }) => {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: "",
    status: "In Stock",
    image: "",
  });

  // live search (debounced)
  useEffect(() => {
    const t = setTimeout(async () => {
      try {
        if (!search.trim()) {
          await fetchProducts();
        } else {
          const res = await axios.get(`https://inventory-backend-xiod.onrender.com/api/products?name=${encodeURIComponent(search)}`);
          const event = new CustomEvent("filteredProducts", { detail: res.data });
          window.dispatchEvent(event);
        }
      } catch (err) {
        console.error(err);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [search, fetchProducts]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://inventory-backend-xiod.onrender.com/api/products", formData);
      setShowModal(false);
      setFormData({ name: "", unit: "", category: "", brand: "", stock: "", status: "In Stock", image: "" });
      fetchProducts();
    } catch (err) {
      console.error("Create product failed", err);
      alert(err.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <>
      <header className="header-compact">
        <div className="header-row">
          <h2 className="title">Inventory Dashboard</h2>

          <div className="controls">
            <input
              className="search-input"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />

            <button
              className="add-small"
              onClick={() => setShowModal(true)}
              aria-haspopup="dialog"
              aria-expanded={showModal}
            >
              + Add
            </button>

            <ImportExportButtons fetchProducts={fetchProducts} />
          </div>
        </div>
      </header>

      {/* Modal */}
      {showModal && (
        <div className="modal" role="dialog" aria-modal="true" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 8 }}>Add Product</h3>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Name" value={formData.name} onChange={handleFormChange} required />
              <input name="unit" placeholder="Unit" value={formData.unit} onChange={handleFormChange} />
              <input name="category" placeholder="Category" value={formData.category} onChange={handleFormChange} />
              <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleFormChange} />
              <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleFormChange} />
              <select name="status" value={formData.status} onChange={handleFormChange}>
                <option>In Stock</option>
                <option>Out of Stock</option>
              </select>
              <input name="image" placeholder="Image URL" value={formData.image} onChange={handleFormChange} />
              <div className="modal-buttons" style={{ marginTop: 6 }}>
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ background: "#eee" }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
