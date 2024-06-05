let cityInput =document.querySelector("#city_input"),
searchBtn = document.getElementById('searchBtn'),
locationBtn = document.getElementById('locationBtn'),
api_key = '72d4bdcd7e383254f0b2bdb6ad5e9ba7',
currentWeatherCard = document.querySelectorAll('.weather-left .card')[0],
fiveDaysForecastCard = document.querySelector('.day-forecast'),
aqiCard =document.querySelectorAll('.highlights .card')[0],
sunriseCard =document.querySelectorAll('.highlights .card')[1],
humidityVal = document.querySelector('#humidityval'),
pressureVal = document.querySelector('#pressureval'),
visibilityVal = document.querySelector('#visibilityval'),
windSpeedVal = document.querySelector('#windSpeedval'),
feelsVal = document.querySelector('#feelsval'),
hourlyforcastcard = document.querySelector('.hourly-forecast'),
aqilist = ['good','fair','moderate','poor','very poor'];


function getWeatherDetails(name, lat, lon, country, state){
    let FORECASTAPI_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}`,
    WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`,
    AIR_POLU_API_URL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${api_key}`,
    days = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
    ],
    months = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'aug',
        'sep',
        'oct',
        'nov',
        'dec'
    ];


    fetch(AIR_POLU_API_URL).then(res => res.json()).then(data => {
        let {co, no, no2, o3, so2, pm2_5, pm10, nh3} = data.list[0].components;
        aqiCard.innerHTML =`
        <div class="card-head flex justify-between sm:item-center mb-6 sm:m-4 sm:flex-col sm:gap-6 sm:justify-center">
            <p class="text-xl text-center">air quality index---></p>
            
            <p class="air-index aqi-${data.list[0].main.aqi}  text-black py-1 px-2.5 rounded-2xl text-center text-sm">${aqilist[data.list[0].main.aqi - 1]}</p>
        </div>
        <div class="air-indices flex flex-col justify-between items-center">
            <i class="fa-solid fa-wind"></i>
            <div class="flex flex-row gap-4">
              <div class="item flex items-center gap-2.5 ">
                  <p class="text-sm text-center">pm2.5</p>
                  <h2 class="mt-3.5 text-3xl">${pm2_5}</h2>
              </div>
              <div class="item flex items-center gap-2.5 ">
                  <p class="text-sm text-center">PM10</p>
                  <h2 class="mt-3.5 text-3xl">${pm10}</h2>
              </div>
              <div class="item flex items-center gap-2.5 ">
                  <p class="text-sm text-center">S02</p>
                  <h2 class="mt-3.5 text-3xl">${so2}</h2>
               </div>
            </div>
            <div class="flex flex-row gap-4 justify-center items-center">
                <div class="item flex items-center gap-2.5 ">
                    <p class="text-sm text-center">co</p>
                    <h2 class="mt-3.5 text-3xl">${co}</h2>
                </div>
                <div class="item flex items-center gap-2.5 ">
                    <p class="text-sm text-center">no</p>
                    <h2 class="mt-3.5 text-3xl">${no}</h2>
                </div>
                <div class="item flex items-center gap-2.5 ">
                    <p class="text-sm text-center">no2</p>
                    <h2 class="mt-3.5 text-3xl">${no2}</h2>
                </div>
            </div>
            <div class="flex flex-row gap-4 ">
                <div class="item flex items-center gap-2.5 ">
                    <p class="text-sm text-center">nnh3</p>
                    <h2 class="mt-3.5 text-3xl">${nh3}</h2>
                </div>
                <div class="item flex items-center gap-2.5 ">
                    <p class="text-sm text-center">o3</p>
                    <h2 class="mt-3.5 text-3xl">${o3}</h2>
                </div>
            </div>
        </
        `;
    }).catch(() => {alert('air polution not fetched')})

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
        <div class="current-weather">
                        <div class="details text-center text-white uppercase text-lg">
                            <p>now</p>
                            <h2 >${(data.main.temp - 273.15).toFixed(2)}&deg;</h2>
                            <p>${data.weather[0].description}</p>
                        </div>
                        <div class="weather-icon">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" width="60px" alt="">
                        </div>
                    </div>
                    <hr>
                    <div class="card-footer text-white ">
                        <p class="text-center" ><i class="fa-regular fa-calendar"></i>${days[date.getDay()]},${date.getDate()},${months[date.getMonth()]},${date.getFullYear()}</p>
                        
                        <p class="text-center" ><i class="fa-solid fa-location-dot"></i>${name}, ${country}</p>
                    </div>
                </div>
        `;
        
        let {timezone, visibility } = data,
        {humidity, pressure, feels_like} = data.main,
        {speed} = data.wind;
        humidityVal.innerHTML = `${humidity}%`;
        pressureVal.innerHTML = `${pressure}hpa`;
        visibilityVal.innerHTML = `${visibility/1000}km`;
        windSpeedVal.innerHTML = `${speed}m/s`;
        feelsVal.innerHTML = `${(feels_like - 273.15).toFixed(2)}&deg;c`;
    }).catch(() => {
        alert('failed to fetch current weather');
    });

    fetch(FORECASTAPI_URL).then((res) => res.json()).then(data => {
    let hourlyForecast = data.list;
    hourlyforcastcard.innerHTML = '';
    for(i=0; i <= 7; i++){
        let hrForecastDate = new Date(hourlyForecast[i].dt_txt);
        let hr = hrForecastDate.getHours();
        let a = 'pm';
        if(hr < 12) a = 'am';
        if(hr == 0) hr = 12;
        if(hr > 12) hr = hr - 12;
        hourlyforcastcard.innerHTML += `
            <div class="card p-4 rounded-2xl m-4 text-center">
                <p class="text-sm ">${hr}${a}</p>
                <img src="https://openweathermap.org/img/wn/${hourlyForecast[i].weather[0].icon}.png" alt="">
                <p class="text-sm ">${(hourlyForecast[i].main.temp - 273.15).toFixed(2)}&deg;c</p>
            </div>
        `;
    }
    let uniqueForecastDays = [];
    let fiveDayForecast = data.list.filter(forecast => {
        let forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqueForecastDays.includes(forecastDate)){
            return uniqueForecastDays.push(forecastDate);
        }
    });
    fiveDaysForecastCard.innerHTML = '';
    for(i=1;i< fiveDayForecast.length; i++){
        let date = new Date(fiveDayForecast[i].dt_txt);
        fiveDaysForecastCard.innerHTML += `
            <div class="forecast-item grid grid-cols-3 justify-center items-center m-4 text-white ">
                <div class="icon-wrapper flex items-center justify-center">
                    <img src="https://openweathermap.org/img/wn/${fiveDayForecast[i].weather[0].icon}.png"   alt="">
                    <span>${(fiveDayForecast[i].main.temp - 273.15).toFixed(2)}&deg;c</span>
                </div>
                <p class="text-center" >--${date.getDate()} ${months[date.getMonth()]}</p>
                <p class="text-center" >${days[date.getDay()]}</p>
            </div>
        `;
    }
   }).catch(()=>{
        alert('failed to fetch weather forecast');
    });
}

