# 🚀 Xandeum pNode Analytics Dashboard

A full-stack MERN application for monitoring and analyzing Xandeum pNodes in real-time. Built with a Nigerian green & white color theme, this dashboard provides comprehensive insights into the decentralized storage network.

![Nigerian Green Theme](https://img.shields.io/badge/Theme-Nigerian_Green-008751?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-00C853?style=for-the-badge)

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Locally](#running-locally)
- [API Routes](#api-routes)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🌐 Core Functionality
- **Real-time pNode Monitoring**: Fetch and display all pNodes from Xandeum gossip network
- **Auto-refresh**: Data updates every 30 seconds automatically
- **Dual View Modes**: Switch between card grid and table views
- **Advanced Filtering**: Filter by status, region, and search by node ID
- **Statistics Dashboard**: View network-wide metrics and analytics

### 🎨 UI/UX Features
- **Nigerian Green & White Theme**: Vibrant, professional color scheme
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Graceful error messages and fallbacks
- **Status Badges**: Visual indicators for node status (Active, Gossiping, Offline)

### 📊 Data Visualization
- **Uptime Distribution Chart**: See node uptime patterns
- **Storage Metrics**: Visualize storage usage with progress bars
- **Regional Distribution**: Filter and view nodes by geographic region
- **Network Statistics**: Real-time stats on total nodes, active nodes, and storage

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Custom styling (no frameworks - pure CSS)
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Axios** - pRPC API integration

### DevOps
- **Git** - Version control
- **npm** - Package management

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/xandeum-pnode-analytics.git
cd xandeum-pnode-analytics
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. Create `.env` file in the `backend` directory:

```bash
cd backend
cp .env.example .env
```

2. Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/xandeum-pnodes

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Xandeum pRPC API
PRPC_BASE_URL=https://api.xandeum.network
# Note: Update above URL based on actual Xandeum documentation

# Cache Settings
CACHE_TTL=30000
```

### Frontend Configuration

1. Create `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

2. Edit `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🏃 Running Locally

### Option 1: Run Both Services Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server will start at `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
App will start at `http://localhost:5173`

### Option 2: Production Build

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Accessing the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## 📡 API Routes

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Get All pNodes
```http
GET /api/pnodes
```

**Query Parameters:**
- `refresh` (optional): Set to 'true' to bypass cache

**Response:**
```json
{
  "success": true,
  "cached": false,
  "data": [
    {
      "id": "pNode-001-ABC123",
      "gossipStatus": "active",
      "storage": {
        "used": 45000000000,
        "total": 100000000000,
        "available": 55000000000
      },
      "location": {
        "country": "Nigeria",
        "region": "West Africa",
        "city": "Lagos",
        "coordinates": { "lat": 6.5244, "lon": 3.3792 }
      },
      "uptime": 2592000,
      "version": "1.2.3",
      "lastSeen": "2024-12-06T10:30:00Z",
      "metadata": {
        "ip": "197.210.x.x",
        "port": 8080,
        "latency": 45
      }
    }
  ],
  "count": 5,
  "timestamp": "2024-12-06T10:30:00Z"
}
```

#### 2. Get Specific pNode
```http
GET /api/pnodes/:id
```

**Response:**
```json
{
  "success": true,
  "data": { /* pNode object */ },
  "timestamp": "2024-12-06T10:30:00Z"
}
```

#### 3. Get Network Statistics
```http
GET /api/pnodes/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 5,
    "active": 3,
    "gossiping": 1,
    "offline": 1,
    "byRegion": {
      "West Africa": 2,
      "North America": 1,
      "Europe": 1,
      "Asia": 1
    },
    "totalStorage": {
      "used": 370000000000,
      "total": 800000000000,
      "available": 430000000000
    },
    "averageUptime": 4838400
  },
  "timestamp": "2024-12-06T10:30:00Z"
}
```

#### 4. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-06T10:30:00Z",
  "service": "Xandeum pNode Analytics API"
}
```

---

## 🚀 Deployment

### Deploy Backend (Render / Railway / Heroku)

#### Using Render:

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
4. Add environment variables from `.env`
5. Deploy!

### Deploy Frontend (Vercel / Netlify)

#### Using Vercel:

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy from frontend directory:
```bash
cd frontend
vercel
```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL` = Your backend URL

#### Using Netlify:

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `dist` folder to Netlify

3. Set environment variable:
   - `VITE_API_URL` = Your backend URL

### MongoDB Atlas (Production Database)

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update backend `MONGODB_URI` environment variable

---

## 📁 Project Structure

```
xandeum-pnode-analytics/
├── backend/
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic (pRPC integration)
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   └── server.js         # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   ├── styles/       # CSS files
│   │   └── utils/        # Helper functions
│   └── public/           # Static assets
└── README.md
```

---

## 🎨 Design System

### Color Palette

```css
/* Primary Colors */
--color-primary: #008751;         /* Nigerian Green */
--color-primary-light: #00A860;
--color-primary-dark: #006B3F;
--color-primary-lighter: #E8F5E9;

/* Status Colors */
--color-status-active: #4CAF50;
--color-status-gossiping: #00C853;
--color-status-offline: #9E9E9E;
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 400, 500, 600, 700, 800, 900

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Xandeum Labs** for the pNode network infrastructure
- **Nigerian Tech Community** for inspiration
- Built with 💚 in Nigeria

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Visit [Xandeum Documentation](https://xandeum.network)
- Email: support@xandeum.network

---

## 🌟 Show Your Support

If you found this project helpful, give it a ⭐️!

---

**Made with 💚 by Xandeum Labs** | Powered by Nigerian Innovation 🇳🇬
