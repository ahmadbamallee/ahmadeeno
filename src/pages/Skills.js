import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';

const SKILLS_PER_PAGE = 10; // Define the number of skills per page

function Skills() {
  const [skills, setSkills] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient
      .fetch('*[_type == "skill"] | order(_createdAt desc) {skillName, progressPercent}')
      .then((data) => {
        setSkills(data);
        setLoading(false); // Set loading to false after fetching data
      })
      .catch(console.error);
  }, []);

  // Calculate the current skills to display based on the page
  const indexOfLastSkill = currentPage * SKILLS_PER_PAGE;
  const indexOfFirstSkill = indexOfLastSkill - SKILLS_PER_PAGE;
  const currentSkills = skills.slice(indexOfFirstSkill, indexOfLastSkill);

  // Calculate the total number of pages
  const totalPages = Math.ceil(skills.length / SKILLS_PER_PAGE);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading) {
    return <div class="spinner center">
      

    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    <div class="spinner-blade"></div>
    </div>;
  }

  return (
    <div className="skills">
      <h1>Skills</h1>
      <div className="skills-list">
        {currentSkills.map((skill) => (
          <div key={skill.skillName} className="skill-item">
            <div className="skill-info">
              <span className="skill-name">{skill.skillName}</span>
              <span className="progress-percentage">{skill.progressPercent}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${skill.progressPercent}%` }} // skill.progressPercent is your percentage
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Skills;
