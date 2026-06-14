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

// --- Firebase Configuration & Initialization ---
const firebaseConfig = {
    apiKey: "AIzaSyCsj47Iv-aCx0_K3j46DAibPrWJ0kWEgls",
    authDomain: "awayhome-tripura.firebaseapp.com",
    projectId: "awayhome-tripura",
    storageBucket: "awayhome-tripura.firebasestorage.app",
    messagingSenderId: "464280299594",
    appId: "1:464280299594:web:754ec02a9d5d2d9d98deb3"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Global Auth State Tracking variable
let isSignUpMode = false;

// Monitor User Authentication State change (Runs automatically on login/logout)
auth.onAuthStateChanged((user) => {
    const authBtn = document.getElementById("authBtn");
    const hostDashBtn = document.getElementById("hostDashBtn");
    const userGreeting = document.getElementById("userGreeting");

    if (user) {
        // User is securely signed in
        console.log("Logged in user:", user.email);
        
        // Use displayName if available from Google, otherwise fallback to email prefix
        const nameToShow = user.displayName ? user.displayName : user.email.split('@')[0];
        userGreeting.innerText = `Hi, ${nameToShow}!`;
        userGreeting.style.display = "inline";
        
        authBtn.innerText = "Logout";
        authBtn.className = "btn-secondary";
        authBtn.setAttribute("onclick", "handleLogout()");
        
        // Show the post-property dashboard option only to logged in members
        hostDashBtn.style.display = "inline-block";
    } else {
        // User is logged out
        userGreeting.style.display = "none";
        hostDashBtn.style.display = "none";
        
        authBtn.innerText = "Login / Sign Up";
        authBtn.className = "btn-primary";
        authBtn.setAttribute("onclick", "openAuthModal()");
    }
});

// --- Authentication UI Controls ---
function openAuthModal() {
    isSignUpMode = false;
    updateAuthModalView();
    document.getElementById("authModal").style.display = "flex";
    
    // Attach listener to the Google button when modal opens
    attachGoogleBtnListener();
}

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
    document.getElementById("authForm").reset();
}

function toggleAuthMode(event) {
    event.preventDefault();
    isSignUpMode = !isSignUpMode;
    updateAuthModalView();
}

function updateAuthModalView() {
    const title = document.getElementById("authModalTitle");
    const submitBtn = document.getElementById("authSubmitBtn");
    const toggleText = document.getElementById("authToggleText");
    const toggleLink = document.getElementById("authToggleLink");

    if (isSignUpMode) {
        title.innerText = "Create AwayHome Account";
        submitBtn.innerText = "Register Now";
        toggleText.innerText = "Already have an account?";
        toggleLink.innerText = "Login";
    } else {
        title.innerText = "Login to AwayHome";
        submitBtn.innerText = "Sign In";
        toggleText.innerText = "Don't have an account?";
        toggleLink.innerText = "Sign Up";
    }
}

// --- Firebase Action Handlers ---
function handleAuthSubmit(event) {
    event.preventDefault();
    const email = document.getElementById("authEmail").value;
    const password = document.getElementById("authPassword").value;

    if (isSignUpMode) {
        // Firebase Creation System
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                alert("Account created successfully welcome to AwayHome!");
                closeAuthModal();
            })
            .catch((error) => {
                alert("Registration Failed: " + error.message);
            });
    } else {
        // Firebase Login System
        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                closeAuthModal();
            })
            .catch((error) => {
                alert("Login Failed: " + error.message);
            });
    }
}

// --- Google Sign-In Handler ---
function attachGoogleBtnListener() {
    const googleBtn = document.getElementById("google-signin-btn");
    if (googleBtn) {
        // Clear any old click listener to prevent multiple bindings
        googleBtn.onclick = function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            auth.signInWithPopup(provider)
                .then((result) => {
                    alert(`Welcome to AwayHome, ${result.user.displayName || 'User'}!`);
                    closeAuthModal();
                })
                .catch((error) => {
                    console.error("Google Auth Error:", error.code, error.message);
                    alert("Google Authentication Failed: " + error.message);
                });
        };
    }
}

function handleLogout() {
    if(confirm("Are you sure you want to sign out of AwayHome?")) {
        auth.signOut().then(() => {
            alert("Signed out successfully.");
        });
    }
}

// =========================================================================
// YOUR EXISTING CODE BELOW (Keep displayListings, filterListings, etc.)
// =========================================================================