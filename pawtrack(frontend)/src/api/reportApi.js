import axios from "axios";
import { BASE_URL } from "./config";

export const addReport = async (reportData) => {
  const res = await axios.post(`${BASE_URL}/reports`, reportData);
  return res.data;
};

export const getAllReports = async () => {
  const res = await axios.get(`${BASE_URL}/reports`);
  return res.data;
};

export const updateReportStatus = async (id, status) => {
  const res = await axios.put(`${BASE_URL}/reports/${id}/status`, { status });
  return res.data;
};
