const apiKey = "741eef21717043149f391816230607";

const form = document.querySelector("#form");
const input = document.querySelector("#inputCity");

const header = document.querySelector(".header");

form.onsubmit = function (e) {
    e.preventDefault();
    let city = input.value.trim();

    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;

    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data.error) {
                const prevCard = document.querySelector(".card");
                if (prevCard) prevCard.remove();

                const html = `<div class='card'>${data.error.message}</div>`;
                header.insertAdjacentHTML("afterend", html);
            } else {
                const prevCard = document.querySelector(".card");
                if (prevCard) prevCard.remove();

                const html = `<div class="card">
                <h2 class="card-city">${data.location.name}<span>${data.location.country}</span></h2>
                <div class="card-weather">
                    <div class="card-value">${data.current.temp_c}<sup>°c</sup></div>
                    <img class="card-image" src="./img/cloudy.png" alt="Weather">
                </div>
    
                <div class="card-description">${data.current.condition.text}</div>
                </div>`;

                header.insertAdjacentHTML("afterend", html);
            }
        });
};
