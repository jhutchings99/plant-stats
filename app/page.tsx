"use client";

import Navbar from "./components/Navbar/Navbar";
import SensorValueCard from "./components/SensorValueCard/SensorValueCard";
import { FaTemperatureHigh } from "react-icons/fa";
import { GiWateringCan, GiWaterDrop } from "react-icons/gi";
import { BsSunFill } from "react-icons/bs";
import { useState, useEffect } from "react";

interface SensorData {
  temperature: number;
  humidity: number;
  soilMoisture: number;
  lightLevel: number;
}

export default function Home() {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/sensor-data");
        const data = await response.json();
        setSensorData(data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    }

    fetchData();
  }, []);

  const realtimeTemp = sensorData[0]?.temperature || 0;
  const realtimeHumid = sensorData[0]?.humidity || 0;
  const realtimeSoil = sensorData[0]?.soilMoisture || 0;
  const realtimeLight = sensorData[0]?.lightLevel || 0;

  return (
    <div>
      <Navbar />
      <div className="flex justify-around mt-8">
        <SensorValueCard
          sensorName={"Temperature"}
          sensorValue={realtimeTemp}
          icon={<FaTemperatureHigh />}
        />
        <SensorValueCard
          sensorName={"Humidity"}
          sensorValue={realtimeHumid}
          icon={<GiWaterDrop />}
        />
        <SensorValueCard
          sensorName={"Soil Moisture"}
          sensorValue={realtimeSoil}
          icon={<GiWateringCan />}
        />
        <SensorValueCard
          sensorName={"Light Level"}
          sensorValue={realtimeLight}
          icon={<BsSunFill />}
        />
      </div>
    </div>
  );
}
