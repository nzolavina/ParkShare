const listings = [
  {
    id: 1,
    title: "Home Covered Garage",
    location: "Toril",
    type: "driveway",
    pricePerHour: 55,
    rating: 4.9,
    reviews: 128,
    image: "images/Davao-Real-Estate3.jpg",
    features: ["EV charger", "24/7 access", "Camera"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      time: "7:00 AM - 10:00 PM",
    },
  },
  {
    id: 2,
    title: "Avida Towers CM Recto",
    location: "Matina",
    type: "Condo Building",
    pricePerHour: 30,
    rating: 4.8,
    reviews: 82,
    image: "images/images.jpg",
    features: ["Easy exit", "Large SUV", "Instant book"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      time: "6:00 AM - 11:00 PM",
    },
  },
  {
    id: 3,
    title: "Home Covered Garage",
    location: "driveway",
    type: "garage",
    pricePerHour: 40,
    rating: 4.7,
    reviews: 244,
    image: "images/images (1).jpg",
    features: ["Attendant", "Wide bays", "Events"],
    availability: {
      days: ["Saturday", "Sunday"],
      time: "8:00 AM - 8:00 PM",
    },
  },
  {
    id: 4,
    title: "Ecoland Parking Lot",
    location: "Sasa",
    type: "Private lot",
    pricePerHour: 40,
    rating: 4.9,
    reviews: 311,
    image: "images/images (2).jpg",
    features: ["Shuttle", "Indoor", "Overnight"],
    availability: {
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      time: "Open 24 Hours",
    },
  },
  {
    id: 5,
    title: "Ecoland Compact Spot",
    location: "Ecoland",
    type: "garage",
    pricePerHour: 40,
    rating: 4.6,
    reviews: 63,
    image: "images/images (3).jpg",
    features: ["Budget", "Quiet street", "Compact"],
    availability: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "6:30 AM - 9:30 PM",
    },
  },
  {
    id: 6,
    title: "Avida Towers Abreeza",
    location: "Bajada",
    type: "condo building",
    pricePerHour: 60,
    rating: 5.0,
    reviews: 95,
    image: "images/images (4).jpg",
    features: ["Gated", "Covered walkway", "Guard"],
    availability: {
      days: ["Tuesday", "Thursday", "Saturday", "Sunday"],
      time: "7:00 AM - 12:00 AM",
    },
  },
];

const listingGrid = document.getElementById("listingGrid");
const resultsText = document.getElementById("resultsText");
const searchForm = document.getElementById("searchForm");

function listingCardMarkup(listing) {
  const featureMarkup = listing.features.map((feature) => `<span>${feature}</span>`).join("");

  return `
    <article class="card">
      <div class="card-image" style="background-image:url('${encodeURI(listing.image)}');"></div>
      <div class="card-body">
        <div class="card-top">
          <h3>${listing.title}</h3>
          <p class="price">PHP ${listing.pricePerHour}/hr</p>
        </div>
        <p class="meta">${listing.location} | ${capitalize(listing.type)}</p>
        <p class="rating">${listing.rating} stars (${listing.reviews} reviews)</p>
        <div class="badges">${featureMarkup}</div>
        <button class="btn btn-solid" data-id="${listing.id}">Reserve spot</button>
      </div>
    </article>
  `;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function renderListings(data) {
  if (!data.length) {
    listingGrid.innerHTML = `
      <article class="card">
        <div class="card-body">
          <h3>No matches found</h3>
          <p class="meta">Try widening your location text or increasing max price.</p>
        </div>
      </article>
    `;
    return;
  }

  listingGrid.innerHTML = data.map(listingCardMarkup).join("");
}

function getCurrentBasePath() {
  const { pathname } = window.location;

  if (pathname.endsWith(".html")) {
    return pathname.slice(0, pathname.lastIndexOf("/") + 1);
  }

  if (pathname.endsWith("/")) {
    return pathname;
  }

  return `${pathname}/`;
}

function getPageUrl(pageName, queryParams = {}) {
  const basePath = getCurrentBasePath();
  const url = new URL(`${basePath}${pageName}`, window.location.origin);

  Object.entries(queryParams).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

function applyFilters() {
  const formData = new FormData(searchForm);
  const location = formData.get("location").toLowerCase().trim();
  const type = formData.get("spotType");
  const priceCap = Number(formData.get("priceCap"));

  const filtered = listings.filter((listing) => {
    const locationMatches =
      location.length === 0 || listing.location.toLowerCase().includes(location) || listing.title.toLowerCase().includes(location);
    const typeMatches = type === "all" || listing.type === type;
    const priceMatches = listing.pricePerHour <= priceCap;

    return locationMatches && typeMatches && priceMatches;
  });

  renderListings(filtered);
  resultsText.textContent = `Showing ${filtered.length} spot${filtered.length === 1 ? "" : "s"}.`;
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  applyFilters();
});

listingGrid.addEventListener("click", (event) => {
  const reserveButton = event.target.closest("button[data-id]");
  if (!reserveButton) {
    return;
  }

  const listing = listings.find((item) => item.id === Number(reserveButton.dataset.id));
  if (!listing) {
    return;
  }

  window.location.href = getPageUrl("reserve.html", { id: listing.id });
});

renderListings(listings);
