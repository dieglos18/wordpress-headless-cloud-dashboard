import axios from "axios";
import { API_BASE_URL } from "./config";
import type { Project } from "../types/project";

export const wordpressApi = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await wordpressApi.get<Project[]>("/projects");
  return response.data;
};
