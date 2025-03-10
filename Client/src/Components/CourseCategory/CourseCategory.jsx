import React from "react";
import { courseCategory } from "../../assets/escomData";
import { Link } from "react-router-dom";
import './CourseCategory.css';

const CourseCategory = () => {

    return (
        <>
            <div className="course-category">
                <h2 id="h2" >"Explore Our Web Apps – Designed to Enhance Your Experience! Discover Powerful Tools for Development, Productivity, and More!"</h2>
                {courseCategory.map((item, i) => {
                    return (
                        <div key={i} className="single-course">
                            <img src={item.img} alt="" />
                            <Link className="no-style" to={`/courses/${item._id}`}><p>{item.name}</p></Link>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default CourseCategory;