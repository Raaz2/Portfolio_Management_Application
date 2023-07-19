import app
import json
from bson import ObjectId

def setup_test_app():
    # Use the test configuration for the app
    app.app.config.from_pyfile('test_config.py')
    app.mongo = app.PyMongo(app.app)


def test_delete_portfolio_manager():
    setup_test_app()

    client = app.app.test_client()

    # Insert some test data into the database
    test_data = {
        "name": "John Doe",
        "status": "Active",
        "role": "Administrator",
        "bio": "Portfolio manager with 5 years of experience.",
        "start_date": "2023-07-01"
    }
    inserted_manager_id = app.mongo.db.portfolio_manager.insert_one(test_data).inserted_id

    # Make a DELETE request to the endpoint with the inserted manager ID
    response = client.delete(f'/api/portfolioManagers/{str(inserted_manager_id)}')

    # Check the response status code (expecting 200 for success)
    assert response.status_code == 200

    # Check the response JSON data for success and the delete message
    response_data = response.get_json()
    assert response_data is not None
    assert "success" in response_data
    assert response_data["success"] is True
    assert "message" in response_data
    assert response_data["message"] == "Portfolio Manager deleted successfully."

    # Check that the manager is no longer in the database
    deleted_manager = app.mongo.db.portfolio_manager.find_one({"_id": ObjectId(inserted_manager_id)})
    assert deleted_manager is None

    # Test deletion of non-existent manager
    non_existent_manager_id = ObjectId()
    response = client.delete(f'/api/portfolioManagers/{str(non_existent_manager_id)}')
    assert response.status_code == 404
    response_data = response.get_json()
    assert response_data is not None
    assert "success" in response_data
    assert response_data["success"] is False
    assert "message" in response_data
    assert response_data["message"] == "Portfolio Manager not found."


def test_update_portfolio_manager():
    setup_test_app()

    client = app.app.test_client()

    # Insert some test data into the database
    test_data = {
        "name": "John Doe",
        "status": "Active",
        "role": "Administrator",
        "bio": "Portfolio manager with 5 years of experience.",
        "start_date": "2023-07-01"
    }
    inserted_manager_id = app.mongo.db.portfolio_manager.insert_one(test_data).inserted_id

    # Test data for updating the portfolio manager
    update_data = {
        "name": "John Doe Updated",
        "status": "Inactive",
        "bio": "Updated bio.",
    }

    # Make a PUT request to the endpoint with the update data and the inserted manager ID
    response = client.put(f'/api/portfolioManagers/{str(inserted_manager_id)}',
                          data=json.dumps(update_data),
                          content_type='application/json')

    # Check the response status code (expecting 200 for success)
    assert response.status_code == 200

    # Check the response JSON data for success and the updated manager data
    response_data = response.get_json()
    assert response_data is not None
    assert "success" in response_data
    assert response_data["success"] is True
    assert "data" in response_data
    assert isinstance(response_data["data"], dict)
    assert response_data["data"]["name"] == update_data["name"]
    assert response_data["data"]["status"] == update_data["status"]
    assert response_data["data"]["bio"] == update_data["bio"]

    # Additional checks based on your implementation
    # ...

    # Fetch the updated manager from the database
    updated_manager = app.mongo.db.portfolio_manager.find_one({"_id": ObjectId(inserted_manager_id)})
    # Convert the ObjectId to a string for serialization
    updated_manager['_id'] = str(updated_manager['_id'])

    # Compare the updated_manager data with the response data
    assert response_data["data"] == updated_manager




