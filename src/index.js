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
  refs.countryListEl.innerHTML = '';
  const countryName = e.target.value.trim();
  if (countryName !== '') {
    fetchCountries(countryName).then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length >= 2 && data.length <= 10) {
        createCountresList(data);
      }
      if (data.length === 1) {
        createCountresList(data);
      }
      if (data.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
      console.log(data);
    });
  }
}

function createCountresList(arr) {
  refs.countryListEl.innerHTML = '';

  const markup = arr
    .map(country => {
      return `<li>
      <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="30" hight="20">
         <b>${country.name.official}</p>
                </li>`;
    })
    .join('');
  return (refs.countryListEl.innerHTML = markup);
}
