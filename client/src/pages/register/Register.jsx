import { useRef } from "react";
import "./register.css";
import axios from "axios";
import {useNavigate} from "react-router-dom"

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();

  const handleClick = async (e) => {

    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity("Password don't match!")
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axios.post("http://localhost:8800/api/auth/register", user);
        navigate("/login");
      } catch (err) {
        console.log(err); 
      }
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to login page when clicking "Log into Account"
  };

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
            <input placeholder="Username" required ref={username} className="loginInput" />
            <input placeholder="Email" required ref={email}  className="loginInput" type="email" />
            <input placeholder="Password" required ref={password} className="loginInput" type="password" minLength="6"/>
            <input placeholder="Password Again" required ref={passwordAgain} className="loginInput" type="password"/>
            <button className="loginButton" type="submit">Sign Up</button>
            <button className="loginRegisterButton" type="button" onClick={handleLoginRedirect}>  
              Log into Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
