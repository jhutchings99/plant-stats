import Navbar from "./components/Navbar/Navbar";
import SensorValueCard from "./components/SensorValueCard/SensorValueCard";
import { FaTemperatureHigh } from "react-icons/fa";
import { GiWateringCan, GiWaterDrop } from "react-icons/gi";
import { BsSunFill } from "react-icons/bs";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex justify-around mt-8">
        <SensorValueCard
          sensorName={"Temperature"}
          sensorValue={67.432}
          icon={<FaTemperatureHigh />}
        />
        <SensorValueCard
          sensorName={"Humidity"}
          sensorValue={42.53}
          icon={<GiWaterDrop />}
        />
        <SensorValueCard
          sensorName={"Soil Moisture"}
          sensorValue={84.85}
          icon={<GiWateringCan />}
        />
        <SensorValueCard
          sensorName={"Light Level"}
          sensorValue={90.84}
          icon={<BsSunFill />}
        />
      </div>
    </div>
  );
}
