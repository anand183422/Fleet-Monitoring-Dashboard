import React from "react";
import { useNavigate } from "react-router-dom";
import "./App.css"; 

function Home() {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            {/* Welcome Text */}
            <div className="home-content">
                <h1 className="home-title">Welcome to Fleet Dashboard</h1>
                <p className="home-subtitle">Hover and Explore!</p>
                {/* Hover Button */}
                <div
                    className="hover-button"
                    onClick={() => navigate("/map")}
                >
                    Enter Dashboard
                </div>
            </div>
        </div>
    );
}

export default Home;
