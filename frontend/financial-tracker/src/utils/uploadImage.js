import axios from "axios";
import { API_PATHS } from "./apiPaths";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("profilePicture", imageFile);

  // Replace this with your EXACT Vercel backend URL
  const baseURL = "https://financial-tracker-rjbe.vercel.app/"; 
  
  const response = await axios.post(
    `${baseURL}${API_PATHS.AUTH.UPLOAD_IMAGE}`, // This evaluates to /api/v1/auth/uploadProfilePicture
    formData,
    { 
        headers: { "Content-Type": "multipart/form-data" }
    }
  );
  return response.data;
};

export default uploadImage;