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
  const [realtimeTemp, setRealtimeTemp] = useState(0);
  const [realtimeHumid, setRealtimeHumid] = useState(0);
  const [realtimeSoil, setRealtimeSoil] = useState(0);
  const [realtimeLight, setRealtimeLight] = useState(0);

  const handleSensorDataReceived = (newData: any) => {
    const split = newData.split("\n");
    setRealtimeTemp(parseFloat(split[0]));
    setRealtimeHumid(parseFloat(split[1]));
    setRealtimeSoil(parseInt(split[2]));
    setRealtimeLight(parseInt(split[3]));
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const response = await fetch("/api/sensor-data");
  //       const data = await response.json();
  //       console.log(data);
  //     } catch (error) {
  //       console.error("Error fetching sensor data:", error);
  //     }
  //   }

  //   fetchData();
  // }, []);

  return (
    <div>
      <Navbar onSensorDataReceived={handleSensorDataReceived} />
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
