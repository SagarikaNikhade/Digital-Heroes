"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("digital-token");

    if (token) {
      router.push("/pages/dashboard"); // ✅ auto redirect
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-black dark:to-zinc-900 font-sans">
      
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">
          🏆 Digital Heroes
        </h1>

        <p className="mb-10 text-gray-600">
          Play. Win. Give back.
        </p>

        <div className="flex gap-6">
          
          {/* USER */}
          <div
            onClick={() => router.push("/pages/login")}
            className="cursor-pointer p-8 w-60 rounded-2xl bg-white shadow-md hover:shadow-xl transition hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-2">User Panel</h2>
            <p className="text-sm text-gray-500">
              Track scores, join draws & win prizes
            </p>
          </div>

          {/* ADMIN */}
          <div
            onClick={() => router.push("/pages/admin")}
            className="cursor-pointer p-8 w-60 rounded-2xl bg-white shadow-md hover:shadow-xl transition hover:scale-105"
          >
            <h2 className="text-xl font-semibold mb-2">Admin Panel</h2>
            <p className="text-sm text-gray-500">
              Manage draws, users & system
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}