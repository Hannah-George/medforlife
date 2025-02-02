import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");


    let navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault();

        // if (!email.includes("@")) {
        //     setError("Invalid email format.");
        //     return;
        // }


        console.log(email, password);

        // if (password.length < 6) {
        //     setError("Password must be at least 6 characters.");
        //     return;
        // }

        // if (password !== confirmPassword) {
        //     setError("Passwords do not match.");
        //     return;
        // }

        axios.post('http://localhost:3000/api/signup', { email, password }).then((res) => {

            console.log(res);

            navigate('/login')


        }).catch((err) => {
            console.log(err);

        })


    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full mx-4">
                <div className="bg-white rounded-lg shadow-md p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Shop Signup</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="text"
                                id="email"
                                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}

                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}

                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                className="w-full p-2 border rounded focus:border-blue-500 focus:outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}

                            />
                        </div>

                        {error && <div className="text-red-500">{error}</div>}

                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 focus:outline-none"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
