from flask import Flask, jsonify, request
# from pymongo import PyMongo
from models.portfolio_manager import PortfolioManager
from models.project import Project
from models.task import Task
from models.resources import Resource
from bson import ObjectId
from flask_cors import CORS
import json

from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

mongo_uri = 'mongodb+srv://Rajeev:AtlasRajeev@cluster0.qpx1rwd.mongodb.net/?retryWrites=true&w=majority'

client = MongoClient(mongo_uri)
db = client.Mongo

class JSONEncoderWithObjectId(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)  # Convert ObjectId to its string representation
        return super().default(o)


app.json_encoder = JSONEncoderWithObjectId


@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.json
    task = Task(data['name'], data['description'], data['priority'], data['assignedTo'], data['dueDate'],
                data['projectName'], data['status'])

    # Insert the new task data into the MongoDB collection
    inserted_task_id = db.tasks.insert_one(task.json()).inserted_id

    # Fetch the newly inserted task from the MongoDB collection
    inserted_task = db.tasks.find_one({'_id': ObjectId(inserted_task_id)})

    # Convert the ObjectId to a string for serialization
    inserted_task['_id'] = str(inserted_task['_id'])

    return jsonify(inserted_task)



# Get All Tasks
@app.route('/api/tasks', methods=['GET'])
def get_all_tasks():
    # Fetch all the tasks from the MongoDB collection
    all_tasks = list(db.tasks.find())

    # Convert the ObjectId to a string for serialization
    for task in all_tasks:
        task['_id'] = str(task['_id'])

    # Create the response data
    response_data = {
        "success": True,
        "data": all_tasks
    }

    # Return the response data as JSON
    return jsonify(response_data)


# Get Task by ID
@app.route('/api/tasks/<string:task_id>', methods=['GET'])
def get_task_by_id(task_id):
    # Fetch the Task by ID from the MongoDB collection
    task = db.tasks.find_one({"_id": ObjectId(task_id)})

    # If the task is not found, return an error response
    if not task:
        return jsonify({"success": False, "message": "Task not found"})

    # Convert the ObjectId to a string for serialization
    task['_id'] = str(task['_id'])

    # Return the Task as the response
    return jsonify({"success": True, "data": task})


