import React from "react";
import axios from "axios";

const ImportExportButtons = ({ fetchProducts }) => {
  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await axios.post("/api/products/import", formData);
    fetchProducts();
    alert("Import successful!");
  };

  const handleExport = async () => {
    const res = await axios.get("/api/products/export", { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="import-export">
      <label className="import-btn">
        📤 Import CSV
        <input type="file" accept=".csv" hidden onChange={handleImport} />
      </label>
      <button onClick={handleExport}>📥 Export CSV</button>
    </div>
  );
};

export default ImportExportButtons;
