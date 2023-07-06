import conditions from "./conditions.js";

const apiKey = "741eef21717043149f391816230607";

const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

const header = document.querySelector(".header");
form.onsubmit = async function (e) {
    e.preventDefault();
    let city = input.value.trim();
    const data = await getWeather(city);
    if (data.error) {
        removeCard();

        showError(data.error.message);
    } else {
        removeCard();

        const info = conditions.find(function (obj) {
            if (obj.code === data.current.condition.code) return true;
        });
        console.log(info);
        // const fileName = data.current.is_day ? info.day : info.night;

        const filePath =
            "./img/" +
            (data.current.is_day ? "day" : "night") +
            "/" +
            info.icon +
            ".png";
        const imgPath = filePath;
        console.log(filePath);
        const weatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            condition: data.current.is_day
                ? info.languages[23]["day_text"]
                : info.languages[23]["night_text"],
            imgPath: imgPath,
            feelslike: data.current.feelslike_c,
            time: data.current.last_updated.slice(10),
            wind_s: data.current.wind_kph,
            wind_dir: data.current.wind_dir,
            pressure: data.current.pressure_mb,
            uv: data.current.uv,
            humidity: data.current.humidity,
            cloud: data.current.cloud,
        };
        showCard(weatherData);
        localStorage.setItem("weatherData", JSON.stringify(weatherData));
    }
};

window.onload = function () {
    const weatherData = localStorage.getItem("weatherData");
    if (weatherData) {
        const parsedData = JSON.parse(weatherData);
        showCard(parsedData);
    }
};

function removeCard() {
    const prevCard = document.querySelector(".card");
    if (prevCard) prevCard.remove();
}

function showError(errorMessage) {
    const html = `<div class='card'>${errorMessage}</div>`;
    header.insertAdjacentHTML("afterend", html);
}

function showCard({
    name,
    country,
    temp,
    condition,
    imgPath,
    feelslike,
    time,
    wind_s,
    wind_dir,
    pressure,
    uv,
    humidity,
    cloud,
}) {
    const html = `<div class="card">
    <div class="location">
    <h2 class="card-city">${name}<span>${country}</span></h2>
    <div class="card-time">${time}</div>
    </div>
    <div class="card-weather">
        <div class="card-value">${temp}<sup>°c</sup></div>
        <img class="card-image" src="${imgPath}" alt="Weather">
    </div>
    <div class="feelslike"><b>Чувствуется как: </b>${feelslike}<sup>°c</sup></div>
    <div class="card-description">${condition}</div>
    <ul class="params">
            <li class="params-item">
                <img src="./img/storm.png" alt="">
                <span>Скорость ветра: ${wind_s}</span>
            </li>
            <li class="params-item">
                <img src="./img/cardinal-points.png" alt="">
                <span>Направление ветра: ${wind_dir}</span>

            </li>
            <li class="params-item">
                <img src="./img/pressure-gauge.png" alt="">
                <span>Давление в миллибарах: ${pressure}</span>

            </li>
            <li class="params-item">
                <img src="./img/humidity.png" alt="">
                <span>Влажность: ${humidity} %</span>

            </li>
            <li class="params-item">
                <img src="./img/uv-index.png" alt="">
                <span>UV-index: ${uv}</span>

            </li>
            <li class="params-item">
                <img src="./img/sun-partially-covered-by-a-cloud.png" alt="">
                <span>Облачность: ${cloud} %</span>

            </li>
        </ul>
    </div>`;

    header.insertAdjacentHTML("afterend", html);
}

async function getWeather(city) {
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
}
