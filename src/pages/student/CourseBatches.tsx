import React, { useState, useEffect } from 'react';
import { Plus, Filter, Eye, Edit, Trash2, RefreshCw, Users, BarChart3 } from 'lucide-react';
import { batchService, courseService, BatchFilters } from '../../services';
import { Batch, Course, CreateBatchRequest } from '../../services/types';
import CreateBatchModal from '../../components/CreateBatchModal';
import BatchDetailModal from '../../components/BatchDetailModal';
import BatchEnrollmentManagement from '../../components/BatchEnrollmentManagement';

const CourseBatches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BatchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBatches, setTotalBatches] = useState(0);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  
  // Tab management
  const [activeTab, setActiveTab] = useState<'batches' | 'enrollments'>('batches');
  const [selectedBatchForEnrollment, setSelectedBatchForEnrollment] = useState<Batch | null>(null);

  useEffect(() => {
    loadBatches();
    loadCourses();
  }, [currentPage, filters]);

  const loadCourses = async () => {
    try {
        const response = await courseService.getAllCourses(1, 100); // Fetch up to 100 courses
        if (response.success && response.data) {
            setCourses(response.data.courses);
        } else {
            console.error("Failed to load courses for dropdown");
        }
    } catch (err) {
        console.error("Error fetching courses:", err);
    }
  };

  const loadBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await batchService.getAllBatches(currentPage, 10, filters);
      if (response.success && response.data) {
        const batchData = response.data as any;
        setBatches(batchData.batches);
        setTotalPages(batchData.pagination?.totalPages || 1);
        setTotalBatches(batchData.pagination?.totalBatches || 0);
      } else {
        // Add mock batches for testing if no real batches are available
        const mockBatches: Batch[] = [
          {
            _id: 'mock-batch-1',
            name: 'Python Morning Batch',
            courseId: {
              _id: 'mock-course-1',
              title: 'Introduction to Python',
              category: 'Programming',
              type: 'online',
              price: 5000,
              currency: 'INR'
            } as any,
            startDate: '2024-01-01T00:00:00.000Z',
            endDate: '2024-03-01T00:00:00.000Z',
            maxStudents: 30,
            enrollmentCount: 15,
            status: 'ongoing',
            timeSlots: [],
            venue: 'Online',
            instructor: 'Dr. Smith',
            description: 'Learn Python programming from basics to advanced concepts',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          {
            _id: 'mock-batch-2',
            name: 'JavaScript Evening Batch',
            courseId: {
              _id: 'mock-course-2',
              title: 'Advanced JavaScript',
              category: 'Programming',
              type: 'online',
              price: 8000,
              currency: 'INR'
            } as any,
            startDate: '2024-02-01T00:00:00.000Z',
            endDate: '2024-04-01T00:00:00.000Z',
            maxStudents: 25,
            enrollmentCount: 8,
            status: 'scheduled',
            timeSlots: [],
            venue: 'Online',
            instructor: 'Dr. Johnson',
            description: 'Master advanced JavaScript concepts and frameworks',
            createdAt: '2024-02-01T00:00:00.000Z',
            updatedAt: '2024-02-01T00:00:00.000Z'
          }
        ];
        
        setBatches(mockBatches);
        setTotalPages(1);
        setTotalBatches(mockBatches.length);
        setError('Using mock data - API not available');
      }
    } catch (err) {
      console.error('Error loading batches:', err);
      // Add mock batches even on error for testing
      const mockBatches: Batch[] = [
        {
          _id: 'mock-batch-1',
          name: 'Python Morning Batch',
          courseId: {
            _id: 'mock-course-1',
            title: 'Introduction to Python',
            category: 'Programming',
            type: 'online',
            price: 5000,
            currency: 'INR'
          } as any,
          startDate: '2024-01-01T00:00:00.000Z',
          endDate: '2024-03-01T00:00:00.000Z',
          maxStudents: 30,
          enrollmentCount: 15,
          status: 'ongoing',
          timeSlots: [],
          venue: 'Online',
          instructor: 'Dr. Smith',
          description: 'Learn Python programming from basics to advanced concepts',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z'
        },
        {
          _id: 'mock-batch-2',
          name: 'JavaScript Evening Batch',
          courseId: {
            _id: 'mock-course-2',
            title: 'Advanced JavaScript',
            category: 'Programming',
            type: 'online',
            price: 8000,
            currency: 'INR'
          } as any,
          startDate: '2024-02-01T00:00:00.000Z',
          endDate: '2024-04-01T00:00:00.000Z',
          maxStudents: 25,
          enrollmentCount: 8,
          status: 'scheduled',
          timeSlots: [],
          venue: 'Online',
          instructor: 'Dr. Johnson',
          description: 'Master advanced JavaScript concepts and frameworks',
          createdAt: '2024-02-01T00:00:00.000Z',
          updatedAt: '2024-02-01T00:00:00.000Z'
        }
      ];
      
      setBatches(mockBatches);
      setTotalPages(1);
      setTotalBatches(mockBatches.length);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreateBatch = async (batchData: CreateBatchRequest) => {
    try {
      setIsCreating(true);
      const response = await batchService.createBatch(batchData);
      if (response.success) {
        setIsCreateModalOpen(false);
        loadBatches(); // Refresh batches list
      } else {
        throw new Error(response.message || 'Failed to create batch');
      }
    } catch (error) {
      console.error("Failed to create batch from page:", error);
      throw error; // Re-throw for modal to catch and display
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleViewBatch = (batch: Batch) => {
    setSelectedBatch(batch);
    setIsDetailModalOpen(true);
  };

  const handleManageEnrollments = (batch: Batch) => {
    setSelectedBatchForEnrollment(batch);
    setActiveTab('enrollments');
  };

  const handleBatchUpdated = (updatedBatch: Batch) => {
    setBatches(prev => prev.map(b => b._id === updatedBatch._id ? updatedBatch : b));
    loadBatches(); // to refresh data
  };

  const handleBatchDeleted = (batchId: string) => {
    setBatches(prev => prev.filter(b => b._id !== batchId));
    loadBatches(); // to refresh data
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    loadBatches();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Batches</h1>
          <p className="text-gray-600">Manage all course batches and enrollments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Create Batch
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('batches')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'batches'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Batch Management</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('enrollments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'enrollments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Enrollment Management</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'batches' ? (
            <div className="space-y-6">
      
      {/* Filters Card */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input type="text" name="search" placeholder="Search by name..." onChange={handleFilterChange} className="input" />
            {/* Add course filter dropdown here once courses are fetched */}
            <select name="status" onChange={handleFilterChange} className="input">
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <button onClick={handleApplyFilters} className="btn-primary flex items-center justify-center">
                <Filter className="w-4 h-4 mr-2" />
                Apply
            </button>
         </div>
      </div>

      {loading ? (
        <div className="text-center py-10">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-gray-500" />
            <p className="mt-2 text-gray-600">Loading batches...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 text-red-700 rounded-lg">
            <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Batch Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrollment ({totalBatches})</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {batches.map(batch => (
                <tr key={batch._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{batch.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{(batch.courseId as any)?.title || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${batchService.getBatchStatusColor(batch.status)}`}>
                        {batch.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(batch.startDate).toLocaleDateString()} - {new Date(batch.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{batch.enrollmentCount} / {batch.maxStudents}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                     <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => handleViewBatch(batch)} className="text-blue-600 hover:text-blue-900" title="View Details"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => handleManageEnrollments(batch)} className="text-green-600 hover:text-green-900" title="Manage Enrollments"><Users className="w-4 h-4" /></button>
                        <button onClick={() => handleViewBatch(batch)} className="text-indigo-600 hover:text-indigo-900" title="Edit"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleViewBatch(batch)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateBatchModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBatch}
        courses={courses}
        loading={isCreating}
      />
       
       <BatchDetailModal 
         isOpen={isDetailModalOpen}
         onClose={() => setIsDetailModalOpen(false)}
         batch={selectedBatch}
         onBatchUpdated={handleBatchUpdated}
         onBatchDeleted={handleBatchDeleted}
       />
       
       {/* Pagination */}
         {totalPages > 1 && (
           <div className="px-6 py-4 border-t border-gray-200">
             <div className="flex items-center justify-between">
               <div className="text-sm text-gray-700">
                 Page {currentPage} of {totalPages}
               </div>
               <div className="flex items-center space-x-2">
                 <button
                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                   disabled={currentPage === 1}
                   className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                 >
                   Previous
                 </button>
                 <button
                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                   disabled={currentPage === totalPages}
                   className="px-3 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                 >
                   Next
                 </button>
               </div>
             </div>
           </div>
         )}
            </div>
          ) : (
            <div className="space-y-6">
              {selectedBatchForEnrollment ? (
                <BatchEnrollmentManagement
                  batchId={selectedBatchForEnrollment._id}
                  batchName={selectedBatchForEnrollment.name}
                  courseName={(selectedBatchForEnrollment.courseId as any)?.title || 'Unknown Course'}
                  onBackToSelection={() => setSelectedBatchForEnrollment(null)}
                />
              ) : (
                <div className="space-y-6">
                  {/* Batch Selector */}
                  <div className="bg-white p-6 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select a Batch to Manage Enrollments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {batches.map((batch) => (
                        <div
                          key={batch._id}
                          className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => setSelectedBatchForEnrollment(batch)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{batch.name}</h4>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${batchService.getBatchStatusColor(batch.status)}`}>
                              {batch.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {(batch.courseId as any)?.title || 'Unknown Course'}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Enrollment: {batch.enrollmentCount}/{batch.maxStudents}</span>
                            <span>{new Date(batch.startDate).toLocaleDateString()}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBatchForEnrollment(batch);
                            }}
                            className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors"
                          >
                            Manage Enrollments
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    {batches.length === 0 && (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No batches available</p>
                        <p className="text-sm text-gray-400">Create a batch first to manage enrollments</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CreateBatchModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateBatch}
        courses={courses}
        loading={isCreating}
      />
       
       <BatchDetailModal 
         isOpen={isDetailModalOpen}
         onClose={() => setIsDetailModalOpen(false)}
         batch={selectedBatch}
         onBatchUpdated={handleBatchUpdated}
         onBatchDeleted={handleBatchDeleted}
       />
    </div>
  );
};

export default CourseBatches;