@app.route('/api/tasks/<string:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json

    # Check if the provided ID is a valid ObjectId
    if not ObjectId.is_valid(task_id):
        return jsonify({"success": False, "message": "Invalid task ID."}), 400

    # Check if the task with the given ID exists
    task = db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        return jsonify({"success": False, "message": "Task not found."}), 404

    # Update the task's data with the new values
    task["name"] = data.get("name", task["name"])
    task["status"] = data.get("status", task["status"])
    task["projectName"] = data.get("projectName", task["projectName"])
    task["description"] = data.get("description", task["description"])
    task["priority"] = data.get("priority", task["priority"])
    task["assignedTo"] = data.get("assignedTo", task["assignedTo"])

    # Update the task in the database
    db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": task})

    # Fetch the updated task from the database
    updated_task = db.tasks.find_one({"_id": ObjectId(task_id)})
    # Convert the ObjectId to a string for serialization
    updated_task['_id'] = str(updated_task['_id'])

    return jsonify({"success": True, "data": updated_task})


# Delete a Task
@app.route('/api/tasks/<string:task_id>', methods=['DELETE'])
def delete_task(task_id):
    # Delete the Task from the database based on the provided ID
    deleted_task = db.tasks.find_one_and_delete(
        {"_id": ObjectId(task_id)})

    if deleted_task:
        # Convert the ObjectId to a string for serialization
        deleted_task['_id'] = str(deleted_task['_id'])
        return jsonify({"success": True, "message": "Task deleted successfully."})
    else:
        return jsonify({"success": False, "message": "Task not found."}), 404


@app.route('/api/resources', methods=['POST'])
def create_resource():
    data = request.json  # Access the JSON data sent in the request body

    # Create a new instance of Resource using the JSON data
    new_resource = Resource(
        rname=data['rname'],
        assignedTaskId=data['assignedTaskId'],
        description=data['description'],
        type=data['type'],
        availability=data['availability']
    )

    # Insert the new_resource data into the MongoDB collection
    inserted_resource_id = db.resources.insert_one(
        new_resource.json()).inserted_id

    # Fetch the newly inserted resource from the MongoDB collection
    inserted_resource = db.resources.find_one(
        {'_id': ObjectId(inserted_resource_id)})

    # Convert the ObjectId to a string for serialization
    inserted_resource['_id'] = str(inserted_resource['_id'])

    # Return the inserted resource as the response
    return jsonify(inserted_resource)


# Get All Resources
@app.route('/api/resources', methods=['GET'])
def get_all_resources():
    # Fetch all the resources from the MongoDB collection
    all_resources = list(db.resources.find())

    # Convert the ObjectId to a string for serialization
    for resource in all_resources:
        resource['_id'] = str(resource['_id'])

    # Create the response data
    response_data = {
        "success": True,
        "data": all_resources
    }

    # Return the response data as JSON
    return jsonify(response_data)


# Get Resource by ID
@app.route('/api/resources/<string:resource_id>', methods=['GET'])
def get_resource_by_id(resource_id):
    # Fetch the Resource by ID from the MongoDB collection
    resource = db.resources.find_one({"_id": ObjectId(resource_id)})

    # If the resource is not found, return an error response
    if not resource:
        return jsonify({"success": False, "message": "Resource not found"})

    # Convert the ObjectId to a string for serialization
    resource['_id'] = str(resource['_id'])

    # Create the response data
    response_data = {
        "success": True,
        "data": resource
    }

    # Return the response data as JSON
    return jsonify(response_data)


@app.route('/api/resources/<string:resource_id>', methods=['PUT'])
def update_resource(resource_id):
    data = request.json

    # Check if the provided ID is a valid ObjectId
    if not ObjectId.is_valid(resource_id):
        return jsonify({"success": False, "message": "Invalid resource ID."}), 400

    # Check if the resource with the given ID exists
    resource = db.resources.find_one({"_id": ObjectId(resource_id)})
    if not resource:
        return jsonify({"success": False, "message": "Resource not found."}), 404

    # Update the resource's data with the new values
    resource["rname"] = data.get("rname", resource["rname"])
    resource["assignedTaskId"] = data.get(
        "assignedTaskId", resource["assignedTaskId"])
    resource["description"] = data.get("description", resource["description"])
    resource["type"] = data.get("type", resource["type"])
    resource["availability"] = data.get(
        "availability", resource["availability"])

    # Update the resource in the database
    db.resources.update_one(
        {"_id": ObjectId(resource_id)}, {"$set": resource})

    # Fetch the updated resource from the database
    updated_resource = db.resources.find_one(
        {"_id": ObjectId(resource_id)})
    # Convert the ObjectId to a string for serialization
    updated_resource['_id'] = str(updated_resource['_id'])

    return jsonify({"success": True, "data": updated_resource})


# Delete a Resource
@app.route('/api/resources/<string:resource_id>', methods=['DELETE'])
def delete_resource(resource_id):
    # Delete the Resource from the database based on the provided ID
    deleted_resource = db.resources.find_one_and_delete(
        {"_id": ObjectId(resource_id)})

    if deleted_resource:
        # Convert the ObjectId to a string for serialization
        deleted_resource['_id'] = str(deleted_resource['_id'])
        return jsonify({"success": True, "message": "Resource deleted successfully."})
    else:
        return jsonify({"success": False, "message": "Resource not found."}), 404


# crud operattions on project entity

@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    project = Project(data['name'], data['description'],
                      data['start_date'], data['end_date'], data['manager_id'], data['status'])

    # Insert the new project data into the MongoDB collection
    inserted_project_id = db.project_collection.insert_one(
        project.json()).inserted_id

    # Fetch the newly inserted project from the MongoDB collection
    inserted_project = db.project_collection.find_one(
        {'_id': ObjectId(inserted_project_id)})

    # Convert the ObjectId to a string for serialization
    inserted_project['_id'] = str(inserted_project['_id'])

    # Add the project ID to the projects list of the corresponding portfolio manager
    manager_id = ObjectId(data['manager_id'])
    db.portfolio_manager.update_one(
        {'_id': manager_id},
        {'$push': {'projects': inserted_project_id}}
    )

    # Return the inserted project as the response
    return jsonify(inserted_project)


# Get all Projects
@app.route('/api/projects', methods=['GET'])
def get_all_projects():
    # Fetch all the projects from the MongoDB collection
    all_projects = list(db.project_collection.find())

    # Convert the ObjectId to a string for serialization
    for project in all_projects:
        project['_id'] = str(project['_id'])

    # Create the response data
    response_data = {
        "success": True,
        "data": all_projects
    }

    # Return the response data as JSON
    return jsonify(response_data)


# Get a Project by ID
@app.route('/api/projects/<string:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    # Fetch the Project by ID from the MongoDB collection
    project = db.project_collection.find_one(
        {"_id": ObjectId(project_id)})

    # If the project is not found, return an error response
    if not project:
        return jsonify({"success": False, "message": "Project not found"})

    # Convert the ObjectId to a string for serialization
    project['_id'] = str(project['_id'])

    # Return the Project as the response
    return jsonify({"success": True, "data": project})


# Update a Project
@app.route('/api/projects/<string:project_id>', methods=['PUT'])
def update_project(project_id):
    data = request.json

    # Check if the provided ID is a valid ObjectId
    if not ObjectId.is_valid(project_id):
        return jsonify({"success": False, "message": "Invalid project ID."}), 400

    # Check if the project with the given ID exists
    project = db.project_collection.find_one(
        {"_id": ObjectId(project_id)})
    if not project:
        return jsonify({"success": False, "message": "Project not found."}), 404

    # Update the project's data with the new values
    project["name"] = data.get("name", project["name"])
    project["description"] = data.get("description", project["description"])
    project["start_date"] = data.get("start_date", project["start_date"])
    project["end_date"] = data.get("end_date", project["end_date"])
    project["manager_id"] = data.get("manager_id", project["manager_id"])
    project["status"] = data.get("status",project["status"])

    # Update the project in the database
    db.project_collection.update_one(
        {"_id": ObjectId(project_id)}, {"$set": project})

    # Fetch the updated project from the database
    updated_project = db.project_collection.find_one(
        {"_id": ObjectId(project_id)})
    # Convert the ObjectId to a string for serialization
    updated_project['_id'] = str(updated_project['_id'])

    return jsonify({"success": True, "data": updated_project})


# Delete a Project
@app.route('/api/projects/<string:project_id>', methods=['DELETE'])
def delete_project(project_id):
    # Delete the Project from the database based on the provided ID
    deleted_project = db.project_collection.find_one_and_delete(
        {"_id": ObjectId(project_id)})

    if deleted_project:
        # Convert the ObjectId to a string for serialization
        deleted_project['_id'] = str(deleted_project['_id'])
        return jsonify({"success": True, "message": "Project deleted successfully."})
    else:
        return jsonify({"success": False, "message": "Project not found."}), 404


# crud operations on portfolio manager

@app.route('/api/portfolioManagers/<string:id>', methods=['DELETE'])
def delete_portfolio_manager(id):
    # Delete the Portfolio Manager from the database based on the provided ID
    deleted_manager = db.portfolio_manager.find_one_and_delete(
        {"_id": ObjectId(id)})

    if deleted_manager:
        # Convert the ObjectId to a string for serialization
        deleted_manager['_id'] = str(deleted_manager['_id'])
        return jsonify({"success": True, "message": "Portfolio Manager deleted successfully."})
    else:
        return jsonify({"success": False, "message": "Portfolio Manager not found."}), 404


@app.route('/api/portfolioManagers/<string:id>', methods=['PUT'])
def update_portfolio_manager(id):
    # Get the JSON data from the request body
    data = request.json

    # Check if the request data is valid
    if not data:
        return jsonify({"success": False, "message": "Invalid request data."}), 400

    # Check if the provided ID is a valid ObjectId
    if not ObjectId.is_valid(id):
        return jsonify({"success": False, "message": "Invalid portfolio manager ID."}), 400

    # Check if the portfolio manager with the given ID exists
    portfolio_manager = db.portfolio_manager.find_one(
        {"_id": ObjectId(id)})
    if not portfolio_manager:
        return jsonify({"success": False, "message": "Portfolio manager not found."}), 404

    # Update the portfolio manager's data with the new values
    portfolio_manager["name"] = data.get("name", portfolio_manager["name"])
    portfolio_manager["status"] = data.get(
        "status", portfolio_manager["status"])
    portfolio_manager["role"] = data.get("role", portfolio_manager["role"])
    portfolio_manager["bio"] = data.get("bio", portfolio_manager["bio"])
    portfolio_manager["start_date"] = data.get(
        "start_date", portfolio_manager["start_date"])

    # Update the portfolio manager in the database
    db.portfolio_manager.update_one(
        {"_id": ObjectId(id)}, {"$set": portfolio_manager})

    # Fetch the updated manager from the database
    updated_manager = db.portfolio_manager.find_one(
        {"_id": ObjectId(id)})
    # Convert the ObjectId to a string for serialization
    updated_manager['_id'] = str(updated_manager['_id'])

    return jsonify({"success": True, "data": updated_manager})


@app.route('/api/portfolioManagers', methods=['POST'])
def add_portfolio_manager():
    data = request.json
    new_manager = PortfolioManager(
        name=data['name'],
        status=data['status'],
        role=data['role'],
        bio=data['bio'],
        start_date=data['start_date']
    )
    inserted_manager_id = db.portfolio_manager.insert_one(
        new_manager.json()).inserted_id
    inserted_manager = db.portfolio_manager.find_one(
        {'_id': ObjectId(inserted_manager_id)})
    inserted_manager['_id'] = str(inserted_manager['_id'])
    return jsonify(inserted_manager)


@app.route('/api/portfolioManagers', methods=['GET'])
def get_all_portfolio_managers():
    # Fetch all the portfolio managers from the MongoDB collection
    all_managers = list(db.portfolio_manager.find())

    # Convert the ObjectId to a string for serialization in projects field
    for manager in all_managers:
        manager['_id'] = str(manager['_id'])
        for i, project_id in enumerate(manager['projects']):
            manager['projects'][i] = str(project_id)

    # Create the response data
    response_data = {
        "success": True,
        "data": all_managers
    }

    # Return the response data as JSON
    return jsonify(response_data)


@app.route('/api/portfolioManagers/<string:manager_id>', methods=['GET'])
def get_portfolio_manager_by_id(manager_id):
    # Fetch the Portfolio Manager by ID from the MongoDB collection
    manager = db.portfolio_manager.find_one(
        {"_id": ObjectId(manager_id)})

    # If the manager is not found, return an error response
    if not manager:
        return jsonify({"success": False, "message": "Portfolio Manager not found"})

    # Convert the ObjectId to a string for serialization
    manager['_id'] = str(manager['_id'])
    for i, project_id in enumerate(manager['projects']):
        manager['projects'] = str(project_id)
    # Return the Portfolio Manager as the response
    return jsonify({"success": True, "data": manager})


if __name__ == "__main__":
    app.run(debug=True)
