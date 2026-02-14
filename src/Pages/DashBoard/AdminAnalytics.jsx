import React from "react";
import { Bar, Pie } from "react-chartjs-2";
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
import useAdminAnalytics from "../../hooks/useAdminAnalytics";
import useTips from "../../hooks/useTips"; // you'll create this
import Loading from "../../utils/Loading";
const colorPalette = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#8BC34A",
  "#FF9800",
  "#9C27B0",
];
const AdminAnalytics = ({ year = new Date().getFullYear() }) => {
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
    insights,
    totalUsers,
    totalTransactions,
    isLoading,
  } = useAdminAnalytics(year);

  const { tips } = useTips();
  console.log("h")

  if (isLoading) return <Loading />;

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
    <div className="container mx-auto p-6 space-y-10">
      <h1 className="text-4xl font-bold text-center">
        Platform Financial Overview — {year}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-[#201F24] p-6 rounded-2xl shadow">
          <h3 className="text-lg">Total Users</h3>
          <p className="text-4xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white dark:bg-[#201F24] p-6 rounded-2xl shadow">
          <h3 className="text-lg">Total Transactions</h3>
          <p className="text-4xl font-bold">{totalTransactions}</p>
        </div>
        <div className="bg-white dark:bg-[#201F24] p-6 rounded-2xl shadow">
          <h3 className="text-lg">Yearly Income</h3>
          <p className="text-4xl font-bold text-green-600">
            ${financialSummaryData.yearlyIncome.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#201F24] p-6 rounded-2xl shadow">
          <h3 className="text-lg">Yearly Expenses</h3>
          <p className="text-4xl font-bold text-red-600">
            ${financialSummaryData.yearlyExpense.toFixed(2)}
          </p>
        </div>
        <div className="bg-white dark:bg-[#201F24] p-6 rounded-2xl shadow">
          <h3 className="text-lg">Yearly Savings</h3>
          <p className="text-4xl font-bold text-emerald-600">
            ${financialSummaryData.yearlySavings.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-3xl">
        <h2 className="text-2xl font-bold mb-4">Smart Financial Insights</h2>
        <ul className="space-y-3 text-lg">
          {insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
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

      <div>
        <h2 className="text-2xl font-bold mb-6">Featured Financial Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip) => (
            <div
              key={tip._id}
              className="bg-white dark:bg-[#201F24] p-6 rounded-2xl shadow"
            >
              <h3 className="font-semibold text-lg">{tip.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
