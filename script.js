// Step 1: Select HTML elements
const cityInput = document.querySelector("#cityInput");
const searchBtn = document.querySelector("#searchBtn");
const cityName = document.querySelector("#cityName");

const temperatureElement = document.querySelector("#temperature");
const humidityElement = document.querySelector("#humidity");
const windSpeedElement = document.querySelector("#windSpeed");
const weatherCondition = document.querySelector("#weatherCondition");
const weatherIcon = document.querySelector("#weatherIcon");
const message = document.querySelector("#message");


// Step 2: Search button click event
searchBtn.addEventListener("click", getWeather);


// Step 3: Also search when Enter key is pressed
cityInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        getWeather();
    }
});


// Step 4: Main weather function
async function getWeather() {

    const city = cityInput.value.trim();

    // Check empty input
    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    // Show loading state
    searchBtn.disabled = true;
    searchBtn.textContent = "Loading...";
    message.textContent = "";
    cityName.textContent = "Loading weather...";

    try {

        // Step 5: Get city coordinates
        const geocodingUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geocodingUrl);

        if (!geoResponse.ok) {
            throw new Error("Unable to search for this city.");
        }

        const geoData = await geoResponse.json();

        // Check if city exists
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try another name.");
        }

        const location = geoData.results[0];

        const latitude = location.latitude;
        const longitude = location.longitude;


        // Step 6: Fetch current weather
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
            throw new Error("Weather information is unavailable.");
        }


        // Step 7: Extract weather values
        const current = weatherData.current;

        const temperature = current.temperature_2m;
        const humidity = current.relative_humidity_2m;
        const windSpeed = current.wind_speed_10m;
        const weatherCode = current.weather_code;


        // Step 8: Convert weather code to condition and icon
        let condition;
        let icon;

        if (weatherCode === 0) {
            condition = "Clear Sky";
            icon = "☀️";

        } else if (weatherCode === 1) {
            condition = "Mainly Clear";
            icon = "🌤️";

        } else if (weatherCode === 2) {
            condition = "Partly Cloudy";
            icon = "⛅";

        } else if (weatherCode === 3) {
            condition = "Overcast";
            icon = "☁️";

        } else if ([45, 48].includes(weatherCode)) {
            condition = "Fog";
            icon = "🌫️";

        } else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
            condition = "Drizzle";
            icon = "🌦️";

        } else if ([61, 63, 65, 66, 67].includes(weatherCode)) {
            condition = "Rain";
            icon = "🌧️";

        } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
            condition = "Snow";
            icon = "❄️";

        } else if ([80, 81, 82].includes(weatherCode)) {
            condition = "Rain Showers";
            icon = "🌦️";

        } else if ([95, 96, 99].includes(weatherCode)) {
            condition = "Thunderstorm";
            icon = "⛈️";

        } else {
            condition = "Unknown Condition";
            icon = "🌡️";
        }


        // Step 9: Display weather information
        cityName.textContent =
            `${location.name}${location.country ? ", " + location.country : ""}`;

        temperatureElement.textContent = `${temperature} °C`;
        humidityElement.textContent = `💧 Humidity: ${humidity}%`;
        windSpeedElement.textContent = `💨 Wind Speed: ${windSpeed} km/h`;

        weatherCondition.textContent = condition;
        weatherIcon.textContent = icon;

        message.textContent = "";


    } catch (error) {

        // Step 10: Handle errors
        console.error("Weather App Error:", error);

        cityName.textContent = "Weather unavailable";
        message.textContent = error.message ||
            "Something went wrong. Please try again.";


    } finally {

        // Step 11: Restore the button
        searchBtn.disabled = false;
        searchBtn.textContent = "Search";
    }
}



