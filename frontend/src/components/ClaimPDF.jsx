import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
  },
  heading: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 5,
  },
  underline: {
    textDecoration: 'underline',
  },
  section: {
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  listItem: {
    marginLeft: 15,
  },
  dashedLine: {
    borderTop: '1pt dashed black',
    marginTop: 15,
  },
});

const ClaimPDF = ({ claim }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={[styles.heading]}>MIT Art, Design and Technology University, Pune</Text>
      <Text style={[styles.heading, styles.underline]}>CLAIM TO BE FILLED IN BY THE EXAMINER</Text>

      <View style={styles.section}>
        <Text><Text style={styles.bold}>Examiner:</Text> {claim.examiner_name}</Text>
        <Text><Text style={styles.bold}>College:</Text> {claim.college_name}</Text>
        <Text><Text style={styles.bold}>Mobile:</Text> {claim.mobile}</Text>
        <Text><Text style={styles.bold}>Academic Year:</Text> {claim.academic_year}</Text>
        <Text><Text style={styles.bold}>Branch:</Text> {claim.branch}</Text>
        <Text><Text style={styles.bold}>Division:</Text> {claim.division}</Text>
      </View>

      <Text style={styles.bold}>Subjects:</Text>
      {claim.subjects?.length > 0
        ? claim.subjects.map((s, i) => (
            <Text key={i} style={styles.listItem}>
              - Code: {s.code} | Name: {s.name}
            </Text>
          ))
        : <Text style={styles.listItem}>- Code: ____ | Name: ____</Text>}

      <View style={styles.section}>
        <Text>Total Candidates: {claim.total_candidates}</Text>
        <Text>Total Sessions: {claim.total_sessions}</Text>
        <Text>Total Groups: {claim.total_groups}</Text>
        <Text>Dates: {claim.date_from} to {claim.date_to}</Text>
        <Text>Total Days: {claim.total_days}</Text>
        <Text>Student Amount: ₹{claim.total_students_amount}</Text>
        <Text>Session Amount: ₹{claim.total_sessions_amount}</Text>
        <Text>Group Amount: ₹{claim.total_groups_amount}</Text>
        <Text><Text style={styles.bold}>Total in Words:</Text> {claim.total_amount_words}</Text>
      </View>

      <Text style={styles.bold}>Bank Details:</Text>
      <Text>Bank: {claim.bank_name}</Text>
      <Text>Account Holder: {claim.account_holder}</Text>
      <Text>Account #: {claim.account_number}</Text>
      <Text>Type: {claim.account_type}</Text>
      <Text>Branch: {claim.branch_name} ({claim.branch_city})</Text>
      <Text>IFSC: {claim.ifsc}</Text>
      <Text>PAN: {claim.pan}</Text>
      <Text>Aadhar-PAN Linked: {claim.aadhar_pan_linked}</Text>

      <Text style={{ marginTop: 20 }}>Signatures: Examiner ____ | HOD ____ | Director ____</Text>
      <View style={styles.dashedLine} />
      <Text>Attach: Aadhar / PAN / Bank Passbook Copy</Text>
    </Page>
  </Document>
);

export default ClaimPDF;
