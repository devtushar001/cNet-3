import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './CourseCategory.css';
import { EscomContext } from "../../Context/escomContext";

const CourseCategory = () => {
    // const { backend_url } = useContext(EscomContext);
    const backend_url = "http://localhost:10017"
    const [webApps, setWebApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchWebApps = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backend_url}/api/web-app/get-all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(response)
            const result = await response.json();
            console.log(result);
            if (result.success) {
                setWebApps(result.webApps);
            } else {
                setError("Failed to fetch web apps.");
            }
        } catch (error) {
            console
            setError("Error fetching web apps.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebApps();
    }, []);

    return (
        <>
            <div className="course-category">

                <div className="webapp-grid">
                    <h2 id="h2">
                        "Explore Our Web Apps – Designed to Enhance Your Experience! Discover Powerful Tools for Development, Productivity, and More!"
                    </h2>

                    {loading && <p className="loading">Loading web apps...</p>}
                    {error && <p className="error">{error}</p>}

                    {!loading && !error && webApps.length === 0 && (
                        <p className="no-apps">No web apps found.</p>
                    )}
                    {webApps.map((item, i) => (
                        <div key={i} className="single-course">
                            <img src={item.image} alt={item.name} className="webapp-image" />
                            <a target="_blank" href={item.link}>
                                <p>{item.name}</p>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CourseCategory;
