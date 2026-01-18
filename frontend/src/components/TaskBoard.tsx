import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Todo } from '../types';

interface TaskBoardProps {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export default function TaskBoard({ todos, onToggle, onEdit, onDelete }: TaskBoardProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const filteredTodos = todos.filter((todo) =>
    activeTab === 'active' ? !todo.completed : todo.completed
  );

  return (
    <div className="p-8">
      {/* Tab Navigation */}
      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('active')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'active'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Task
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'completed'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Task Grid */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTodos.map((todo) => (
            <TaskCard
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
