// alert("script is working...")

const API_KEY = '21ca5ac40fe04d49bd0142942251606';
const BASE_URL = 'https://api.weatherapi.com/v1';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.querySelector('.city-name');
const weatherDesc = document.querySelector('.weather-desc');
const weatherIcon = document.querySelector('.weather-icon-large i');
const temperature = document.querySelector('.temperature');
const feelsLike = document.querySelector('.feels-like');
const chanceOfRain = document.querySelector('.chance-of-rain');
const windSpeed = document.querySelector('.wind-speed');
const uvIndex = document.querySelector('.uv-index');
const hourlyForecast = document.querySelector('.hourly-forecast');
const weeklyForecast = document.querySelector('.weekly-forecast');

const weatherIcons = {
    'Sunny': 'fa-sun',
    'Clear': 'fa-moon',
    'Partly cloudy': 'fa-cloud-sun',
    'Cloudy': 'fa-cloud',
    'Overcast': 'fa-cloud',
    'Mist': 'fa-smog',
    'Patchy rain possible': 'fa-cloud-rain',
    'Patchy snow possible': 'fa-snowflake',
    'Patchy sleet possible': 'fa-snowflake',
    'Patchy freezing drizzle possible': 'fa-snowflake',
    'Thundery outbreaks possible': 'fa-bolt',
    'Blowing snow': 'fa-snowflake',
    'Blizzard': 'fa-snowflake',
    'Fog': 'fa-smog',
    'Freezing fog': 'fa-smog',
    'Patchy light drizzle': 'fa-cloud-rain',
    'Light drizzle': 'fa-cloud-rain',
    'Freezing drizzle': 'fa-snowflake',
    'Heavy freezing drizzle': 'fa-snowflake',
    'Patchy light rain': 'fa-cloud-rain',
    'Light rain': 'fa-cloud-rain',
    'Moderate rain at times': 'fa-cloud-showers-heavy',
    'Moderate rain': 'fa-cloud-showers-heavy',
    'Heavy rain at times': 'fa-cloud-showers-heavy',
    'Heavy rain': 'fa-cloud-showers-heavy',
    'Light freezing rain': 'fa-snowflake',
    'Moderate or heavy freezing rain': 'fa-snowflake',
    'Light sleet': 'fa-snowflake',
    'Moderate or heavy sleet': 'fa-snowflake',
    'Patchy light snow': 'fa-snowflake',
    'Light snow': 'fa-snowflake',
    'Patchy moderate snow': 'fa-snowflake',
    'Moderate snow': 'fa-snowflake',
    'Patchy heavy snow': 'fa-snowflake',
    'Heavy snow': 'fa-snowflake',
    'Ice pellets': 'fa-snowflake',
    'Light rain shower': 'fa-cloud-rain',
    'Moderate or heavy rain shower': 'fa-cloud-showers-heavy',
    'Torrential rain shower': 'fa-cloud-showers-heavy',
    'Light sleet showers': 'fa-snowflake',
    'Moderate or heavy sleet showers': 'fa-snowflake',
    'Light snow showers': 'fa-snowflake',
    'Moderate or heavy snow showers': 'fa-snowflake',
    'Light showers of ice pellets': 'fa-snowflake',
    'Moderate or heavy showers of ice pellets': 'fa-snowflake',
    'Patchy light rain with thunder': 'fa-bolt',
    'Moderate or heavy rain with thunder': 'fa-bolt',
    'Patchy light snow with thunder': 'fa-bolt',
    'Moderate or heavy snow with thunder': 'fa-bolt'
};

searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

async function handleSearch() {
    const city = cityInput.value.trim();
    if (!city) return;
    try {
        const currentWeather = await fetchWeatherData(city);
        updateCurrentWeather(currentWeather);
        const forecast = await fetchForecastData(city);
        updateForecast(forecast);
    } catch (error) {
        console.error('Error fetching', error);
        alert('Error fetching');
    }
}

async function fetchWeatherData(city) {
    const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${city}&aqi=no`);
    if (!response.ok) throw new Error('Weather data fetch failed');
    return await response.json();
}

async function fetchForecastData(city) {
    const response = await fetch(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`);
    if (!response.ok) throw new Error('Forecast data fetch failed');
    return await response.json();
}

function updateCurrentWeather(data) {
    const current = data.current;
    const location = data.location;

    cityName.textContent = location.name;
    temperature.textContent = Math.round(current.temp_c);
    weatherDesc.textContent = current.condition.text;
    weatherIcon.className = `fas ${weatherIcons[current.condition.text] || 'fa-cloud'}`;

    feelsLike.textContent = `${Math.round(current.feelslike_c)}°`;
    chanceOfRain.textContent = `${current.cloud}%`;
    windSpeed.textContent = `${current.wind_kph} km/h`;
    uvIndex.textContent = current.uv;
}

