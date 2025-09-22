import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { DepartmentStats } from '../../services/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DepartmentChartProps {
  data: DepartmentStats;
  type: 'students' | 'societyMembers' | 'courses';
}

const DepartmentChart: React.FC<DepartmentChartProps> = ({ data, type }) => {
  const getData = () => {
    switch (type) {
      case 'students':
        return data.students;
      case 'societyMembers':
        return data.societyMembers;
      case 'courses':
        return data.courses;
      default:
        return [];
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'students':
        return 'Students by Department';
      case 'societyMembers':
        return 'Society Members by Department';
      case 'courses':
        return 'Courses by Department';
      default:
        return '';
    }
  };

  const getColors = () => {
    const colors = [
      'rgba(59, 130, 246, 0.8)',
      'rgba(16, 185, 129, 0.8)',
      'rgba(245, 158, 11, 0.8)',
      'rgba(239, 68, 68, 0.8)',
      'rgba(139, 92, 246, 0.8)',
      'rgba(236, 72, 153, 0.8)',
    ];
    return colors.slice(0, getData().length);
  };

  const chartData = {
    labels: getData().map(item => item._id),
    datasets: [
      {
        data: getData().map(item => item.count),
        backgroundColor: getColors(),
        borderColor: getColors().map(color => color.replace('0.8', '1')),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
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
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="h-80">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default DepartmentChart;
