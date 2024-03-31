function updateWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.main.temp;
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windSpeedElement = document.querySelector("#wind-speed");
  let timeElement = document.querySelector("#time");
  let iconElement = document.querySelector("#icon");
  let date = new Date(response.data.dt * 1000);

  console.log(response.data);

  timeElement.innerHTML = formatDate(date);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = `${response.data.main.humidity}%`;
  windSpeedElement.innerHTML = `${response.data.wind.speed}m/s`;
  temperatureElement.innerHTML = Math.round(temperature);
  iconElement.innerHTML = `<img src="https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png"
    class="weather-app-icon" />`;

  getForecast(response.data.coord);
}

function formatDate(date) {
  let minutes = date.getMinutes();
  let hours = date.getHours();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function searchCity(city) {
  let apiKey = "7508ec314e6ccfad6700f5d89600ffed";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(updateWeather);
}

function handleSearch(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[date.getDay()];
}

function getForecast(coords) {
  let apiKey = "7508ec314e6ccfad6700f5d89600ffed";
  let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric`;
  axios(apiUrl).then(showForecast);
}

function showForecast(response) {
  let forecastHtml = "";
  let dailyForecasts = {};

  response.data.list.forEach(function (forecast) {
    const day = formatDay(forecast.dt);
    if (!dailyForecasts[day]) {
      dailyForecasts[day] = forecast;
    }
  });

  
  Object.keys(dailyForecasts).forEach(function (day) {
    const forecast = dailyForecasts[day];
    forecastHtml += `
      <div class="weather-forecast-day">
        <div class="weather-forecast-date">${formatDay(forecast.dt)}</div>
        <img src="https://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png"
          class="weather-forecast-icon" />
        <div class="weather-forecast-temperatures">
          <div class="weather-forecast-temperature">
            <strong>${Math.round(forecast.main.temp_max)}º</strong>
          </div>
          <div class="weather-forecast-temperature">${Math.round(
            forecast.main.temp_min
          )}º</div>
        </div>
      </div>
    `;
  });

  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearch);

searchCity("Enugu");
