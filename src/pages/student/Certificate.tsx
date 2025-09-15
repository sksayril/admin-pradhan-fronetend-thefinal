import React from 'react';
import { Award, Plus, Download, Eye, Send } from 'lucide-react';

const Certificate: React.FC = () => {
  const certificates = [
    { id: 1, student: 'Alice Johnson', course: 'Computer Science', batch: '2024-A', issueDate: '2024-01-20', type: 'Course Completion', status: 'Issued', grade: 'A+' },
    { id: 2, student: 'Bob Smith', course: 'Mathematics', batch: '2024-B', issueDate: '2024-01-18', type: 'Excellence Award', status: 'Pending', grade: 'A' },
    { id: 3, student: 'Eva Brown', course: 'Biology', batch: '2023-D', issueDate: '2024-01-15', type: 'Course Completion', status: 'Issued', grade: 'A+' },
    { id: 4, student: 'Carol Davis', course: 'Physics', batch: '2024-A', issueDate: '2024-01-12', type: 'Participation', status: 'Draft', grade: 'B+' },
    { id: 5, student: 'David Wilson', course: 'Chemistry', batch: '2024-C', issueDate: '2024-01-10', type: 'Course Completion', status: 'Issued', grade: 'A-' }
  ];

  const totalIssued = certificates.filter(c => c.status === 'Issued').length;
  const pendingCertificates = certificates.filter(c => c.status === 'Pending').length;
  const draftCertificates = certificates.filter(c => c.status === 'Draft').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Award className="w-8 h-8 text-sky-600" />
          <h1 className="text-3xl font-bold text-gray-800">Certificates</h1>
        </div>
        <div className="flex space-x-3">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors">
            <Plus className="w-5 h-5" />
            <span>Issue Certificate</span>
          </button>
        </div>
      </div>

      {/* Certificate Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Certificates</p>
              <p className="text-2xl font-bold text-gray-800">{certificates.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Issued</p>
              <p className="text-2xl font-bold text-gray-800">{totalIssued}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-lg">✓</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-800">{pendingCertificates}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold text-lg">⏳</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Draft</p>
              <p className="text-2xl font-bold text-gray-800">{draftCertificates}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-600 font-bold text-lg">📄</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Templates */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Certificate Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-dashed border-sky-300 rounded-lg p-6 text-center hover:border-sky-500 hover:bg-sky-50 transition-all cursor-pointer">
            <Award className="w-12 h-12 text-sky-500 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-800">Course Completion</h3>
            <p className="text-sm text-gray-600 mt-1">Standard completion certificate</p>
          </div>
          <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-500 hover:bg-purple-50 transition-all cursor-pointer">
            <span className="text-4xl mb-3 block">🏆</span>
            <h3 className="font-semibold text-gray-800">Excellence Award</h3>
            <p className="text-sm text-gray-600 mt-1">For outstanding performance</p>
          </div>
          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-500 hover:bg-green-50 transition-all cursor-pointer">
            <span className="text-4xl mb-3 block">🎓</span>
            <h3 className="font-semibold text-gray-800">Graduation</h3>
            <p className="text-sm text-gray-600 mt-1">Degree completion certificate</p>
          </div>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Certificates</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {certificates.map((certificate) => (
                <tr key={certificate.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #C{certificate.id.toString().padStart(4, '0')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-xs font-semibold">
                          {certificate.student.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-sm text-gray-900">{certificate.student}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{certificate.course}</div>
                    <div className="text-sm text-gray-500">Batch: {certificate.batch}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      certificate.type === 'Course Completion' ? 'bg-blue-100 text-blue-800' :
                      certificate.type === 'Excellence Award' ? 'bg-purple-100 text-purple-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {certificate.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      certificate.grade.startsWith('A') ? 'text-green-600' :
                      certificate.grade.startsWith('B') ? 'text-blue-600' :
                      'text-orange-600'
                    }`}>
                      {certificate.grade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(certificate.issueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      certificate.status === 'Issued' ? 'bg-green-100 text-green-800' :
                      certificate.status === 'Pending' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {certificate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-sky-600 hover:text-sky-900" title="View">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-green-600 hover:text-green-900" title="Download">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900" title="Send">
                      <Send className="w-4 h-4" />
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

export default Certificate;