interface Props {
  sensorName: string;
  sensorValue: number;
  icon: JSX.Element;
}

export default function SensorValueCard({
  sensorName,
  sensorValue,
  icon,
}: Props) {
  const formattedSensorValue = sensorValue.toFixed(2);

  return (
    <div className="border-2 border-black rounded-md h-[30vh] w-[20vw] p-4">
      <div className="flex items-center justify-center gap-2">
        <p className="text-3xl">{icon}</p>
        <p className="text-2xl font-bold">{sensorName}</p>
      </div>
      <hr className="bg-black" />
      <div className="flex items-center justify-center pb-4">
        <p className="text-5xl pt-4">{formattedSensorValue}</p>
        <p className="text-2xl font-thin pt-4">
          {sensorName === "Temperature" ? "°F" : "%"}
        </p>
      </div>

      {/* Temperature Checks */}
      {sensorName === "Temperature" && sensorValue > 80 && (
        <p>
          Caution: The plant is overheating. Consider a cooler location or
          shade.
        </p>
      )}
      {sensorName === "Temperature" && sensorValue < 60 && (
        <p>Caution: The plant is too cold. It needs a warmer environment.</p>
      )}
      {sensorName === "Temperature" &&
        sensorValue >= 60 &&
        sensorValue <= 80 && (
          <p>Perfect! The plant is in its ideal temperature range.</p>
        )}

      {/* Humidity Checks */}
      {sensorName === "Humidity" && sensorValue > 70 && (
        <p>Warning: High humidity. Risk of mold and plant disease.</p>
      )}
      {sensorName === "Humidity" && sensorValue < 50 && (
        <p>Warning: Air is too dry. Consider increasing humidity.</p>
      )}
      {sensorName === "Humidity" && sensorValue >= 50 && sensorValue <= 70 && (
        <p>Perfect! The plant is in its ideal humidity range.</p>
      )}

      {/* Soil Moisture Checks */}
      {sensorName === "Soil Moisture" && sensorValue > 50 && (
        <p>Warning: Soil is too wet. Reduce watering.</p>
      )}
      {sensorName === "Soil Moisture" && sensorValue < 20 && (
        <p>Warning: Soil is too dry. Increase watering.</p>
      )}
      {sensorName === "Soil Moisture" &&
        sensorValue >= 20 &&
        sensorValue <= 50 && (
          <p>Perfect! The plant is in its ideal soil moisture range.</p>
        )}

      {/* Light Level Checks */}
      {sensorName === "Light Level" && sensorValue > 80 && (
        <p>Warning: Too much light. Consider less exposure or shading.</p>
      )}
      {sensorName === "Light Level" && sensorValue < 20 && (
        <p>Alert: Insufficient light. More exposure is needed.</p>
      )}
      {sensorName === "Light Level" &&
        sensorValue >= 20 &&
        sensorValue <= 80 && (
          <p>Perfect! The plant is in its ideal light exposure range.</p>
        )}
    </div>
  );
}
