#include <ESP8266WiFi.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

// WiFi Connection Details
const char* ssid = "SM-N920P59B";
const char* password = "0777883570";

// Data sensor
int bpm;
float temperatureDHT, temperatureLM35, humidity;
char mqtt_message[512];
bool flag = true;
String receivedData;

// MQTT Broker Connection Details
const char* mqtt_server = "2c41ea6628d949ec81f1c888f8ab3d76.s1.eu.hivemq.cloud";
const char* mqtt_username = "hieucb98";
const char* mqtt_password = "hieucb98";
const int mqtt_port = 8883;

// Secure WiFi Connectivity Initialisation
WiFiClientSecure espClient;

// MQTT Client Initialisation Using WiFi Connection
PubSubClient client(espClient);

// Connect to WiFi
void setup_wifi() {
  delay(10);
  Serial.print("\nConnecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  randomSeed(micros());
  Serial.println("\nWiFi connected\nIP address: ");
  Serial.println(WiFi.localIP());
}

// Connect to MQTT Broker
void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP8266Client-";   // Create a random client ID
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqtt_username, mqtt_password)) {
      Serial.println("connected");
      // client.subscribe("");   // subscribe the topics here
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");   // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void processReceivedData(String data) {
  if (data.startsWith("BPM:")) {
    bpm = data.substring(4).toInt();
    Serial.print("BPM received: ");
    Serial.println(bpm);
  }
  else if (data.startsWith("Humidity:")) {
    humidity = data.substring(9).toFloat();
    Serial.print("Humidity received: ");
    Serial.println(humidity);
  }
  else if (data.startsWith("TemperatureDHT:")) {
    temperatureDHT = data.substring(15).toFloat();
    Serial.print("DHT received: ");
    Serial.println(temperatureDHT);
  }
  else if (data.startsWith("TemperatureLM35:")) {
    temperatureLM35 = data.substring(16).toFloat();
    Serial.print("LM35 received: ");
    Serial.println(temperatureLM35);
  }
}

void processMessage() {
  Serial.print("BPM: "); Serial.println(bpm);
Serial.print("Temperature DHT: "); Serial.println(temperatureDHT);
Serial.print("Temperature LM35: "); Serial.println(temperatureLM35);
Serial.print("Humidity: "); Serial.println(humidity);
  if(bpm <= 0 || isnan(temperatureDHT) || isnan(temperatureLM35) || isnan(humidity)) {
    flag = false;
    return;
  };
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();

  JsonObject obj1 = array.createNestedObject();
  obj1["sensorType"] = "DHT11";
  obj1["metric"] = "temperature";
  obj1["value"] = temperatureDHT;

  JsonObject obj2 = array.createNestedObject();
  obj2["sensorType"] = "DHT11";
  obj2["metric"] = "humidity";
  obj2["value"] = humidity;

  JsonObject obj3 = array.createNestedObject();
  obj3["sensorType"] = "LM35";
  obj3["metric"] = "temperature";
  obj3["value"] = temperatureLM35;

  JsonObject obj4 = array.createNestedObject();
  obj4["sensorType"] = "Pulse senor";
  obj4["metric"] = "Heartbeat";
  obj4["value"] = bpm;

  serializeJson(doc, mqtt_message);
}

// Method for Publishing MQTT Messages
void publishMessage(const char* topic, String payload){
  Serial.println("Publish message to topic: " + String(topic));
  if (client.publish(topic, payload.c_str(), false))
      Serial.println("Message publised ["+String(topic)+"]: "+payload);
}

// Application Initialisation Function
void setup() {
  Serial.begin(115200);
  while (!Serial) delay(1);
  setup_wifi();

  espClient.setInsecure();

  client.setServer(mqtt_server, mqtt_port);
}

// Main Function
void loop() {
  bpm = -1;
  humidity = NAN;
  temperatureDHT = NAN;
  temperatureLM35 = NAN;
  flag = true;
  if (!client.connected()) reconnect(); // check if client is connected
  client.loop();

  while (Serial.available()) {
    char c = Serial.read();
    receivedData += c;

    if (c == '\n') {
      processReceivedData(receivedData);
      receivedData = "";
    }
  }
  processMessage();
  if(!flag) return;

  publishMessage("sensor-data", mqtt_message);
}