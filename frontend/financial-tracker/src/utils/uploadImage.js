import axios from "axios";
import { API_PATHS } from "./apiPaths";

const uploadImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("profilePicture", imageFile);

  // Use a direct axios call to avoid the "No Token" interceptor
  const response = await axios.post(
    `${process.env.REACT_APP_BACKEND_URL}${API_PATHS.AUTH.UPLOAD_IMAGE}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return response.data;
};

export default uploadImage;
