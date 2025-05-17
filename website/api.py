from flask import request, jsonify, send_file, Blueprint
from flask_login import login_required, current_user
from .models import ExaminerClaim, Subject
import io
import csv

api = Blueprint('api', __name__)


@api.route('/examiner-claim', methods=['POST'])
@login_required
def submit_examiner_claim():
    data = request.json
    existing = ExaminerClaim.objects(examiner_name=data['examiner_name']).first()

    claim_data = {
        "examiner_name": data['examiner_name'],
        "college_name": data['college_name'],
        "mobile": data['mobile'],
        "exam_type": data['exam_type'],
        "exam_month_year": data['exam_month_year'],
        "academic_year": data['academic_year'],
        "branch": data['branch'],
        "division": data['division'],
        "subjects": [Subject(**subj) for subj in data['subjects']],
        "total_candidates": data['total_candidates'],
        "total_sessions": data['total_sessions'],
        "total_groups": data['total_groups'],
        "date_from": data['date_from'],
        "date_to": data['date_to'],
        "total_days": data['total_days'],
        "claim_per_student": data['claim_per_student'],
        "claim_per_session": data['claim_per_session'],
        "claim_per_group": data['claim_per_group'],
        "total_students_amount": data['total_students_amount'],
        "total_sessions_amount": data['total_sessions_amount'],
        "total_groups_amount": data['total_groups_amount'],
        "total_amount_words": data['total_amount_words'],
        "bank_name": data['bank_name'],
        "account_holder": data['account_holder'],
        "account_number": data['account_number'],
        "account_type": data['account_type'],
        "branch_name": data['branch_name'],
        "branch_city": data['branch_city'],
        "ifsc": data['ifsc'],
        "pan": data['pan'],
        "aadhar_pan_linked": data['aadhar_pan_linked']
    }

    if existing:
        existing.update(**claim_data)
    else:
        ExaminerClaim(**claim_data).save()

    return jsonify({"message": "Examiner claim submitted successfully."})


@api.route('/examiner-claims', methods=['GET'])
@login_required
def get_all_claims():
    claims = ExaminerClaim.objects()
    response = []

    for claim in claims:
        response.append({
            "examiner_name": claim.examiner_name,
            "college_name": claim.college_name,
            "mobile": claim.mobile,
            "exam_type": claim.exam_type,
            "branch": claim.branch,
            "subjects": [{"code": s.code, "name": s.name} for s in claim.subjects],
            "total_candidates": claim.total_candidates,
            "total_students_amount": claim.total_students_amount,
            "account_number": claim.account_number,
            "ifsc": claim.ifsc,
            "pan": claim.pan
        })

    return jsonify(response)


@api.route('/export/claims/csv', methods=['GET'])
@login_required
def export_claims_csv():
    claims = ExaminerClaim.objects()

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Examiner", "College", "Mobile", "Exam Type", "Branch",
        "Subject(s)", "Candidates", "Total Amount",
        "Account Number", "IFSC", "PAN"
    ])

    for c in claims:
        subjects = ", ".join([f"{s.code}-{s.name}" for s in c.subjects])
        writer.writerow([
            c.examiner_name,
            c.college_name,
            c.mobile,
            c.exam_type,
            c.branch,
            subjects,
            c.total_candidates,
            c.total_students_amount,
            c.account_number,
            c.ifsc,
            c.pan
        ])

    output.seek(0)
    return send_file(
        io.BytesIO(output.getvalue().encode()),
        mimetype="text/csv",
        as_attachment=True,
        download_name="examiner_claims.csv"
    )


@api.route('/session', methods=['GET'])
def check_session():
    if current_user.is_authenticated:
        return jsonify({
            "logged_in": True,
            "email": current_user.email
        })
    return jsonify({"logged_in": False}), 401

@api.route('/examiner-claims/full', methods=['GET'])
@login_required
def get_full_claims():
    claims = ExaminerClaim.objects()
    response = []

    for claim in claims:
        response.append({
            "examiner_name": claim.examiner_name,
            "college_name": claim.college_name,
            "mobile": claim.mobile,
            "exam_type": claim.exam_type,
            "exam_month_year": claim.exam_month_year,
            "academic_year": claim.academic_year,
            "branch": claim.branch,
            "division": claim.division,
            "subjects": [{"code": s.code, "name": s.name} for s in claim.subjects],
            "total_candidates": claim.total_candidates,
            "total_sessions": claim.total_sessions,
            "total_groups": claim.total_groups,
            "date_from": claim.date_from,
            "date_to": claim.date_to,
            "total_days": claim.total_days,
            "claim_per_student": claim.claim_per_student,
            "claim_per_session": claim.claim_per_session,
            "claim_per_group": claim.claim_per_group,
            "total_students_amount": claim.total_students_amount,
            "total_sessions_amount": claim.total_sessions_amount,
            "total_groups_amount": claim.total_groups_amount,
            "total_amount_words": claim.total_amount_words,
            "bank_name": claim.bank_name,
            "account_holder": claim.account_holder,
            "account_number": claim.account_number,
            "account_type": claim.account_type,
            "branch_name": claim.branch_name,
            "branch_city": claim.branch_city,
            "ifsc": claim.ifsc,
            "pan": claim.pan,
            "aadhar_pan_linked": claim.aadhar_pan_linked
        })

    return jsonify(response)

