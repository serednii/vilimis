import { nameWeekDay, nameMonth } from "./czechDateLabels";

//sbíráme za každý den všechny časové intervaly, kdy jsme pracovali
export const groupByTimeOfDay = (workDataTime) => {
  const arrayDayOfTime = {};
  workDataTime.forEach((el) => {
    const deltaTime =
      new Date(el.datetimeStop.date) - new Date(el.datetimeStart.date);
    const date = el.datetimeStart.date.split(" ")[0];
    if (arrayDayOfTime[date] === undefined) {
      arrayDayOfTime[date] = deltaTime;
    } else {
      arrayDayOfTime[date] = arrayDayOfTime[date] + deltaTime;
    }
  });
  return arrayDayOfTime
};

//analyzujeme všechna pole objektu po jednotlivých objektech
const separateObject = (obj) => {
  const arrayDay = [];
  for (const date in obj) {
    arrayDay.push({
      date: date,
      workTime: obj[date]
    });
  }
  return arrayDay;
};

function getDaysInMonth(month, year) {
  // Місяці в JavaScript: 0 - Січень, 1 - Лютий, ..., 11 - Грудень
  return new Date(year, month + 1, 0).getDate();
}

//analyzujeme všechna pole objektu po jednotlivých objektech
export const addNewProperties = (array) => {

  const newArr = array.map((day) => {
    let hour = Math.floor(day?.workTime / 1000 / 60 / 60);
    const minute = Math.floor(day?.workTime / 1000 / 60);
    hour = hour + (minute - hour * 60) / 100;
    const weekDay = nameWeekDay[new Date(day.date).getDay()]
    const monthDay = new Date(day.date).getDate()

    return {
      date: day.date,
      weekMonthDey: monthDay + "" + weekDay.slice(0, 2),
      weekDay,
      monthDay,
      month: nameMonth[new Date(day?.date).getMonth()],
      year: new Date(day?.date).getFullYear(),
      timeMinute: minute,
      timeHour: hour,
    }

  })

  return newArr

};

export const fillInTheMissingDays = (arrayDays) => {
  const year = Number(arrayDays[0].date.slice(0, 4))
  const month = Number(arrayDays[0].date.slice(5, 7))
  const numberOfDaysInMonth = getDaysInMonth(month, year);
  const newArrDays = []

  for (let i = 1; i <= numberOfDaysInMonth; i++) {
    const res = arrayDays.find(day => Number(day.date.slice(8, 10)) === i)
    const newDay = {}
    if (!res) {
      newDay.date = arrayDays[0].date.slice(0, 8) + (i < 10 ? `0${i}` : i.toString());
      newDay.workTime = 0
      newArrDays.push(newDay)
    } else {
      newArrDays.push(res)
    }
  }
  return newArrDays
}

export const getYearAndMonth = (date) => {
  const setDate = new Set();
  const setYear = new Set();

  date.forEach((el) => {
    setDate.add(el.date.slice(0, 8) + "01");
    setYear.add(el.date.slice(0, 4));
  });

  const arrayDate = Array.from(setDate);
  const allYear = Array.from(setYear);

  const objArrayMonth = {};
  allYear.forEach((year) => {
    const month = arrayDate.filter((date) => date.slice(0, 4) === year);
    objArrayMonth[year] = month.map(
      (year) => nameMonth[new Date(year).getMonth()]
    );
  });
  objArrayMonth["allYear"] = allYear;
  return objArrayMonth;
};

export const functionFilterData = (data, lastYear, lastMonth) => {
  const year = data.date.slice(0, 4);
  const month = nameMonth[+data.date.slice(5, 7) - 1];
  return year === lastYear && month === lastMonth;
};

export const splitNumber = (num) => {
  const [integerPart, decimalPart] = num.toFixed(2).split(".");
  return {
    integerPart: parseInt(integerPart, 10),
    decimalPart: parseInt(decimalPart, 10),
  };
}

export const getNewFormatData = (workDataTime) => {
  // console.log(workDataTime)
  //Збираємо всі дані в один обєкт для кожного поля двти додаємо робочі години за день
  const objTimeOfDay = groupByTimeOfDay(workDataTime)//
  // console.log(objTimeOfDay)
  //Розкидаємо кожен день в окремий обєкт
  const separateObjectIntoArray = separateObject(objTimeOfDay)
  // console.log(separateObjectIntoArray)

  //Додаємо нові властивості до обєкта дня
  const arrayObjectWorkDay = addNewProperties(separateObjectIntoArray)
  // console.log(arrayObjectWorkDay)

  //Створюємо окремий обєкт з робочими роками і місяцями
  const objYearAndMonth = getYearAndMonth(arrayObjectWorkDay)
  return { arrayObjectWorkDay, objYearAndMonth, separateObjectIntoArray }
}

export const sortDay = (a, b) => {
  const aDateTime = new Date(a.date).getTime();
  const bDateTime = new Date(b.date).getTime();
  return aDateTime - bDateTime;
};

