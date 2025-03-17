import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("software");
  const [location, setLocation] = useState("India");

  const fetchJobs = async (keywords, jobLocation) => {
    setLoading(true);
    try {
      const url = "https://jooble.org/api/0fc2627b-7941-4ec4-ae6d-cccf31727dd2";
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords, location: jobLocation }),
      };

      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data?.jobs?.length > 0) {
        const companyData = {
          "ChargePoint": {
            skills: ["PHP", "PHP", "TypeScript"],
            salary: "₹977,594 per annum"
          },
          "Teva Pharmaceutical Industries Ltd.": {
            skills: ["Scrum", "REST API", "CSS"],
            salary: "₹426,373 per annum"
          },
          "Dish": {
            skills: [],
            salary: "Not disclosed"
          },
          "Klüber Lubrication India Pvt. Ltd.": {
            skills: [],
            salary: "Not disclosed"
          }
        };

        const formattedJobs = data.jobs.map((job) => {
          const companyName = job.company || "Company";
          const companyInfo = companyData[companyName] || { skills: [], salary: "Not disclosed" };

          return {
            id: job.id || Math.random().toString(),
            company: companyName,
            location: job.location || jobLocation,
            salary: companyInfo.salary,
            title: job.title || "Position",
            skills: companyInfo.skills,
            postedTime: formatDate(job.updated),
            type: "Full-time",
            applied: false,
          };
        });
        setJobs(formattedJobs);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(currentUser));
    }
    fetchJobs(searchTerm, location);
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(searchTerm, location);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("currentUser");
    navigate("/login");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((now - date) / (1000 * 60 * 60 * 24));
    return `${diffDays} days ago`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>KODEJOBS</h1>
        <p className="subtitle">Find your next opportunity</p>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="search-container">
        <div className="search-input-group">
          <div className="search-field">
            <label>Keywords</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="search-field">
            <label>Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={handleSearch} className="search-button">
            SEARCH JOBS
          </button>
        </div>
      </div>

      {jobs.length > 0 && (
        <div className="search-results">Found {jobs.length} jobs</div>
      )}

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <div className="job-header">
              <div className="company-info">
                <div className="company-logo">
                  {job.company.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3>{job.company}</h3>
                  <div className="location">
                    📍 {job.location}
                  </div>
                </div>
              </div>
              <div className="salary">
                {job.salary}
              </div>
            </div>

            <h4 className="job-title">{job.title}</h4>

            <div className="skills-section">
              {job.skills.length === 0 ? (
                <div className="no-skills">No skills listed</div>
              ) : (
                <div className="skills-container">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="job-footer">
              <div className="job-meta">
                <span>Posted: {job.postedTime}</span>
                <span>{job.type}</span>
              </div>
              <div className="action-area">
                <span className="application-status">
                  Not Applied
                </span>
                <button className="apply-button">
                  APPLY NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
