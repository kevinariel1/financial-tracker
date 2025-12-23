import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import ProfilePictureSelector from '../../components/Inputs/ProfilePictureSelector';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { uploadImage } from '../../utils/uploadImage';
import { UserContext } from '../../context/UserContext';

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle SignUp Form 
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profilePictureUrl = null;

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(null);

    try {
      let profilePictureUrl = ""; // Only declare it once here

      if (profilePic) {
        // Pass the file to the helper
        const imgUploadRes = await uploadImage(profilePic);

        // Your backend returns { imageUrl: req.file.path }
        profilePictureUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profilePictureUrl, // This will now correctly be "" or the Cloudinary URL
      });

      const { token, user } = response.data;

      if (token) {
        // 3. Save to LocalStorage and Update Context
        localStorage.setItem("token", token);
        updateUser(user);

        // Go straight to dashboard since they are now logged in
        navigate("/dashboard");
      } else {
        // Fallback if your backend doesn't auto-login after signup
        navigate("/login");
      }
    } catch (error) {
      console.error("SignUp error (full):", error);
      if (error.response) {
        setError(error.response.data.message || "An error occurred during signup.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">
          Create an Account
        </h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Join us today! It only takes few steps.
        </p>

        <form onSubmit={handleSignUp}>

          <ProfilePictureSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text" />

            <Input value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@example.com"
              type="text"
            />

            <Input value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Min. 8 characters"
              type="password"
            />

            <Input value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
              label="Confirm Password"
              placeholder="Min. 8 characters"
              type="password"
            />

          </div>

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type="submit" className='btn-primary'>
            SIGN UP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account? {" "}
            <Link className='font-medium text-primary underline ' to='/login'>Login</Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp