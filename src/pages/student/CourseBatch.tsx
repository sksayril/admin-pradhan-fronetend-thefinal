import React from 'react';
import { BookOpen, Plus, Users, Calendar } from 'lucide-react';

const CourseBatch: React.FC = () => {
  const batches = [
    { id: 1, name: '2024-A', course: 'Computer Science', instructor: 'Dr. Smith', students: 25, startDate: '2024-01-15', endDate: '2024-05-15', status: 'Active' },
    { id: 2, name: '2024-B', course: 'Mathematics', instructor: 'Prof. Johnson', students: 20, startDate: '2024-02-01', endDate: '2024-06-01', status: 'Active' },
    { id: 3, name: '2024-C', course: 'Physics', instructor: 'Dr. Wilson', students: 18, startDate: '2024-03-01', endDate: '2024-07-01', status: 'Upcoming' },
    { id: 4, name: '2023-D', course: 'Chemistry', instructor: 'Prof. Brown', students: 22, startDate: '2023-09-01', endDate: '2024-01-01', status: 'Completed' },
    { id: 5, name: '2024-E', course: 'Biology', instructor: 'Dr. Davis', students: 30, startDate: '2024-04-01', endDate: '2024-08-01', status: 'Upcoming' }
  ];

  const totalStudents = batches.reduce((sum, batch) => sum + batch.students, 0);
  const activeBatches = batches.filter(b => b.status === 'Active').length;
  const upcomingBatches = batches.filter(b => b.status === 'Upcoming').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Course Batches</h1>
        </div>
        <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
          <Plus className="w-5 h-5" />
          <span>New Batch</span>
        </button>
      </div>

      {/* Batch Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Batches</p>
              <p className="text-2xl font-bold text-gray-800">{batches.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Batches</p>
              <p className="text-2xl font-bold text-gray-800">{activeBatches}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{totalStudents}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-gray-800">{upcomingBatches}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Batch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{batch.name}</h3>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                  batch.status === 'Active' ? 'bg-green-100 text-green-800' :
                  batch.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {batch.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 mr-2" />
                  {batch.course}
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  {batch.students} Students
                </div>
                
                <div className="text-sm text-gray-600">
                  <strong>Instructor:</strong> {batch.instructor}
                </div>
                
                <div className="text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                  View Details
                </button>
                <button className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                  Manage
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all">
            <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Create Batch</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
            <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Assign Students</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <span className="text-sm text-gray-600">Schedule Classes</span>
          </button>
          <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all">
            <span className="text-2xl text-gray-400 mx-auto mb-2 block">📊</span>
            <span className="text-sm text-gray-600">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseBatch;