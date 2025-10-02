const apiKey = "5505af83b67c57e4e521fecd446a28e2";
const weatherDisplay = document.getElementById("weatherDisplay");
let forecastChart;

function getWeatherByCity() {
    const city = document.getElementById("cityInput").value;
    if (!city) return alert("Enter a city!");
    fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const lat = pos.coords.latitude, lon = pos.coords.longitude;
            fetchWeather(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
            fetchForecast(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
        }, () => alert("Location access denied."));
    }
}

async function fetchWeather(url) {
    const res = await fetch(url);
    const data = await res.json();
    if (data.cod !== 200) return alert(data.message);
    displayWeather(data);
}

async function fetchForecast(url) {
    const res = await fetch(url);
    const data = await res.json();
    if (data.cod !== "200") return;

    let days = {};
    data.list.forEach((item) => {
        let date = item.dt_txt.split(" ")[0];
        if (!days[date]) days[date] = item;
    });

    const labels = Object.keys(days).slice(0, 5);
    const temps = Object.values(days).slice(0, 5).map(d => d.main.temp);

    drawForecast(labels, temps);
}

function displayWeather(data) {
    const { name, main, weather, wind, sys } = data;
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString();

    weatherDisplay.innerHTML = `
    <h2>${name}</h2>
    <h3>${main.temp}°C</h3>
    <p>${weather[0].description}</p>
    <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png">
    <p>Feels Like: ${main.feels_like}°C</p>
    <p>Humidity: ${main.humidity}%</p>
    <p>Wind: ${wind.speed} m/s</p>
    <p>Pressure: ${main.pressure} hPa</p>
    <p>Sunrise: ${sunrise} 🌅 | Sunset: ${sunset} 🌇</p>
  `;

    setDynamicBackground(weather[0].main.toLowerCase());
}

function drawForecast(labels, temps) {
    const ctx = document.getElementById("forecastChart").getContext("2d");
    if (forecastChart) forecastChart.destroy();

    forecastChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Temp (°C)",
                data: temps,
                borderColor: "#ff758c",
                backgroundColor: "rgba(255, 117, 140, 0.3)",
                fill: true,
                tension: 0.3,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: false } }
        }
    });
}

function setDynamicBackground(condition) {
    let bg;
    if (condition.includes("clear")) bg = "linear-gradient(135deg, #f6d365, #fda085)";
    else if (condition.includes("cloud")) bg = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
    else if (condition.includes("rain")) bg = "linear-gradient(135deg, #00c6fb, #005bea)";
    else if (condition.includes("snow")) bg = "linear-gradient(135deg, #83a4d4, #b6fbff)";
    else bg = "linear-gradient(135deg, #89f7fe, #66a6ff)";
    document.body.style.background = bg;
}
