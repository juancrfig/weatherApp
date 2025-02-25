import { generateDayInformation } from "./modules/dayInformation.js";

const mainElement = document.querySelector('#mainEl');
const searchElement = document.querySelector('#searchInput');
const API_KEY = 'XVBJRDCXSCJ5Y4QCW65MXQ9MF';

const tempToggle = document.querySelector('#temp-toggle');
let unit = localStorage.getItem('unit') || 'F'; // Default to Fahrenheit
tempToggle.checked = unit === 'C'; // Set initial state

// Toggle event listener
tempToggle.addEventListener('change', () => {
  unit = tempToggle.checked ? 'C' : 'F';
  localStorage.setItem('unit', unit);
  const weatherData = JSON.parse(localStorage.getItem('weatherData'));
  if (weatherData) {
    displayInformation(weatherData); // Re-render with new units
  }
});

// Temperature conversion function
function convertTemp(temp) {
  if (unit === 'C') {
    return ((temp - 32) * (5 / 9)).toFixed(1);
  }
  return temp;
}

// Search event listener
searchElement.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    const userResponse = searchElement.value;
    const response = await getWeatherData(userResponse);
    if (response.error) {
      showError(response.error);
    } else {
      const data = await processData(response);
      displayInformation(data);
    }
  }
});

// Display weather data and update background
function displayInformation(data) {
    const mainElement = document.getElementById('mainEl');
    mainElement.innerHTML = ''; // This removes #welcomeMessage
    const convertedData = {
      0: data[0], // City name
      1: data[1], // Weather description
      2: data[2].map(day => ({
        ...day,
        temp: convertTemp(day.temp),
        tempmax: convertTemp(day.tempmax),
        tempmin: convertTemp(day.tempmin)
      }))
    };
  
    mainElement.innerHTML = `<h1 class="text-white text-3xl font-bold">Weather in ${convertedData[0]}</h1>
      <p class="pt-5 pb-10 text-2xl">${convertedData[1]}</p>`;
  
    const flexContainer = document.createElement('div');
    flexContainer.setAttribute('class', 'flex flex-wrap justify-center');
    mainElement.appendChild(flexContainer);
  
    // Use convertedData[2] with converted temperatures and pass the unit
    convertedData[2].forEach(day => {
      flexContainer.innerHTML += generateDayInformation(
        day.date,
        day.temp,
        day.conditions,
        day.tempmax,
        day.tempmin,
        day.uvindex,
        unit // Assuming 'unit' is a global variable like 'C' or 'F'
      );
    });
  
    // Change background based on first day's weather
    const firstDayConditions = data[2][0].conditions.toLowerCase();
    if (firstDayConditions.includes('rain')) {
      document.body.className = 'h-screen bg-rainy';
    } else if (firstDayConditions.includes('cloudy')) {
      document.body.className = 'h-screen bg-cloudy';
    } else if (firstDayConditions.includes('clear')) {
      document.body.className = 'h-screen bg-sunny';
    } else {
      document.body.className = 'h-screen bg-windy';
    }
  }
// Fetch weather data with error handling
async function getWeatherData(userResponse) {
  const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userResponse}?key=${API_KEY}`;
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return { error: error.message };
  }
}

// Process API data
async function processData(data) {
  const description = data.description;
  const resolvedAddress = data.resolvedAddress;
  const days = [];
  data.days.forEach(day => {
    if (days.length > 6) return;
    days.push({
      "date": day.datetime,
      "tempmax": day.tempmax,
      "tempmin": day.tempmin,
      "temp": day.temp,
      "uvindex": day.uvindex,
      "conditions": day.conditions
    });
  });
  return [resolvedAddress, description, days];
}

// Show error message below search input
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'alert alert-error shadow-lg mt-2';
  errorDiv.innerHTML = `
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    </div>
  `;
  const searchBox = document.querySelector('.searchBox');
  searchBox.appendChild(errorDiv);
  setTimeout(() => errorDiv.remove(), 3000); // Remove after 3 seconds
}