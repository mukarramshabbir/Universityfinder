// src/components/UniversityList.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UniversityList = () => {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch universities from the backend API
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/universities`)
      .then(response => {
        setUniversities(response.data.universities);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load universities");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading universities...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 >List of Universities</h1>
      <table>
        <thead>
          <tr>
            <th>University Name</th>
            <th>Location</th>
            <th>Tuition Fees (UG)</th>
            <th>Tuition Fees (PG)</th>
            <th>Scholarships Available</th>
            <th>Educational Domains</th>
            <th>Societies</th>
            <th>International Support</th>
            <th>Research Opportunities</th>
            <th>Rankings</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((university, index) => (
            <tr key={index}>
              <td>{university.Name}</td>
              <td>{university.Location}</td>
              <td>{university.UG_Tuition_Fee}</td>
              <td>{university.Masters_Tuition_Fee}</td>
              <td>{university.Scholarship_Availability}</td>
              <td>{university.educationalDomains}</td>
              <td>{university.Clubs_Societies}</td>
              <td>{university.Exchange_Students_Acceptance}</td>
              <td>{university.Research_Opportunities}</td>
              <td>{university.Ranking}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UniversityList;
