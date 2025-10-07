import React, { useState } from "react";
import axios from "axios";

const ProductTable = ({ products, fetchProducts, setSelectedProduct }) => {
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (product) => {
    setEditId(product._id);
    setEditData(product);
  };

  const handleSave = async (id) => {
    await axios.put(`https://inventory-backend-xiod.onrender.com/api/products/${id}`, editData);
    setEditId(null);
    fetchProducts();
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id, name) => {
    const confirmDelete = window.confirm(`Delete "${name}"?`);
    if (!confirmDelete) return;
    await axios.delete(`https://inventory-backend-xiod.onrender.com/api/products/${id}`);
    fetchProducts();
  };

  return (
    <table className="product-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Unit</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {products.map((p) => (
          <tr key={p._id}>
            <td>
              <img
                src={p.image || "https://via.placeholder.com/50"}
                alt={p.name}
                width="50"
                height="50"
                style={{ borderRadius: 6 }}
              />
            </td>

            <td>
              {editId === p._id ? (
                <input name="name" value={editData.name} onChange={handleChange} />
              ) : (
                p.name
              )}
            </td>

            <td>
              {editId === p._id ? (
                <input name="unit" value={editData.unit} onChange={handleChange} />
              ) : (
                p.unit
              )}
            </td>

            <td>
              {editId === p._id ? (
                <input
                  name="category"
                  value={editData.category}
                  onChange={handleChange}
                />
              ) : (
                p.category
              )}
            </td>

            <td>
              {editId === p._id ? (
                <input name="brand" value={editData.brand} onChange={handleChange} />
              ) : (
                p.brand
              )}
            </td>

            <td>
              {editId === p._id ? (
                <input name="stock" value={editData.stock} onChange={handleChange} />
              ) : (
                <span style={{ color: p.stock > 0 ? "#1e7e34" : "#c82333", fontWeight: 600 }}>
                  {p.stock}
                </span>
              )}
            </td>

            <td>
              <span className={`status ${p.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                {p.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </td>

            <td className="actions">
              {editId === p._id ? (
                <button onClick={() => handleSave(p._id)}>Save</button>
              ) : (
                <button onClick={() => handleEdit(p)}>Edit</button>
              )}

              <button onClick={() => setSelectedProduct(p)}>History</button>

              <button onClick={() => handleDelete(p._id, p.name)} className="delete-btn">
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
