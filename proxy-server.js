const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// MQTT Configuration (same as your mosquitto command)
const MQTT_BROKER = 'mqtt-dev.seag.cloud';
const MQTT_PORT = 1883;
const MQTT_TOPIC = 'v1/devices/me/telemetry';
const MQTT_USERNAME = 'zXKJxdn3i2yeTZdwKbgS';

// MQTT Client
let mqttClient = null;

// Initialize MQTT connection
function initMQTT() {
    console.log(`🔗 Connecting to MQTT broker: ${MQTT_BROKER}:${MQTT_PORT}`);

    mqttClient = mqtt.connect(`mqtt://${MQTT_BROKER}:${MQTT_PORT}`, {
        username: MQTT_USERNAME,
        clean: true,
        connectTimeout: 4000,
        reconnectPeriod: 1000,
    });

    mqttClient.on('connect', function () {
        console.log('✅ Connected to MQTT broker');
    });

    mqttClient.on('error', function (error) {
        console.error('❌ MQTT connection error:', error);
    });

    mqttClient.on('offline', function () {
        console.log('⚠️ MQTT client offline');
    });

    mqttClient.on('reconnect', function () {
        console.log('🔄 MQTT reconnecting...');
    });
}

// MQTT proxy endpoint
app.post('/api/telemetry', async (req, res) => {
    try {
        console.log('📨 Received telemetry data:', req.body);

        if (mqttClient && mqttClient.connected) {
            // Publish to MQTT broker (same as mosquitto_pub command)
            mqttClient.publish(MQTT_TOPIC, JSON.stringify(req.body), { qos: 1 }, function (error) {
                if (error) {
                    console.error('❌ MQTT publish error:', error);
                    res.status(500).json({
                        success: false,
                        error: `MQTT publish error: ${error.message}`
                    });
                } else {
                    console.log('✅ Published to MQTT:', req.body);
                    res.json({
                        success: true,
                        message: 'Data sent to MQTT broker'
                    });
                }
            });
        } else {
            console.error('❌ MQTT client not connected');
            res.status(503).json({
                success: false,
                error: 'MQTT client not connected'
            });
        }
    } catch (error) {
        console.error('❌ Proxy error:', error);
        res.status(500).json({
            success: false,
            error: `Proxy server error: ${error.message}`
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        mqtt_connected: mqttClient && mqttClient.connected,
        timestamp: new Date().toISOString()
    });
});

// Initialize MQTT connection
initMQTT();

app.listen(PORT, () => {
    console.log(`🚀 MQTT Proxy server running on port ${PORT}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`📨 Telemetry endpoint: http://localhost:${PORT}/api/telemetry`);
    console.log(`\n📱 Deployed to Render: https://compass-1.onrender.com`);
    console.log(`🔗 MQTT Broker: ${MQTT_BROKER}:${MQTT_PORT}`);
    console.log(`📡 MQTT Topic: ${MQTT_TOPIC}`);
});
