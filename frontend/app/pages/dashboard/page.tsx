"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./dashboard.css";

type User = {
  name: string;
  email: string;
  subscription: {
    status: string
  }
};

type Score = {
  _id: string;
  score: number;
  date: string;
};

type Draw = {
  numbers: number[];
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [score, setScore] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [scores, setScores] = useState<Score[]>([]);
  const [draw, setDraw] = useState<Draw | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("digital-token");

    if (!token) {
      router.push("/login");
      return;
    }

    const init = async () => {
      try {
        const res = await axios.get("http://localhost:8000/user/me", {
          headers: { Authorization: token },
        });

        setUser(res.data);

        // ✅ only fetch scores if subscribed
        if (res.data.subscription?.status === "active") {
          fetchScores();
        }

        fetchDraw();
      } catch {
        router.push("/login");
      }
    };

    init();
  }, []);

  const fetchScores = async () => {
    const token = localStorage.getItem("digital-token");

    const res = await axios.get("http://localhost:8000/score", {
      headers: { Authorization: token },
    });

    setScores(res.data);
  };

  const fetchDraw = async () => {
    try {
      const res = await axios.get("http://localhost:8000/draw/latest");
      setDraw(res.data);
    } catch (err) {
      console.log("No draw yet");
    }
  };

  const handleAddScore = async () => {
    const token = localStorage.getItem("digital-token");

    if (+score < 1 || +score > 45) {
      alert("Score must be between 1–45");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/score/add",
        { score: +score, date },
        { headers: { Authorization: token } }
      );

      setScore("");
      setDate("");
      fetchScores();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("digital-token");
    router.push("/pages/login");
  };

  const handleSubscribe = async (plan: string) => {
    const token = localStorage.getItem("digital-token");

    if (!(window as any).Razorpay) {
      alert("Payment SDK not loaded");
      return;
    }

    const { data } = await axios.post(
      "http://localhost:8000/payment/create-order",
      { plan },
      { headers: { Authorization: token } }
    );

    const options = {
      key: "rzp_test_SilbddfeKk0xty",
      amount: data.amount,
      currency: data.currency,
      order_id: data.id,

      name: "Digital Heroes",
      description: "Subscription Payment",

      handler: async (response: any) => {
        await axios.post(
          "http://localhost:8000/payment/verify",
          { ...response, plan },
          { headers: { Authorization: token } }
        );

        alert("Payment successful!");

        // ✅ better than reload
        const updatedUser = await axios.get("http://localhost:8000/user/me", {
          headers: { Authorization: token },
        });

        setUser(updatedUser.data);
        fetchScores();
      },

      prefill: {
        name: user?.name,
        email: user?.email,
      },

      theme: {
        color: "#2563eb",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <h2>🏆 Digital Heroes</h2>
        <button onClick={handleLogout}>Logout</button>
      </header>

      {/* Top Section */}
      <div className="top-grid">
        {/* User Card */}
        <div className="user-card">
          <h3>Welcome, {user.name}</h3>
          <p>{user.email}</p>
        </div>

        {/* Subscription Card */}
        <div className="card subscription-card">
          <h3>Subscription</h3>

          <p>
            Status:{" "}
            <span
              className={
                user.subscription?.status === "active"
                  ? "active"
                  : "inactive"
              }
            >
              {user.subscription?.status === "active"
                ? "Active"
                : "Inactive"}
            </span>
          </p>

          {user.subscription?.status !== "active" && (
            <div className="subscribe-actions">
              <button onClick={() => handleSubscribe("monthly")}>
                Monthly Plan
              </button>
              <button onClick={() => handleSubscribe("yearly")}>
                Yearly Plan
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid">
        {/* Score Section */}
        <div className="card">
          <h3>Your Scores</h3>

          {user.subscription?.status !== "active" ? (
            <p className="warning">
              Subscribe to add and view scores
            </p>
          ) : (
            <>
              <div className="score-form">
                <input
                  placeholder="Score (1–45)"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />

                <button onClick={handleAddScore}>Add Score</button>
              </div>

              <div className="score-list">
                {scores.length === 0 ? (
                  <p>No scores yet</p>
                ) : (
                  scores.map((s) => (
                    <div key={s._id} className="score-item">
                      <span>{s.score}</span>
                      <span>{s.date}</span>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h3>Latest Draw</h3>

          {draw ? (
            <p>{draw.numbers.join(", ")}</p>
          ) : (
            <p>No draw yet</p>
          )}
        </div>

        {/* Charity */}
        <div className="card">
          <h3>Charity</h3>
          <p>Coming soon</p>
        </div>

        {/* Winnings */}
        <div className="card">
          <h3>Winnings</h3>
          <p>₹0</p>
        </div>
      </div>
    </div>
  );
}