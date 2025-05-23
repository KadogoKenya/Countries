document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('countries-container');
  const searchInput = document.getElementById('search-input');
  const pagination = document.getElementById('pagination');
  const contactForm = document.querySelector('.contact-form');
  const profilePhoto = document.querySelector('.profile-photo');
  const section = document.getElementById('sectionId')
  const themeToggle = document.getElementById('theme-toggle');
  const regionSelect = document.getElementById('region-select');
  const toggle = document.querySelector('.js-toggle-dark-mode');
  let searchCounts = JSON.parse(localStorage.getItem('searchCounts')) || {};


  const toggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');




  let allCountries = [];
  let currentPage = 1;
  const countriesPerPage = 9;
  let filteredCountries = [];

  // Fetch countries
  fetch('https://restcountries.com/v3.1/all')
    .then(res => {
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      allCountries = data;
      filteredCountries = allCountries; // Initially show all
      renderPage(currentPage);
      renderPagination();
    })
    .catch(err => console.error(err));


 // Tracks how many times each country is searched

let mostSearched = { name: '', count: 0 };

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();
  document.getElementById('loader').style.display = 'block'; // Show loader

  setTimeout(() => {
    if (searchTerm.trim() !== '') {
      allCountries.forEach(country => {
        if (country.name?.common?.toLowerCase().includes(searchTerm)) {
          const countryName = country.name.common;
          searchCounts[countryName] = (searchCounts[countryName] || 0) + 1;

          if (searchCounts[countryName] > mostSearched.count) {
            mostSearched = { countryName, count: searchCounts[countryName] };
          }
        }
      });
    }

    // Filter results
    filteredCountries = allCountries.filter(country =>
      country.name?.common?.toLowerCase().includes(searchTerm)
    );

    localStorage.setItem('searchCounts', JSON.stringify(searchCounts));

    currentPage = 1;
    renderPage(currentPage);
    renderPagination();

    document.getElementById('loader').style.display = 'none'; // Hide loader
  }, 300); // Simulate a brief loading delay (adjust as needed)
});


  function renderPage(page) {
  container.innerHTML = '';
  const start = (page - 1) * countriesPerPage;
  const end = start + countriesPerPage;
  const pageCountries = filteredCountries.slice(start, end);

  pageCountries.forEach(country => {
    const voteCount = searchCounts[country.name.common] || 0;

    const card = createCountryCard(country);

    const voteBadge = document.createElement('div');
    voteBadge.className = 'vote-counter';
    voteBadge.textContent = `🔼 ${voteCount}`;

    
    card.style.position = 'relative';
   
    card.appendChild(voteBadge);

    container.appendChild(card);
  });
}


  function createCountryCard(country) {
    const card = document.createElement('div');
    card.className = 'col-md-4 mb-4';
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${country.flags?.svg || ''}" class="card-img-top" alt="Flag of ${country.name?.common || 'Unknown'}">
        <div class="card-body">
          <h5 class="card-title">${country.name?.common || 'Unknown'}</h5>
          <p class="card-text">
            <strong>Official Name:</strong> ${country.name?.official || 'Unknown'}<br>
            <strong>Region:</strong> ${country.region || 'Unknown'}<br>
            <strong>Capital:</strong> ${country.capital?.[0] || 'N/A'}
          </p>
        </div>
      </div>
    `;
    return card;
  }

  function renderPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(filteredCountries.length / countriesPerPage);

    const prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn-outline-primary me-2';
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
        renderPagination();
      }
    };

    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn-outline-primary';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderPage(currentPage);
        renderPagination();
      }
    };

    pagination.appendChild(prevBtn);
    pagination.appendChild(nextBtn);
  }

  // Contact form submit
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you shortly.');
      contactForm.reset();
    });
  }
  

  // Profile scroll animation
  window.addEventListener('scroll', () => {
    if (profilePhoto) {
      const position = profilePhoto.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (position < windowHeight - 100) {
        profilePhoto.classList.add('in-view');
      }
    }
  });

  
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// const regionSelect = document.getElementById('region-select');

if (regionSelect) {
  regionSelect.addEventListener('change', () => {
    const selectedRegion = regionSelect.value;

    if (selectedRegion === 'all') {
      renderPage(1); // show all
    } else {
      const filtered = allCountries.filter(
        country => country.region === selectedRegion
      );
      renderFilteredCountries(filtered);
    }
  });
}



regionSelect.addEventListener('change', () => {
  const selectedRegion = regionSelect.value;
  const filtered = selectedRegion === 'all'
    ? allCountries
    : allCountries.filter(country => country.region === selectedRegion);
  renderFilteredCountries(filtered);
});

function renderFilteredCountries(countries) {
  container.innerHTML = '';
  pagination.innerHTML = '';

  countries.forEach(country => {
    const card = createCountryCard(country); 
    container.appendChild(card);
  });
}


// toggling
 const userPref = localStorage.getItem('theme');
  const systemPrefDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const setTheme = (isDark) => {
    document.body.classList.toggle('dark-mode', isDark);
    sunIcon.classList.toggle('hidden', !isDark); // Show sun icon only in dark mode
    moonIcon.classList.toggle('hidden', isDark); // Show moon icon only in light mode
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  // Set theme on load
  if (userPref) {
    setTheme(userPref === 'dark');
  } else {
    setTheme(systemPrefDark);
  }

  // Toggle on click
  toggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-mode');
    setTheme(!isDark);
  });

});
