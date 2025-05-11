export interface AstronomyPicture {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: string;
  service_version: string;
  title: string;
  url: string;
}

export interface SpaceObject {
  id: string;
  name: string;
  altitude: number;
  velocity: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  risk: "high" | "medium" | "low";
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}
