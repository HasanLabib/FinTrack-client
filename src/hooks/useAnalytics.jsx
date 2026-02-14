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
  const axiosSecure = useAxiosSecure();
  const [isLoading, setIsLoading] = useState(true);
  const [insights, setInsights] = useState([]);
  const [featuredTips, setFeaturedTips] = useState([]);
  const [incomeVsExpenseBarData, setIncomeVsExpenseBarData] = useState({
    labels: monthNames,
    datasets: [
      { label: "Income", data: Array(12).fill(0), backgroundColor: "#4CAF50" },
      { label: "Expense", data: Array(12).fill(0), backgroundColor: "#F44336" },
    ],
  });
  const [monthlyExpenseTrendLineData, setMonthlyExpenseTrendLineData] =
    useState({
      labels: monthNames,
      datasets: [
        {
          label: "Monthly Expenses",
          data: Array(12).fill(0),
          borderColor: "#FF6384",
          tension: 0.3,
        },
      ],
    });
  const [categorySpendingPieData, setCategorySpendingPieData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  });
  const [balanceTrendLineData, setBalanceTrendLineData] = useState({
    labels: monthNames,
    datasets: [
      {
        label: "Balance Trend",
        data: Array(12).fill(0),
        borderColor: "#2196F3",
        tension: 0.3,
      },
    ],
  });
  const [savingsGrowthLineData, setSavingsGrowthLineData] = useState({
    labels: monthNames,
    datasets: [
      {
        label: "Savings Growth",
        data: Array(12).fill(0),
        borderColor: "#4CAF50",
        tension: 0.3,
      },
    ],
  });
  const [incomeBySourceBarData, setIncomeBySourceBarData] = useState({
    labels: monthNames,
    datasets: [],
  });
  const [expensesBySourceBarData, setExpensesBySourceBarData] = useState({
    labels: monthNames,
    datasets: [],
  });
  const [savingsBySourceBarData, setSavingsBySourceBarData] = useState({
    labels: monthNames,
    datasets: [],
  });
  const [
    monthlyIncomeExpenseRatioLineData,
    setMonthlyIncomeExpenseRatioLineData,
  ] = useState({
    labels: monthNames,
    datasets: [
      {
        label: "Income/Expense Ratio",
        data: Array(12).fill(0),
        borderColor: "#FFCE56",
        tension: 0.3,
      },
    ],
  });
  const [financialSummaryData, setFinancialSummaryData] = useState({
    monthlyNets: Array(12).fill(0),
    yearlyIncome: 0,
    yearlyExpense: 0,
    yearlySavings: 0,
    labels: monthNames,
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);

      const countResponse = await axiosSecure.get("/transaction?page=1");
      const totalTransactionsCount = countResponse.data.totalTran || 0;
      const transactionsPerPage = 8;
      const totalPagesCount = Math.ceil(
        totalTransactionsCount / transactionsPerPage,
      );

      let allTransactionsList = [];
      for (let pageNumber = 1; pageNumber <= totalPagesCount; pageNumber++) {
        const pageResponse = await axiosSecure.get(
          `/transaction?page=${pageNumber}`,
        );
        const pageTransactionsList = pageResponse.data.transactions || [];
        allTransactionsList = allTransactionsList.concat(pageTransactionsList);
      }

      const yearlyTransactionsList = allTransactionsList.filter(
        (transaction) => {
          return new Date(transaction.date).getFullYear() === year;
        },
      );

      //console.log(yearlyTransactionsList);

      const monthlyIncomeTotalsArray = Array(12).fill(0);
      const monthlyExpenseTotalsArray = Array(12).fill(0);
      const yearlyCategoryTotalsObject = {};
      const monthlySavingsGrowthArray = Array(12).fill(0);

      yearlyTransactionsList.forEach((transaction) => {
        const transactionDateObject = new Date(transaction.date);
        const monthIndex = transactionDateObject.getMonth();

        if (transaction.type === "Income") {
          monthlyIncomeTotalsArray[monthIndex] += parseFloat(
            transaction.amount || 0,
          );
        }
        if (transaction.type === "Expense") {
          monthlyExpenseTotalsArray[monthIndex] += parseFloat(
            transaction.amount || 0,
          );
          const categoryName = transaction.category || "Uncategorized";
          yearlyCategoryTotalsObject[categoryName] =
            (yearlyCategoryTotalsObject[categoryName] || 0) +
            parseFloat(transaction.amount || 0);
        }
        if (transaction.type === "Savings") {
          monthlySavingsGrowthArray[monthIndex] += parseFloat(
            transaction.amount || 0,
          );
        }
      });

      const monthlyBalanceTrendArray = Array(12).fill(0);
      let currentBalanceAmount = 0;
      for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
        currentBalanceAmount +=
          monthlyIncomeTotalsArray[monthIndex] -
          monthlyExpenseTotalsArray[monthIndex];
        monthlyBalanceTrendArray[monthIndex] = currentBalanceAmount;
      }

      const monthlyRatiosArray = monthlyIncomeTotalsArray.map(
        (income, index) => {
          const expense = monthlyExpenseTotalsArray[index];
          return expense > 0 ? +(income / expense).toFixed(2) : 0;
        },
      );

      const buildSourceDataObject = (transactionsList, transactionType) => {
        const sourcesObject = {};
        transactionsList.forEach((transaction) => {
          if (transaction.type !== transactionType) return;
          const monthIndex = new Date(transaction.date).getMonth();
          const sourceName = transaction.source || `General ${transactionType}`;
          if (!sourcesObject[sourceName])
            sourcesObject[sourceName] = Array(12).fill(0);
          sourcesObject[sourceName][monthIndex] += parseFloat(
            transaction.amount || 0,
          );
        });
        return {
          labels: monthNames,
          datasets: Object.keys(sourcesObject).map((source) => ({
            label: source,
            data: sourcesObject[source],
          })),
        };
      };

      const incomeSourceDataObject = buildSourceDataObject(
        yearlyTransactionsList,
        "Income",
      );
      const expenseSourceDataObject = buildSourceDataObject(
        yearlyTransactionsList,
        "Expense",
      );
      const savingsSourceDataObject = buildSourceDataObject(
        yearlyTransactionsList,
        "Savings",
      );

      setIncomeVsExpenseBarData({
        labels: monthNames,
        datasets: [
          {
            label: "Income",
            data: monthlyIncomeTotalsArray,
            backgroundColor: "#4CAF50",
          },
          {
            label: "Expense",
            data: monthlyExpenseTotalsArray,
            backgroundColor: "#F44336",
          },
        ],
      });

      setMonthlyExpenseTrendLineData({
        labels: monthNames,
        datasets: [
          {
            label: "Monthly Expenses",
            data: monthlyExpenseTotalsArray,
            borderColor: "#FF6384",
            tension: 0.3,
          },
        ],
      });

      setCategorySpendingPieData({
        labels: Object.keys(yearlyCategoryTotalsObject),
        datasets: [
          {
            data: Object.values(yearlyCategoryTotalsObject),
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

      setBalanceTrendLineData({
        labels: monthNames,
        datasets: [
          {
            label: "Balance Trend",
            data: monthlyBalanceTrendArray,
            borderColor: "#2196F3",
            tension: 0.3,
          },
        ],
      });

      setSavingsGrowthLineData({
        labels: monthNames,
        datasets: [
          {
            label: "Savings Growth",
            data: monthlySavingsGrowthArray,
            borderColor: "#4CAF50",
            tension: 0.3,
          },
        ],
      });

      setIncomeBySourceBarData(incomeSourceDataObject);
      setExpensesBySourceBarData(expenseSourceDataObject);
      setSavingsBySourceBarData(savingsSourceDataObject);

      setMonthlyIncomeExpenseRatioLineData({
        labels: monthNames,
        datasets: [
          {
            label: "Income/Expense Ratio",
            data: monthlyRatiosArray,
            borderColor: "#FFCE56",
            tension: 0.3,
          },
        ],
      });

      const monthlyNetBalancesArray = monthlyIncomeTotalsArray.map(
        (income, index) =>
          income -
          monthlyExpenseTotalsArray[index] +
          monthlySavingsGrowthArray[index],
      );
      setFinancialSummaryData({
        monthlyNets: monthlyNetBalancesArray,
        yearlyIncome: monthlyIncomeTotalsArray.reduce((a, b) => a + b, 0),
        yearlyExpense: monthlyExpenseTotalsArray.reduce((a, b) => a + b, 0),
        yearlySavings: monthlySavingsGrowthArray.reduce((a, b) => a + b, 0),
        labels: monthNames,
      });

      setIsLoading(false);

      const totalIncome = monthlyIncomeTotalsArray.reduce((a, b) => a + b, 0);
      const totalExpense = monthlyExpenseTotalsArray.reduce((a, b) => a + b, 0);
      const totalSavings = monthlySavingsGrowthArray.reduce((a, b) => a + b, 0);
      const totalTransactionsThisYear = yearlyTransactionsList.length;

      const savingsRate =
        totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : 0;
      const expenseRatio =
        totalIncome > 0 ? ((totalExpense / totalIncome) * 100).toFixed(1) : 0;

      const topCategoryEntry = Object.entries(
        yearlyCategoryTotalsObject,
      ).reduce((max, entry) => (entry[1] > max[1] ? entry : max), ["", 0]);
      const topCategory = topCategoryEntry[0];

      let newInsights = [];

      if (totalTransactionsThisYear < 15) {
        newInsights = [
          "You have limited transaction data this year. The more you track, the smarter your insights become! 📈",
          "General Tip: Follow the 50/30/20 rule — 50% needs, 30% wants, 20% savings.",
          "Sample Insight: Most users who save consistently reach their goals 3× faster.",
          `Common expense trap: ${topCategory || "Dining Out"} is a frequent culprit for many users.`,
        ];
      } else {
        newInsights.push(
          `Your savings rate is ${savingsRate}%. ${savingsRate >= 20 ? "Excellent work! You're building real wealth." : "Try to push it toward 20% for better financial security."}`,
        );

        if (expenseRatio > 75) {
          newInsights.push(
            "You're spending over 75% of income. Consider reviewing subscriptions and non-essential spending.",
          );
        } else if (expenseRatio < 50) {
          newInsights.push(
            "Strong control over expenses! You're in a great position to accelerate savings.",
          );
        }

        if (topCategory) {
          newInsights.push(
            `Your biggest spending category is "${topCategory}". Setting a monthly budget here could save you hundreds.`,
          );
        }
        const recentExpenseAvg =
          monthlyExpenseTotalsArray.slice(-3).reduce((a, b) => a + b, 0) / 3;
        const overallExpenseAvg = totalExpense / 12;
        if (recentExpenseAvg > overallExpenseAvg * 1.25) {
          newInsights.push(
            "Expenses have spiked in the last 3 months. Time to investigate!",
          );
        }
        if (totalSavings > totalExpense * 0.6) {
          newInsights.push(
            "Outstanding savings behavior! You're well on your way to financial freedom.",
          );
        }
      }
      newInsights.push(
        "Pro tip: Automate your savings transfer right after payday — out of sight, out of mind! 💰",
      );

      setInsights(newInsights);
    };

    fetchAnalyticsData();
  }, [year]);

  return {
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
    insights,
    featuredTips,
  };
};

export default useAnalytics;
