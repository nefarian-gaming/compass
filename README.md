# Compass to ThingsBoard Proxy

This proxy server solves the mixed content issue by forwarding HTTPS requests from your browser to the HTTP ThingsBoard endpoint.

## Quick Setup

### Option 1: Deploy to Heroku (Recommended)

1. **Install Heroku CLI** and login
2. **Create a new Heroku app:**
   ```bash
   heroku create your-compass-proxy
   ```
3. **Deploy:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```
4. **Update the HTML file** with your Heroku URL:
   ```javascript
   const TELEMETRY_ENDPOINT = "https://your-compass-proxy.herokuapp.com/api/telemetry";
   ```

### Option 2: Run Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Update the HTML file** to use localhost:
   ```javascript
   const TELEMETRY_ENDPOINT = "http://localhost:3000/api/telemetry";
   ```

### Option 3: Deploy to Railway/Render

Both Railway and Render offer free hosting for Node.js apps. Just connect your GitHub repo and deploy.

## How It Works

1. **Browser** (HTTPS) → **Proxy Server** (HTTPS) ✅ No mixed content issues
2. **Proxy Server** (HTTP) → **ThingsBoard** (HTTP) ✅ Server-to-server communication

## Testing

- Health check: `GET /health`
- Telemetry: `POST /api/telemetry` with `{"heading": 123}`

## Environment Variables

- `PORT`: Server port (default: 3000)
