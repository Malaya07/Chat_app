import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SIGNUP_USER } from "../graphql/mutation";
import { useMutation } from "@apollo/client";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const [signupUser, { loading }] = useMutation(SIGNUP_USER, {
        onCompleted: () => navigate("/"),
        onError: (error) => setError(error.message),
    });

    const handleSignUp = () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const trimmedName = name.trim();

        // Basic validation
        if (!trimmedEmail || !trimmedPassword || !trimmedName) {
            setError("All fields are required.");
            triggerShake(["email", "password", "name"]);
            return;
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(trimmedEmail)) {
            setError("Please enter a valid email address.");
            triggerShake(["email"]);
            return;
        }

        // Validate password strength
        if (trimmedPassword.length < 6) {
            setError("Password must be at least 6 characters long.");
            triggerShake(["password"]);
            return;
        }

        setError(""); // Clear error

        signupUser({
            variables: {
                userNew: {
                    username: trimmedName,
                    email: trimmedEmail,
                    password: trimmedPassword,
                    profilePicture: "",
                },
            },
        });
    };

    const triggerShake = (fieldsToClear = []) => {
        setShake(true);
        setTimeout(() => {
            setShake(false);
            if (fieldsToClear.includes("email")) setEmail("");
            if (fieldsToClear.includes("password")) setPassword("");
            if (fieldsToClear.includes("name")) setName("");
        }, 300);
    };

    return (
        <div className="auth-container">
            <div className="card">
                <h1>Sign Up</h1>
                <input
                    type="text"
                    className={shake ? "shake" : ""}
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                <button onClick={handleSignUp} disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
                {error && <p className="error">{error}</p>}
                <p>
                    Already have an account? <a href="/">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
