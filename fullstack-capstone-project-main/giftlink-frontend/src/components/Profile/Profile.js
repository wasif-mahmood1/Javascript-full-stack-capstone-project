import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './Profile.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
    const [userDetails, setUserDetails] = useState({});
    const [updatedDetails, setUpdatedDetails] = useState({});
    const { setUserName } = useAppContext();
    const [changed, setChanged] = useState('');
    const [editMode, setEditMode] = useState(false);

    const navigate = useNavigate();

    const fetchUserProfile = useCallback(async () => {
        try {
            const authtoken = sessionStorage.getItem('auth-token');
            const email = sessionStorage.getItem('email');
            const firstName = sessionStorage.getItem('firstName');
            if (firstName || authtoken) {
                const storedUserDetails = {
                    firstName: firstName,
                    email: email,
                };

                setUserDetails(storedUserDetails);
                setUpdatedDetails(storedUserDetails);
            }
        } catch (error) {
            console.error(error);
            navigate('/app/login');
        }
    }, [navigate]);

    useEffect(() => {
        const authtoken = sessionStorage.getItem('auth-token');
        if (!authtoken) {
            navigate('/app/login');
        } else {
            fetchUserProfile();
        }
    }, [fetchUserProfile, navigate]);

    const handleEdit = () => {
        setEditMode(true);
    };

    const handleInputChange = (e) => {
        setUpdatedDetails({
            ...updatedDetails,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const authtoken = sessionStorage.getItem('auth-token');
            const email = sessionStorage.getItem('email');

            if (!authtoken || !email) {
                navigate('/app/login');
                return;
            }

            const response = await fetch(
                `${urlConfig.backendUrl}/api/auth/update`,
                {
                    method: 'POST', // Task 1: Set method
                    headers: {
                        // Task 2: Set headers
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authtoken}`,
                    },
                    body: JSON.stringify({
                        // Task 3: Set body
                        firstName: updatedDetails.firstName,
                        email: email,
                    }),
                }
            );

            if (response.ok) {
                const data = await response.json();
                // Task 4: Set the new name in AppContext
                setUserName(data.firstName);

                // Task 5: Set user name in session storage
                sessionStorage.setItem('firstName', data.firstName);

                setUserDetails(updatedDetails);
                setEditMode(false);
                setChanged('Name Changed Successfully!');
                setTimeout(() => {
                    setChanged('');
                    navigate('/');
                }, 1000);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="profile-container">
            {editMode ? (
                <form onSubmit={handleSubmit}>
                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={userDetails.email}
                            disabled // Disable the email field
                        />
                    </label>
                    <label>
                        Name
                        <input
                            type="text"
                            name="firstName"
                            value={updatedDetails.firstName}
                            onChange={handleInputChange}
                        />
                    </label>

                    <button type="submit">Save</button>
                </form>
            ) : (
                <div className="profile-details">
                    <h1>Hi, {userDetails.firstName}</h1>
                    <p>
                        {' '}
                        <b>Email:</b> {userDetails.email}
                    </p>
                    <button onClick={handleEdit}>Edit</button>
                    <span
                        style={{
                            color: 'green',
                            height: '.5cm',
                            display: 'block',
                            fontStyle: 'italic',
                            fontSize: '12px',
                        }}
                    >
                        {changed}
                    </span>
                </div>
            )}
        </div>
    );
};

export default Profile;
