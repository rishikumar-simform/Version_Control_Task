from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# MySQL Database Configuration using environment variables
db = mysql.connector.connect(
    host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)
cursor = db.cursor(dictionary=True)

# API Endpoints

@app.route('/api/todos', methods=['GET'])
def get_todos():
    cursor.execute("SELECT * FROM todos")
    todos = cursor.fetchall()
    return jsonify(todos)

@app.route('/api/todos', methods=['POST'])
def add_todo():
    data = request.json
    task = data.get("task")

    if not task:
        return jsonify({"error": "Task is required"}), 400

    cursor.execute("INSERT INTO todos (task) VALUES (%s)", (task,))
    db.commit()

    new_todo_id = cursor.lastrowid
    cursor.execute("SELECT * FROM todos WHERE id = %s", (new_todo_id,))
    new_todo = cursor.fetchone()

    return jsonify(new_todo), 201

@app.route('/api/todos/<int:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    cursor.execute("UPDATE todos SET done = NOT done WHERE id = %s", (todo_id,))
    db.commit()

    cursor.execute("SELECT * FROM todos WHERE id = %s", (todo_id,))
    updated_todo = cursor.fetchone()

    if updated_todo:
        return jsonify(updated_todo)
    return jsonify({"error": "Todo not found"}), 404

@app.route('/api/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    cursor.execute("DELETE FROM todos WHERE id = %s", (todo_id,))
    db.commit()

    return jsonify({"message": "Deleted"}), 200

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5003))  # Default to 5000 if PORT is not set
    app.run(debug=True, host="0.0.0.0", port=port)
