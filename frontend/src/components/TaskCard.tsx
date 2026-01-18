import React from 'react';
import { MoreVertical } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Todo } from '../types';

interface TaskCardProps {
  todo: Todo;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

const colorClasses = {
  blue: 'bg-blue-100 border-blue-200',
  purple: 'bg-purple-100 border-purple-200',
  yellow: 'bg-yellow-100 border-yellow-200',
  pink: 'bg-pink-100 border-pink-200',
  green: 'bg-green-100 border-green-200',
};

export default function TaskCard({ todo, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      className={`${colorClasses[todo.color]} border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
          />
          <h3 className="font-semibold text-gray-900">{todo.title}</h3>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-white/50 rounded transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => {
                  onEdit(todo);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(todo.id);
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {todo.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{todo.description}</p>
      )}

      {/* Time */}
      {todo.start_time && todo.end_time && (
        <div className="text-sm font-medium text-gray-700">
          {todo.start_time} - {todo.end_time}
        </div>
      )}

      {/* Assigned Member */}
      {todo.assigned_to && (
        <div className="mt-3 text-xs text-gray-500">
          Assigned to: {todo.assigned_to.name}
        </div>
      )}
    </div>
  );
}
