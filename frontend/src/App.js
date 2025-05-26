import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClaimForm from './components/ClaimForm';
import AdminDashboard from './components/AdminDashboard';
import ClaimPDF from './components/ClaimPDF';

function App() {
  return (
    <Router>
      <nav style={{ padding: '1rem', backgroundColor: '#eee' }}>
        <Link to="/form" style={{ marginRight: '1rem' }}>Claim Form</Link>
        <Link to="/admin">Admin Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/form" element={<ClaimForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
