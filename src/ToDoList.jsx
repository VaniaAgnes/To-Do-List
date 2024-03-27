import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firestore, auth } from "./firebase"; // Import Firebase authentication
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import ProfileIcon from "./assets/kuromi.jpg";
import toast from "react-hot-toast";

function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <div className="user-details">
        <span className="email">{user?.email}</span>
      </div>
      {!user?.photoURL ? (
        <img src={ProfileIcon} className="profile-img" />
      ) : (
        <img src={user?.photoURL} className="profile-img" />
      )}
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

  async function addTodo({ text }) {
    const docRef = await addDoc(collection(firestore, "todos"), {
      text,
      completed: false,
    });

    console.log(docRef.id);
  }

  async function deleteTodo(id) {
    const docRef = doc(firestore, "todos", id);

    await deleteDoc(docRef);
  }

  async function updateTodo({ id, text, completed }) {
    const docRef = doc(firestore, "todos", id);

    await updateDoc(docRef, {
      text,
      completed,
    });
  }

  async function editTask(id, newText) {
    const taskRef = doc(firestore, "todos", id);
    await updateDoc(taskRef, { text: newText });
    fetchTodos(); // Refresh the task list after editing a task
  }

  // edit text of the task
  /*
  
  function editTask(task) {
    updateTodo(task)
  }
  
  */

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
    if (newTask.trim().length === 0) {
      toast.error("Please input the new task title");
      return;
    }
    addTodo({ text: newTask });
    setNewTask("");
    fetchTodos();
  }

  function handleTaskStatus(task) {
    updateTodo({
      ...task,
      completed: !task.completed,
    });
    fetchTodos();
  }

  function deleteTask(id) {
    deleteTodo(id);
    fetchTodos();
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
                  onChange={() => handleTaskStatus(task)}
                />
                <span className="text">{task.text}</span>
              </li>
            ))
          : uncompletedTasks.map((task, index) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleTaskStatus(task)}
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
                    className="edit-button"
                    onClick={() => {
                      const newText = prompt("Enter new task title:", task.text);
                      if (newText !== null) {
                        editTask(task.id, newText);
                      }
                    }}
                  >
                    ✏️
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
    
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribe(); 
    };
  }, []);

  return (
    <div>
      <Header user={user} />
      <ToDoList />
    </div>
  );
}
