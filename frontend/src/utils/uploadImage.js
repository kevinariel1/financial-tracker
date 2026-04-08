import axios from "axios";
import { API_PATHS } from "./apiPaths";

export const uploadImage = async (imageFile) => {
  // DEBUG LOGS - Look for these in your browser console!
  console.log("API_PATHS object:", API_PATHS);
  console.log("Upload Path:", API_PATHS?.IMAGE?.UPLOAD_IMAGE);

  const formData = new FormData();
  formData.append("profilePicture", imageFile);

  const baseURL = import.meta.env.VITE_API_URL || "https://financial-tracker-rjbe.vercel.app"; 
  
  // This is the specific line causing your error
  const endpoint = API_PATHS?.IMAGE?.UPLOAD_IMAGE;

  if (!endpoint) {
    console.error("ERROR: UPLOAD_IMAGE path is missing from API_PATHS!");
    throw new Error("Internal Configuration Error: Upload path not found.");
  }

  const response = await axios.post(
  "https://financial-tracker-rjbe.vercel.app/api/v1/auth/uploadProfilePicture",
  formData,
  { headers: { "Content-Type": "multipart/form-data" } }
);

  return response.data;
};