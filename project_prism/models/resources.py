# Resource model
class Resource:
    def __init__(self, rname, assignedTaskId, description, type, availability):
        self.rname = rname
        self.assignedTaskId = assignedTaskId
        self.description = description
        self.type = type
        self.availability = availability

    def json(self):
        return {
            "rname": self.rname,
            "assignedTaskId": self.assignedTaskId,
            "description": self.description,
            "type": self.type,
            "availability": self.availability
        }
