import React from "react";
import './Courses.css';
import CourseCategory from "../../Components/CourseCategory/CourseCategory";
import Loading from "../../Components/Loading/Loading";

const Courses = () => {
    return (
        <>
            <div className="courses">
            </div>
            <div className="content">
                <CourseCategory/>
            </div>
        </>
    )
}

export default Courses;