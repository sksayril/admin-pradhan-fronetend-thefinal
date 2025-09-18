import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Banknote, 
  AlertTriangle,
  GraduationCap,
  BookOpen,
  Award,
  FileText,
  ChevronDown,
  ChevronRight,
  X,
  LogOut,
  Shield,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Image
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['society', 'student', 'kyc', 'reports', 'enrollment', 'admin']);

  // Auto-collapse on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      onToggle();
    }
  }, [location.pathname]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      description: 'Overview and analytics'
    },
    {
      id: 'society',
      title: 'Society Management',
      icon: Users,
      description: 'Manage society members and finances',
      children: [
        { 
          title: 'Society Members', 
          path: '/society/members', 
          icon: Users,
          description: 'View and manage members'
        },
        { 
          title: 'Payments', 
          path: '/society/payments', 
          icon: CreditCard,
          description: 'Track payments and contributions'
        },
        { 
          title: 'Loans', 
          path: '/society/loans', 
          icon: Banknote,
          description: 'Manage loan applications'
        },
        { 
          title: 'Penalties', 
          path: '/society/penalty', 
          icon: AlertTriangle,
          description: 'Handle penalty management'
        },
        { 
          title: 'Investment Plans', 
          path: '/society/investment-plans', 
          icon: DollarSign,
          description: 'Create and manage investment plans'
        },
        { 
          title: 'Pending Applications', 
          path: '/society/pending-investment-applications', 
          icon: AlertTriangle,
          description: 'Review pending investment applications'
        },
        { 
          title: 'Approved Applications', 
          path: '/society/approved-investment-applications', 
          icon: CheckCircle,
          description: 'View approved investment applications'
        },
        { 
          title: 'Rejected Applications', 
          path: '/society/rejected-investment-applications', 
          icon: XCircle,
          description: 'View rejected investment applications'
        },
        { 
          title: 'Payment Management', 
          path: '/society/payment-management', 
          icon: CreditCard,
          description: 'Manage payments and EMIs'
        },
        { 
          title: 'Loan Management', 
          path: '/society/loan-management', 
          icon: Banknote,
          description: 'Manage loan requests and approvals'
        },
        { 
          title: 'Thumbnail Management', 
          path: '/society/thumbnail-management', 
          icon: Image,
          description: 'Manage thumbnails and images'
        },
      ]
    },
    {
      id: 'student',
      title: 'Student Management',
      icon: GraduationCap,
      description: 'Manage students and academic records',
      children: [
        { 
          title: 'Students', 
          path: '/student/students', 
          icon: GraduationCap,
          description: 'Student information'
        },
        { 
          title: 'Courses', 
          path: '/student/courses', 
          icon: BookOpen,
          description: 'Manage courses and curriculum'
        },
        { 
          title: 'Course Batches', 
          path: '/student/course-batches', 
          icon: Users,
          description: 'Manage course batches and schedules'
        },
        { 
          title: 'Fee Management', 
          path: '/student/fee-management', 
          icon: DollarSign,
          description: 'Manage fee requests and payments'
        },
        { 
          title: 'Payment History', 
          path: '/student/payment-history', 
          icon: CreditCard,
          description: 'View payment history and records'
        },
        { 
          title: 'Attendance', 
          path: '/student/attendance', 
          icon: Calendar,
          description: 'Manage student attendance and reports'
        },
        // { 
        //   title: 'Certificates', 
        //   path: '/student/certificate', 
        //   icon: Award,
        //   description: 'Issue and manage certificates'
        // },
        { 
          title: 'Certificate Management', 
          path: '/student/certificate-management', 
          icon: Award,
          description: 'Manage student certificates and marksheets'
        },
        { 
          title: 'Marksheets', 
          path: '/student/marksheet', 
          icon: FileText,
          description: 'Academic records and grades'
        },
      ]
    },
    // {
    //   id: 'enrollment',
    //   title: 'Enrollment Management',
    //   icon: Users,
    //   description: 'Manage student enrollments and approvals',
    //   children: [
    //     { 
    //       title: 'Enrollment Management', 
    //       path: '/student/enrollment-management', 
    //       icon: Users,
    //       description: 'Manage enrollments, approvals, and analytics'
    //     },
    //   ]
    // },
    // {
    //   id: 'admin',
    //   title: 'Admin Management',
    //   icon: Settings,
    //   description: 'Administrative functions and system management',
    //   children: [
    //     // Admin management features can be added here in the future
    //   ]
    // },
    {
      id: 'kyc',
      title: 'KYC Management',
      icon: Shield,
      description: 'Manage KYC verification and approval',
      children: [
        { 
          title: 'Pending KYC', 
          path: '/kyc/pending', 
          icon: AlertTriangle,
          description: 'Review pending KYC requests'
        },
        { 
          title: 'Student KYC', 
          path: '/kyc/students', 
          icon: GraduationCap,
          description: 'Manage student KYC verification'
        },
        { 
          title: 'Society Member KYC', 
          path: '/kyc/society-members', 
          icon: Users,
          description: 'Manage society member KYC verification'
        },
        { 
          title: 'Approved KYC', 
          path: '/kyc/approved', 
          icon: Shield,
          description: 'View approved KYC documents'
        },
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: FileText,
      description: 'Generate reports and view analytics',
      children: [
        { 
          title: 'Financial Reports', 
          path: '/reports/financial', 
          icon: CreditCard,
          description: 'Financial statements and reports'
        },
        { 
          title: 'Student Reports', 
          path: '/reports/students', 
          icon: GraduationCap,
          description: 'Student performance and statistics'
        },
        { 
          title: 'Society Reports', 
          path: '/reports/society', 
          icon: Users,
          description: 'Society activity and member reports'
        },
        { 
          title: 'KYC Reports', 
          path: '/reports/kyc', 
          icon: Shield,
          description: 'KYC verification and status reports'
        },
      ]
    }
  ];

  const bottomMenuItems: Array<{
    id: string;
    title: string;
    icon: any;
    path: string;
  }> = [];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar-fixed sidebar-container w-72 bg-gradient-to-b from-white to-gray-50 shadow-2xl transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isOpen ? '' : 'lg:w-0 lg:overflow-hidden'}
        border-r border-gray-200 flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-xs text-gray-500">Management System</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-sky-50 to-blue-50 flex-shrink-0">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg">
                {user?.firstName?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@example.com'}
              </p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav 
          className="flex-1 sidebar-scroll sidebar-nav p-4 space-y-1 min-h-0 overflow-y-auto"
          style={{ 
            overflowY: 'auto',
            overflowX: 'hidden',
            maxHeight: 'calc(100vh - 200px)',
            height: '0'
          }}
        >
          {menuItems.map((item) => (
            <div key={item.id} className="mb-2">
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.id)}
                    className="w-full flex items-center justify-between p-3 text-gray-700 rounded-xl hover:bg-sky-50 hover:text-sky-700 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-sky-100 transition-colors">
                        <item.icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="font-semibold text-sm">{item.title}</span>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg bg-gray-100 group-hover:bg-sky-100 transition-colors">
                      {expandedSections.includes(item.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                  
                  {expandedSections.includes(item.id) && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-gray-100 pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`flex items-center space-x-3 p-3 rounded-lg transition-all group ${
                            location.pathname === child.path
                              ? 'bg-sky-100 text-sky-700 border-l-2 border-sky-500 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                          }`}
                        >
                          <div className={`p-1.5 rounded-md transition-colors ${
                            location.pathname === child.path
                              ? 'bg-sky-200'
                              : 'bg-gray-100 group-hover:bg-gray-200'
                          }`}>
                            <child.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium">{child.title}</span>
                            <p className="text-xs text-gray-500 truncate">{child.description}</p>
                          </div>
                          {location.pathname === child.path && (
                            <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all group ${
                    location.pathname === item.path
                      ? 'bg-sky-100 text-sky-700 border-l-4 border-sky-500 shadow-sm'
                      : 'text-gray-700 hover:bg-sky-50 hover:text-sky-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-sky-200'
                      : 'bg-gray-100 group-hover:bg-sky-100'
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-sm">{item.title}</span>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  {location.pathname === item.path && (
                    <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 p-4 space-y-2 flex-shrink-0 bg-white">
          {/* Bottom Menu Items */}
          {bottomMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className="flex items-center space-x-3 p-3 text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-800 transition-all group"
            >
              <div className="p-1.5 rounded-md bg-gray-100 group-hover:bg-gray-200 transition-colors">
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all group"
          >
            <div className="p-1.5 rounded-md bg-red-100 group-hover:bg-red-200 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;