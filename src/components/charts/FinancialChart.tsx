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
import { FinancialChart as FinancialChartType } from '../../services/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialChartProps {
  data: FinancialChartType;
}

const FinancialChart: React.FC<FinancialChartProps> = ({ data }) => {
  const chartData = {
    labels: data.cdInvestments.map(item => item.month),
    datasets: [
      {
        label: 'CD Investments (₹)',
        data: data.cdInvestments.map(item => item.amount || 0),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
      {
        label: 'Loans (₹)',
        data: data.loans.map(item => item.amount || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
      {
        label: 'Fees (₹)',
        data: data.fees.map(item => item.amount || 0),
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgb(245, 158, 11)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Financial Overview',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.parsed.y;
            return `${context.dataset.label}: ₹${value.toLocaleString()}`;
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
        ticks: {
          callback: function(value: any) {
            return '₹' + value.toLocaleString();
          },
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

export default FinancialChart;
