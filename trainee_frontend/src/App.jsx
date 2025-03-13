import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/todos"; // Flask API URL

function App() {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");

    // Fetch todos from Flask API
    useEffect(() => {
        axios.get(API_URL)
            .then(response => setTodos(response.data))
            .catch(error => console.error("Error fetching todos:", error));
    }, []);

    // Add new todo
    const addTodo = () => {
        if (!task.trim()) return;
        axios.post(API_URL, { task })
            .then(response => {
                setTodos([...todos, response.data]);
                setTask(""); // Clear input
            })
            .catch(error => console.error("Error adding todo:", error));
    };

    // Toggle todo completion
    const toggleTodo = (id) => {
        axios.put(`${API_URL}/${id}`)
            .then(response => {
                setTodos(todos.map(todo => 
                    todo.id === id ? response.data : todo
                ));
            })
            .catch(error => console.error("Error updating todo:", error));
    };

    // Delete todo
    const deleteTodo = (id) => {
        axios.delete(`${API_URL}/${id}`)
            .then(() => {
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch(error => console.error("Error deleting todo:", error));
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Todo List</h2>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    placeholder="Add a new task..."
                    style={styles.input}
                />
                <button onClick={addTodo} style={styles.addButton}>Add</button>
            </div>
            <ul style={styles.list}>
                {todos.map(todo => (
                    <li key={todo.id} style={styles.listItem}>
                        <span
                            onClick={() => toggleTodo(todo.id)}
                            style={{
                                ...styles.taskText,
                                textDecoration: todo.done ? "line-through" : "none",
                                color: todo.done ? "#888" : "#333"
                            }}
                        >
                            {todo.task}
                        </span>
                        <button onClick={() => deleteTodo(todo.id)} style={styles.deleteButton}>
                            ❌
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Styling object
const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        background: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    title: {
        color: "#333",
        marginBottom: "15px"
    },
    inputContainer: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
    },
    input: {
        flex: 1,
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
    },
    addButton: {
        marginLeft: "10px",
        padding: "8px 12px",
        border: "none",
        background: "#28a745",
        color: "#fff",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    list: {
        listStyle: "none",
        padding: 0,
    },
    listItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        background: "#fff",
        borderRadius: "5px",
        marginBottom: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    taskText: {
        cursor: "pointer",
        fontSize: "16px",
        transition: "color 0.3s ease-in-out",
    },
    deleteButton: {
        background: "red",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
    },
};

export default App;

