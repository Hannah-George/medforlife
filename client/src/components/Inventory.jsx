import React, { useState } from "react";

const Inventory = () => {
  const [medicineName, setMedicineName] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [inventory, setInventory] = useState([]);

  // Function to handle form submission and update inventory
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!medicineName || stock <= 0 || price <= 0) {
      alert("Please fill in all fields correctly.");
      return;
    }

    const newInventoryItem = {
      name: medicineName,
      stock,
      price,
    };

    setInventory([...inventory, newInventoryItem]);

    // Reset form fields after submitting
    setMedicineName("");
    setStock(0);
    setPrice(0);
  };

  // Function to handle logout (you can link this to a real authentication logic)
  const handleLogout = () => {
    alert("Logged out");
  };

  return (
    <div className="bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">MedforLife - Shop Dashboard</h1>
          <button onClick={handleLogout} className="text-white hover:underline">
            Logout
          </button>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Management</h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Add/Update Medicine</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Medicine Name</label>
                  <input
                    type="text"
                    value={medicineName}
                    onChange={(e) => setMedicineName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update Inventory
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Current Inventory</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-2 border text-left">Medicine</th>
                    <th className="p-2 border text-left">Stock</th>
                    <th className="p-2 border text-left">Price</th>
                    <th className="p-2 border text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length > 0 ? (
                    inventory.map((item, index) => (
                      <tr key={index}>
                        <td className="p-2 border">{item.name}</td>
                        <td className="p-2 border">{item.stock}</td>
                        <td className="p-2 border">${item.price.toFixed(2)}</td>
                        <td className="p-2 border">
                          <button className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600">
                            Edit
                          </button>
                          <button className="bg-red-500 text-white px-4 py-1 rounded ml-2 hover:bg-red-600">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-2 text-center text-gray-500">
                        No inventory items available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Inventory;