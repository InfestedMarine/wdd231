document.getElementById("copyright-year").textContent = new Date().getFullYear();

document.getElementById("last-modified").textContent = document.lastModified;

fetch('members.json')
  .then(response => response.json())
  .then(data => displayBusinesses(data.businesses))
  .catch(error => console.error('Error fetching data:', error));

function displayBusinesses(businesses) {
  const container = document.querySelector("#business-cards");
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
document.querySelector("#grid").addEventListener("click", () => {
  document.querySelector("#business-cards").classList.add("grid");
  document.querySelector("#business-cards").classList.remove("list");
});

document.querySelector("#list").addEventListener("click", () => {
  document.querySelector("#business-cards").classList.add("list");
  document.querySelector("#business-cards").classList.remove("grid");
});