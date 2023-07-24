# app.py (updated)
class Project:
    def __init__(self, name, description, start_date, end_date, manager_id, status):
        self.name = name
        self.description = description
        self.start_date = start_date
        self.end_date = end_date
        self.manager_id = manager_id
        self.status = status

    def json(self):
        return {
            'name': self.name,
            'description': self.description,
            'start_date': self.start_date,
            'end_date': self.end_date,
            'manager_id': self.manager_id,
            'status' : self.status
        }



