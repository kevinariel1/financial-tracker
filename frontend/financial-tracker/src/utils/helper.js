import moment from "moment";

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  let initials = "";

  for (let i = 0; i < Math.min(words.length, 2); i++) {
    initials += words[i][0];
  }

  return initials.toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) {
    return "";
  }

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart
    ? `${formattedInteger}.${fractionalPart}`
    : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));

  return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
  const sortedData = [...data].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const chartData = sortedData.map((item) => ({
    month: moment(item?.date).format("Do MMM"),
    amount: item?.amount,
    source: item?.source,
  }));

  return chartData;
};

export const prepareExpenseLineChartData = (expenses) => {
  const sorted = [...expenses].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return sorted.map(exp => ({
    id: exp._id,
    date: exp.date.slice(0, 10) + ` (${exp.category})`,
    amount: Number(exp.amount),
    category: exp.category
  }));
};

export const getDaySuffix = (day) => {
  if (day >= 11 && day <= 13) return `${day}th`;
  switch (day % 10) {
    case 1: return `${day}st`;
    case 2: return `${day}nd`;
    case 3: return `${day}rd`;
    default: return `${day}th`;
  }
};