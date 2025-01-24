import React, { useState } from 'react';
import './RegisterPage.css';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function RegisterPage() {
    // Create state variables for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const { setIsLoggedIn } = useAppContext(); // Get setIsLoggedIn from context
    const navigate = useNavigate(); // Initialize navigate

    //console.log('setIsLoggedIn', useAppContext());

    // Handle form submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reset error message

        try {
            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/register`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json(); // Access data in JSON format

            if (response.ok) {
                // Store token and user details in session storage
                sessionStorage.setItem('auth-token', data.authtoken);
                sessionStorage.setItem('firstName', data.firstName);
                sessionStorage.setItem('lastName', data.lastName);
                sessionStorage.setItem('email', data.email);

                setIsLoggedIn(true); // Set user as logged in
                navigate('/'); // Navigate to MainPage
            } else {
                // Handle registration failure
                setErrorMessage(
                    data.error || 'Registration failed. Please try again.'
                );
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="register-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">
                            Register
                        </h2>
                        <form onSubmit={handleRegister}>
                            <div className="form-group mb-3">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    required
                                    autoComplete="firstname"
                                />
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    required
                                    autoComplete="lastname"
                                />
                            </div>
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
                                Register
                            </button>
                            {errorMessage && (
                                <p className="text-danger mt-3">
                                    {errorMessage}
                                </p>
                            )}
                        </form>
                        <p className="mt-4 text-center">
                            Already a member?{' '}
                            <a href="/app/login" className="text-primary">
                                Login
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
