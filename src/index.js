import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('input#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  cleanCountrestEl();
  const countryName = e.target.value.trim();
  if (countryName !== '') {
    fetchCountries(countryName).then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        createCountresList(data);
      } else if (data.length === 1) {
        createOneCountryInfo(data);
      } else if (data.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
  }
}

function createCountresList(arr) {
  const markup = arr
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
         <b>${country.name.official}</b>
                </li>`;
    })
    .join('');
  return (refs.countryListEl.innerHTML = markup);
}

function createOneCountryInfo(arr) {
  const markup = arr
    .map(country => {
      return `
     <div class="wrap"> <img src="${country.flags.svg}" alt="Flag of ${
        country.name.official
      }" width="30" hight="20">
         <h2 class="country-name">${country.name.official}</h2></div>
<p><b>capital:</b> ${country.capital} </p>
<p><b>population:</b> ${country.population} </p>
<p><b>languages:</b> ${Object.values(country.languages)} </p> `;
    })
    .join('');

  return (refs.countryInfoEl.innerHTML = markup);
}

function cleanCountrestEl() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}
