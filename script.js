const day = {
  labelElement: document.getElementById("day-label"),
  inputElement: document.getElementById("day"),
  errorElement: document.getElementById("day_error"),
};
const month = {
  labelElement: document.getElementById("month-label"),
  inputElement: document.getElementById("month"),
  errorElement: document.getElementById("month_error"),
};
const year = {
  labelElement: document.getElementById("year-label"),
  inputElement: document.getElementById("year"),
  errorElement: document.getElementById("year_error"),
};

const handleError = ({ labelElement, inputElement, errorElement }, message) => {
  errorElement.textContent = message;
  inputElement.style.outline = "none";
  inputElement.style.border = "1px solid red";
  labelElement.style.color = "red";
};

const revertErrorStates = () => {
  document.getElementById("years").textContent = "--";
  document.getElementById("days").textContent = "--";
  document.getElementById("months").textContent = "--";

  [day, month, year].forEach((item) => {
    const { labelElement, inputElement, errorElement } = item;
    labelElement.style.color = "var(--smokey-grey)";
    inputElement.style.outline = "none";
    inputElement.style.border = "1px solid var(--light-grey)";
    errorElement.textContent = "";
  });
};

const format = (value) => {
  return value.substring(0, 1) == 0 ? value.slice(1, 2) : value;
};

const getFormattedValues = () => {
  return {
    day: format(day.inputElement.value),
    month: format(month.inputElement.value),
    year: format(year.inputElement.value),
  };
};

const fillInValues = ({ days, months, years }) => {
  document.getElementById("years").textContent = years;
  document.getElementById("months").textContent = months;
  document.getElementById("days").textContent = days;
};

function calculateAge(birthDay, birthMonth, birthYear) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  let years = currentYear - birthYear;

  let months = currentMonth - birthMonth;
  if (currentDay < birthDay) {
    months--;
  }

  let days = currentDay - birthDay;
  if (currentDay < birthDay) {
    const lastDayOfPreviousMonth = new Date(
      currentYear,
      currentMonth - 1,
      0
    ).getDate();
    days = lastDayOfPreviousMonth - (birthDay - currentDay);
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

const checkValuesPresence = () => {
  const message = "This field is required";
  let errorOccured = false;

  [day, month, year].forEach((item) => {
    if (item.inputElement.value === "") {
      handleError(item, message);
      errorOccured = true;
    }
  });

  return !errorOccured;
};

const validateValues = () => {
  let errorOccured = false;

  const dayValue = parseInt(day.inputElement.value);
  if (dayValue > 31 || dayValue < 0) {
    handleError(day, "Must be a valid day");
    errorOccured = true;
  }

  const monthValue = parseInt(month.inputElement.value);
  if (monthValue > 12 || monthValue <= 0) {
    handleError(month, "Must be a valid month");
    errorOccured = true;
  }

  const yearValue = parseInt(year.inputElement.value);
  if (yearValue > new Date().getFullYear()) {
    handleError(year, "Must be in the past");
    errorOccured = true;
  }

  return !errorOccured;
};

const validateCompleteDate = () => {
  const monthDayCounts = [31, 28, 31, 30, 31, 30, 31, 30, 31, 31, 30, 31];

  function handleSubError() {
    revertErrorStates();
    handleError(day, "Must be a valid date");
    handleError(month, "");
    handleError(year, "");
  }

  if (
    day.inputElement.value >
    monthDayCounts[format(month.inputElement.value) - 1]
  ) {
    handleSubError();
  } else if (
    parseInt(day.inputElement.value) > new Date().getUTCDate() &&
    parseInt(year.inputElement.value) === new Date().getFullYear()
  ) {
    handleSubError();
  } else {
    return true;
  }
};

const validate = () => {
  let hasError = false;
  if (!checkValuesPresence()) hasError = true;
  if (!validateValues()) hasError = true;
  if (hasError) return !hasError;

  if (!validateCompleteDate()) hasError = true;
  return !hasError;
};

const submitted = () => {
  revertErrorStates();

  if (validate()) {
    const { day, month, year } = getFormattedValues();
    fillInValues(calculateAge(day, month, year));
  }
};
