import React from "react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import useAnalytics from "../../hooks/useAnalytics";
import useRecentTransactions from "../../hooks/useRecentTransactions";
import { Link } from "react-router";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ChartDataLabels,
);

const AnalyticsDashboard = ({ year = new Date().getFullYear() }) => {
  const {
    recentTransactions,
    recentTransactionsLoading,
    recentTransactionserror,
  } = useRecentTransactions();
  const {
    incomeVsExpenseBarData,
    monthlyExpenseTrendLineData,
    categorySpendingPieData,
    balanceTrendLineData,
    savingsGrowthLineData,
    incomeBySourceBarData,
    expensesBySourceBarData,
    savingsBySourceBarData,
    monthlyIncomeExpenseRatioLineData,
    financialSummaryData,
    isLoading,
  } = useAnalytics(year);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading analytics...
      </div>
    );
  }

  const colorPalette = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#8BC34A",
    "#FF9800",
    "#9C27B0",
  ];

  const chartContainerStyles = {
    position: "relative",
    height: "320px",
    width: "100%",
  };

  const convertToRechartsFormat = (chartDataObject) => {
    const { labels, datasets } = chartDataObject;
    if (!labels || !datasets || !datasets.length) return [];
    const dataKey = datasets[0].label;
    return labels.map((label, index) => ({
      label,
      [dataKey]: datasets[0].data[index] || 0,
    }));
  };

  return (
    <div className="container mx-auto p-4 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-8">
        Financial Analytics Dashboard — {year}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="w-full bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Yearly Income
              </h2>
            </div>
          </div>
          <div className="mb-5 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${financialSummaryData.yearlyIncome.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-full bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Yearly Expenses
              </h2>
            </div>
          </div>
          <div className="mb-5 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${financialSummaryData.yearlyExpense.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-full bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Yearly Savings
              </h2>
            </div>
          </div>
          <div className="mb-5 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ${financialSummaryData.yearlySavings.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-full bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Net Balance
              </h2>
            </div>
          </div>
          <div className="mb-5 text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              $
              {(
                financialSummaryData.yearlyIncome -
                financialSummaryData.yearlyExpense +
                financialSummaryData.yearlySavings
              ).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900  mb-4">
            Recent Transactions
          </h2>
          <Link to={"/dashboard/userDashboard/transaction"}>View More</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentTransactions.map((transaction, index) => (
            <div
              key={index}
              className="w-full bg-white dark:bg-[#201F24] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {transaction.type || "Transaction"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {transaction.category || "N/A"}
                  </p>
                </div>
              </div>
              <div className="mb-5">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${parseFloat(transaction.amount || 0).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p className="text-xs uppercase text-gray-400">Date</p>
                  <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase text-gray-400">Note</p>
                  <p className="truncate max-w-37.5">
                    {transaction.note || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            Income vs Expense Comparison
          </h2>
          <div style={chartContainerStyles}>
            <Bar
              data={{
                labels: [...incomeVsExpenseBarData.labels],
                datasets: incomeVsExpenseBarData.datasets.map((dataset) => ({
                  ...dataset,
                  data: [...dataset.data],
                })),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            Category Spending Breakdown
          </h2>
          <div style={chartContainerStyles}>
            <Pie
              data={{
                labels: [...categorySpendingPieData.labels],
                datasets: [
                  {
                    data: [...categorySpendingPieData.datasets[0].data],
                    backgroundColor: colorPalette,
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: "right" },
                  datalabels: {
                    color: "#fff",
                    font: { weight: "bold" },
                    formatter: (value, context) => {
                      const sum = context.dataset.data.reduce(
                        (a, b) => a + b,
                        0,
                      );
                      return Math.round((value / sum) * 100) + "%";
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-5">Balance Trend</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={convertToRechartsFormat(balanceTrendLineData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Balance Trend"
                stroke="#2196F3"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-5">Monthly Expense Trend</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={convertToRechartsFormat(monthlyExpenseTrendLineData)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Monthly Expenses"
                stroke="#FF6384"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-5">Income / Expense Ratio</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart
              data={convertToRechartsFormat(monthlyIncomeExpenseRatioLineData)}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Income/Expense Ratio"
                stroke="#FFCE56"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-5">
            Savings Growth Over Time
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={convertToRechartsFormat(savingsGrowthLineData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Savings Growth"
                stroke="#4CAF50"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-5">
            Income by Source (Monthly)
          </h2>
          <div style={chartContainerStyles}>
            <Bar
              data={{
                labels: [...incomeBySourceBarData.labels],
                datasets: incomeBySourceBarData.datasets.map(
                  (dataset, index) => ({
                    ...dataset,
                    data: [...dataset.data],
                    backgroundColor: colorPalette[index % colorPalette.length],
                    borderColor: colorPalette[index % colorPalette.length],
                    borderWidth: 1,
                  }),
                ),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: {
                  x: { stacked: false },
                  y: { stacked: false, beginAtZero: true },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-5">
            Expenses by Source (Monthly)
          </h2>
          <div style={chartContainerStyles}>
            <Bar
              data={{
                labels: [...expensesBySourceBarData.labels],
                datasets: expensesBySourceBarData.datasets.map(
                  (dataset, index) => ({
                    ...dataset,
                    data: [...dataset.data],
                    backgroundColor: colorPalette[index % colorPalette.length],
                  }),
                ),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-5">
            Savings by Source (Monthly)
          </h2>
          <div style={chartContainerStyles}>
            <Bar
              data={{
                labels: [...savingsBySourceBarData.labels],
                datasets: savingsBySourceBarData.datasets.map(
                  (dataset, index) => ({
                    ...dataset,
                    data: [...dataset.data],
                    backgroundColor: colorPalette[index % colorPalette.length],
                  }),
                ),
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
                scales: { y: { beginAtZero: true } },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow lg:col-span-2">
          <h2 className="text-xl font-semibold mb-5">
            Monthly Financial Summary
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                    Month
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700 border-b">
                    Net Balance ($)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {financialSummaryData.labels.map((month, index) => (
                  <tr key={month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {month}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                      ${financialSummaryData.monthlyNets[index].toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
