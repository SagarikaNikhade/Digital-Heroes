"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import "./admin.css";

export default function AdminPage() {
    const [draw, setDraw] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [charityName, setCharityName] = useState("");
    const [description, setDescription] = useState("");

    const createCharity = async () => {
        try {
            const token = localStorage.getItem("digital-token");

            const role = localStorage.getItem("digital-role");

            if (role !== "admin") {
                alert("Only admin can create charity");
                return;
            }

            if (!charityName) {
                alert("Charity name required");
                return;
            }

            const res = await axios.post(
                "http://localhost:8000/charity/create",
                {
                    name: charityName,
                    description,
                },
                { headers: { Authorization: token } }
            );

            alert("Charity created successfully!");

            // reset form
            setCharityName("");
            setDescription("");
        } catch (err: any) {
            alert(err.response?.data?.message || "Error creating charity");
        }
    };

    const runDraw = async () => {
        const role = localStorage.getItem("digital-role");
        console.log("role:", localStorage.getItem("digital-role"));

        if (role !== "admin") {
            alert("Only admin can run draw");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("digital-token");

            const res = await axios.post(
                "http://localhost:8000/draw/run",
                {},
                { headers: { Authorization: token } }
            );

            setDraw(res.data);
        } catch (err: any) {
            alert(err.response?.data?.message || "Error running draw");
        } finally {
            setLoading(false);
        }
    };

    const fetchLatestDraw = async () => {
        try {
            const res = await axios.get("http://localhost:8000/draw/latest");
            setDraw(res.data);
        } catch {
            console.log("No draw yet");
        }
    };

    useEffect(() => {
        fetchLatestDraw();
    }, []);

   return (
  <div className="admin-container">
    
    <h2 className="admin-title">🧑‍💼 Admin Panel</h2>

    {/* DRAW BUTTON */}
    <div className="card">
      <button onClick={runDraw} disabled={loading}>
        {loading ? "Running Draw..." : "Run Monthly Draw"}
      </button>
    </div>

    {/* DRAW SECTION */}
    <div className="card">
      <h3 className="section-title">🎰 Latest Draw</h3>

      {draw ? (
        <div className="draw-box">
          <p><b>Numbers:</b> {draw.numbers.join(", ")}</p>
          <p><b>Prize Pool:</b> ₹{draw.prizePool}</p>
          <p><b>Jackpot:</b> ₹{draw.jackpotCarryForward}</p>

          <h4>🏆 Winners</h4>

          {draw.winners.length === 0 ? (
            <p>No winners this month</p>
          ) : (
            draw.winners.map((w: any) => (
              <div key={w.userId} className="winner-box">
                Match: {w.matchCount} | Prize: ₹{w.prize}
              </div>
            ))
          )}
        </div>
      ) : (
        <p>No draw data yet</p>
      )}
    </div>

    {/* CHARITY SECTION */}
    <div className="card">
      <h3 className="section-title">❤️ Create Charity</h3>

      <input
        placeholder="Charity Name"
        value={charityName}
        onChange={(e) => setCharityName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button onClick={createCharity}>
        Create Charity
      </button>
    </div>

  </div>
);
}