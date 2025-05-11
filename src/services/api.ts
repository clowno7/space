import axios from "axios";
import { AstronomyPicture, SpaceObject } from "../types";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: baseURL + "/api",
});

export const getAstronomyPictureOfDay = async (): Promise<AstronomyPicture> => {
  try {
    const { data } = await api.get("/apod/");
    return {
      url: data.url,
      title: data.title,
      explanation: data.explanation,
      date: data.date,
      copyright: data.copyright,
      media_type: "image",
      service_version: "v1",
    };
  } catch (error: any) {
    console.error(
      "APOD Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    return {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      title: "Space View",
      explanation: "Unable to load image at this time.",
      date: new Date().toISOString(),
      media_type: "image",
      service_version: "v1",
    };

};

export const getSpaceImages = async (
  count: number = 10
): Promise<AstronomyPicture[]> => {
  try {
    const { data } = await api.get(`/space-images/?count=${count}`);
    return data;
  } catch (error: any) {
    console.error(
      "Space Images Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error(error.message || "Failed to fetch space images");
  }
};

export const getChatResponse = async (message: string): Promise<string> => {
  try {
    const { data } = await api.post("/chat/", { message });
    return data.response;
  } catch (error: any) {
    console.error(
      "AI Chat Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error(error.message || "Failed to get chat response");
  }
};

export const getSpaceDebris = async (): Promise<SpaceObject[]> => {
  try {
    const { data } = await api.get("/debris/");
    return data;
  } catch (error: any) {
    console.error(
      "Space Debris Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw new Error(error.message || "Failed to get space debris");
  }
};
