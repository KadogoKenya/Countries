document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('countries-container');
  const searchInput = document.getElementById('search-input');
  const pagination = document.getElementById('pagination');
  const contactForm = document.querySelector('.contact-form');
  const profilePhoto = document.querySelector('.profile-photo');
  const section = document.getElementById('sectionId');
  const themeToggle = document.getElementById('theme-toggle');
  const regionSelect = document.getElementById('region-select');
  const toggle = document.querySelector('.js-toggle-dark-mode');
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');
  const themeSwitch = document.getElementById('theme-switch');
  const loader = document.getElementById('loader');

  let allCountries = [];
  let filteredCountries = [];
  let currentPage = 1;
  const countriesPerPage = 9;
  let searchCounts = JSON.parse(localStorage.getItem('searchCounts')) || {};
  let mostSearched = { name: '', count: 0 };

  // ✅ Fixed API: Includes 'capital'
  fetch('https://restcountries.com/v3.1/all?fields=name,region,flags,cca3,capital')
    .then(res => {
      if (!res.ok) throw new Error(`Network error: ${res.status}`);
      return res.json();
    })
    .then(data => {
      allCountries = data;
      filteredCountries = allCountries;
      renderPage(currentPage);
      renderPagination();
    })
    .catch(err => console.error('Failed to fetch countries:', err));

  // 🔍 Search functionality
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    loader.style.display = 'block';

    setTimeout(() => {
      if (searchTerm.trim() !== '') {
        allCountries.forEach(country => {
          if (country.name?.common?.toLowerCase().includes(searchTerm)) {
            const name = country.name.common;
            searchCounts[name] = (searchCounts[name] || 0) + 1;

            if (searchCounts[name] > mostSearched.count) {
              mostSearched = { name, count: searchCounts[name] };
            }
          }
        });
      }

      filteredCountries = allCountries.filter(country =>
        country.name?.common?.toLowerCase().includes(searchTerm)
      );

      localStorage.setItem('searchCounts', JSON.stringify(searchCounts));
      currentPage = 1;
      renderPage(currentPage);
      renderPagination();
      loader.style.display = 'none';
    }, 300);
  });

  // 🌍 Region filter
  if (regionSelect) {
    regionSelect.addEventListener('change', () => {
      const selectedRegion = regionSelect.value;
      filteredCountries = selectedRegion === 'all'
        ? allCountries
        : allCountries.filter(country => country.region === selectedRegion);
      currentPage = 1;
      renderPage(currentPage);
      renderPagination();
    });
  }

  // 📄 Render country cards
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

  // ✉️ Contact form submit
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Thank you for your message! We will get back to you shortly.');
      contactForm.reset();
    });
  }

  // 👤 Profile photo animation
  window.addEventListener('scroll', () => {
    if (profilePhoto) {
      const position = profilePhoto.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (position < windowHeight - 100) {
        profilePhoto.classList.add('in-view');
      }
    }
  });

  // 🌗 Theme toggling
  let darkmode = localStorage.getItem('darkmode');

  const enableDarkmode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
  };

  const disableDarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', 'null');
  };

  if (darkmode === "active") enableDarkmode();

  if (themeSwitch) {
    themeSwitch.addEventListener("click", () => {
      darkmode = localStorage.getItem('darkmode');
      darkmode !== "active" ? enableDarkmode() : disableDarkmode();
    });
  }

});
