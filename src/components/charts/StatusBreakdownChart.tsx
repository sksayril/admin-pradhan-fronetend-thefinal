import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { StatusBreakdowns } from '../../services/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatusBreakdownChartProps {
  data: StatusBreakdowns;
  type: 'cdInvestments' | 'loans' | 'feeRequests' | 'enrollments';
}

const StatusBreakdownChart: React.FC<StatusBreakdownChartProps> = ({ data, type }) => {
  const getData = () => {
    switch (type) {
      case 'cdInvestments':
        return data.cdInvestments;
      case 'loans':
        return data.loans;
      case 'feeRequests':
        return data.feeRequests;
      case 'enrollments':
        return data.enrollments;
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'cdInvestments':
        return 'CD Investment Status Breakdown';
      case 'loans':
        return 'Loan Status Breakdown';
      case 'feeRequests':
        return 'Fee Request Status Breakdown';
      case 'enrollments':
        return 'Enrollment Status Breakdown';
      default:
        return '';
    }
  };

  const getColors = () => {
    const colorMap: { [key: string]: string } = {
      'pending': 'rgba(245, 158, 11, 0.8)',
      'approved': 'rgba(16, 185, 129, 0.8)',
      'rejected': 'rgba(239, 68, 68, 0.8)',
      'active': 'rgba(59, 130, 246, 0.8)',
      'disbursed': 'rgba(139, 92, 246, 0.8)',
      'paid': 'rgba(16, 185, 129, 0.8)',
      'completed': 'rgba(16, 185, 129, 0.8)',
    };

    return getData().map(item => colorMap[item._id] || 'rgba(156, 163, 175, 0.8)');
  };

  const chartData = {
    labels: getData().map(item => item._id.charAt(0).toUpperCase() + item._id.slice(1)),
    datasets: [
      {
        label: 'Count',
        data: getData().map(item => item.count),
        backgroundColor: getColors(),
        borderColor: getColors().map(color => color.replace('0.8', '1')),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: getTitle(),
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `Count: ${value}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="h-80">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default StatusBreakdownChart;
