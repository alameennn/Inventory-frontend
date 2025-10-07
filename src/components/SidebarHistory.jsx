import React, { useEffect, useState } from "react";
import axios from "axios";

const SidebarHistory = ({ product, close }) => {
  const [history, setHistory] = useState([]);
  const productId = product?._id;

  useEffect(() => {
    if (!productId) return;
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`https://inventory-backend-xiod.onrender.com/api/products/${productId}/history`);
        setHistory(res.data || []);
      } catch (err) {
        console.error("Failed to load history", err);
        setHistory([]);
      }
    };
    fetchHistory();
  }, [productId]);

  if (!product) return null;

  return (
    <aside className="history-sidebar">
      <div className="history-header">
        <h3>Inventory History</h3>
        <button className="close-btn" onClick={close}>✕</button>
      </div>

      <div className="history-body">
        <h4 className="product-name">{product.name}</h4>
        {history.length === 0 ? (
          <div className="no-history">No history found.</div>
        ) : (
          <ul className="history-list">
            {history.map((h) => (
              <li key={h._id || `${h.date}-${h.newQuantity}`} className="history-item">
                <div className="history-row">
                  <div className="history-dates">
                    <div className="date">{new Date(h.date).toLocaleString()}</div>
                  </div>
                  <div className="history-qty">
                    <div className="old">Old: {h.oldQuantity ?? "-"}</div>
                    <div className="new">New: {h.newQuantity ?? "-"}</div>
                  </div>
                </div>
                <div className="history-user">By: {h.user || "Unknown"}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default SidebarHistory;
