"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PiPlant } from "react-icons/pi";
import Link from "next/link";

function connectBle(characteristicId: string, serviceId: string, model: any) {
  navigator.bluetooth.requestDevice({
    filters: [{ services: [serviceId] }]
  }).then(device => {
    return device.gatt?.connect();
  }).then(server => {
    return server?.getPrimaryService(serviceId);
  }).then(service => {
    return service?.getCharacteristic(characteristicId);
  }).then(character => {
    model.characteristic = character
  });
}

function sendTest(msg: string, model: any, enc: any) {
  if (!model.characteristic) {
    return;
  }

  model.characteristic.writeValue(enc.encode(msg));
}

function receiveTest(model: any, dec: any) {
  if (!model.characteristic) {
    return;
  }

  model.characteristic.readValue().then(function (msg: string) {
    model.recvMsg = dec.decode(msg);
  });
}

export default function Navbar() {
  const [isOnDashboard, setIsOnDashboard] = useState(false);
  const pathname = usePathname();

  const serviceId        = "c4ae5be3-d939-4a88-82f9-8b8c73e81c01";
  const characteristicId = "b7b46926-2e25-4a90-9174-d71ae1c3bb12";
  
  // let myCharacteristic: null = null;
  let model = {
    characteristic: null,
    recvMsg: ""
  }
  const dec = new TextDecoder();
  const enc = new TextEncoder();

  useEffect(() => {
    setIsOnDashboard(pathname === "/dashboard");
  }, [pathname]);

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
          onClick={() => {receiveTest(model, dec); console.log(model)}}
        >
          Receive Test {model.recvMsg}
        </button>
      <button
          className="text-logo-secondary bg-logo-primary font-semibold rounded-md py-2 px-4 text-xl"
          onClick={() => {sendTest("testing", model, enc)}}
        >
          Send Test
        </button>
        <button
          className="text-logo-secondary bg-logo-primary font-semibold rounded-md py-2 px-4 text-xl"
          onClick={() => {connectBle(characteristicId, serviceId, model)}}
        >
          Connect
        </button>
        {!isOnDashboard && (
          <Link
            href="/dashboard"
            className="text-logo-secondary bg-logo-primary font-semibold rounded-md py-2 px-4 text-xl"
          >
            Dashboard
          </Link>
        )}
        {isOnDashboard && (
          <Link
            href="/"
            className="text-logo-secondary bg-logo-primary font-semibold rounded-md py-2 px-4 text-xl"
          >
            Realtime
          </Link>
        )}
      </div>
    </div>
  );
}
