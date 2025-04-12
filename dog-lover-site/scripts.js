document.addEventListener("DOMContentLoaded", function () {
    // Fetch Dog Data for Gallery
    fetchDogData();
    setupModal();
    setupRandomDogButton(); // Add this new function to setup the random dog image button

    // Function to fetch dog data (assuming you have this for dog cards)
    function fetchDogData() {
        fetch("dog-data.json")
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch dog data.");
                return response.json();
            })
            .then(data => renderDogCards(data))
            .catch(error => console.error("Error loading dog data:", error));
    }

    // Function to render dog cards
    function renderDogCards(data) {
        const gallery = document.getElementById("dogGallery");
        gallery.innerHTML = "";

        data.dogData.forEach(dog => {
            const card = document.createElement("div");
            card.classList.add("dog-card");

            card.innerHTML = `
                <div class="image-container">
                    <img src="${dog.grassImg}" alt="Grass Background" class="grass-img">
                    <img src="${dog.dogImg}" alt="${dog.breed}" class="dog-img">
                    <img src="${dog.overlayImg}" alt="Overlay for ${dog.breed}" class="overlay-img">
                </div>
                <p>${dog.description}</p>
                <button class="learn-more-btn">Learn more</button>
            `;

            // Add event listener for each "Learn More" button
            card.querySelector(".learn-more-btn").addEventListener("click", () => {
                openModal(dog);
            });

            gallery.appendChild(card);
        });
    }

    // Function to open modal
    function openModal(dog) {
        document.getElementById("modalTitle").textContent = dog.breed;
        document.getElementById("modalDescription").textContent = dog.careDescription;
        document.getElementById("modalImage").src = dog.dogImg; 

        // Show the modal
        document.getElementById("dogModal").classList.add("show");
    }

    // Function to setup modal
    function setupModal() {
        const modal = document.getElementById("dogModal");
        const closeBtn = document.querySelector(".close-button");

        // Close the modal when the close button is clicked
        closeBtn.addEventListener("click", () => {
            modal.classList.remove("show");
        });

        // Close the modal if user clicks outside of it
        window.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("show");
            }
        });
    }

    // Function to setup random dog image button
    function setupRandomDogButton() {
        const button = document.getElementById("load-random-image");
        button.addEventListener("click", fetchRandomDogImage);

        // Load the first dog image when the page loads
        fetchRandomDogImage();
    }

    // Function to fetch random dog image
    function fetchRandomDogImage() {
        fetch('https://dog.ceo/api/breeds/image/random')
            .then(response => response.json()) // Parse the response as JSON
            .then(data => {
                const dogImageUrl = data.message;

                // Create an image element
                const imgElement = document.createElement('img');
                imgElement.src = dogImageUrl;
                imgElement.alt = "Random Dog Image";
                imgElement.classList.add('dog-image');

                // Append the image to the #random-dog-images div
                const dogContainer = document.getElementById('random-dog-images');
                dogContainer.innerHTML = ''; // Clear any existing content
                dogContainer.appendChild(imgElement);
            })
            .catch(error => console.error('Error fetching dog image:', error)); // Handle errors
    }
});