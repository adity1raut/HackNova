import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, ArcElement, BarElement, Title, Tooltip, Legend);

const AttendanceVisualise = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const email = localStorage.getItem("email");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/getAttendanceForVisualiation/${email}`)
      .then((response) => {
        console.log("Attendance data:", response.data.attendance);
        setAttendanceData(response.data.attendance);
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });
  }, []);

  if (attendanceData.length === 0) {
    return <p className="text-gray-600 text-center">Loading attendance data...</p>;
  }

  // Total Days Calculation
  const totalPresentDays = attendanceData.reduce((sum, item) => sum + item.presentDays, 0);
  const totalDays = attendanceData.reduce((sum, item) => sum + item.totalDays, 0);
  const totalAttendancePercentage = (totalPresentDays / totalDays) * 100;

  // Subject-wise Present & Total Days
  const subjects = attendanceData.map((item) => item.subject);
  const presentDays = attendanceData.map((item) => item.presentDays);
  const totalDaysArr = attendanceData.map((item) => item.totalDays);

  // Subject-wise contribution in percentage
  const subjectContribution = attendanceData.map((item) => ({
    subject: item.subject,
    contribution: (item.presentDays / totalPresentDays) * 100,
  }));

  // Overall Attendance Bar Chart Data
  const overallChartData = {
    labels: ["Total Attendance"],
    datasets: [
      {
        label: "Attendance Percentage",
        data: [totalAttendancePercentage.toFixed(2)],
        backgroundColor: totalAttendancePercentage < 75 ? "rgba(255, 99, 132, 0.6)" : "rgba(54, 162, 235, 0.6)",
        borderColor: totalAttendancePercentage < 75 ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Doughnut Chart Data for Subject Contribution
  const doughnutChartData = {
    labels: subjectContribution.map((item) => item.subject),
    datasets: [
      {
        label: "Subject Contribution",
        data: subjectContribution.map((item) => item.contribution),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        hoverOffset: 4,
      },
    ],
  };

  // Subject-wise Present Days vs. Total Days (Stacked Bar Chart)
  const subjectWiseStackedChartData = {
    labels: subjects,
    datasets: [
      {
        label: "Total Days",
        data: totalDaysArr,
        backgroundColor: "rgba(200, 200, 200, 0.5)", // Light color for total days
        borderColor: "rgba(200, 200, 200, 1)",
        borderWidth: 1,
      },
      {
        label: "Present Days",
        data: presentDays,
        backgroundColor: "rgba(54, 162, 235, 0.6)", // Darker color for present days
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Attendance Visualization</h2>

      {/* Overall Attendance Percentage */}
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Attendance Percentage</h3>
        <Bar data={overallChartData} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 100 } } }} />
      </div>

      {/* Subject Contribution Doughnut Chart */}
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Subject Contribution to Attendance</h3>
        <Doughnut data={doughnutChartData} />
      </div>

      {/* Subject-wise Present Days vs Total Days (Stacked Bar Chart) */}
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Subject-wise Attendance</h3>
        <Bar
          data={subjectWiseStackedChartData}
          options={{
            responsive: true,
            scales: {
              y: { beginAtZero: true },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const datasetLabel = context.dataset.label || "";
                    return `${datasetLabel}: ${context.raw} days`;
                  },
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AttendanceVisualise;
