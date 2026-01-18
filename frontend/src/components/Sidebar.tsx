import React, { useState } from 'react';
import { LayoutDashboard, Users, ListTodo, ChevronDown, ChevronRight } from 'lucide-react';
import { TeamMember } from '../types';

interface SidebarProps {
  currentView: 'overview' | 'team-mates' | 'todo-list';
  onViewChange: (view: 'overview' | 'team-mates' | 'todo-list') => void;
  teamMembers: TeamMember[];
  selectedMemberId?: number;
  onMemberSelect: (memberId: number) => void;
}

export default function Sidebar({
  currentView,
  onViewChange,
  teamMembers,
  selectedMemberId,
  onMemberSelect,
}: SidebarProps) {
  const [isTeamExpanded, setIsTeamExpanded] = useState(true);
  const [isTodoExpanded, setIsTodoExpanded] = useState(true);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'team-mates', label: 'Team Mates', icon: Users, expandable: true },
    { id: 'todo-list', label: 'Todo List', icon: ListTodo, expandable: true },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">HealDocs</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {/* Overview */}
        <button
          onClick={() => onViewChange('overview')}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            currentView === 'overview'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </button>

        {/* Team Mates */}
        <div>
          <button
            onClick={() => {
              setIsTeamExpanded(!isTeamExpanded);
              if (!isTeamExpanded) onViewChange('team-mates');
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'team-mates'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <span>Team Mates</span>
            </div>
            {isTeamExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Team Members List */}
          {isTeamExpanded && (
            <div className="mt-1 ml-4 space-y-1">
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  onClick={() => onMemberSelect(member.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedMemberId === member.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {member.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Todo List */}
        <div>
          <button
            onClick={() => {
              setIsTodoExpanded(!isTodoExpanded);
              if (!isTodoExpanded) onViewChange('todo-list');
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'todo-list'
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <ListTodo className="w-5 h-5" />
              <span>Todo List</span>
            </div>
            {isTodoExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {/* Todo Categories (stub for now) */}
          {isTodoExpanded && (
            <div className="mt-1 ml-4 space-y-1">
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Team Meeting
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Work on Branding
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Make a Report for client
              </button>
              <button className="w-full text-left px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Create a planer
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
