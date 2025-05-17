import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';

const AdminDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [printNow, setPrintNow] = useState(false);
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

  useEffect(() => {
    if (printNow && claims.length > 0 && printRef.current) {
      handlePrint();
      setPrintNow(false);
    }
  }, [printNow, claims, handlePrint]);

  return (
    <div className="container">
      <h2 className="mt-4">Submitted Examiner Claims</h2>
      <button
        className="btn btn-primary mb-4"
        onClick={() => setPrintNow(true)}
        disabled={claims.length === 0}
      >
        Print All as DOC Format
      </button>
      {claims.length === 0 && <p className="text-muted">No claims to print or still loading...</p>}

      <div ref={printRef}>
        {claims.map((claim, idx) => (
          <div key={idx} style={{ pageBreakAfter: 'always', padding: 20, border: '1px solid #000' }}>
            <img src="/mit-logo.jpg" alt="MIT Logo" style={{ height: 70, display: 'block', margin: '0 auto' }} />
            <h4 style={{ textAlign: 'center' }}>
              MIT Art, Design and Technology University, Pune
            </h4> 

            <h5 style={{ textAlign: 'center', textDecoration: 'underline' }}>
              CLAIM TO BE FILLED IN BY THE EXAMINER
            </h5>

            <p><strong>Examination Name:</strong> Semester End (Odd) Examination 2023-24</p>
            <p><strong>Center Name:</strong> MITSOC Pune &nbsp;&nbsp;&nbsp; <strong>Date:</strong> _____ / _____ / 2024</p>
            <p><strong>Name of Examiner:</strong> {claim.examiner_name}</p>
            <p><strong>College Name:</strong> {claim.college_name} &nbsp;&nbsp;&nbsp; <strong>Mobile:</strong> {claim.mobile}</p>

            <p>
              Claim Remuneration for the Examination of B. Tech / M. Tech./M.Sc./Int. B.Tech in {claim.exam_month_year}<br />
              Year: {claim.academic_year} &nbsp;&nbsp;&nbsp; Branch: {claim.branch} &nbsp;&nbsp;&nbsp; Division: {claim.division}
            </p>

            <p><strong>Subjects:</strong></p>
            <ol>
              {claim.subjects.length > 0 ? (
                claim.subjects.map((s, i) => (
                  <li key={i}>Subject Code: {s.code || '____'} &nbsp;&nbsp; Subject Name: {s.name || '____'}</li>
                ))
              ) : (
                <li>Subject Code: _____ &nbsp;&nbsp; Subject Name: _____</li>
              )}
            </ol>

            <p>
              Practical / Oral / Seminar / Project and Viva / Dissertation for B. Tech / M. Tech./M.Sc./Int. B.Tech.
            </p>

            <p>Total Number of Candidate: {claim.total_candidates}</p>
            <p>Total Number of Sessions: {claim.total_sessions}</p>
            <p>Total Number of Groups: {claim.total_groups}</p>
            <p>
              Practical/Oral /Sessional Exam work from {claim.date_from || '____'} to {claim.date_to || '____'}
            </p>
            <p>Total Number of Days: {claim.total_days}</p>

            <p>Total Students: {claim.total_candidates} × {claim.claim_per_student} = ₹{claim.total_students_amount || 0}</p>
            <p>Total Sessions: {claim.total_sessions} × {claim.claim_per_session} = ₹{claim.total_sessions_amount || 0}</p>
            <p>Total Groups: {claim.total_groups} × {claim.claim_per_group} = ₹{claim.total_groups_amount || 0}</p>

            <p><strong>Total Amount in Words:</strong> {claim.total_amount_words || '___________'}</p>

            <h6>Bank Details of Examiner:</h6>
            <p><strong>Name of Bank:</strong> {claim.bank_name}</p>
            <p><strong>Account Holder Name:</strong> {claim.account_holder}</p>
            <p><strong>Account Number:</strong> {claim.account_number}</p>
            <p><strong>Account Type:</strong> {claim.account_type}</p>
            <p><strong>Branch Name:</strong> {claim.branch_name} &nbsp;&nbsp; City: {claim.branch_city}</p>
            <p><strong>IFSC Code:</strong> {claim.ifsc}</p>
            <p><strong>PAN:</strong> {claim.pan} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Mobile:</strong> {claim.mobile}</p>
            <p><strong>Aadhar / PAN Linking Status:</strong> {claim.aadhar_pan_linked} &nbsp;&nbsp;&nbsp; <strong>Sign: __________________</strong></p>

            <p style={{ marginTop: 40 }}>Examiner Sign _______________________<br />
              HOD Sign _______________________<br />
              Director Sign _______________________
            </p>

            <p style={{ borderTop: '1px dashed #000', marginTop: 40 }}>
              Note: Compulsory Attach Aadhar Card / PAN Card / Nationalized Bank Passbook
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
