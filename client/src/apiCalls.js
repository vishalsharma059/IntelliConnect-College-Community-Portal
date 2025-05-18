import axios from "axios";

export const loginCall = async (userCredentials, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, userCredentials);
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
    } catch(err) {
        dispatch({
            type: "LOGIN_FAILURE",
            payload: err.response?.data || "Login Failed. Please check your credentials.",
        });
    }
};
