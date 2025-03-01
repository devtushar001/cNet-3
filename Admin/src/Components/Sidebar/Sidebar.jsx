import React from "react";
import './Sidebar.css';
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <>
            <div className="sidebar">
                <div className="buttons">

                    <Link className="no-style" to="/add-products">
                        <button>
                            Add Products
                        </button>
                    </Link>
                    <Link className="no-style" to="/add-blogs">
                        <button>
                            Add Blogs
                        </button>
                    </Link>
                    <button>
                        Orders
                    </button>
                </div>
                <div className="content"></div>
            </div>
        </>
    )
}

export default Sidebar;