import React, { useState } from 'react';

function Header() {
    return (
        <div className="header">
            <p>Name: Vania Agnes Djunaedy ⋆˚🐾˖°</p>
            <p>NIM: 2602158531 ⋆˙⟡♡ </p>
            <p>Class: L4BC     ⋆૮₍´˶• . • ⑅ ₎ა </p>
        </div>
    );
}

function ToDoList() {
    const [tasks, setTasks] = useState([
        { id: 1, text: "WADS Assignment", completed: false },
        { id: 2, text: "Study for Mid Exam", completed: false }
      ]);
    const [newTask, setNewTask] = useState("");
    const [filter, setFilter] = useState("");
    const [showCompleted, setShowCompleted] = useState(false);

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== "") {
            setTasks(prevTasks => [...prevTasks, { id: Date.now(), text: newTask, completed: false }]);
            setNewTask("");
        }
    }

    function handleCheckboxChange(id) {
        setTasks(prevTasks => {
            return prevTasks.map(task => {
                if (task.id === id) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });
        });
    }

    function deleteTask(id) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    }

    function moveTaskUp(index) {
        if (index > 0) {
            setTasks(prevTasks => {
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
            setTasks(prevTasks => {
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

    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(filter.toLowerCase()));
    const uncompletedTasks = filteredTasks.filter(task => !task.completed);
    const completedTasks = filteredTasks.filter(task => task.completed);

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
                <button className='add-button' onClick={addTask}>
                    Add
                </button>
            </div>
            <div>
                <button className="uncompleted-button" onClick={() => setShowCompleted(false)}>Uncompleted</button>
                <button className="completed-button" onClick={() => setShowCompleted(true)}>Completed</button>
            </div>
            <ol>
                {showCompleted ? completedTasks.map(task => (
                    <li key={task.id} className="completed">
                        <input
                            type="checkbox"
                            checked
                            onChange={() => handleCheckboxChange(task.id)}
                        />
                        <span className="text">{task.text}</span>
                    </li>
                )) : uncompletedTasks.map((task, index) => (
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
                                ⬆️
                            </button>
                            <button
                                className="move-button"
                                onClick={() => moveTaskDown(index)}
                            >
                                ⬇️
                            </button>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default function App() {
    return (
        <div>
            <Header />
            <ToDoList />
        </div>
    );
}

