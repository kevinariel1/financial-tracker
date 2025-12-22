import axios from "axios";
import { API_PATHS } from "./apiPaths";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("profilePicture", imageFile);

  // USE THE HARDCODED URL FROM YOUR LOGS
  const baseURL = "https://financial-tracker-rjbe.vercel.app"; 
  
  const response = await axios.post(
    `${baseURL}${API_PATHS.AUTH.UPLOAD_IMAGE}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export default uploadImage;