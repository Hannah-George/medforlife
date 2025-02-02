// main.js
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const medicineInput = document.getElementById('medicine');
    const locationStatus = document.getElementById('locationStatus');
    const resultsContainer = document.getElementById('results');

    let userLocation = null;

    // Get user's location
    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject('Geolocation is not supported by your browser');
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error.message);
                }
            );
        });
    };

    // Search for medical shops
    const searchMedicalShops = async () => {
        try {
            const medicine = medicineInput.value.trim();
            if (!medicine) {
                alert('Please enter a medicine name');
                return;
            }

            locationStatus.textContent = 'Getting your location...';
            userLocation = await getLocation();
            
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    medicine,
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude
                })
            });

            const data = await response.json();
            displayResults(data);
        } catch (error) {
            locationStatus.textContent = `Error: ${error}`;
        }
    };

    // Display results
    const displayResults = (shops) => {
        resultsContainer.innerHTML = '';
        
        shops.forEach(shop => {
            const shopCard = document.createElement('div');
            shopCard.className = 'bg-white p-4 rounded-lg shadow';
            shopCard.innerHTML = `
                <h3 class="font-semibold text-lg">${shop.name}</h3>
                <p class="text-gray-600">${shop.address}</p>
                <p class="text-green-600 mt-2">Distance: ${shop.distance.toFixed(1)} km</p>
                <p class="text-blue-600">Stock: ${shop.stock} units</p>
                <p class="mt-2">Phone: ${shop.phone}</p>
            `;
            resultsContainer.appendChild(shopCard);
        });

        if (shops.length === 0) {
            resultsContainer.innerHTML = `
                <div class="col-span-full text-center text-gray-600">
                    No medical shops found with the requested medicine nearby.
                </div>
            `;
        }
    };

    searchBtn.addEventListener('click', searchMedicalShops);
});