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

function onInput(evt) {
  cleanCountresEl();
  const countryName = evt.target.value.trim();
  if (countryName !== '') {
    fetchCountries(countryName).then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length >= 2 && data.length <= 10) {
        const markup = createCountresList(data);
        addMurkup(refs.countryListEl, markup);
      } else if (data.length === 1) {
        const markup = createOneCountryInfo(data);
        addMurkup(refs.countryInfoEl, markup);
      } else if (data.length === 0) {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
  }
}

function createCountresList(arr) {
  return arr
    .map(({ flags: { svg }, name: { official } }) => {
      return `<li>
      <img src="${svg}" alt="Flag of ${official}" width="30" hight="20">
         <b>${official}</b>
                </li>`;
    })
    .join('');
}

function createOneCountryInfo(arr) {
  return arr
    .map(
      ({
        flags: { svg },
        name: { official },
        capital,
        population,
        languages,
      }) => {
        return `
     <div class="wrap"> <img src="${svg}" alt="Flag of ${official}" width="30" hight="20">
         <h2 class="country-name">${official}</h2></div>
<p><b>capital:</b> ${capital} </p>
<p><b>population:</b> ${population} </p>
<p><b>languages:</b> ${Object.values(languages)} </p> `;
      }
    )
    .join('');
}

function addMurkup(element, murkup) {
  return (element.innerHTML = murkup);
}

function cleanCountresEl() {
  refs.countryListEl.innerHTML = '';
  refs.countryInfoEl.innerHTML = '';
}
