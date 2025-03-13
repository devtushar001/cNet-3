import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CourseCategory.css";
import { EscomContext } from "../../Context/escomContext";
import Loading from "../Loading/Loading";

const CourseCategory = () => {
    const backend_url = "http://localhost:10017";
    const { webApps, setWebApps } = useContext(EscomContext);
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

            const result = await response.json();

            if (result.success) {
                setWebApps(result.webApps);
            } else {
                setError("Failed to fetch web apps.");
            }
        } catch (error) {
            setError("Error fetching web apps.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebApps();
    }, []);

    return (
        <div className="course-category">
            <div className="webapp-grid">
                <h2 id="h2">
                    "Explore Our Web Apps – Designed to Enhance Your Experience! Discover Powerful Tools for Development, Productivity, and More!"
                </h2>
                {loading && <Loading />}
                {error && <p className="error">{error}</p>}
                {!loading && !error && webApps.length === 0 && (
                    <p className="no-apps">No web apps found.</p>
                )}
                {!loading && !error && webApps.map((item, i) => (
                    <div key={i} className="single-course">
                        <img src={item.image} alt={item.name} className="webapp-image" />
                        <a target="_blank" href={item.link} rel="noopener noreferrer">
                            <p>{item.name}</p>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseCategory;
