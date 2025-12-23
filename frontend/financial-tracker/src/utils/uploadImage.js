import axios from "axios";
import { API_PATHS } from "./apiPaths";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("profilePicture", imageFile);

  const baseURL = import.meta.env.VITE_API_URL || "https://financial-tracker-rjbe.vercel.app"; 
  
  const response = await axios.post(
    `${baseURL}${API_PATHS.AUTH.UPLOAD_IMAGE}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

// THIS IS THE LINE VITE IS COMPLAINING ABOUT:
export default uploadImage;