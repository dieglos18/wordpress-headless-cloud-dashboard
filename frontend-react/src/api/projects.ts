import axios from "axios";
import { API_BASE_URL } from "./config";
import type { Project } from "../types/project";

export const fetchProjects = async (): Promise<Project[]> => {
  const response = await axios.get<Project[]>(`${API_BASE_URL}/projects`);
  return response.data;
};
