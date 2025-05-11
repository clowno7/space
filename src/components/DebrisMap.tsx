import React, { useEffect, useState } from "react";
import { getSpaceDebris } from "../services/api";
import { SpaceObject } from "../types";

export function DebrisMap() {
  const [debris, setDebris] = useState<SpaceObject[]>([]);

  useEffect(() => {
    const fetchDebris = async () => {
      const data = await getSpaceDebris();
      setDebris(data);
    };
    fetchDebris();
    const interval = setInterval(fetchDebris, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"
        alt="Earth from space"
        className="w-full h-full object-cover opacity-75"
      />
      {debris.map((object) => (
        <div
          key={object.id}
          className={`absolute w-2 h-2 rounded-full transform hover:scale-150 transition-transform ${
            object.risk === "high"
              ? "bg-red-500"
              : object.risk === "medium"
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
          style={{
            left: `${((object.coordinates.lng + 180) / 360) * 100}%`,
            top: `${((object.coordinates.lat + 90) / 180) * 100}%`,
          }}
        >
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {object.name}
            <br />
            Alt: {object.altitude.toFixed(1)}km
            <br />
            Vel: {object.velocity.toFixed(1)}km/s
          </div>
        </div>
      ))}
    </div>
  );
}
