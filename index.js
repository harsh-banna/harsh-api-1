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
        <div class="card-head flex justify-between mb-2.5">
            <p class="text-sm">air quality index</p>
            <p class="air-index aqi-${data.list[0].main.aqi}  text-black py-1 px-2.5 rounded-2xl text-sm">${aqilist[data.list[0].main.aqi - 1]}</p>
        </div>
        <div class="air-indices grid grid-cols-4 items-center ">
            <i class="fa-solid fa-wind"></i>
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
            <div class="item flex items-center gap-2.5 ">
                <p class="text-sm text-center">nnh3</p>
                <h2 class="mt-3.5">${nh3}</h2>
            </div>
            <div class="item flex items-center gap-2.5 ">
                <p class="text-sm text-center">o3</p>
                <h2 class="mt-3.5 text-3xl">${o3}</h2>
            </div>
        </
        `;
    }).catch(() => {alert('air polution not fetched')})

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {
        let date = new Date();
        currentWeatherCard.innerHTML = `
        <div class="current-weather">
                        <div class="details">
                            <p>now</p>
                            <h2>${(data.main.temp - 273.15).toFixed(2)}&deg;</h2>
                            <p>${data.weather[0].description}</p>
                        </div>
                        <div class="weather-icon">
                            <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" width="60px" alt="">
                        </div>
                    </div>
                    <hr>
                    <div class="card-footer">
                        <p><i class="fa-regular fa-calendar"></i>${days[date.getDay()]},${date.getDate()},${months[date.getMonth()]},${date.getFullYear()}</p>
                        <p><i class="fa-solid fa-location-dot"></i>${name}, ${country}</p>
                    </div>
                </div>
        `;
        // let {sunrise, sunset} = data.sys,
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
        <div class="forecast-item grid grid-cols-3 items-center m-4">
          <div class="icon-wrapper flex items-center">
            <img src="https://openweathermap.org/img/wn/${fiveDayForecast[i].weather[0].icon}.png"   alt="">
            <span>${(fiveDayForecast[i].main.temp - 273.15).toFixed(2)}&deg;c</span>
          </div>
            <p>--${date.getDate()} ${months[date.getMonth()]}</p>
            <p>${days[date.getDay()]}</p>
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
    })
    
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

// function loadCityHistory() {
//     let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];
//     let historyDropdown = document.querySelector("#history");
//     let dropdownContent = <select class="form-select mb-3" onchange="searchCity(this.value)">;
  
//     for (let i = 0; i < cityHistory.length; i++) {
//       const citY = cityHistory[i];
//       dropdownContent += <option value="${citY}">${citY}</option>;
//     }

//     dropdownContent += </select>;
//     historyDropdown.innerHTML = dropdownContent;
//   }
  
//   loadCityHistory();



//  function loadcitY (){
//     let citYHistory = JSON.parse(localStorage.getItem("cityHistory")) || [] ;
//     let dropdown = document.querySelector("select");
//     for(i=0; i<citYHistory.length;i++){
//         const inputcity = citYHistory[i];
//         dropdown.innerHTML += `<option value="${inputcity}">${inputcity}</option>`;
//     }

     

//   }



//   function addCityToDropdown(city) {
//     const recentCitiesButton = document.getElementById('recentCitiesButton');
//     let cities = JSON.parse(localStorage.getItem('task')) || [];
//     if (!cities.includes(city)) {
//         cities.push(city);
//         if (cities.length > 5) cities.shift();
//         localStorage.setItem('recentCities', JSON.stringify(cities));
//     }