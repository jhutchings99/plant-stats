"use client";

import { useEffect, useRef, useState } from "react";
import { PiPlant } from "react-icons/pi";

function connectBle(characteristicId: string, serviceId: string, model: any, dec:any, setSensorData: any, handleNewSensorData: any) {
  navigator.bluetooth.requestDevice({
    filters: [{ services: [serviceId] }]
  }).then(device => {
    return device.gatt?.connect();
  }).then(server => {
    return server?.getPrimaryService(serviceId);
  }).then(service => {
    return service?.getCharacteristic(characteristicId);
  }).then(character => {
    model.characteristic = character;
    getCurrentSensorData(character, dec, setSensorData, handleNewSensorData);
  });
}

function getCurrentSensorData(characteristic: any, dec: any, setSensorData: any, handleNewSensorData: any) {
  setInterval(() => {
    characteristic.readValue()
      .then((value: any) => {
        const sensorData = dec.decode(value);
        setSensorData(sensorData);
        handleNewSensorData(sensorData);
      })
  }, 1000);
}

async function sendDataToDb(sensorData: any) {
  try {
    const response = await fetch("/api/sensor-data", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sensorData)
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error posting sensor data:", error);
  }
}

function formatSensorValues(sensorValues: any) {
  let split = sensorValues.split("\n");

  let formatted = {
    temperature: parseFloat(split[0]),
    humidity: parseFloat(split[1]),
    soilMoisture: parseFloat(split[2]),
    lightLevel: parseFloat(split[3]),
  }
  return formatted;
}

export default function Navbar({ onSensorDataReceived }: any) {
  const [sensorData, setSensorData] = useState("");
  const latestSensorData = useRef<{} | null>(null);

  const dec = new TextDecoder();
  const serviceId        = "c4ae5be3-d939-4a88-82f9-8b8c73e81c01";
  const characteristicId = "b7b46926-2e25-4a90-9174-d71ae1c3bb12";
  
  let model = {
    characteristic: null,
    recvMsg: ""
  }

  const handleNewSensorData = (newData: any) => {
    latestSensorData.current = formatSensorValues(newData);
    onSensorDataReceived(newData);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (latestSensorData.current) {
        sendDataToDb(latestSensorData.current);
      }
    }, 10000);
  
    return () => clearInterval(intervalId);
  }, []);
  

  return (
    <div className=" flex justify-between items-center p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <PiPlant className="text-logo-secondary h-16 w-16" />
        <p className="text-logo-primary text-4xl">plant</p>
        <p className="text-logo-secondary text-4xl">stats</p>
      </div>
      <div className="flex gap-2">
        <button
          className="text-logo-secondary bg-logo-primary font-semibold rounded-md py-2 px-4 text-xl"
          onClick={() => {connectBle(characteristicId, serviceId, model, dec, setSensorData, handleNewSensorData)}}
        >
          Connect
        </button>
      </div>
    </div>
  );
}
