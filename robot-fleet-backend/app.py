from flask import Flask, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
import json
import time
import threading

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSocket support

# Load robot data from JSON file
with open("fake_robot_data.json", "r") as file:
    all_robots = json.load(file)
    robots = all_robots[:30]  # Use only the first 10 valid data points


# REST API Endpoint: Get robot data
@app.route("/robots", methods=["GET"])
def get_robot_data():
    return jsonify(robots)


# Background thread for real-time updates
def send_updates():
    while True:
        # Simulate real-time updates (e.g., decrement battery percentage for online robots)
        for robot in robots:
            if robot["Online/Offline"]:
                robot["Battery Percentage"] = max(0, robot["Battery Percentage"] - 1)
        socketio.emit("robot_data", robots)  # Send updated data to WebSocket clients
        time.sleep(5)  # Update every 5 seconds


# Start the background thread when the server starts
@socketio.on("connect")
def on_connect():
    print("Client connected")


@socketio.on("disconnect")
def on_disconnect():
    print("Client disconnected")


if __name__ == "__main__":
    # Start the background thread
    threading.Thread(target=send_updates, daemon=True).start()
    # Run the Flask app
    socketio.run(app, host="0.0.0.0", port=8000)
