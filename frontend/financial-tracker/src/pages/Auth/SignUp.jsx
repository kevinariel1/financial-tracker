import React from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { Link } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import ProfilePictureSelector from '../../components/Inputs/ProfilePictureSelector';

const SignUp = () => {
  const [profilePic, setProfilePic] = React.useState(null);
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  //Handle SignUp Form 
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profilePicUrl = null;

    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (!fullName){
      setError('Please enter your full name.');
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

    // If validation passes, proceed with sign up logic (API, etc.)
    console.log("Sign up successful:", { fullName, email, password });
    navigate("/dashboard"); // or wherever you want

  }

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

          <ProfilePictureSelector image={profilePic} setImage={setProfilePic}/>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"/>

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