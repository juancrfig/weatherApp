export function generateDayInformation(date, temp, conditions, tempmax, tempmin, uvindex, unit) {
  const tempSymbol = unit === 'C' ? '°C' : '°F';
  return `
    <div class="weather-card bg-white shadow-lg rounded-lg p-4 m-2 w-fit sm:w-72 flex flex-col flex-shrink-0 transition-transform transform hover:scale-105">
      <h3 class="text-lg font-semibold text-gray-800 mb-2 date">${date}</h3>
      <div class="flex items-center justify-between mb-3">
        <span class="text-3xl font-bold text-blue-600 temp">${temp}${tempSymbol}</span>
        <span class="text-sm text-gray-500 conditions">${conditions}</span>
      </div>
      <div class="flex justify-between text-sm text-gray-600 mb-3">
        <span>Max: <span class="font-medium tempmax">${tempmax}${tempSymbol}</span></span>
        <span>Min: <span class="font-medium tempmin">${tempmin}${tempSymbol}</span></span>
      </div>
      <div class="flex items-center text-sm">
        <span class="text-gray-700">UV Index:</span>
        <span class="ml-2 px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs uvindex">${uvindex}</span>
      </div>
    </div>
  `;
}