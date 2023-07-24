import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddTaskForm from './AddTaskForm';
import UpdateTaskForm from './UpdateTaskForm';
import './TaskList.css'

const backendBaseUrl = 'http://localhost:5000'; // Set the base URL for the backend

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [developers, setDevelopers] = useState([]); // Store the list of developers
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [addStatus, setAddStatus] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/tasks`);
      const data = response.data.data;
      setTasks(data);
    } catch (error) {
      console.error('Error fetching Tasks:', error);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const response = await axios.get(`${backendBaseUrl}/api/resources`);
      const data = response.data.data;
      setDevelopers(data);
    } catch (error) {
      console.error('Error fetching Developers:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchDevelopers();
  }, [updateStatus, deleteStatus, addStatus]);

  const handleUpdate = (id) => {
    setSelectedTaskId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendBaseUrl}/api/tasks/${id}`);
      setDeleteStatus(true);
    } catch (error) {
      console.error('Error deleting Task:', error);
    }
  };

  useEffect(() => {
    let timer;
    if (updateStatus || deleteStatus || addStatus) {
      timer = setTimeout(() => {
        setUpdateStatus(false);
        setDeleteStatus(false);
        setAddStatus(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [updateStatus, deleteStatus, addStatus]);

  // Helper function to get the name of the developer based on assignedTo ID
  const getDeveloperName = (developerId) => {
    const developer = developers.find((dev) => dev._id === developerId);
    return developer ? developer.rname : 'Unknown';
  };

  return (
    <div className="task-list">
      <h2>Task List</h2>
      <button onClick={() => setShowAddForm(true)}>Add New Task</button>
      {showAddForm ? (
        <AddTaskForm
          onSuccess={() => {
            setShowAddForm(false);
            setAddStatus(true);
          }}
        />
      ) : (
        <>
          <ul className="task-list-items">
            {tasks.map((task) => (
              <li key={task._id} className="task-item">
                <p className="task-name">Name: {task.name}</p>
                <p className="task-description">Description: {task.description}</p>
                <p className="task-priority">Priority: {task.priority}</p>
                <p className="task-assigned-to">Assigned To: {getDeveloperName(task.assignedTo)}</p>
                <p className="task-project-name">Project Name: {task.projectName}</p>
                <p className="task-status">Status: {task.status}</p>
                <button onClick={() => handleUpdate(task._id)}>Update</button>
                <button onClick={() => handleDelete(task._id)}>Delete</button>
              </li>
            ))}
          </ul>

          {updateStatus && <div className="success-message">Task updated successfully!</div>}
          {deleteStatus && <div className="success-message">Task deleted successfully!</div>}
        </>
      )}

      {selectedTaskId && (
        <div className="update-form">
          <UpdateTaskForm
            taskId={selectedTaskId}
            onSuccess={() => {
              setSelectedTaskId(null);
              setUpdateStatus(true);
            }}
          />
        </div>
      )}

      {addStatus && <div className="success-message">Task added successfully! Reloading list...</div>}
    </div>
  );
};

export default TaskList;
