import "./login.css"
import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = (e) => {

    e.preventDefault();
    loginCall({ email:email.current.value, password:password.current.value }, dispatch);
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Navigate to register page
  };

  // console.log(user);
  
  return (
      <div className="login">
          <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">IntelliConnect</h3>
          <span className="loginDesc">
            Smart Campus, Bright mind: Your Gateway Endless Opportunities.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Email" required type="email" className="loginInput" ref={email}/>
            <input placeholder="Password" required minLength="6" type="password" className="loginInput" ref={password} />
            
            <button className="loginButton" type="submit" disabled={isFetching}>{isFetching ? <CircularProgress color="white" size="20px" /> : "Log In"}</button>

            {error && <span className="errorMessage">{error}</span>}
            
            <span className="loginForgot">Forgot Password?</span>

            <button className="loginRegisterButton" type="button"
              onClick={handleRegisterRedirect}>
            {isFetching ? <CircularProgress color="white" size="20px"/> : "Create a New Account"}
              
            </button>
         </form>
        </div>
      </div>
      
    </div>
  )
}
