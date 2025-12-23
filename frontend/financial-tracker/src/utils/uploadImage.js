import axios from "axios";
import { API_PATHS } from "./apiPaths";

export const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("profilePicture", imageFile);

  // 1. Ensure baseURL doesn't end with a slash if API_PATHS starts with one
  const baseURL = import.meta.env.VITE_API_URL || "https://financial-tracker-rjbe.vercel.app"; 
  
  // 2. Explicitly use the IMAGE object path
  const uploadPath = API_PATHS.IMAGE?.UPLOAD_IMAGE;

  if (!uploadPath) {
    throw new Error("Upload path is undefined. Check apiPaths.js");
  }

  const response = await axios.post(
    `${baseURL}${uploadPath}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  
  return response.data;
};