function getcitycoordinates(){
    let cityName = cityInput.value.trim();
    cityInput.value = '';
    if(!cityName) return;
    let GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`;
    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        let {name, lat, lon, country, state} = data[0];
        getWeatherDetails(name, lat, lon, country, state);
    }).catch(() => {
        alert(`failed to get coordinates of ${cityName}`);
        cityInput.value='type valid city';
    })
    addCityToDropdown(cityName);
}

function getusercoordinates(){
    navigator.geolocation.getCurrentPosition(position => {
        let {latitude, longitude} = position.coords;
        let REVERSE_GEOCODING_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${api_key}
        `;

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data => {
            let {name, country, state} = data[0];
            getWeatherDetails(name, latitude, longitude, country, state);
        }).catch(() => {
            alert('failed to fetch user coordinates')
        })
    }, error => {
        if(error.code === error.PERMISSION_DENIED){
            alert('location permission denied.  grant permission to continue')
        }
    })
}

searchBtn.addEventListener('click',getcitycoordinates);
locationBtn.addEventListener('click',getusercoordinates);
cityInput.addEventListener('keyup', e => e.key === 'enter' && getcitycoordinates());
window.addEventListener('load',getusercoordinates);


document.getElementById('recentCitiesButton').addEventListener('click', () => {
    const recentCitiesList = document.getElementById('recentCitiesList');
    recentCitiesList.classList.toggle('hidden');
});


// Hide dropdown 
document.addEventListener('click', (event) => {
    const recentCitiesList = document.getElementById('recentCitiesList');
    const recentCitiesButton = document.getElementById('recentCitiesButton');
    if (!recentCitiesList.contains(event.target) && !recentCitiesButton.contains(event.target)) {
        recentCitiesList.classList.add('hidden');
    }
});
// Add city to dropdown
function addCityToDropdown(city) {
    const recentCitiesButton = document.getElementById('recentCitiesButton');
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!cities.includes(city)) {
        cities.unshift(city); 
        if (cities.length > 5) cities.pop(); 
        localStorage.setItem('recentCities', JSON.stringify(cities));
    }
    recentCitiesButton.classList.remove('hidden');
    renderRecentCities();
}


// Render recent cities in the dropdown
function renderRecentCities() {
    const recentCitiesList = document.getElementById('recentCitiesList');
    recentCitiesList.innerHTML = '';
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    cities.forEach(city => {
        const cityItem = document.createElement('div');
        cityItem.className = 'p-2 flex justify-between items-center hover:bg-gray-200';
        cityItem.innerHTML = `
            <span class="selectcity cursor-pointer">${city}</span>
            <button class="remove-city bg-red-500 text-white text-lg px-2 py-1 rounded ml-2">❌</button>
        `;
        cityItem.querySelector('.selectcity').addEventListener('click', () => {
            getcitycoordinates(`${city}`);
            cityInput.value=`${city}`;
            recentCitiesList.classList.add('hidden');
        });
        cityItem.querySelector('.remove-city').addEventListener('click', (e) => {
            e.stopPropagation();
            removeCityFromDropdown(city);
        });
        recentCitiesList.appendChild(cityItem);
    });
}

// Remove city from dropdown
function removeCityFromDropdown(city) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    cities = cities.filter(c => c !== city);
    localStorage.setItem('recentCities', JSON.stringify(cities));
    renderRecentCities();
}
