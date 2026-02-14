import { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const useAnalytics = (year = new Date().getFullYear()) => {
  const axios = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [incomeVsExpenseBar, setIncomeVsExpenseBar] = useState({});
  const [monthlyExpenseTrendLine, setMonthlyExpenseTrendLine] = useState({});
  const [categorySpendingPie, setCategorySpendingPie] = useState({});
  const [balanceTrendLine, setBalanceTrendLine] = useState({});
  const [savingsGrowthLine, setSavingsGrowthLine] = useState({});
  const [incomeSourceBar, setIncomeSourceBar] = useState({});
  const [expenseSourceBar, setExpenseSourceBar] = useState({});
  const [savingsSourceBar, setSavingsSourceBar] = useState({});
  const [monthlyRatioLine, setMonthlyRatioLine] = useState({});
  const [financialSummary, setFinancialSummary] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);

      const incomeResponse = await axios.get(`/income-track?year=${year}`);
      const incomeTrackData = incomeResponse.data || [];
      const expenseResponse = await axios.get(`/expense-track?year=${year}`);
      const expenseTrackData = expenseResponse.data || [];
      const countResponse = await axios.get("/transaction?page=1");
      const totalTransactions = countResponse.data.totalTran || 0;
      const transactionsPerPage = 8;
      const totalPages = Math.ceil(totalTransactions / transactionsPerPage);

      let allTransactions = [];
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const pageResponse = await axios.get(`/transaction?page=${pageNum}`);
        const pageTransactions = pageResponse.data.transactions || [];
        allTransactions = allTransactions.concat(pageTransactions);
      }

      const yearlyTransactions = allTransactions.filter((transaction) => {
        return new Date(transaction.date).getFullYear() === year;
      });

      console.log(yearlyTransactions);
      const monthlyIncomeTotals = Array(12).fill(0);
      const monthlyExpenseTotals = Array(12).fill(0);
      const categoryTotalsForYear = {};
      const savingsGrowthPerMonth = Array(12).fill(0);

      yearlyTransactions.forEach((transaction) => {
        const transactionDate = new Date(transaction.date);
        const monthIndex = transactionDate.getMonth();

        if (transaction.type === "Income") {
          monthlyIncomeTotals[monthIndex] += parseFloat(
            transaction.amount || 0,
          );
        }
        if (transaction.type === "Expense") {
          monthlyExpenseTotals[monthIndex] += parseFloat(
            transaction.amount || 0,
          );
          const categoryName = transaction.category || "Uncategorized";
          categoryTotalsForYear[categoryName] =
            (categoryTotalsForYear[categoryName] || 0) +
            parseFloat(transaction.amount || 0);
        }
        if (transaction.type === "Savings") {
          savingsGrowthPerMonth[monthIndex] += parseFloat(
            transaction.amount || 0,
          );
        }
      });

      const balanceTrendPerMonth = Array(12).fill(0);
      let currentBalance = 0;
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        currentBalance +=
          monthlyIncomeTotals[monthIndex] - monthlyExpenseTotals[monthIndex];
        balanceTrendPerMonth[monthIndex] = currentBalance;
      }

      const monthlyRatios = monthlyIncomeTotals.map((income, index) => {
        const expense = monthlyExpenseTotals[index];
        return expense > 0 ? (income / expense).toFixed(2) : 0;
      });

      const buildSourceData = (trackData, isSavings = false) => {
        let uniqueSources = [];
        trackData.forEach((monthData) => {
          monthData.sources.forEach((sourceItem) => {
            const sourceName =
              sourceItem.sourceName || sourceItem.description || "Unknown";
            if (!uniqueSources.includes(sourceName))
              uniqueSources.push(sourceName);
          });
        });

        if (isSavings) {
          const savingSources = {};
          yearlyTransactions.forEach((transaction) => {
            if (transaction.type !== "Savings") return;
            const monthIndex = new Date(transaction.date).getMonth();
            const sourceName = transaction.source || "General Savings";
            if (!savingSources[sourceName])
              savingSources[sourceName] = Array(12).fill(0);
            savingSources[sourceName][monthIndex] += parseFloat(
              transaction.amount || 0,
            );
          });
          uniqueSources = Object.keys(savingSources);
          return {
            labels: monthNames,
            datasets: uniqueSources.map((source) => ({
              label: source,
              data: savingSources[source],
            })),
          };
        } else {
          let datasets = [];
          uniqueSources.forEach((source) => {
            const newDataset = { label: source, data: Array(12).fill(0) };
            datasets.push(newDataset);
          });

          trackData.forEach((monthData) => {
            const monthIndex = monthData.monthId - 1;
            monthData.sources.forEach((sourceItem) => {
              const sourceName = sourceItem.sourceName;
              const amount = sourceItem.amount;
              for (let i = 0; i < datasets.length; i++) {
                if (datasets[i].label === sourceName) {
                  datasets[i].data[monthIndex] = amount;
                  break;
                }
              }
            });
          });

          return { labels: monthNames, datasets };
        }
      };

      const incomeSourceData = buildSourceData(incomeTrackData);
      const expenseSourceData = buildSourceData(expenseTrackData);
      const savingsSourceData = buildSourceData([], true);

      setIncomeVsExpenseBar({
        labels: monthNames,
        datasets: [
          {
            label: "Income",
            data: monthlyIncomeTotals,
            backgroundColor: "#4CAF50",
          },
          {
            label: "Expense",
            data: monthlyExpenseTotals,
            backgroundColor: "#F44336",
          },
        ],
      });

      setMonthlyExpenseTrendLine({
        labels: monthNames,
        datasets: [
          {
            label: "Monthly Expenses",
            data: monthlyExpenseTotals,
            borderColor: "#FF6384",
            tension: 0.3,
          },
        ],
      });

      setCategorySpendingPie({
        labels: Object.keys(categoryTotalsForYear),
        datasets: [
          {
            data: Object.values(categoryTotalsForYear),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#8BC34A",
              "#FF9800",
              "#9C27B0",
            ],
          },
        ],
      });

      setBalanceTrendLine({
        labels: monthNames,
        datasets: [
          {
            label: "Balance Trend",
            data: balanceTrendPerMonth,
            borderColor: "#2196F3",
            tension: 0.3,
          },
        ],
      });

      setSavingsGrowthLine({
        labels: monthNames,
        datasets: [
          {
            label: "Savings Growth",
            data: savingsGrowthPerMonth,
            borderColor: "#4CAF50",
            tension: 0.3,
          },
        ],
      });

      setIncomeSourceBar(incomeSourceData);
      setExpenseSourceBar(expenseSourceData);
      setSavingsSourceBar(savingsSourceData);

      setMonthlyRatioLine({
        labels: monthNames,
        datasets: [
          {
            label: "Income/Expense Ratio",
            data: monthlyRatios,
            borderColor: "#FFCE56",
            tension: 0.3,
          },
        ],
      });

      const monthlyNets = monthlyIncomeTotals.map(
        (income, idx) =>
          income - monthlyExpenseTotals[idx] + savingsGrowthPerMonth[idx],
      );
      setFinancialSummary({
        monthlyNets,
        yearlyIncome: monthlyIncomeTotals.reduce((a, b) => a + b, 0),
        yearlyExpense: monthlyExpenseTotals.reduce((a, b) => a + b, 0),
        yearlySavings: savingsGrowthPerMonth.reduce((a, b) => a + b, 0),
        labels: monthNames,
      });

      setLoading(false);
    };

    fetchAnalytics();
  }, [year]);

  return {
    incomeVsExpenseBar,
    monthlyExpenseTrendLine,
    categorySpendingPie,
    balanceTrendLine,
    savingsGrowthLine,
    incomeSourceBar,
    expenseSourceBar,
    savingsSourceBar,
    monthlyRatioLine,
    financialSummary,
    loading,
  };
};

export default useAnalytics;
