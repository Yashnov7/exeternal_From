import { useState, useEffect } from 'react';
import axios from 'axios';
import './ClaimForm.css';

const ClaimForm = () => {
  const [form, setForm] = useState({
    examiner_name: '',
    college_name: '',
    mobile: '',
    exam_type: '',
    exam_month_year: '',
    academic_year: '',
    branch: '',
    division: '',
    subjects: [{ code: '', name: '' }],
    total_candidates: 0,
    total_sessions: 0,
    total_groups: 0,
    date_from: '',
    date_to: '',
    total_days: 0,
    claim_per_student: 0,
    claim_per_session: 0,
    claim_per_group: 0,
    total_students_amount: 0,
    total_sessions_amount: 0,
    total_groups_amount: 0,
    total_amount_words: '',
    bank_name: '',
    account_holder: '',
    account_number: '',
    account_type: '',
    branch_name: '',
    branch_city: '',
    ifsc: '',
    pan: '',
    aadhar_pan_linked: 'Yes',
  });

  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const numberToWords = (num) =>
   {
   const a = 
    [
    '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'
    ];
   const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

   if ((num = num.toString()).length > 9) return 'overflow';
   const n = ('000000000' + num).substr(-9).match(/.{1,2}/g);
   let str = '';
   const units = ['crore', 'lakh', 'thousand', 'hundred', ''];
   for (let i = 0; i < units.length; i++) {
    const val = parseInt(n[i]);
    if (val) {
      if (val < 20) {
        str += a[val] + ' ';
      } else {
        str += b[Math.floor(val / 10)] + ' ' + a[val % 10] + ' ';
      }
      str += units[i] + ' ';
    }
  }
  return str.trim().replace(/\s+/g, ' ').replace(/^./, str => str.toUpperCase());
 };


  const calculateTotals = () => {
    const studentAmount = form.total_candidates * form.claim_per_student;
    const sessionAmount = form.total_sessions * form.claim_per_session;
    const groupAmount = form.total_groups * form.claim_per_group;
    const totalAmount = studentAmount + sessionAmount + groupAmount;

    setForm(prev => ({
      ...prev,
      total_students_amount: studentAmount,
      total_sessions_amount: sessionAmount,
      total_groups_amount: groupAmount,
      total_amount_words: numberToWords(totalAmount)+'Only'
    }));
  };

  useEffect(() => {
    calculateTotals();
  }, [
    form.total_candidates,
    form.claim_per_student,
    form.total_sessions,
    form.claim_per_session,
    form.total_groups,
    form.claim_per_group
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const addSubject = () => {
    setForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, { code: '', name: '' }]
    }));
  };

  const handleSubjectChange = (index, field, value) => {
    const updated = [...form.subjects];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, subjects: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/examiner-claim', form, {
        withCredentials: true,
      });
      setSuccess(true);
    } catch (err) {
      alert("Error submitting form.");
      console.error(err);
    }
  };

  // Prevent form submission via Enter unless on last step
  const preventEnterSubmit = (e) => {
    if (e.key === 'Enter' && step !== 4) {
      e.preventDefault();
    }
  };

  return (
    <section className="claim-form-section" onKeyDown={preventEnterSubmit}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-8 col-xl-10">
            <div className="card rounded-3">
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2">Examiner Claim Form</h3>

                {success ? (
                  <p className="text-success">Form submitted successfully!</p>
                ) : (
                  <form onSubmit={handleSubmit} className="px-md-2">
                    {step === 1 && (
                      <div>
                        <h5>Personal Information</h5>
                        <input name="examiner_name" placeholder="Examiner Name" value={form.examiner_name} onChange={handleChange} required />
                        <input name="mobile" placeholder="Mobile" value={form.mobile} onChange={handleChange} required />
                        <button type="button" onClick={handleNext} className="btn btn-primary mt-3">Next</button>
                      </div>
                    )}

                    {step === 2 && (
                      <div>
                        <h5>College and Exam Info</h5>
                        <input name="college_name" placeholder="College Name" value={form.college_name} onChange={handleChange} required />
                        <input name="exam_type" placeholder="Exam Type" value={form.exam_type} onChange={handleChange} required />
                        <input name="exam_month_year" placeholder="Exam Month & Year" value={form.exam_month_year} onChange={handleChange} required />
                        <input name="academic_year" placeholder="Academic Year" value={form.academic_year} onChange={handleChange} required />
                        <input name="branch" placeholder="Branch" value={form.branch} onChange={handleChange} required />
                        <input name="division" placeholder="Division" value={form.division} onChange={handleChange} required />
                        <input name="date_from" type="date" placeholder="Date From" value={form.date_from} onChange={handleChange} required />
                        <input name="date_to" type="date" placeholder="Date To" value={form.date_to} onChange={handleChange} required />
                        <input name="total_days" type="number" placeholder="Total Days" value={form.total_days} onChange={handleChange} required />
                        <button type="button" onClick={handleBack} className="btn btn-secondary mt-3 me-2">Back</button>
                        <button type="button" onClick={handleNext} className="btn btn-primary mt-3">Next</button>
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <h5>Bank Details</h5>
                        <input name="account_holder" placeholder="Account Holder" value={form.account_holder} onChange={handleChange} required />
                        <input name="bank_name" placeholder="Bank Name" value={form.bank_name} onChange={handleChange} required />
                        <input name="account_number" placeholder="Account Number" value={form.account_number} onChange={handleChange} required />
                        <input name="account_type" placeholder="Account Type" value={form.account_type} onChange={handleChange} required />
                        <input name="branch_name" placeholder="Branch Name" value={form.branch_name} onChange={handleChange} required />
                        <input name="branch_city" placeholder="Branch City" value={form.branch_city} onChange={handleChange} required />
                        <input name="ifsc" placeholder="IFSC" value={form.ifsc} onChange={handleChange} required />
                        <input name="pan" placeholder="PAN" value={form.pan} onChange={handleChange} required />
                        <select name="aadhar_pan_linked" value={form.aadhar_pan_linked} onChange={handleChange} required>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </select>
                        <button type="button" onClick={handleBack} className="btn btn-secondary mt-3 me-2">Back</button>
                        <button type="button" onClick={handleNext} className="btn btn-primary mt-3">Next</button>
                      </div>
                    )}

                    {step === 4 && (
                      <div>
                        <h5>Claim Details</h5>
                        <input name="total_candidates" type="number" placeholder="Total Candidates" value={form.total_candidates} onChange={handleChange} required />
                        <input name="claim_per_student" type="number" placeholder="Rate per Student" value={form.claim_per_student} onChange={handleChange} required />
                        <p>Total Students Amount: Rs. {form.total_students_amount}</p>

                        <input name="total_sessions" type="number" placeholder="Total Sessions" value={form.total_sessions} onChange={handleChange} required />
                        <input name="claim_per_session" type="number" placeholder="Rate per Session" value={form.claim_per_session} onChange={handleChange} required />
                        <p>Total Sessions Amount: Rs. {form.total_sessions_amount}</p>

                        <input name="total_groups" type="number" placeholder="Total Groups" value={form.total_groups} onChange={handleChange} required />
                        <input name="claim_per_group" type="number" placeholder="Rate per Group" value={form.claim_per_group} onChange={handleChange} required />
                        <p>Total Groups Amount: Rs. {form.total_groups_amount}</p>

                        <p>Total Amount in Words: {form.total_amount_words}</p>
                        <button type="button" onClick={handleBack} className="btn btn-secondary mt-3 me-2">Back</button>
                        <button type="submit" className="btn btn-success mt-3">Submit</button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClaimForm;
