"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./auth.css";
import axios from "axios";

export default function Signup() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/user/signup",
                form 
            );

            const data = res.data; // ✅ axios gives data here

            if (data._id) {
                alert("Signup successful");
                router.push("/pages/login");
            } else {
                alert(data.message || "Error");
            }
        } catch (err:any) {
            alert(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Create Account</h2>

                <input
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                />

                <button onClick={handleSignup}>Sign Up</button>

                <p>
                    Already have an account?{" "}
                    <span onClick={() => router.push("/login")}>Login</span>
                </p>
            </div>
        </div>
    );
}