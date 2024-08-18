import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Alert, Container, Card, Box, CardContent } from "@mui/material";
import { login } from "../services/api";

const Login = ({setUser}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.clear(); // Clear all local storage data
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Reset error message before new login attempt
        localStorage.clear();
        try {
            console.log("Login req")    
            const response = await login({username: username, password: password});
            console.log("Login resp ", response)
            if (response.status==200) {
                // Login successful, navigate to projects page
                const token = response.data.data
                localStorage.setItem('token', token);
                setUser(username)
                navigate("/projects", {replace: true})
                
            } else {
                setError("Invalid credentials or unsufficient roles.")
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                // 401 Unauthorized
                setError("Invalid username or password");
            } else {
                // Handle other errors
                setError("An error occurred during login. Please try again.");
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Card sx={{ mt: 8 }}>
                <CardContent>
                <Box
                    sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                   
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {error && (
                        <Typography color="error" align="center" sx={{ mt: 1 }}>
                        {error}
                        </Typography>
                    )}
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, mb: 2 }}
                        onClick={handleLogin}
                    >
                        Sign In
                    </Button>
                    </Box>
                </Box>
                </CardContent>
            </Card>
        </Container>
        
    );
};

export default Login;
