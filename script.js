const wrapper = document.querySelector(".wrapper");
const searchInput = wrapper.querySelector("input");
const synonymsList = wrapper.querySelector(".synonyms .list");
const infoText = wrapper.querySelector(".info-text");
const audioElement = document.querySelector(".pronunciation-audio");
const closeIcon = document.querySelector(".close-icon");

function data(result, word) {
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please, try to search another word.`;
  } else {
    console.log(result); 
    wrapper.classList.add("active");

    let definitions = result[0].meanings[0].definitions[0];
    let phonetics = result[0].phonetics[0]
      ? `/${result[0].phonetics[0].text}/`
      : "";

    document.querySelector(".word p").innerText = result[0].word;
    document.querySelector(".word span").innerText = phonetics;

    document.querySelector(".meaning span").innerText = definitions.definition;
    document.querySelector(".example span").innerText =
      definitions.example || "No example available.";


    if (result[0].phonetics[0] && result[0].phonetics[0].audio) {
      audioElement.src = result[0].phonetics[0].audio;
      audioElement.style.display = "block";
    } else {
      audioElement.style.display = "none";
    }

    
    if (result[0].meanings.length > 0) {
      synonymsList.innerHTML = ""; 
      let allSynonyms = [];

    
      result[0].meanings.forEach((meaning) => {
        meaning.definitions.forEach((def) => {
          if (def.synonyms && def.synonyms.length > 0) {
            allSynonyms = allSynonyms.concat(def.synonyms);
          }
        });
      });

      if (allSynonyms.length > 0) {
        synonymsList.parentElement.style.display = "block";
        let uniqueSynonyms = [...new Set(allSynonyms)]; 
        uniqueSynonyms.slice(0, 10).forEach((synonym) => {
          let tag = `<span>${synonym},</span>`;
          synonymsList.insertAdjacentHTML("beforeend", tag);
        });
      } else {
        synonymsList.parentElement.style.display = "none";
        console.log("No synonyms available for this word.");
      }
    } else {
      synonymsList.parentElement.style.display = "none";
      console.log("No synonyms available for this word.");
    }
  }
}

function fetchApi(word) {
  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((res) => res.json())
    .then((result) => data(result, word))
    .catch((error) => {
      console.error("Error fetching data:", error);
      infoText.innerHTML = `Failed to fetch data for <span>"${word}"</span>. Please check your internet connection or try another word.`;
    });
}


closeIcon.addEventListener("click", () => {
  searchInput.value = "";
  wrapper.classList.remove("active");
  infoText.innerHTML =
    'Type a word and press enter to get meaning, example, pronunciation, and synonyms of that typed word.';
  synonymsList.innerHTML = "";
  document.querySelector(".word p").innerText = "_";
  document.querySelector(".word span").innerText = "__";
  document.querySelector(".meaning span").innerText = "__";
  document.querySelector(".example span").innerText = "__";
  audioElement.style.display = "none";
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    fetchApi(e.target.value);
  }
});
