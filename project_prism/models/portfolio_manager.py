# app.py (updated)
class PortfolioManager:
    def __init__(self, name, status, role, bio, start_date):
        self.name = name
        self.status = status
        self.role = role
        self.bio = bio
        self.start_date = start_date
        self.projects = []

    def json(self):
        return {
            'name': self.name,
            'status': self.status,
            'role': self.role,
            'bio': self.bio,
            'start_date': self.start_date,
            'projects': self.projects
        }