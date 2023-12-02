#include "DHT.h"
#include <BLEDevice.h>
#include "heltec.h"

#define DEVICE_NAME         "Jeremy Plant Stats BLE"
#define SERVICE_UUID        "c4ae5be3-d939-4a88-82f9-8b8c73e81c01"
#define CHARACTERISTIC_UUID "b7b46926-2e25-4a90-9174-d71ae1c3bb12"

#define DHTPIN 13
#define DHTTYPE DHT11
#define MOISTURE A0


BLECharacteristic *pCharacteristic;
String data = "";


DHT dht(DHTPIN, DHTTYPE);
float temperatureFValue, humidityValue;


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

  printToScreen("Starting BLE!");
  BLEDevice::init(DEVICE_NAME);

  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  BLEService *pService = pServer->createService(SERVICE_UUID);

  pCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ | BLECharacteristic::PROPERTY_WRITE
  );
  pCharacteristic->setCallbacks(new MyCharacteristicCallbacks());
  pCharacteristic->setValue("Init");

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(true);
  BLEDevice::startAdvertising();
}


// void loop() {
//   temperatureFValue = dht.readTemperature(true);
//   humidityValue = dht.readHumidity();

//   int moistureSensor = analogRead(MOISTURE);
  
//   String sensorValuesString = String(temperatureFValue) +  "°F\n" + String(humidityValue) + "%\n" + String(moistureSensor) + "\n";
  
//   Serial.println(sensorValuesString);
//   printToScreen(sensorValuesString);
// }

void loop(){}
