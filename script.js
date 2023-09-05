"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const body = document.getElementById('body');
const loader = document.getElementById('loader');
const themeCheckbox = document.getElementById('toggle--theme');
const fontSelect = document.getElementById('font-select');
const searchValue = document.getElementById('search-word');
const wordTitle = document.getElementById('word-title');
const wordDefs = document.getElementById('word-defintions');
const wordWord = document.getElementById('word-word');
const wordPro = document.getElementById('word-pronunciation');
const wordAudio = document.getElementById('word-audio');
const wordAudioBtn = document.getElementById('word-audio-btn');
setPreferedThemes();
searchValue.addEventListener("change", (e) => {
    console.log('SEARCH: ', e.target.value);
    fetchWord(e.target.value);
    e.target.value = '';
});
fontSelect.addEventListener("change", changeFont);
themeCheckbox.addEventListener("change", changeTheme);
function setPreferedThemes() {
    if (localStorage.getItem('theme') === 'dark') {
        themeCheckbox.checked = true;
    }
    body.classList.remove('theme--light');
    body.classList.remove('theme--dark');
    body.classList.add(`theme--${localStorage.getItem('theme')}`);
    if (localStorage.getItem('font') !== null) {
        fontSelect.value = localStorage.getItem('font');
        body.classList.add(`theme--${localStorage.getItem('font')}`);
    }
    else {
        fontSelect.value = 'serif';
        body.classList.add('theme--serif');
    }
}
function changeTheme() {
    if (body.classList.contains('theme--light')) {
        localStorage.setItem('theme', 'dark');
        body.classList.replace('theme--light', 'theme--dark');
    }
    else {
        localStorage.setItem('theme', 'light');
        body.classList.remove('theme--dark');
        body.classList.add('theme--light');
    }
}
function changeFont() {
    body.classList.remove('theme--sans-serif');
    body.classList.remove('theme--serif');
    body.classList.remove('theme--mono');
    body.classList.add(`theme--${fontSelect.value}`);
    localStorage.setItem('font', fontSelect.value);
}
function fetchWord(word) {
    return __awaiter(this, void 0, void 0, function* () {
        loader.classList.remove('hidden');
        wordTitle.classList.add('hidden');
        wordDefs.classList.add('hidden');
        const response = yield fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = yield response.json();
        if (response.status === 200) {
            setWord(data);
        }
        else {
            wordDefs.classList.remove('hidden');
            loader.classList.add('hidden');
            wordDefs.innerHTML = `
    <h1 class="error--title">${data.title}</h1>
    <p class="error--body">${data.message}</p>
    `;
        }
    });
}
function test(word) {
    console.log(word);
}
function setWord(definitions) {
    // set audio and button events
    wordAudio === null || wordAudio === void 0 ? void 0 : wordAudio.setAttribute('src', '');
    if (definitions[0].phonetics[0]) {
        for (let audio of definitions[0].phonetics) {
            if (audio.audio !== '') {
                wordAudio === null || wordAudio === void 0 ? void 0 : wordAudio.setAttribute('src', audio.audio);
                break;
            }
        }
    }
    wordAudioBtn === null || wordAudioBtn === void 0 ? void 0 : wordAudioBtn.addEventListener("click", () => {
        if (wordAudio === null || wordAudio === void 0 ? void 0 : wordAudio.getAttribute('src')) {
            wordAudio === null || wordAudio === void 0 ? void 0 : wordAudio.play();
        }
    });
    // set word header and phonetic text
    wordWord.innerHTML = definitions[0].word;
    wordPro.innerHTML = definitions[0].phonetic ? definitions[0].phonetic : '';
    // set all difintions, examples, synonyms & sources
    wordDefs.innerHTML = `
    ${definitions.map((def) => {
        return `${def.meanings.map((meaning) => {
            return `<h2 class="definition--part-of-speech">${meaning.partOfSpeech}</h2>
          <h3 class="definition--meaning-label" >Meaning</h3>
          <ul class="definition--meaning-list">
          ${meaning.definitions.map((def) => {
                return `
              <li>
                <p class="definition--meaning-text">${def.definition}</p>
                ${def.example ? `<p class="definition--meaning-example">"${def.example}"</p>` : ''}
              </li>`;
            }).join('')}
          </ul>
          ${meaning.synonyms[0] ?
                `<h3 class="definition--synonym-label">Synonyms:</h3>
          <ul class="definition--synonym-list">
            ${meaning.synonyms.map((synonym) => {
                    return `<li class="definition--synonym">${synonym}</li>`;
                }).join(', ')}`
                : ''}
          </ul>`;
        }).join('')}
    ${def.sourceUrls[0] ?
            `<h4 class="definition--source-label">Source</h4>
    <ul class="definition--source-list">
      ${def.sourceUrls.map((sourceurl) => {
                return `<li class="definition--source-url">
                  <a href="${sourceurl}" target="_blank">${sourceurl} <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                </li>`;
            }).join('')}
    </ul>` :
            ''}
  `;
    }).join('')}`;
    wordTitle.classList.remove('hidden');
    wordDefs.classList.remove('hidden');
    loader.classList.add('hidden');
}
