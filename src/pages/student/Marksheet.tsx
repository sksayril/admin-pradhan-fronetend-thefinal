import React from 'react';
import { FileText, Plus, Download, Eye, Printer } from 'lucide-react';

const Marksheet: React.FC = () => {
  const marksheets = [
    { id: 1, student: 'Alice Johnson', course: 'Computer Science', batch: '2024-A', semester: 'Semester 1', examDate: '2024-01-20', totalMarks: 500, obtainedMarks: 485, percentage: 97, grade: 'A+', status: 'Generated' },
    { id: 2, student: 'Bob Smith', course: 'Mathematics', batch: '2024-B', semester: 'Semester 2', examDate: '2024-01-18', totalMarks: 500, obtainedMarks: 425, percentage: 85, grade: 'A', status: 'Generated' },
    { id: 3, student: 'Carol Davis', course: 'Physics', batch: '2024-A', semester: 'Semester 1', examDate: '2024-01-15', totalMarks: 500, obtainedMarks: 465, percentage: 93, grade: 'A+', status: 'Generated' },
    { id: 4, student: 'David Wilson', course: 'Chemistry', batch: '2024-C', semester: 'Mid-term', examDate: '2024-01-12', totalMarks: 250, obtainedMarks: 210, percentage: 84, grade: 'A', status: 'Pending' },
    { id: 5, student: 'Eva Brown', course: 'Biology', batch: '2024-B', semester: 'Final', examDate: '2024-01-10', totalMarks: 600, obtainedMarks: 570, percentage: 95, grade: 'A+', status: 'Generated' }
  ];

  const totalGenerated = marksheets.filter(m => m.status === 'Generated').length;
  const averagePercentage = marksheets.reduce((sum, m) => sum + m.percentage, 0) / marksheets.length;
  const excellentGrades = marksheets.filter(m => m.grade === 'A+').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Marksheets</h1>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Generate Marksheet</span>
          </button>
        </div>
      </div>

      {/* Marksheet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Marksheets</p>
              <p className="text-2xl font-bold text-gray-800">{marksheets.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Generated</p>
              <p className="text-2xl font-bold text-gray-800">{totalGenerated}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-800">{averagePercentage.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold text-lg">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">A+ Grades</p>
              <p className="text-2xl font-bold text-gray-800">{excellentGrades}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 font-bold text-lg">🌟</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {['A+', 'A', 'B+', 'B', 'C'].map((grade) => {
            const count = marksheets.filter(m => m.grade === grade).length;
            const percentage = (count / marksheets.length) * 100;
            return (
              <div key={grade} className="text-center">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-2 relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-sky-500 transition-all duration-500"
                    style={{ height: `${percentage}%` }}
                  ></div>
                  <span className="text-lg font-bold text-gray-800 relative z-10">{grade}</span>
                </div>
                <p className="text-sm text-gray-600">{count} students</p>
                <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Marksheets Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Marksheets</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marksheet ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course & Semester</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marks</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {marksheets.map((marksheet) => (
                <tr key={marksheet.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #M{marksheet.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-semibold">
                          {marksheet.student.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{marksheet.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{marksheet.course}</div>
                    <div className="text-sm text-gray-500">{marksheet.semester} - {marksheet.batch}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="font-semibold">{marksheet.obtainedMarks}/{marksheet.totalMarks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-semibold ${
                      marksheet.percentage >= 90 ? 'text-green-600' :
                      marksheet.percentage >= 80 ? 'text-blue-600' :
                      marksheet.percentage >= 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {marksheet.percentage}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      marksheet.grade === 'A+' ? 'bg-green-100 text-green-800' :
                      marksheet.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                      marksheet.grade === 'B+' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {marksheet.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(marksheet.examDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      marksheet.status === 'Generated' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {marksheet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-sky-600 hover:text-sky-900" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-purple-600 hover:text-purple-900" title="Print">
                      <Printer className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Marksheet;