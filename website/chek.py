from models import ExaminerClaim, Subject

subj = Subject(code="CS101", name="Computer Science")
claim = ExaminerClaim(examiner_name="Dr. John", college_name="MIT", subjects=[subj])
claim.save()

print("Record saved successfully!")
