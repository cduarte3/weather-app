const key = process.env.GEO_KEY;
const weatherKey = process.env.WEATHER_KEY;
let QUERY = document.getElementById("city").value;

function API(queryVal) {
  return fetch(
    `http://api.weatherapi.com/v1/current.json?key=${key}&q=${queryVal}&aqi=no`
  )
    .then((response) => {
      if (response.ok) {
        return response.json(); // Return the parsed JSON data
      } else {
        throw new Error("API request failed");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function getCoordinates(queryVal) {
  return fetch(`https://geocode.maps.co/search?q=${queryVal}&api_key=${key}`)
    .then((response) => {
      if (response.ok) {
        return response.json(); // Return the parsed JSON data
      } else {
        throw new Error("API request failed");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

const submitForm = document.getElementById("submit");
const confirmCity = document.getElementById("confirm");
const resetForm = document.getElementById("reset");

submitForm.addEventListener("click", function (event) {
  event.preventDefault();
  const queryVal = document.getElementById("city").value;
  weatherContainer.innerHTML = "";

  getCoordinates(queryVal).then((apiVal) => {
    console.log(apiVal);
    const accordionElement = document.getElementById("accordion");
    accordionElement.innerHTML = "";
    if (apiVal.length === 0) {
      const accordionItem = document.createElement("div");
      accordionItem.classList.add("accordion-item");
      const accordionHeader = document.createElement("div");
      accordionHeader.classList.add("accordion-header");
      accordionHeader.innerHTML = `<h3 class="accordion-title">No results found - Invalid City</h3>`;
      accordionItem.appendChild(accordionHeader);
      accordionElement.appendChild(accordionItem);
    } else {
      apiVal.forEach((item) => {
        console.log(item);
        const accordionItem = document.createElement("div");
        accordionItem.classList.add("accordion-item");
        const accordionHeader = document.createElement("div");
        accordionHeader.classList.add("accordion-header");
        const confirmButton = document.createElement("input");
        confirmButton.type = "submit";
        confirmButton.value = " confirm ";
        confirmButton.id = "confirm";
        confirmButton.addEventListener("click", function (event) {
          event.preventDefault();
          getWeather(item.lat, item.lon).then((data) => {
            setWeather(data, item.display_name);
          });
        });
        accordionHeader.innerHTML = `
      <h2 class="accordion-title">${item.display_name}</h2>`;
        accordionHeader.appendChild(confirmButton);
        const hrElement = document.createElement("hr");
        accordionHeader.appendChild(hrElement);
        accordionItem.appendChild(accordionHeader);
        accordionElement.appendChild(accordionItem);
      });
    }
  });
});

resetForm.addEventListener("click", function (event) {
  event.preventDefault();
  reset();
});

function reset() {
  const accordionElement = document.getElementById("accordion");
  accordionElement.innerHTML = "";
  document.getElementById("city").value = "";

  weatherContainer.innerHTML = "";
}

function getWeather(lat, long) {
  QUERY = document.getElementById("city").value;
  reset();
  return fetch(
    `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${weatherKey}&units=metric`
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("API request failed");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

const weatherContainer = document.getElementById("weatherContainer");

function setWeather(data, displayName) {
  console.log(data);
  weatherContainer.innerHTML = "";
  const containerTitle = document.createElement("div");
  containerTitle.classList.add("containerTitle");
  containerTitle.innerHTML = `<p>${displayName}</p>`;
  //console.log("Query: ", QUERY);
  weatherContainer.appendChild(containerTitle);
  const scrollable = document.createElement("div");
  scrollable.classList.add("scrollable");
  const scrollableRow = document.createElement("div");
  scrollableRow.classList.add("scrollableRow");

  data.list.forEach((item) => {
    const scrollableItem = document.createElement("div");
    scrollableItem.classList.add("col-xs-4");
    scrollableItem.innerHTML = `
      <p>${item.dt_txt}</p>
      <img src="http://openweathermap.org/img/w/${
        item.weather[0].icon
      }.png" alt="weather icon">
      <p>Temperature: ${item.main.temp}°C</p>
      <p>Feels like: ${item.main.feels_like}°C</p>
      <p>Humidity: ${item.main.humidity}%</p>
      <p>Wind speed: ${Math.round(item.wind.speed * 3.6)} km/h</p>
      <p>Weather: ${item.weather[0].description}</p>`;
    scrollableRow.appendChild(scrollableItem);
  });

  scrollable.appendChild(scrollableRow);
  weatherContainer.appendChild(scrollable);
}