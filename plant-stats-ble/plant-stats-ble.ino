#include "DHT.h"
#include <BLEDevice.h>
#include "heltec.h"

#define DEVICE_NAME         "Jeremy Plant Stats BLE"
#define SERVICE_UUID        "c4ae5be3-d939-4a88-82f9-8b8c73e81c01"
#define CHARACTERISTIC_UUID "b7b46926-2e25-4a90-9174-d71ae1c3bb12"

#define DHTPIN 13
#define DHTTYPE DHT11
#define MOISTURE 36
#define LIGHT 37

BLECharacteristic *pCharacteristic;
String data = "";

DHT dht(DHTPIN, DHTTYPE);
float temperatureFValue, humidityValue;
int moistureValue;
float moisture;
int lightValue;
float light;

const int dry = 2700;
const int wet = 239;

const int high = 4095;
const int low = 10;

void printToScreen(String s) {
  Heltec.display->clear();
  Heltec.display->drawString(0, 0, s);
  Heltec.display->display();
}


class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      printToScreen("BLE client connected.");
    };

    void onDisconnect(BLEServer* pServer) {
      printToScreen("BLE client disconnected.");
      BLEDevice::startAdvertising();
    }
};


class MyCharacteristicCallbacks: public BLECharacteristicCallbacks {
  void onWrite(BLECharacteristic *characteristic) {
    data = String(characteristic->getValue().c_str());
    printToScreen("Received:\n" + data);

    if (data == "testing") {
      digitalWrite(25, LOW);
      data.toUpperCase();
      pCharacteristic->setValue(data.c_str());
    }
    if (data == "ledon") {
      digitalWrite(25, HIGH);
    }
  }
};


void setup() {
  Serial.begin(115200);
  Heltec.begin(true /*display*/, false /*LoRa*/, true /*Serial*/);
  dht.begin();
  pinMode(MOISTURE, INPUT);
  pinMode(LIGHT, INPUT);

  printToScreen("Starting BLE!");
  BLEDevice::init(DEVICE_NAME);

  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY
  );

  pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());
  pCharacteristic->setValue("Init");

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  BLEDevice::startAdvertising();
}

float mapfloat(float x, float in_min, float in_max, float out_min, float out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void loop() {
  temperatureFValue = dht.readTemperature(true);
  humidityValue = dht.readHumidity();

  int moistureValue = analogRead(MOISTURE);  
  moisture = mapfloat(moistureValue, wet, dry, 100, 0); 

  int lightValue = analogRead(LIGHT);
  light = mapfloat(lightValue, low, high, 0, 100);

  String sensorValuesString = String(temperatureFValue) +  "\n" + String(humidityValue) + "\n" + String(moisture) + "\n" + String(light);
  
  Serial.println(lightValue);
  // Serial.println(moistureValue);
  // Serial.println(sensorValuesString);
  printToScreen(sensorValuesString);
  
  pCharacteristic->setValue(sensorValuesString.c_str());

  pCharacteristic->notify();

  delay(1000);
}
