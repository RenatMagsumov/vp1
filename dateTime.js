const monthNamesEt = ["jaanuar", "veebruar", "märts", "aprill", "mai", "juuni", "juuli", "august", "september", "oktoober", "november", "detsember"];
const weekdayNamesEt = ["pühapäev", "esmaspäev", "teisipäev", "kolmapäev", "neljapäev", "reede", "laupäev"];

const dateEt = function()
{
	let timeNow = new Date();
	let dateNow = timeNow.getDate();
	let monthNow = timeNow.getMonth();
	let yearNow = timeNow.getFullYear();
	let dateNowEt = dateNow + ". " + monthNamesEt[monthNow] + " " + yearNow;
	return dateNowEt;
}

const weekDayET = function()
{
	let timeNow = new Date();
	let dayNow = timeNow.getDay();
	return weekdayNamesEt[dayNow];
}

const timeFormattedET = function()
{
	function addZero(i)
	{
		if (i < 10)
		{
			i = "0" + i;
		}
		return i;
	}
	let timeNow = new Date();
	let hourNow = timeNow.getHours();
	let minuteNow = timeNow.getMinutes();
	let secondNow = timeNow.getSeconds();
	return hourNow + ":" + minuteNow + ":" + secondNow;
}

/*const partOfDay = function()
{
	let dayPart = "suvaline hetk";
	let timeNow = new Date();
	if(timeNow.getHours() >= 0 && timeNow.getHours() < 8)
	{
		dayPart = "Sleep time";
	}
	return dayPart;
}*/
const partOfWeek = function()
{
	let dayPart = "Nädalapäev";
	let timeNow = new Date();
	if(timeNow.getDay() == 6 || timeNow.getDay() == 0)
	{
		dayPart = "Nädalavahetus"
		if(timeNow.getHours() >= 0 && timeNow.getHours() < 12)
		{
			dayPart = "Sleep time"
		}
		else if(timeNow.getHours() >= 12 && timeNow.getHours() < 16)
		{
			dayPart = "free time"
		}
		else
		{
			dayPart = "Work time"
		}
	}	
	else
	{
		dayPart = "Töönädal"
		if(timeNow.getHours() >= 0 && timeNow.getHours() < 8)
		{
			dayPart = "Sleep time"
		}
		else if(timeNow.getHours() >= 8 && timeNow.getHours() < 16)
		{
			dayPart = "Work time"
		}
		else
		{
			dayPart = "Free time"
		}
	}
	return dayPart;
}
/*console.log("Kuupäev:", dateEt());
console.log("Nädalapäev:", weekDayET()); 
console.log("Kell:", timeFormattedET());
console.log("Praegune sessioon:", partOfWeek());*/

module.exports = {monthsEt: monthNamesEt, weekdaysEt: weekdayNamesEt, dateEt: dateEt, weekDayEt: weekDayET, timeEt: timeFormattedET, partOfWeek};