const API_KEY = '071a4a29ba2459702dde1bdec00d68e2';
function convertCelsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
  }
  function convertFahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
  }
  let currentTemperatureCelsius = 0;
  let currentTemperatureFahrenheit = 0;
  function searchWeather() {
    const locationInput = document.getElementById('location-input').value;
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${API_KEY}&units=metric`; 
    fetch(weatherUrl)
      .then(response => response.json())
      .then(weatherData => {
        const weatherCard = document.getElementById('weather-card');
        const weatherIcon = document.getElementById('weather-icon');
        const temperature = document.getElementById('temperature');
        const description = document.getElementById('description');
        weatherIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="Weather Icon">`;    
        currentTemperatureCelsius = weatherData.main.temp;
        currentTemperatureFahrenheit = convertCelsiusToFahrenheit(currentTemperatureCelsius);      
        temperature.innerText = `${currentTemperatureCelsius.toFixed(2)} °C`;
        description.innerText = weatherData.weather[0].description;
        const geocodeUrl = `https://www.mapquestapi.com/geocoding/v1/address?key=AigtpABG9004r2E7oHZ15f0Mo0GHKfLU&location=${locationInput}`;

        // Fetch city name for the ZIP code
        fetch(geocodeUrl)
          .then(response => response.json())
          .then(geocodeData => {
            if (geocodeData.results.length > 0) {
              const city = geocodeData.results[0].locations[0].adminArea5;
              const country = geocodeData.results[0].locations[0].adminArea1;
              const locationInput = `${city}, ${country}`;
              document.getElementById('location-input').value = locationInput;
            }
          })
          .catch(error => console.log('Error:', error));
        updateWeatherChart(weatherData.hourly);
      })
      .catch(error => console.log('Error:', error));
  }
  function updateWeatherChart(hourlyData) {
    const chartLabels = hourlyData.map(hour => hour.time);
    const chartData = hourlyData.map(hour => hour.temperature);
    const ctx = document.getElementById('weather-chart').getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [{
          label: 'Temperature (°C)',
          data: chartData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  const celsiusRadio = document.getElementById('celsius');
  const fahrenheitRadio = document.getElementById('fahrenheit');
  celsiusRadio.addEventListener('change', function () {
    if (this.checked) {
        const temperatureElement = document.getElementById('temperature');
        temperatureElement.innerText = `${currentTemperatureCelsius.toFixed(2)} °C`;
      }
    });
    fahrenheitRadio.addEventListener('change', function () {
      if (this.checked) {
        const temperatureElement = document.getElementById('temperature');
        temperatureElement.innerText = `${currentTemperatureFahrenheit.toFixed(2)} °F`;
      }
    });
      