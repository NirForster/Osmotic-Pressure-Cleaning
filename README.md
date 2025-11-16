# Osmotic-Pressure-Cleaning
Ben Gigi - Osmotic Pressure Cleaning Devices 

## Deployment

This application is deployed on Render with the following services:

### Backend (API Server)
- **URL**: https://osmotic-pressure-cleaning.onrender.com
- **Type**: Web Service (Node.js)
- **Root Directory**: `server/`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGODB_URI`: MongoDB Atlas connection string
  - `NODE_ENV`: Set to `production`
  - `CLIENT_URL`: Frontend URL for CORS (https://osmotic-pressure-cleaning-client.onrender.com)

### Frontend (React Client)
- **URL**: https://osmotic-pressure-cleaning-client.onrender.com
- **Type**: Static Site
- **Root Directory**: `client/`
- **Build Command**: `cd client && npm install && npm run build`
- **Publish Directory**: `client/dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: Backend API URL (https://osmotic-pressure-cleaning.onrender.com/api)

### Local Development

1. **Backend**:
   ```bash
   cd server
   npm install
   cp .env.example .env  # Create .env file with your MongoDB URI
   npm run dev
   ```

2. **Frontend**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

The frontend will automatically connect to `http://localhost:3000/api` in development mode.
