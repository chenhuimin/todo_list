import React from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddNew: () => void;
}

export default function Header({
  selectedDate,
  onDateChange,
  searchQuery,
  onSearchChange,
  onAddNew,
}: HeaderProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = ['th', 'st', 'nd', 'rd'][
      day % 10 > 3 ? 0 : ((day % 100) - (day % 10) !== 10 ? day % 10 : 0)
    ];
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}${suffix} ${month}, ${year}`;
  };

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Title and Date */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
          <div className="mt-2">
            <select
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="text-sm font-medium text-gray-700 bg-transparent border-none cursor-pointer hover:text-gray-900 focus:outline-none"
            >
              <option value={new Date().toISOString().split('T')[0]}>
                {formatDate(new Date().toISOString())}
              </option>
              <option value={new Date(Date.now() - 86400000).toISOString().split('T')[0]}>
                Yesterday
              </option>
              <option value={new Date(Date.now() + 86400000).toISOString().split('T')[0]}>
                Tomorrow
              </option>
            </select>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search List"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          {/* Notification Icon */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>

          {/* User Avatar */}
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-900">😊</span>
          </div>

          {/* Add Button */}
          <Button onClick={onAddNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New List
          </Button>
        </div>
      </div>
    </div>
  );
}
