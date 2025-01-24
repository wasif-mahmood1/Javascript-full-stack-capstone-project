import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { urlConfig } from '../../config';

function SearchPage() {
    //Task 1: Define state variables for the search query, age range, and search results.
    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [ageRange, setAgeRange] = useState(0);
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        // fetch all products
        const fetchProducts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`;
                console.log(url);
                const response = await fetch(url);
                if (!response.ok) {
                    //something went wrong
                    throw new Error(`HTTP error; ${response.status}`);
                }
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2. Fetch search results from the API based on user inputs.

    const navigate = useNavigate();

    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);

        // Task 6. Enable navigation to the details page of a selected gift.
    };

    const handleSearch = async () => {
        try {
            let url = `${urlConfig.backendUrl}/api/search?`;
            if (searchQuery) url += `name=${searchQuery}&`;
            if (selectedCategory) url += `category=${selectedCategory}&`;
            if (selectedCondition) url += `condition=${selectedCondition}&`;
            if (ageRange > 0) url += `age_years=${ageRange}`;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Search failed');
            }
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Search error:', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="d-flex flex-column">
                            {/* Category dropdown */}
                            <select
                                className="form-select mb-2 dropdown-filter"
                                value={selectedCategory}
                                onChange={(e) =>
                                    setSelectedCategory(e.target.value)
                                }
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>

                            {/* Condition dropdown */}
                            <select
                                className="form-select mb-2 dropdown-filter"
                                value={selectedCondition}
                                onChange={(e) =>
                                    setSelectedCondition(e.target.value)
                                }
                            >
                                <option value="">Select Condition</option>
                                {conditions.map((condition) => (
                                    <option key={condition} value={condition}>
                                        {condition}
                                    </option>
                                ))}
                            </select>

                            {/* Age range slider */}
                            <div className="mb-2">
                                <label>Age Range: {ageRange} years</label>
                                <input
                                    type="range"
                                    className="form-range age-range-slider"
                                    min="0"
                                    max="100"
                                    value={ageRange}
                                    onChange={(e) =>
                                        setAgeRange(e.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Search input and button */}
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control search-input"
                            placeholder="Search gifts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                            className="btn btn-primary search-button"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>

                    {/* Search results */}
                    <div className="search-results">
                        {searchResults.length > 0 ? (
                            searchResults.map((gift) => (
                                <div
                                    key={gift.id}
                                    className="card mb-3 search-results-card"
                                >
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            {gift.name}
                                        </h5>
                                        <p className="card-text">
                                            {gift.description}
                                        </p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                goToDetailsPage(gift.id)
                                            }
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="alert alert-info">
                                No products found
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
