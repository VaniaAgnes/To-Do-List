import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { firestore, auth } from "./firebase"; // Import Firebase authentication
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function UserProfile({ user }) {
  const profileIcon = './assets/kuromi.jpg'; // Define profileIcon here
  return (
    <div className="user-profile">
      <div className="user-details">
        <span className="email">{user?.email}</span>
      </div>
      <img src={user?.photoURL || profileIcon} alt="Profile" className="profile-img" />
    </div>
  );
}


function Header() {
const [user] = useAuthState(auth);
const navigate = useNavigate();

const handleProfileClick = () => {
  navigate("/profile"); // Navigate to the Profile.jsx page
};
return (
  <div className="header">
    <button className="profile-button" onClick={handleProfileClick}>
        <UserProfile user={user} />
      </button>
    
    <div className="user-details">
      <p>Name: Vania Agnes Djunaedy ⋆˚🐾˖°</p>
      <p>NIM: 2602158531 ⋆˙⟡♡</p>
      <p>Class: L4BC ⋆૮₍´˶• . • ⑅ ₎ა</p>
    </div>
  </div>
);
}



function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("");
  const [showCompleted, setShowCompleted] = useState(false);

  async function fetchTodos() {
    const querySnapshot = await getDocs(collection(firestore, "todos"));
    const tasksData = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        completed: data.completed,
        text: data.text,
      };
    });

    setTasks(tasksData);
  }

  // This useEffect will trigger the code to be executed the very time
  // the website is loaded. (there are additonal concept to this actually.)
  useEffect(() => {
    // code
    fetchTodos();
  }, []);

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    if (newTask.trim() !== "") {
      setTasks((prevTasks) => [
        ...prevTasks,
        { id: Date.now(), text: newTask, completed: false },
      ]);
      setNewTask("");
    }
  }

  function handleCheckboxChange(id) {
    setTasks((prevTasks) => {
      return prevTasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
    });
  }

  function deleteTask(id) {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  function moveTaskUp(index) {
    if (index > 0) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        const temp = updatedTasks[index];
        updatedTasks[index] = updatedTasks[index - 1];
        updatedTasks[index - 1] = temp;
        return updatedTasks;
      });
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks];
        const temp = updatedTasks[index];
        updatedTasks[index] = updatedTasks[index + 1];
        updatedTasks[index + 1] = temp;
        return updatedTasks;
      });
    }
  }

  function applyFilter(event) {
    setFilter(event.target.value);
  }

  const filteredTasks = tasks.filter((task) =>
    task.text.toLowerCase().includes(filter.toLowerCase())
  );
  const uncompletedTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Filter Tasks..."
          value={filter}
          onChange={applyFilter}
        />
        <input
          type="text"
          placeholder="Enter a Task..."
          value={newTask}
          onChange={handleInputChange}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>
      <div>
        <button
          className="uncompleted-button"
          onClick={() => setShowCompleted(false)}
        >
          Uncompleted
        </button>
        <button
          className="completed-button"
          onClick={() => setShowCompleted(true)}
        >
          Completed
        </button>
      </div>
      <ol>
        {showCompleted
          ? completedTasks.map((task) => (
              <li key={task.id} className="completed">
                <input
                  type="checkbox"
                  checked
                  onChange={() => handleCheckboxChange(task.id)}
                />
                <span className="text">{task.text}</span>
              </li>
            ))
          : uncompletedTasks.map((task, index) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleCheckboxChange(task.id)}
                />
                <span className="text">{task.text}</span>
                <div>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    🗑️
                  </button>
                  <button
                    className="move-button"
                    onClick={() => moveTaskUp(index)}
                  >
                    ⬆
                  </button>
                  <button
                    className="move-button"
                    onClick={() => moveTaskDown(index)}
                  >
                    ⬇
                  </button>
                </div>
              </li>
            ))}
      </ol>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe(); // Cleanup the listener on unmount
    };
  }, []);

  return (
    <div>
      <Header user={user} />
      <ToDoList />
    </div>
  );
}

