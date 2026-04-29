"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "../signup/auth.css";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    const res = await fetch("http://localhost:8000/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.token) {
      // ✅ store token
      localStorage.setItem("digital-token", data.token);

      // ✅ store role
      localStorage.setItem("digital-role", data.user.role);

      // ✅ role-based redirect
      if (data.user.role === "admin") {
        router.push("/pages/admin");
      } else {
        router.push("/pages/dashboard");
      }

    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Welcome Back</h2>

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

        <button onClick={handleLogin}>Login</button>

        <p>
          Don’t have an account?{" "}
          <span onClick={() => router.push("/pages/signup")}>Sign Up</span>
        </p>
      </div>
    </div>
  );
}