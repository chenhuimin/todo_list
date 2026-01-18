import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Todo, TodoCreate, TeamMember } from '../types';

interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TodoCreate) => void;
  todo?: Todo;
  teamMembers: TeamMember[];
}

export default function TaskDialog({
  isOpen,
  onClose,
  onSubmit,
  todo,
  teamMembers,
}: TaskDialogProps) {
  const [formData, setFormData] = useState<TodoCreate>({
    title: '',
    description: '',
    color: 'blue',
    start_time: '10:30 AM',
    end_time: '12:00 PM',
    date: new Date().toISOString().split('T')[0],
    assigned_to_id: undefined,
    completed: false,
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        title: todo.title,
        description: todo.description || '',
        color: todo.color,
        start_time: todo.start_time || '10:30 AM',
        end_time: todo.end_time || '12:00 PM',
        date: todo.date || new Date().toISOString().split('T')[0],
        assigned_to_id: todo.assigned_to_id,
        completed: todo.completed,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        color: 'blue',
        start_time: '10:30 AM',
        end_time: '12:00 PM',
        date: new Date().toISOString().split('T')[0],
        assigned_to_id: undefined,
        completed: false,
      });
    }
  }, [todo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {todo ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <Input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <div className="flex gap-3">
              {['blue', 'purple', 'yellow', 'pink', 'green'].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-lg border-2 transition-all ${
                    formData.color === color
                      ? 'border-gray-900 scale-110'
                      : 'border-transparent'
                  } ${
                    color === 'blue' ? 'bg-blue-200' :
                    color === 'purple' ? 'bg-purple-200' :
                    color === 'yellow' ? 'bg-yellow-200' :
                    color === 'pink' ? 'bg-pink-200' :
                    'bg-green-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <Input
                type="text"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                placeholder="10:30 AM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <Input
                type="text"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                placeholder="12:00 PM"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <select
              value={formData.assigned_to_id || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  assigned_to_id: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Unassigned</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {todo ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
