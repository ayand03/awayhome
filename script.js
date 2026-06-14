// Sample initial data simulating properties around Tripura on AwayHome
const initialProperties = [
    {
        title: "Cozy 2BHK Flat near Radhanagar",
        location: "agartala",
        type: "rent",
        price: "8500",
        img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80"
    },
    {
        title: "Premium Boys PG - High Speed Wi-Fi",
        location: "amtali",
        type: "pg",
        price: "4200",
        img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=400&q=80"
    },
    {
        title: "Traditional Eco Homestay Jampui",
        location: "jampui",
        type: "homestay",
        price: "1800",
        img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80"
    }
];

// Load listings on start
document.addEventListener("DOMContentLoaded", () => {
    displayListings(initialProperties);
});

// Function to render cards into the grid
function displayListings(properties) {
    const grid = document.getElementById("listingsGrid");
    grid.innerHTML = ""; // Clear existing

    if(properties.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color: #94a3b8;">No accommodations found matching your criteria on AwayHome.</p>`;
        return;
    }

    properties.forEach(item => {
        const cardHtml = `
            <div class="card">
                <img src="${item.img}" alt="Property" class="card-img">
                <div class="card-body">
                    <span class="tag">${item.type}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-location"><i class="fa-solid fa-location-dot"></i> ${capitalize(item.location)}, Tripura</p>
                    <div class="card-footer">
                        <span class="price">₹${item.price}${item.type === 'rent' || item.type === 'pg' ? '/month' : '/day'}</span>
                        <button class="btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">View Details</button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHtml;
    });
}

// Simple Filter Engine
function filterListings() {
    const locValue = document.getElementById("locationFilter").value;
    const typeValue = document.getElementById("typeFilter").value;

    const filtered = initialProperties.filter(p => {
        const matchLoc = (locValue === "all" || p.location === locValue);
        const matchType = (typeValue === "all" || p.type === typeValue);
        return matchLoc && matchType;
    });

    displayListings(filtered);
}

// Dynamic property addition for AwayHome hosts
function addNewProperty(event) {
    event.preventDefault();

    const newProp = {
        title: document.getElementById("pTitle").value,
        location: document.getElementById("pLocation").value,
        type: document.getElementById("pType").value,
        price: document.getElementById("pPrice").value,
        img: document.getElementById("pImg").value || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80"
    };

    initialProperties.unshift(newProp); // Add to the top of our array
    displayListings(initialProperties); // Refresh display
    toggleForm('listModal'); // Close modal
    document.getElementById("propertyForm").reset(); // Reset form fields
    
    // Smooth scroll down to listings
    document.getElementById("discover").scrollIntoView();
}

// Modal handling logic
function toggleForm(modalId) {
    const modal = document.getElementById(modalId);
    if (modal.style.display === "flex") {
        modal.style.display = "none";
    } else {
        modal.style.display = "flex";
    }
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}