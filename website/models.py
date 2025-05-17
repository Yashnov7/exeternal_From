# website/models.py

from flask_login import UserMixin
from mongoengine import (
    Document, EmbeddedDocument,
    StringField, IntField, FloatField,
    EmbeddedDocumentListField
)

# ---- User model for login ----
class User(Document, UserMixin):
    email = StringField(required=True, unique=True)
    password = StringField(required=True)

    meta = {
        "collection": "users"
    }

# ---- Embedded subject info ----
class Subject(EmbeddedDocument):
    code = StringField(required=True)
    name = StringField(required=True)

# ---- Main form model ----
class ExaminerClaim(Document):
    examiner_name = StringField(required=True)
    college_name = StringField(required=True)
    mobile = StringField()
    exam_type = StringField()
    exam_month_year = StringField()
    academic_year = StringField()
    branch = StringField()
    division = StringField()

    subjects = EmbeddedDocumentListField(Subject)

    total_candidates = IntField()
    total_sessions = IntField()
    total_groups = IntField()
    date_from = StringField()
    date_to = StringField()
    total_days = IntField()

    claim_per_student = FloatField()
    claim_per_session = FloatField()
    claim_per_group = FloatField()

    total_students_amount = FloatField()
    total_sessions_amount = FloatField()
    total_groups_amount = FloatField()
    total_amount_words = StringField()

    bank_name = StringField()
    account_holder = StringField()
    account_number = StringField()
    account_type = StringField()
    branch_name = StringField()
    branch_city = StringField()
    ifsc = StringField()
    pan = StringField()
    aadhar_pan_linked = StringField(choices=["Yes", "No"])

    meta = {
        "collection": "examiner_claims"
    }
