import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../graphql/mutation";
import {jwtDecode} from "jwt-decode";
const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const [signinUser, { loading: signLoad }] = useMutation(LOGIN_USER, {
        

        // Inside onCompleted
        onCompleted: (data) => {
            const token = data.signin.token;
            localStorage.setItem("jwt", token);
            try {
                const decodedToken = jwtDecode(token);
                console.log("Decoded Token:", decodedToken);
                if (!decodedToken.exp || Date.now() >= decodedToken.exp * 1000) {
                    console.error("Token is expired. Redirecting to login.");
                    localStorage.removeItem("jwt");
                    navigate("/");
                    return;
                }
                console.log("JWT Token stored successfully:", localStorage.getItem("jwt"));
                navigate("/welcome");
            } catch (error) {
                console.error("Invalid token format. Redirecting to login.");
                localStorage.removeItem("jwt");
                navigate("/signin");
            }
        },
        
        onError: (err) => {
            setError(err.message || "Signin failed. Please check your credentials.");
        },
    });

    const handleSignIn = () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Basic validation
        if (!trimmedEmail || !trimmedPassword) {
            setError("Email and password are required.");
            triggerShake(["email", "password"]);
            return;
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError("Please enter a valid email address.");
            triggerShake(["email"]);
            return;
        }

        // Validate password length
        if (trimmedPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            triggerShake(["password"]);
            return;
        }
       // console.log(trimmedEmail+"  "+trimmedPassword)
        setError(""); // Clear errors

        signinUser({
            variables: {
                userNew: {
                    email: trimmedEmail,
                    password: trimmedPassword,
                },
            },
        });
        console.log("done")
    };

    const triggerShake = (fieldsToClear = []) => {
        setShake(true);
        setTimeout(() => {
            setShake(false);
            if (fieldsToClear.includes("email")) setEmail("");
            if (fieldsToClear.includes("password")) setPassword("");
        }, 300); // Matches the animation duration
    };

    return (
        <div className="auth-container">
            <div className="card">
                <h1>Sign In</h1>
                <input
                    type="email"
                    className={shake ? "shake" : ""}
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className={shake ? "shake" : ""}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button onClick={handleSignIn} disabled={signLoad}>
                    {signLoad ? "Signing In..." : "Sign In"}
                </button>
                {error && <p className="error">{error}</p>}
                <p>
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
