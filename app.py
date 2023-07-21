from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from models.portfolio_manager import PortfolioManager
from bson import ObjectId
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Initialize CORS
app.config["MONGO_URI"] = "mongodb://localhost:27017/portfolio_management_system"
mongo = PyMongo(app)


@app.route('/api/portfolioManagers/<string:id>', methods=['DELETE'])
def delete_portfolio_manager(id):
    # Delete the Portfolio Manager from the database based on the provided ID
    deleted_manager = mongo.db.portfolio_manager.find_one_and_delete({"_id": ObjectId(id)})

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
    portfolio_manager = mongo.db.portfolio_manager.find_one({"_id": ObjectId(id)})
    if not portfolio_manager:
        return jsonify({"success": False, "message": "Portfolio manager not found."}), 404

    # Update the portfolio manager's data with the new values
    portfolio_manager["name"] = data.get("name", portfolio_manager["name"])
    portfolio_manager["status"] = data.get("status", portfolio_manager["status"])
    portfolio_manager["role"] = data.get("role", portfolio_manager["role"])
    portfolio_manager["bio"] = data.get("bio", portfolio_manager["bio"])
    portfolio_manager["start_date"] = data.get("start_date", portfolio_manager["start_date"])

    # Update the portfolio manager in the database
    mongo.db.portfolio_manager.update_one({"_id": ObjectId(id)}, {"$set": portfolio_manager})

    # Fetch the updated manager from the database
    updated_manager = mongo.db.portfolio_manager.find_one({"_id": ObjectId(id)})
    # Convert the ObjectId to a string for serialization
    updated_manager['_id'] = str(updated_manager['_id'])

    return jsonify({"success": True, "data": updated_manager})




@app.route('/api/portfolioManagers', methods=['POST'])
def add_portfolio_manager():
    data = request.json  # Access the JSON data sent in the request body

    # Create a new instance of PortfolioManager using the JSON data
    new_manager = PortfolioManager(
        name=data['name'],
        status=data['status'],
        role=data['role'],
        bio=data['bio'],
        start_date=data['start_date']
    )

    # Insert the new_manager data into the MongoDB collection
    inserted_manager_id = mongo.db.portfolio_manager.insert_one(new_manager.__dict__).inserted_id

    # Fetch the newly inserted manager from the MongoDB collection
    inserted_manager = mongo.db.portfolio_manager.find_one({'_id': inserted_manager_id})

    # Convert the ObjectId to a string for serialization
    inserted_manager['_id'] = str(inserted_manager['_id'])

    # Return the inserted manager as the response
    return jsonify(inserted_manager)



@app.route('/api/portfolioManagers', methods=['GET'])
def get_all_portfolio_managers():
    # Fetch all the portfolio managers from the MongoDB collection
    all_managers = list(mongo.db.portfolio_manager.find())

    # Convert the ObjectId to a string for serialization
    for manager in all_managers:
        manager['_id'] = str(manager['_id'])

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
    manager = mongo.db.portfolio_manager.find_one({"_id": ObjectId(manager_id)})

    # If the manager is not found, return an error response
    if not manager:
        return jsonify({"success": False, "message": "Portfolio Manager not found"})

    # Convert the ObjectId to a string for serialization
    manager['_id'] = str(manager['_id'])

    # Return the Portfolio Manager as the response
    return jsonify({"success": True, "data": manager})

if __name__ == "__main__":
    app.run(debug=True)
