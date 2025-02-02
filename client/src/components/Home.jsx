import React, { useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';

const Home = () => {
    const [medicine, setMedicine] = useState('');
    const [results, setResults] = useState([]);
    const [locationStatus, setLocationStatus] = useState('');



    const handleSearch = async () => {
        if (!medicine) {
            alert("Please enter a medicine name.");
            return;
        }

        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                setLocationStatus(`Location: ${latitude}, ${longitude}`);

                try {
                    const response = await axios.get(`http://localhost:5000/search`, {
                        params: { medicine, latitude, longitude }
                    });

                    setResults(response.data);
                } catch (error) {
                    console.error("Error fetching nearby pharmacies:", error);
                    setResults([]);
                }
            }, (error) => {
                console.error("Geolocation error:", error);
            });
        } else {
            alert("Geolocation is not supported by your browser.");
        }
    };


    return (
        <div className="bg-gray-100">
            <nav className="bg-blue-600 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-white text-2xl font-bold">Med for Life - "Find Medicine, Find Care"</h1>

                    <Link to={'/login'}>
                        Log in
                    </Link>
                    /
                    <Link to={'/signup'}>
                        Sign up
                    </Link>
                  

                </div>
            </nav>

            <main className="container mx-auto p-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Find Medicines Near You</h2>

                    <div className="mb-4">
                        <input
                            type="text"
                            value={medicine}
                            onChange={(e) => setMedicine(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Enter medicine name"
                        />
                    </div>

                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Search Nearby Stores
                    </button>

                    <div id="locationStatus" className="mt-2 text-sm text-gray-600">
                        {locationStatus}
                    </div>
                </div>

                <div id="results" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {results.map((result, index) => (
                        <div key={index} className="bg-white p-4 border rounded shadow-md">
                            <h3 className="text-lg font-semibold">{result.name}</h3>
                            <p>{result.store}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Home;
