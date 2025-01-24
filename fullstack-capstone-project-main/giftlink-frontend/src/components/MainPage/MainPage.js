import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Task 1: Write async fetch operation
        // Write your code below this line
        const fetchGifts = async () => {
            try {
                const response = await fetch(
                    `${urlConfig.backendUrl}/api/gifts`
                );
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.error('Error fetching gifts:', error);
            }
        };

        fetchGifts();
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getConditionClass = (condition) => {
        return condition === 'New'
            ? 'list-group-item-success'
            : 'list-group-item-warning';
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-6 col-lg-4 mb-4">
                        <div className="card product-card">
                            {/* Task 4: Display gift image */}
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} />
                                ) : (
                                    <div className="no-image-available">
                                        No Image Available
                                    </div>
                                )}
                            </div>

                            <div className="card-body">
                                {/* Task 5: Display gift name */}
                                <h5 className="card-title">{gift.name}</h5>

                                {/* Task 6: Display formatted date */}
                                <p className="card-text date-added">
                                    <small className="text-muted">
                                        Added: {formatDate(gift.date_added)}
                                    </small>
                                </p>

                                <p
                                    className={`card-text ${getConditionClass(
                                        gift.condition
                                    )}`}
                                >
                                    {gift.condition}
                                </p>

                                <button
                                    onClick={() => goToDetailsPage(gift.id)}
                                    className="btn btn-primary"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
