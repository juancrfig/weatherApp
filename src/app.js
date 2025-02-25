import { generateDayInformation } from "./modules/dayInformation.js";

const mainElement = document.querySelector('#mainEl');

const API_KEY = 'XVBJRDCXSCJ5Y4QCW65MXQ9MF';
const searchElement = document.querySelector('#searchInput');


searchElement.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const userResponse = searchElement.value;
        const response = await getWeatherData(userResponse);
        const data = await processData(response);
        displayInformation(data);
        
    }
} )

function displayInformation(data) {
    mainElement.innerHTML = `<h1 class="text-white text-3xl font-bold">Weather in ${data[0]}</h1>
    <p class="pt-5 pb-10 text-2xl">${data[1]}</p>`;

    const flexContainer = document.createElement('div');
    flexContainer.setAttribute('class', 'flex flex-wrap justify-center');
    mainElement.appendChild(flexContainer);

    data[2].forEach( day => {
        flexContainer.innerHTML += generateDayInformation(day.date, day.temp, day.conditions, day.tempmax, day.tempmin, day.uvindex);
    });
}


async function getWeatherData(userResponse) {
    const URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${userResponse}?key=${API_KEY}`;
    try {
        const response = await fetch(URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; 

    } catch (error){
        console.error('Error fetching weather data:', error);
        alert('No data about the city you typed :(')
        return null;
    }
}

async function processData(data) {

    const description = data.description;
    const resolvedAddress = data.resolvedAddress;

    const days = [];
    data.days.forEach(day => {
        if (days.length > 6) {
            return;
        }
        days.push(
            {
                "date": day.datetime,
                "tempmax": day.tempmax,
                "tempmin": day.tempmin,
                "temp": day.temp,
                "uvindex": day.uvindex,
                "conditions": day.conditions
            }
        );
    });
    return [resolvedAddress, description, days];
}
