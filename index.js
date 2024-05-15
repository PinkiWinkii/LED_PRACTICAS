import mqtt from 'mqtt';

const protocol = 'mqtts'
const host = '7b97ddb1a02b45308522e93ed8f9bcd1.s1.eu.hivemq.cloud'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'ledpatata',
  password: 'ABCD1234e',
  reconnectPeriod: 1000,
})

client.on('connect', () => {
  console.log('Connected to MQTT LED-PATATA');

  // Subscribe to a topic
  client.subscribe('control-led', function (err) {
      if (!err) {
          console.log('Subscribed to topic: control-led');
      }
  });

  let jsonTest = {
    "msg": 1
  }
  
  let payload = JSON.stringify(jsonTest);

  // Publish a message
  //client.publish('control-led', payload);
})

// Handle incoming messages
client.on('message', function (topic, message) {
  console.log('Received message on topic:', topic);
  console.log('Message:', message.toString());
});

// Error handling
client.on('error', function (error) {
  console.error('MQTT Client Error:', error);
});

client.on('offline', function () {
  console.warn('MQTT Client is offline');
});

client.on('reconnect', function () {
  console.log('Reconnecting to MQTT broker');
});

client.on('close', function () {
  console.log('Connection to MQTT broker closed');
});