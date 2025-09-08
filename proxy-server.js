const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Simple HTTP proxy to ThingsBoard
app.post('/api/telemetry', async (req, res) => {
    try {
        console.log('📨 Received telemetry data:', req.body);

        // Forward to ThingsBoard HTTP endpoint
        const response = await fetch('http://www-dev.seag.cloud:8080/api/v1/zXKJxdn3i2yeTZdwKbgS/telemetry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body)
        });

        if (response.ok) {
            console.log('✅ Successfully forwarded to ThingsBoard');
            res.json({ success: true, message: 'Data sent to ThingsBoard' });
        } else {
            const errorText = await response.text();
            console.error('❌ ThingsBoard error:', response.status, errorText);
            res.status(response.status).json({
                success: false,
                error: `ThingsBoard error: ${response.status}`
            });
        }
    } catch (error) {
        console.error('❌ Proxy error:', error);
        res.status(500).json({
            success: false,
            error: 'Proxy server error'
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Simple proxy server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📨 Telemetry endpoint: http://localhost:${PORT}/api/telemetry`);
    console.log(`\n📱 To use with ngrok:`);
    console.log(`   1. Run: ngrok http ${PORT}`);
    console.log(`   2. Use the HTTPS URL in your HTML file`);
});
