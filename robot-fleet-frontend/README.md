# Robot Fleet Monitoring Dashboard

A responsive web application that monitors a fleet of robots in real time. The application provides robot details, displays their locations on a map, and highlights robots that are offline or have low battery levels.

---

## Features

1. **Robot Details Dashboard**:
   - Displays details like ID, status, battery percentage, CPU usage, and last updated time.
   - Highlights critical robots (offline or battery < 20%).

2. **Real-Time Map View**:
   - Shows robot positions on a world map using custom icons.
   - Displays detailed information in popups for each robot.

3. **Real-Time Updates**:
   - Backend sends updates every 5 seconds via WebSocket.
   - Frontend reflects the updated robot details and positions.

4. **Responsive Design**:
   - Optimized for desktop and mobile devices.

---

## Tools and Technologies

### Frontend
- **React.js**: For building the interactive user interface.
- **React-Leaflet**: For rendering the map view and markers.
- **Material-UI**: For styling and responsive design.
- **Axios**: For making API requests to the backend.

### Backend
- **Flask**: For serving robot data via REST API.
- **Flask-SocketIO**: For real-time WebSocket communication.
- **Flask-CORS**: To enable cross-origin requests from the frontend.

### Other Tools
- **OpenStreetMap Nominatim API**: For reverse geocoding (fetching city names from latitude and longitude).
- **JSON**: For storing and simulating robot data.

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd <repository-folder>
```
### 2. Backend Setup
```bash
** i. Navigate to the robot-fleet-backend/ folder:

        cd robot-fleet-backend
** ii. Install Python Dependencies:

        pip install flask flask-cors flask-socketio eventlet
** iii. Add the fake_robot_data.json File:

        Place your JSON file containing robot data in the robot-fleet-backend/ folder.
**Run the Flask Server:

        python app.py
## Flask server will run at http://localhost:8000.
```
### 3. Frontend Setup
```bash 
** i. Navigate to the robot-fleet-frontend/ folder:

        cd robot-fleet-frontend
** ii. Install Node.js Dependencies:

        npm install
** iii. Run the React App:

        npm start
React app will be available at http://localhost:3000.
```
### Project Structure
Backend (robot-fleet-backend/)
```bash
robot-fleet-backend/
├── app.py                 # Flask server with REST API and WebSocket
├── fake_robot_data.json   # JSON file with robot data
```
Frontend (robot-fleet-frontend/)
```bash
robot-fleet-frontend/
├── public/
│   ├── index.html         # Main HTML file
├── src/
│   ├── assets/            # Icons for robots
│   ├── Home.jsx  # Displays robot details
│   ├── MapView.jsx    # Displays the map view
│   │   
│   ├── AppRouter.js             # Main React component
│   ├── index.js           # Entry point
    ├── README.md
```
