import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import { Grid, Paper, Typography, Box, Card } from "@mui/material";
import robotIconImage from "./assets/robot-icon.png";
import criticalRobotIconImage from "./assets/critical-robot-icon.png";

// Default robot icon
const robotIcon = L.icon({
    iconUrl: robotIconImage,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

// Critical robot icon
const criticalRobotIcon = L.icon({
    iconUrl: criticalRobotIconImage,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

// Helper function to get the city from latitude and longitude
const getCityFromCoordinates = async (lat, lon) => {
    try {
        const response = await axios.get("https://nominatim.openstreetmap.org/reverse", {
            params: {
                lat,
                lon,
                format: "json",
            },
        });
        const address = response.data.address;
        return address.city || address.town || address.village || "Unknown location";
    } catch (error) {
        console.error("Error fetching city:", error);
        return "Unknown location";
    }
};

function MapView() {
    const [robots, setRobots] = useState([]);
    const [cityNames, setCityNames] = useState({});

    useEffect(() => {
        const fetchRobots = async () => {
            try {
                const { data } = await axios.get("http://localhost:8000/robots");
                setRobots(data.slice(0, 30)); // Fetch and limit to 30 robots

                // Fetch city names for robots
                const cityPromises = data.slice(0, 30).map(async (robot) => {
                    const [lat, lon] = robot["Location Coordinates"];
                    const city = await getCityFromCoordinates(lat, lon);
                    return { id: robot["Robot ID"], city };
                });

                const cities = await Promise.all(cityPromises);
                const cityMap = cities.reduce((acc, curr) => {
                    acc[curr.id] = curr.city;
                    return acc;
                }, {});
                setCityNames(cityMap);
            } catch (error) {
                console.error("Error fetching robot data:", error);
            }
        };

        fetchRobots();
        const interval = setInterval(fetchRobots, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval); // Cleanup interval
    }, []);

    return (
        <Box sx={{ height: "100vh", display: "flex" }}>
            {/* Left Column: Robot Details */}
            <Paper
                elevation={3}
                sx={{
                    width: "30%",
                    height: "100%",
                    overflowY: "auto",
                    padding: 2,
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Robot Details
                </Typography>
                <Grid container spacing={2}>
                    {robots.map((robot) => (
                        <Grid item xs={12} key={robot["Robot ID"]}>
                            <Card
                                variant="outlined"
                                sx={{
                                    padding: 1,
                                    borderColor:
                                        !robot["Online/Offline"] || robot["Battery Percentage"] < 20
                                            ? "red"
                                            : "default",
                                    boxShadow:
                                        !robot["Online/Offline"] || robot["Battery Percentage"] < 20
                                            ? "0 0 8px red"
                                            : "none",
                                }}
                            >
                                <Typography variant="body1">
                                    <strong>ID:</strong> {robot["Robot ID"]}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>City:</strong>{" "}
                                    {cityNames[robot["Robot ID"]] || "Loading..."}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Status:</strong>{" "}
                                    {robot["Online/Offline"] ? "Online" : "Offline"}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Battery:</strong> {robot["Battery Percentage"]}%
                                </Typography>
                                <Typography variant="body2">
                                    <strong>CPU Usage:</strong> {robot["CPU Usage"]}%
                                </Typography>
                                <Typography variant="body2">
                                    <strong>RAM Consumption:</strong> {robot["RAM Consumption"]} MB
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Last Updated:</strong> {robot["Last Updated"]}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Paper>

            {/* Right Column: Map View */}
            <Box sx={{ width: "70%", height: "100%" }}>
                <MapContainer center={[0, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {robots.map((robot) => {
                        const [lat, lon] = robot["Location Coordinates"];
                        const isCritical =
                            robot["Battery Percentage"] < 20 || !robot["Online/Offline"];

                        return (
                            <Marker
                                key={robot["Robot ID"]}
                                position={[lat, lon]}
                                icon={isCritical ? criticalRobotIcon : robotIcon}
                            >
                                <Popup>
                                    <div>
                                        <p><strong>ID:</strong> {robot["Robot ID"]}</p>
                                        <p><strong>City:</strong> {cityNames[robot["Robot ID"]] || "Loading..."}</p>
                                        <p>
                                            <strong>Status:</strong>{" "}
                                            {robot["Online/Offline"] ? "Online" : "Offline"}
                                        </p>
                                        <p><strong>Battery:</strong> {robot["Battery Percentage"]}%</p>
                                        <p><strong>Last Updated:</strong> {robot["Last Updated"]}</p>
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </Box>
        </Box>
    );
}

export default MapView;
