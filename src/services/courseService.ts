import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './config';
import { 
  Course, 
  CreateCourseRequest, 
  UpdateCourseRequest, 
  CourseFilters, 
  CourseResponse, 
  CourseWithBatchesResponse, 
  CourseStatisticsResponse,
  CoursePagination,
  ApiResponse
} from './types';

class CourseService {
  // Get all courses with pagination and filtering
  async getAllCourses(
    page: number = 1,
    limit: number = 10,
    filters?: CourseFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<ApiResponse<{
    courses: Course[];
    pagination: CoursePagination;
    filters?: {
      applied: string;
      sortBy: string;
      sortOrder: string;
    };
  }>> {
    try {
      const params: Record<string, any> = {
        page,
        limit,
        sortBy: sortBy || 'createdAt',
        sortOrder
      };

      // Add filters to params
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params[key] = value;
          }
        });
      }

      const response = await apiClient.get<{
        courses: Course[];
        pagination: CoursePagination;
        filters?: {
          applied: string;
          sortBy: string;
          sortOrder: string;
        };
      }>(
        API_ENDPOINTS.COURSES.LIST,
        { params }
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch courses');
    } catch (error) {
      console.error('Get courses error:', error);
      throw error;
    }
  }

  // Get course by ID
  async getCourseById(id: string): Promise<ApiResponse<CourseResponse>> {
    try {
      const response = await apiClient.get<CourseResponse>(
        API_ENDPOINTS.COURSES.BY_ID(id)
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch course');
    } catch (error) {
      console.error('Get course by ID error:', error);
      throw error;
    }
  }

  // Get course with batches
  async getCourseWithBatches(id: string): Promise<ApiResponse<CourseWithBatchesResponse>> {
    try {
      const response = await apiClient.get<CourseWithBatchesResponse>(
        API_ENDPOINTS.COURSES.BY_ID(id)
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to fetch course with batches');
    } catch (error) {
      console.error('Get course with batches error:', error);
      throw error;
    }
  }

  // Create new course
  async createCourse(courseData: CreateCourseRequest): Promise<ApiResponse<CourseResponse>> {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add basic fields
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('type', courseData.type);
      formData.append('category', courseData.category);
      formData.append('status', courseData.status);
      formData.append('price', courseData.price.toString());
      formData.append('duration', courseData.duration.toString());
      formData.append('maxStudents', courseData.maxStudents.toString());
      
      // Add instructor information
      formData.append('instructor[name]', courseData.instructor.name);
      formData.append('instructor[email]', courseData.instructor.email);
      if (courseData.instructor.phone) {
        formData.append('instructor[phone]', courseData.instructor.phone);
      }
      if (courseData.instructor.bio) {
        formData.append('instructor[bio]', courseData.instructor.bio);
      }
      if (courseData.instructor.qualifications) {
        formData.append('instructor[qualifications]', courseData.instructor.qualifications);
      }
      
      // Add optional fields
      if (courseData.currency) {
        formData.append('currency', courseData.currency);
      }
      if (courseData.durationUnit) {
        formData.append('durationUnit', courseData.durationUnit);
      }
      
      // Add files
      if (courseData.thumbnail) {
        formData.append('thumbnail', courseData.thumbnail);
      }
      if (courseData.syllabus) {
        formData.append('syllabus', courseData.syllabus);
      }
      
      // Add type-specific fields
      if (courseData.type === 'online') {
        if (courseData.videoUrl) {
          formData.append('videoUrl', courseData.videoUrl);
        }
      } else if (courseData.type === 'offline') {
        if (courseData.venue) {
          formData.append('venue', courseData.venue);
        }
      }
      
      // Add address information (for offline and hybrid courses)
      if (courseData.address && (courseData.type === 'offline' || courseData.type === 'hybrid')) {
        if (courseData.address.street) {
          formData.append('address[street]', courseData.address.street);
        }
        if (courseData.address.city) {
          formData.append('address[city]', courseData.address.city);
        }
        if (courseData.address.state) {
          formData.append('address[state]', courseData.address.state);
        }
        if (courseData.address.zipCode) {
          formData.append('address[zipCode]', courseData.address.zipCode);
        }
        if (courseData.address.country) {
          formData.append('address[country]', courseData.address.country);
        }
      }
      
      // Add optional text fields
      if (courseData.tags) {
        formData.append('tags', courseData.tags);
      }
      if (courseData.prerequisites) {
        formData.append('prerequisites', courseData.prerequisites);
      }
      if (courseData.learningObjectives) {
        formData.append('learningObjectives', courseData.learningObjectives);
      }
      if (courseData.courseContent) {
        formData.append('courseContent', courseData.courseContent);
      }

      // Debug: Log FormData contents
      console.log('FormData being sent:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await apiClient.post<CourseResponse>(
        API_ENDPOINTS.COURSES.CREATE,
        formData
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to create course');
    } catch (error) {
      console.error('Create course error:', error);
      throw error;
    }
  }

  // Update course
  async updateCourse(id: string, courseData: UpdateCourseRequest): Promise<ApiResponse<CourseResponse>> {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // Add fields that are provided
      if (courseData.title) formData.append('title', courseData.title);
      if (courseData.description) formData.append('description', courseData.description);
      if (courseData.type) formData.append('type', courseData.type);
      if (courseData.category) formData.append('category', courseData.category);
      if (courseData.price !== undefined) formData.append('price', courseData.price.toString());
      if (courseData.duration !== undefined) formData.append('duration', courseData.duration.toString());
      if (courseData.status) formData.append('status', courseData.status);
      if (courseData.isActive !== undefined) formData.append('isActive', courseData.isActive.toString());
      
      // Add instructor information if provided
      if (courseData.instructor) {
        if (courseData.instructor.name) formData.append('instructor.name', courseData.instructor.name);
        if (courseData.instructor.email) formData.append('instructor.email', courseData.instructor.email);
        if (courseData.instructor.phone) formData.append('instructor.phone', courseData.instructor.phone);
        if (courseData.instructor.bio) formData.append('instructor.bio', courseData.instructor.bio);
      }
      
      // Add optional fields
      if (courseData.currency) formData.append('currency', courseData.currency);
      if (courseData.durationUnit) formData.append('durationUnit', courseData.durationUnit);
      
      // Add files if provided
      if (courseData.thumbnail) formData.append('thumbnail', courseData.thumbnail);
      if (courseData.coursePdf) formData.append('coursePdf', courseData.coursePdf);
      
      // Add type-specific fields
      if (courseData.type === 'online') {
        if (courseData.videoUrl) formData.append('videoUrl', courseData.videoUrl);
      } else if (courseData.type === 'offline') {
        if (courseData.venue) formData.append('venue', courseData.venue);
        if (courseData.maxStudents !== undefined) formData.append('maxStudents', courseData.maxStudents.toString());
        if (courseData.address) {
          if (courseData.address.street) formData.append('address.street', courseData.address.street);
          if (courseData.address.city) formData.append('address.city', courseData.address.city);
          if (courseData.address.state) formData.append('address.state', courseData.address.state);
          if (courseData.address.zipCode) formData.append('address.zipCode', courseData.address.zipCode);
        }
      }
      
      // Add optional text fields
      if (courseData.tags) formData.append('tags', courseData.tags);
      if (courseData.prerequisites) formData.append('prerequisites', courseData.prerequisites);
      if (courseData.learningObjectives) formData.append('learningObjectives', courseData.learningObjectives);

      const response = await apiClient.put<CourseResponse>(
        API_ENDPOINTS.COURSES.UPDATE(id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.success && response.data) {
        return response;
      }

      throw new Error(response.message || 'Failed to update course');
    } catch (error) {
      console.error('Update course error:', error);
      throw error;
    }
  }

  // Delete course
  async deleteCourse(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete<{ success: boolean; message: string }>(
        API_ENDPOINTS.COURSES.DELETE(id)
      );

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Failed to delete course');
    } catch (error) {
      console.error('Delete course error:', error);
      throw error;
    }
  }

  // Get course statistics
  async getCourseStatistics(): Promise<CourseStatisticsResponse> {
    try {
      const response = await apiClient.get<CourseStatisticsResponse>(
        API_ENDPOINTS.COURSES.STATISTICS
      );

      if (response.success && response.data) {
        return response.data;
      }

      // Handle case where statistics might be directly in the response
      if (response.data && typeof response.data === 'object') {
        return {
          success: true,
          message: 'Course statistics retrieved successfully',
          data: response.data as any
        };
      }

      throw new Error(response.message || 'Failed to fetch course statistics');
    } catch (error) {
      console.error('Get course statistics error:', error);
      throw error;
    }
  }

  // Get courses with filters (convenience method)
  async getCoursesWithFilters(
    page: number = 1,
    limit: number = 10,
    filters?: CourseFilters,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<{ courses: Course[]; pagination: CoursePagination }> {
    try {
      const response = await this.getAllCourses(page, limit, filters, sortBy, sortOrder);
      
      console.log('getCoursesWithFilters - Full response:', response);
      console.log('getCoursesWithFilters - response.data:', response.data);
      console.log('getCoursesWithFilters - response.data.courses:', response.data?.courses);
      
      // Handle different response structures
      if (response.success && response.data && response.data.courses) {
        console.log('getCoursesWithFilters - Found courses in response.data.courses:', response.data.courses);
        return {
          courses: response.data.courses,
          pagination: response.data.pagination
        };
      } else if (response.data && Array.isArray(response.data)) {
        console.log('getCoursesWithFilters - Found courses as direct array:', response.data);
        // If the response is directly an array
        return {
          courses: response.data,
          pagination: {
            currentPage: page,
            totalPages: 1,
            totalCourses: response.data.length,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      } else {
        // Fallback for unexpected structure
        console.warn('Unexpected API response structure:', response);
        console.warn('Response keys:', Object.keys(response));
        if (response.data) {
          console.warn('Response.data keys:', Object.keys(response.data));
        }
        return {
          courses: [],
          pagination: {
            currentPage: page,
            totalPages: 1,
            totalCourses: 0,
            hasNextPage: false,
            hasPrevPage: false
          }
        };
      }
    } catch (error) {
      console.error('Get courses with filters error:', error);
      throw error;
    }
  }
}

export const courseService = new CourseService();
