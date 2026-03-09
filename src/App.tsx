import React, { useState, useEffect } from 'react';
import './index.css';

interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  
  const API_URL = 'http://localhost:8080/api/todos';

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setTodos(data);
        }
      } catch (error) {
        console.error('Lỗi khi tải danh sách công việc:', error);
      }
    };
    fetchTodos();
  }, []); 

  const handleAddTodo = async () => {
    if (!title.trim()) return;

    const newTodo = {
      title,
      description,
      completed: false,
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const createdTodo = await response.json();
        setTodos([...todos, createdTodo]);
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      console.error('Lỗi khi thêm công việc:', error);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    try {
      const response = await fetch(`${API_URL}/${todo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTodo),
      });

      if (response.ok) {
        setTodos(todos.map((t) => (t.id === todo.id ? updatedTodo : t)));
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setTodos(todos.filter((t) => t.id !== id));
      }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="todo-wrapper">
        
        <header className="todo-header">
          <h1>Todo List</h1>
        </header>

        <div className="todo-input-section">
          <input
            type="text"
            className="todo-input"
            placeholder="Tên công việc (bắt buộc)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <input
            type="text"
            className="todo-input"
            placeholder="Mô tả chi tiết..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button onClick={handleAddTodo} className="todo-btn">
            <span>+ Thêm</span>
          </button>
        </div>

        <ul className="todo-list">
          {todos.length === 0 ? (
            <p className="empty-message">Chưa có công việc nào!</p>
          ) : (
            todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(todo)}
                  className="todo-checkbox"
                />
                
                <div className="todo-content">
                  <h3 className={`todo-title ${todo.completed ? 'completed' : ''}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`todo-desc ${todo.completed ? 'completed' : ''}`}>
                      {todo.description}
                    </p>
                  )}
                </div>

                <div className="todo-actions">
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="delete-btn"
                    title="Xóa"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>

      </div>
    </div>
  );
};

export default TodoList;