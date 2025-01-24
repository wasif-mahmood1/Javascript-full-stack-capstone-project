import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AuthContext';
import { urlConfig } from '../../config';

function LoginPage() {
    const navigate = useNavigate();
    // Create state variables for form inputs
    const { setIsLoggedIn } = useAppContext();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message

    // Handle form submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/login`,
                {
                    method: 'POST', // Changed from 'GET' to 'POST' to send data to the server
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                }
            );

            const data = await response.json();

            console.log('Login data:', data);

            if (response.ok) {
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('firstName', data.firstName);
                sessionStorage.setItem('lastName', data.lastName);
                sessionStorage.setItem('email', data.email);

                console.log(
                    'sessionStorage from loginComponent',
                    sessionStorage
                );

                setIsLoggedIn(true);
                navigate('/app');
            } else {
                setErrorMessage('Invalid credentials or user not found');
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('An error occurred during login');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">
                            Login
                        </h2>
                        <form onSubmit={handleLogin}>
                            <div className="form-group mb-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                    autoComplete="current-password"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                Login
                            </button>
                            {errorMessage && (
                                <p className="text-danger mt-3">
                                    {errorMessage}
                                </p>
                            )}
                        </form>
                        <p className="mt-4 text-center">
                            Not a member?{' '}
                            <a href="/app/register" className="text-primary">
                                Register
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
