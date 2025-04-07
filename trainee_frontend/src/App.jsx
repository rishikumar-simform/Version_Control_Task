import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_SERVER;


function App() {
    const [todos, setTodos] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        const response = await axios.get(API_URL);
        setTodos(response.data);
    };

    const addTodo = async () => {
        if (!newTask.trim()) return;
        const response = await axios.post(API_URL, { task: newTask });
        setTodos([...todos, response.data]);
        setNewTask("");
    };

    const toggleCompletion = async (id) => {
        await axios.put(`${API_URL}/${id}`);
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const deleteTodo = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>To-Do List</h1>
            <input 
                type="text" 
                value={newTask} 
                onChange={(e) => setNewTask(e.target.value)} 
                placeholder="Add a task..." 
            />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
                        {todo.task}
                        <button onClick={() => toggleCompletion(todo.id)}>✔</button>
                        <button onClick={() => deleteTodo(todo.id)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;

