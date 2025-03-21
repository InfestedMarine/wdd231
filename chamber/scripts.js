document.getElementById("copyright-year").textContent = new Date().getFullYear();

document.getElementById("last-modified").textContent = document.lastModified;

const apiKey = '1762636b66ec64a7a90fb7c7c417e489'; // Replace with your actual API key
const city = 'Manila'; // Change to the chamber's location
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

document.addEventListener("DOMContentLoaded", () => {
    fetchWeather();
    fetchForecast();
    fetchBusinesses();
});

async function fetchWeather() {
    try {
        const response = await fetch(weatherUrl);
        const data = await response.json();
        document.querySelector(".weather").innerHTML = `
            <h2>Current Weather</h2>
            <p><strong>${Math.round(data.main.temp)}°F</strong> ${data.weather[0].description}</p>
            <p>High: ${Math.round(data.main.temp_max)}° | Low: ${Math.round(data.main.temp_min)}°</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()} | Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}</p>
        `;
    } catch (error) {
        console.error("Weather data fetch failed", error);
    }
}

async function fetchForecast() {
    try {
        const response = await fetch(forecastUrl);
        const data = await response.json();
        let forecastHtml = '<h2>Weather Forecast</h2>';
        
        const dailyData = {};
        data.list.forEach(entry => {
            const date = new Date(entry.dt * 1000).toLocaleDateString();
            if (!dailyData[date]) {
                dailyData[date] = Math.round(entry.main.temp);
            }
        });

        const forecastDays = Object.keys(dailyData).slice(0, 3);
        forecastDays.forEach(day => {
            const dayName = new Date(day).toLocaleDateString(undefined, { weekday: 'long' });
            forecastHtml += `<p>${dayName}: <strong>${dailyData[day]}°F</strong></p>`;
        });
        
        document.querySelector(".forecast").innerHTML = forecastHtml;
    } catch (error) {
        console.error("Forecast data fetch failed", error);
    }
}

async function fetchBusinesses() {
    try {
        const response = await fetch('members.json');
        const data = await response.json();
        displayBusinesses(data.businesses);
        loadCompanySpotlight(data.businesses);
    } catch (error) {
        console.error('Error fetching business data:', error);
    }
}

function displayBusinesses(businesses) {
  const container = document.querySelector("#business-cards");
  if (!container) {
      console.error("Error: #business-cards element not found.");
      return;
  }

  container.innerHTML = ''; 
  businesses.forEach(business => {
      const card = document.createElement("div");
      card.classList.add("business-card");

      card.innerHTML = `
        <img src="${business.image}" alt="${business.name}" class="business-image">
        <h3>${business.name}</h3>
        <p><strong>Membership Level:</strong> ${business.membership}</p>
        <p><strong>Address:</strong> ${business.address}</p>
        <p><strong>Phone:</strong> ${business.phone}</p>
        <p><strong>Website:</strong> <a href="${business.url}" target="_blank">${business.url}</a></p>
      `;
      container.appendChild(card);
  });

  container.classList.add("grid"); // Default view
}

// Grid/List Toggle
const gridButton = document.querySelector("#grid");
const listButton = document.querySelector("#list");
const businessContainer = document.querySelector("#business-cards");

gridButton.addEventListener("click", () => {
    businessContainer.classList.add("grid");
    businessContainer.classList.remove("list");
});

listButton.addEventListener("click", () => {
    businessContainer.classList.add("list");
    businessContainer.classList.remove("grid");
});

// Company Spotlight Function
function loadCompanySpotlight(businesses) {
    const spotlightContainer = document.querySelector("#company_spotlight .spotlight_container");
    spotlightContainer.innerHTML = '<h2>Company Spotlight</h2>';

    // Filter only Gold and Silver members
    const spotlightMembers = businesses.filter(member => 
        member.membership === 'Gold' || member.membership === 'Silver'
    );

    // Shuffle and select 2-3 members randomly
    const selectedMembers = spotlightMembers.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Generate HTML for each selected member
    selectedMembers.forEach(member => {
      const memberCard = `
        <div class="business-card">
            <img src="${member.image}" alt="${member.name}" class="business-image">
            <h3>${member.name}</h3>
            <p><strong>Membership Level:</strong> ${member.membership}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Website:</strong> <a href="${member.url}" target="_blank">${member.url}</a></p>
        </div>
      `;
      spotlightContainer.innerHTML += memberCard;
  });
}
