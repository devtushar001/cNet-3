import React, { useState, useEffect } from "react";
import ImageUploader from "../../Components/ImageUploader/ImageUploader";
import './WebApps.css';

const backend_url = "http://localhost:10017"; 

const WebApps = () => {
    const [webApps, setWebApps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const [webAppImage, setWebAppImage] = useState({ type: "single", selection: false, image: null });

    const [data, setData] = useState({
        name: "",
        image: "",
        link: "",
    });

    const fetchWebApps = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${backend_url}/api/web-app/get-all`);
            const result = await response.json();
            if (result.success) {
                setWebApps(result.webApps);
            } else {
                setError("Failed to fetch web apps");
            }
        } catch (error) {
            setError("Error fetching web apps");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWebApps();
    }, []);

    const deleteWebApp = async (id) => {
        if (!window.confirm("Are you sure you want to delete this web app?")) return;

        try {
            const response = await fetch(`${backend_url}/api/web-app/delete/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (result.success) {
                alert("WebApp deleted successfully!");
                setWebApps((prev) => prev.filter((app) => app._id !== id));
            } else {
                alert(`Failed to delete WebApp: ${result.message}`);
            }
        } catch (error) {
            alert("Error deleting WebApp.");
        }
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!data.name || !data.link || !webAppImage.image) {
            alert("All fields are required!");
            return;
        }

        try {
            const response = await fetch(`${backend_url}/api/web-app/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    image: webAppImage.image, // Use selected image URL
                    link: data.link,
                }),
            });

            const result = await response.json();
            if (result.success) {
                alert("WebApp created successfully!");
                fetchWebApps(); // Refresh the list
                setData({ name: "", image: "", link: "" });
                setWebAppImage({ type: "single", selection: false, image: null });
            } else {
                alert(`Failed to create WebApp: ${result.message}`);
            }
        } catch (error) {
            alert("Error creating WebApp.");
        }
    };

    return (
        <>
            <div style={{ marginLeft: "210px" }} className="webapps-container">
                <h2 className="title">Web Applications</h2>

                {loading && <p className="loading">Loading web apps...</p>}
                {error && <p className="error">Error: {error}</p>}
                {!loading && !error && webApps.length === 0 && <p>No web apps found.</p>}

                <div className="webapps-grid">
                    {webApps.map((app) => (
                        <div key={app._id} className="webapp-card">
                            <img src={app.image} alt={app.name} className="webapp-image" />
                            <h3 className="webapp-name">{app.name}</h3>
                            <a href={app.link} target="_blank" rel="noopener noreferrer" className="webapp-link">
                                Visit App
                            </a>
                            <button className="delete-btn" onClick={() => deleteWebApp(app._id)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* ✅ Create WebApp Form */}
            <div style={{ marginLeft: "210px" }} className="create-web-apps">
                <h2>Create Web App</h2>
                {webAppImage.image && <img style={{ width: "320px" }} src={webAppImage.image} alt="Web App Preview" />}
                <br />
                <input
                    type="text"
                    name="name"
                    placeholder="Web App Name"
                    value={data.name}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="link"
                    placeholder="Web App Link"
                    value={data.link}
                    onChange={handleChange}
                />
                <button onClick={() => setWebAppImage((prev) => ({ ...prev, selection: true }))}>
                    Select Image
                </button>
                {webAppImage.selection && <ImageUploader object={webAppImage} imageSelector={setWebAppImage} />}
                
                <button className="create-btn" onClick={handleSubmit}>Create WebApp</button>
            </div>
        </>
    );
};

export default WebApps;