def test_get_portfolio_manager_by_id():
    setup_test_app()

    client = app.app.test_client()

    # Insert some test data into the database (optional)
    test_data = {
        "name": "John Doe",
        "status": "Active",
        "role": "Administrator",
        "bio": "Portfolio manager with 5 years of experience.",
        "start_date": "2023-07-01"
    }

    # Insert the test data into the database and get the inserted manager's ID
    inserted_manager_id = app.mongo.db.portfolio_manager.insert_one(test_data).inserted_id

    # Make a GET request to the endpoint with the inserted manager ID
    response = client.get(f'/api/portfolioManagers/{str(inserted_manager_id)}')

    # Check the response status code (expecting 200 for success)
    assert response.status_code == 200

    # Check the response JSON data for the manager details
    response_data = response.get_json()
    assert response_data is not None
    assert "success" in response_data
    assert response_data["success"] is True
    assert "data" in response_data

    # Check if the data field is a dictionary with the expected keys
    data = response_data["data"]
    assert isinstance(data, dict)
    assert "_id" in data  # Change "id" to "_id" here

    # Check if the returned manager details match the test data
    assert data["name"] == test_data["name"]
    assert data["status"] == test_data["status"]
    assert data["role"] == test_data["role"]
    assert data["bio"] == test_data["bio"]
    assert data["start_date"] == test_data["start_date"]




def test_get_all_portfolio_managers():
    setup_test_app()

    client = app.app.test_client()

    # Insert some test data into the database (optional)
    test_data = [
        {
            "name": "John Doe",
            "status": "Active",
            "role": "Administrator",
            "bio": "Portfolio manager with 5 years of experience.",
            "start_date": "2023-07-01"
        },
        # Add more test data if needed
    ]

    for data in test_data:
        app.mongo.db.portfolio_manager.insert_one(data)

    # Make a GET request to the endpoint
    response = client.get('/api/portfolioManagers')

    # Check the response status code (expecting 200 for success)
    assert response.status_code == 200

    # Check the response JSON data for the list of managers
    response_data = response.get_json()
    assert response_data is not None
    assert "success" in response_data
    assert response_data["success"] is True
    assert "data" in response_data

    # Check if the data field is a list of managers
    data = response_data["data"]
    assert isinstance(data, list)

    # Check if each item in the list is a dictionary with the expected keys
    for item in data:
        assert isinstance(item, dict)
        assert "_id" in item
        assert "name" in item
        assert "status" in item
        assert "role" in item
        assert "bio" in item
        assert "start_date" in item

    # ... Rest of your test code ...



def test_add_portfolio_manager():
    setup_test_app()

    client = app.app.test_client()

    # Test data for the request JSON
    data = {
        "name": "John Doe",
        "status": "Active",
        "role": "Administrator",
        "bio": "Lorem ipsum...",
        "start_date": "2023-07-19"
    }

    # Make a POST request to the endpoint with the test data
    response = client.post('/api/portfolio_managers', data=json.dumps(data), content_type='application/json')

    # Check the response status code (expecting 200 for success)
    assert response.status_code == 200

    # Check the response JSON data for the inserted manager
    response_data = response.get_json()
    assert response_data is not None

    # Check the response data for specific fields (you can add more checks as needed)
    assert response_data['name'] == data['name']
    assert response_data['status'] == data['status']
    assert response_data['role'] == data['role']
    assert response_data['bio'] == data['bio']
    assert response_data['start_date'] == data['start_date']

    # Check that the _id field is present in the response data and is a string
    assert '_id' in response_data
    assert isinstance(response_data['_id'], str)

    # Check that the _id field is a valid ObjectId (optional, if needed)
    assert ObjectId.is_valid(response_data['_id'])

    # Ensure that the data is correctly inserted into the MongoDB collection
    # You can add more checks based on your MongoDB setup and data validation needs
    inserted_manager = app.mongo.db.portfolio_manager.find_one({'_id': ObjectId(response_data['_id'])})
    assert inserted_manager is not None
    assert inserted_manager['name'] == data['name']
    assert inserted_manager['status'] == data['status']
    assert inserted_manager['role'] == data['role']
    assert inserted_manager['bio'] == data['bio']
    assert inserted_manager['start_date'] == data['start_date']