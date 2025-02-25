/* eslint-disable no-unused-vars */
const API_KEY = 'XVBJRDCXSCJ5Y4QCW65MXQ9MF';
const URL_FORMAT = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/[location]?key=${API_KEY}`;
const urlLondon = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/London, UK?key=${API_KEY}`;


async function getWeatherData() {
    try {
        const response = await fetch(urlLondon);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data; 

    } catch (error){
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function consoleData() {
    const data = await getWeatherData();
    console.log(data);
}

consoleData();