function updateForecast(data) {
    const hourly = data.forecast.forecastday[0].hour;
    hourlyForecast.innerHTML = hourly
        .filter((_, index) => index % 3 === 0)
        .map(hour => `
            <div class="hourly-item">
                <div class="hour">${new Date(hour.time).getHours()}:00</div>
                <div class="hourly-icon"><i class="fas ${weatherIcons[hour.condition.text] || 'fa-cloud'}"></i></div>
                <div class="hourly-temp">${Math.round(hour.temp_c)}°</div>
            </div>
        `).join('');

    weeklyForecast.innerHTML = data.forecast.forecastday
        .map(day => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const isToday = date.toDateString() === new Date().toDateString();
            
            return `
                <div class="weekly-item">
                    <div class="weekly-day">${isToday ? 'Today' : dayName}</div>
                    <div class="weekly-icon">
                        <i class="fas ${weatherIcons[day.day.condition.text] || 'fa-cloud'}"></i>
                    </div>
                    <div class="weekly-details">
                        <div class="weekly-desc">${day.day.condition.text}</div>
                        <div class="weekly-temp-range">
                            <span class="max-temp">${Math.round(day.day.maxtemp_c)}°</span>
                            <span class="min-temp">${Math.round(day.day.mintemp_c)}°</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
}

handleSearch('London');


const CACHE_DURATION = 10 * 60 * 1000;
const weatherCache = new Map();
const suggestionsCache = new Map();

const suggestionsContainer = document.createElement('div');
suggestionsContainer.className = 'suggestions-container';
document.body.appendChild(suggestionsContainer);

let searchTimeout;
cityInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(searchTimeout);
    
    if (!query) {
        suggestionsContainer.classList.remove('active');
        return;
    }
    

    const searchBox = document.querySelector('.top-search');
    const searchBoxRect = searchBox.getBoundingClientRect();
    suggestionsContainer.style.top = `${searchBoxRect.bottom + 5}px`;
    suggestionsContainer.style.left = `${searchBoxRect.left}px`;
    
    searchTimeout = setTimeout(async () => {
        try {
            const response = await fetch(`${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('Search failed');
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                suggestionsContainer.innerHTML = data
                    .map(city => `
                        <div class="suggestion-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <div class="city-name">${city.name}</div>
                                <div class="country">${city.country}</div>
                            </div>
                        </div>
                    `).join('');
                
                suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
                    item.addEventListener('click', () => {
                        const city = data[index];
                        cityInput.value = `${city.name}, ${city.country}`;
                        suggestionsContainer.classList.remove('active');
                        handleSearch();
                    });
                });
                
                suggestionsContainer.classList.add('active');
            } else {
                suggestionsContainer.innerHTML = `
                    <div class="suggestion-item">
                        <i class="fas fa-exclamation-circle"></i>
                        <div>
                            <div class="city-name">No cities found</div>
                        </div>
                    </div>
                `;
                suggestionsContainer.classList.add('active');
            }
        } catch (error) {
            console.error('Error fetching', error);
            suggestionsContainer.innerHTML = `
                <div class="suggestion-item">
                    <i class="fas fa-exclamation-circle"></i>
                    <div>
                        <div class="city-name">Error loading suggestions</div>
                    </div>
                </div>
            `;
            suggestionsContainer.classList.add('active');
        }
    }, 300);
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.top-search') && !e.target.closest('.suggestions-container')) {
        suggestionsContainer.classList.remove('active');
    }
});

window.addEventListener('load', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                handleSearchByCoords(latitude, longitude);
            },
            (error) => {
                console.error('Error fetching', error);
                handleSearch('London');
            }
        );
    } else {
        handleSearch('London');
    }
});

async function fetchWeatherDataWithCache(city) {
    if (!city) {
        showError('city name');
        return;
    }

    const cachedWeather = weatherCache.get(city);
    if (cachedWeather && Date.now() - cachedWeather.timestamp < CACHE_DURATION) {
        updateCurrentWeather(cachedWeather.data);
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no`);
        
        if (!response.ok) {
            if (response.status === 401) {
                showError('el API mesh sa7eb 7aga');
                return;
            }
            if (response.status === 429) {
                showError('Too many requests');
                return;
            }
            if (response.status === 404) {
                showError('City not found');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.location) {
            showError('Error fetching');
            return;
        }
        weatherCache.set(city, {
            data: data,
            timestamp: Date.now()
        });

        updateCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching', error);
        showError('Error fetching');
    }
}

async function handleSearchByCoords(lat, lon) {
    const cacheKey = `${lat},${lon}`;
    const cachedWeather = weatherCache.get(cacheKey);
    
    if (cachedWeather && Date.now() - cachedWeather.timestamp < CACHE_DURATION) {
        updateCurrentWeather(cachedWeather.data);
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=no`);
        
        if (!response.ok) {
            if (response.status === 401) {
                showError('API key Festek');
                return;
            }
            if (response.status === 429) {
                showError('Too many requests.');
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.location) {
            showError('Error fetching');
            return;
        }

        weatherCache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });

        updateCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching', error);
        showError('Error fetching weather data');
    }
}

function showError(message) {
    cityName.textContent = 'Error';
    temperature.textContent = '--°C';
    weatherDesc.textContent = message;
    windSpeed.textContent = '-- km/h';
    chanceOfRain.textContent = '--%';
    feelsLike.textContent = '--°C';
    uvIndex.textContent = '--';
}

function showLoading() {
    cityName.textContent = 'Loading...';
    temperature.textContent = '--°C';
    weatherDesc.textContent = 'Loading weather data...';
    windSpeed.textContent = '-- km/h';
    chanceOfRain.textContent = '--%';
    feelsLike.textContent = '--°C';
    uvIndex.textContent = '--';
}

const style = document.createElement('style');
style.textContent = `
    .suggestions-container {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 0 0 15px 15px;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        margin-top: 5px;
        z-index: 1000 !important;
    }

    .suggestion-item {
        padding: 10px 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .suggestion-item:hover {
        background: rgba(255, 255, 255, 0.2);
    }

    .suggestion-item i {
        color: var(--secondary-color);
    }

    .search-box {
        position: relative;
    }

    .suggestions-container::-webkit-scrollbar {
        width: 8px;
    }

    .suggestions-container::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
    }

    .suggestions-container::-webkit-scrollbar-thumb {
        background: var(--secondary-color);
        border-radius: 4px;
    }
`;
document.head.appendChild(style);
