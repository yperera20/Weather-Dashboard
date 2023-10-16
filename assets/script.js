document.addEventListener("DOMContentLoaded", function () {
    const cityForm = document.getElementById("city-form");
    const cityInput = document.getElementById("city-input");
    const searchHistory = document.getElementById("search-history");
    const currentWeather = document.getElementById("current-weather");
    const forecast = document.getElementById("forecast");

    const API_KEY = "11e32922c7c414cb30643dd5f19d25d0";

    cityForm.addEventListener("submit", async function (e) {
        e.preventDefault();
        const cityName = cityInput.value;

        try {
            const currentWeatherData = await fetchCurrentWeather(cityName, API_KEY);
            const forecastData = await fetchWeatherForecast(cityName, API_KEY);

            // Display current and future conditions
            displayCurrentWeather(currentWeatherData);
            displayForecast(forecastData);

            // Add the city to the search history
            addToSearchHistory(cityName);
        } catch (error) {
            console.error("Error fetching weather data:", error);
        }
    });

    // Function to fetch current weather
    async function fetchCurrentWeather(cityName, apiKey) {
        const currentWeatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
        );

        if (!currentWeatherResponse.ok) {
            throw new Error("City not found");
        }

        return currentWeatherResponse.json();
    }

    // Function to fetch 5-day forecast
    async function fetchWeatherForecast(cityName, apiKey) {
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`
        );

        if (!forecastResponse.ok) {
            throw new Error("City not found");
        }

        return forecastResponse.json();
    }
  
    // Function to display current weather
    function displayCurrentWeather(data) {
        const temperatureKelvin = data.main.temp;
        const temperatureCelsius = temperatureKelvin - 273.15; // Conversion to Celsius
        
        // Display the temperature in Celsius
        currentWeather.innerHTML = `
            <h2>${data.name}</h2>
            <p>Date: ${new Date(data.dt * 1000).toDateString()}</p>
            <p>Weather: ${data.weather[0].description}</p>
            <p>Temperature: ${temperatureCelsius.toFixed(2)} °C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }

    // Function to display 5-day forecast
    function displayForecast(data) {
        // Update the forecast div with a 5-day weather forecast.
        forecast.innerHTML = "<h2>5-Day Forecast</h2>";
        const forecastList = data.list;

        for (let i = 0; i < forecastList.length; i += 8) {
            const forecastData = forecastList[i];
            const date = new Date(forecastData.dt * 1000).toDateString();
            const weatherDescription = forecastData.weather[0].description;
            const temperature = forecastData.main.temp;
            const humidity = forecastData.main.humidity;
            const windSpeed = forecastData.wind.speed;

            forecast.innerHTML += `
                <div class="forecast-item">
                    <p>Date: ${date}</p>
                    <p>Weather: ${weatherDescription}</p>
                    <p>Temperature: ${temperature} °C</p>
                    <p>Humidity: ${humidity}%</p>
                    <p>Wind Speed: ${windSpeed} m/s</p>
                </div>
            `;
        }
    }

    // Function to add a city to the search history
    function addToSearchHistory(cityName) {
        // Create a button and add it to the search history div.
        const button = document.createElement("button");
        button.textContent = cityName;
        button.dataset.city = cityName;
        searchHistory.appendChild(button);
    }

    // Function to handle click on a city in the search history
    searchHistory.addEventListener("click", async function (e) {
        if (e.target.tagName === "BUTTON") {
            const cityName = e.target.dataset.city;

            try {
                const currentWeatherData = await fetchCurrentWeather(cityName, API_KEY);
                const forecastData = await fetchWeatherForecast(cityName, API_KEY);

                displayCurrentWeather(currentWeatherData);
                displayForecast(forecastData);
            } catch (error) {
                console.error("Error fetching weather data:", error);
            }
        }
    });
});
