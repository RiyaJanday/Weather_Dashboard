const apiKey = "5505af83b67c57e4e521fecd446a28e2";
const weatherDisplay = document.getElementById("weatherDisplay");

async function getWeatherByCity() {
    const city = document.getElementById("cityInput").value;
    if (!city) return alert("Please enter a city!");

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
            fetchWeather(url);
        }, () => {
            alert("Location access denied.");
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function fetchWeather(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            alert(data.message);
            return;
        }

        displayWeather(data);
    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

function displayWeather(data) {
    const { name, main, weather } = data;
    weatherDisplay.innerHTML = `
    <h2>${name}</h2>
    <h3>${main.temp}°C</h3>
    <p>${weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="weather-icon">
    <p>Feels Like: ${main.feels_like}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Min: ${main.temp_min}°C | Max: ${main.temp_max}°C</p>
  `;
}
