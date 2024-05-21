import mqtt from 'mqtt';
import fs from 'fs';
import express from 'express';
import sharp from 'sharp';

const protocol = 'mqtts';
const host = '7b97ddb1a02b45308522e93ed8f9bcd1.s1.eu.hivemq.cloud';
const port = '8883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `${protocol}://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'ledpatata',
  password: 'ABCD1234e',
  reconnectPeriod: 1000,
});

const app = express();
let isConnected = false;

app.get('/photo', (req, res) => {
  const imagePath = 'photo.jpg';

  fs.readFile(imagePath, (err, data) => {
    if (err) {
      console.error('Error reading image:', err);
      res.status(500).send('Internal Server Error');
      return;
    }
    res.set('Content-Type', 'image/jpeg');
    res.send(data);
  });
});

client.on('connect', () => {
  console.log('Connected to MQTT LED-PATATA');
  isConnected = true;

  client.subscribe('control-led', (err) => {
    if (!err) {
      console.log('Subscribed to topic: control-led');
    }
  });

  client.subscribe('photo', (err) => {
    if (!err) {
      console.log('Subscribed to topic: photo');
    }
  });
});

// Handle incoming messages
client.on('message', (topic, message) => {
  if (!isConnected) return;  // Ensure the client is connected

  console.log('Received message on topic:', topic);

  if (topic === 'photo') {
    const imagePath = 'photo.jpg';

    // Save the received buffer as an image file
    fs.writeFile(imagePath, message, (err) => {
      if (err) {
        console.error('Error saving the image:', err);
      } else {
        console.log('Image saved successfully to', imagePath);
      }
    });
  } else {
    console.log('Message:', message.toString());
  }
});

// Error handling
client.on('error', (error) => {
  console.error('MQTT Client Error:', error);
});

client.on('offline', () => {
  console.warn('MQTT Client is offline');
});

client.on('reconnect', () => {
  console.log('Reconnecting to MQTT broker');
});

client.on('close', () => {
  console.log('Connection to MQTT broker closed');
});

// Start the server
const server = app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
