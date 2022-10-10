import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) {
  resetMarkup();

  const searchContry = evt.target.value;

  if (searchContry === '') {
    return;
  }

  const normalizedSearchCountry = searchContry.trim();
  fetchCountries(normalizedSearchCountry)
    .then(countries => renderMarkupCountry(countries))
    .catch(error => Notify.failure('Oops, there is no country with that name'));
}

function renderMarkupCountry(countries) {
  if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length > 1) {
    const markup = countries
      .map(({ flags, name }) => {
        return `
        <li class = "country-item">
            <img class = "country-img" src="${flags.svg}" alt="${name.official}" width="60" height="40" />
            <p class="country-label">${name.official}</p> 
        </li>`;
      })
      .join('');

    refs.countryList.innerHTML = markup;
  } else if (countries.length === 1) {
    const markup = countries
      .map(({ flags, name, capital, population, languages }) => {
        return `
        <div class="country-name">
            <img class="country-name__img" src="${flags.svg}" alt="${
          name.common
        }" width="100" height="60"/>
            <h2 class="country-name__title">${name.official}</h2>
        </div>
        <ul>
          <li>
            <p class="country-name__subtitle">Capital: <span class="country-name__text">${
              capital[0]
            }</span></p>
            
          </li>
          <li>
            <p class="country-name__subtitle">Population: <span class="country-name__text">${population}</span></p>
            
          </li>
          <li>
            <p class="country-name__subtitle">Languages: <span class="country-name__text">${Object.values(
              languages
            )}</span></p>
          </li>
        </ul>`;
      })
      .join('');

    refs.countryInfo.innerHTML = markup;
  }
}

function resetMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}
