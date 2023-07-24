class Task:
    def __init__(self, name, description, priority, assignedTo, dueDate, projectName, status):
        self.name = name
        self.description = description
        self.priority = priority
        self.assignedTo = assignedTo
        self.dueDate = dueDate
        self.projectName = projectName
        self.status = status

    def json(self):
        return {
            'name': self.name,
            'description': self.description,
            'priority': self.priority,
            'assignedTo': self.assignedTo,
            'dueDate': self.dueDate,
            'projectName': self.projectName,
            'status': self.status
        }
