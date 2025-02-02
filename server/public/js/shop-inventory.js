// public/js/shop-inventory.js
document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('updateForm');
    const inventoryList = document.getElementById('inventoryList');
    const logoutBtn = document.getElementById('logoutBtn');

    // Check authentication
    const token = localStorage.getItem('shopToken');
    if (!token) {
        window.location.href = '/shop/login.html';
        return;
    }

    // Load inventory
    const loadInventory = async () => {
        try {
            const response = await fetch('/api/shop/inventory', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load inventory');
            }

            const inventory = await response.json();
            displayInventory(inventory);
        } catch (error) {
            console.error('Error loading inventory:', error);
        }
    };

    // Display inventory
    const displayInventory = (inventory) => {
        inventoryList.innerHTML = inventory.map(item => `
            <tr>
                <td class="p-2 border">${item.medicine_name}</td>
                <td class="p-2 border">${item.stock}</td>
                <td class="p-2 border">$${item.price.toFixed(2)}</td>
                <td class="p-2 border">
                    <button 
                        onclick="editItem(${item.id})"
                        class="text-blue-600 hover:underline mr-2">
                        Edit
                    </button>
                    <button 
                        onclick="deleteItem(${item.id})"
                        class="text-red-600 hover:underline">
                        Delete
                    </button>
                </td>
            </tr>
        `).join('');
    };

    // Update inventory
    updateForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const medicineName = document.getElementById('medicineName').value;
        const stock = document.getElementById('stock').value;
        const price = document.getElementById('price').value;

        try {
            const response = await fetch('/api/shop/inventory/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    medicineName,
                    stock,
                    price
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update inventory');
            }

            // Reset form and reload inventory
            updateForm.reset();
            await loadInventory();
        } catch (error) {
            console.error('Error updating inventory:', error);
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('shopToken');
        window.location.href = '/shop/login.html';
    });

    // Initial load
    loadInventory();
});