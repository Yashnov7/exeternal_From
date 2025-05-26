import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [showPrintSection, setShowPrintSection] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    axios.get('http://localhost:5000/api/examiner-claims/full', {
      withCredentials: true,
    })
      .then(res => setClaims(res.data))
      .catch(err => console.error("Failed to fetch claims", err));
  }, []);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Examiner_Claims_All',
    onBeforePrint: () => console.log("Starting print..."),
    onAfterPrint: () => console.log("Print done"),
  });

  const totalByYear = Object.values(
    claims.reduce((acc, claim) => {
      const year = claim.academic_year || 'Unknown';
      const total = Number(claim.total_students_amount || 0) + Number(claim.total_sessions_amount || 0) + Number(claim.total_groups_amount || 0);
      acc[year] = acc[year] || { year, total: 0 };
      acc[year].total += total;
      return acc;
    }, {})
  );

  const examsByMonth = Object.values(
    claims.reduce((acc, claim) => {
      const month = claim.exam_month_year || 'Unknown';
      acc[month] = acc[month] || { month, count: 0 };
      acc[month].count += 1;
      return acc;
    }, {})
  );

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-heading">Examiner Claim Overview</h2>

      <div className="dashboard-summary">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Examiner Name</th>
              <th>Mobile</th>
              <th>Academic Year</th>
              <th>Exam Month/Year</th>
              <th>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {claims.map((claim, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{claim.examiner_name}</td>
                <td>{claim.mobile}</td>
                <td>{claim.academic_year}</td>
                <td>{claim.exam_month_year}</td>
                <td>
                  ₹{(
                    Number(claim.total_students_amount || 0) +
                    Number(claim.total_sessions_amount || 0) +
                    Number(claim.total_groups_amount || 0)
                  ).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="charts">
        <div className="chart-box">
          <h3>Total Amount Claimed by Academic Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={totalByYear} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#4e73df" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h3>Exams Conducted Per Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={examsByMonth} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#f6c23e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <button
        className="print-button"
        onClick={() => setShowPrintSection(true)}
        disabled={claims.length === 0}
      >
        Show Print Preview
      </button>

      {claims.length === 0 && <p className="no-data">No claims to print or still loading...</p>}

      {showPrintSection && (
        <div>
          <button className="print-button" onClick={handlePrint}>
            Print All as DOC Format
          </button>
          <div ref={printRef}> {/* Print content remains unchanged */} </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
