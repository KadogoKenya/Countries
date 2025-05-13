document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('countries-container');
  const searchInput = document.getElementById('search-input');
  const pagination = document.getElementById('pagination');
  const contactForm = document.querySelector('.contact-form');
  const profilePhoto = document.querySelector('.profile-photo');
  const section = document.getElementById('sectionId')

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

  // Listen to input
  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    filteredCountries = allCountries.filter(country =>
      country.name?.common?.toLowerCase().includes(searchTerm)
    );
    currentPage = 1;
    renderPage(currentPage);
    renderPagination();
  });

  function renderPage(page) {
    container.innerHTML = '';
    const start = (page - 1) * countriesPerPage;
    const end = start + countriesPerPage;
    const pageCountries = filteredCountries.slice(start, end);

    pageCountries.forEach(country => {
      container.appendChild(createCountryCard(country));
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

});
