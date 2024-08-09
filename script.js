const wrapper = document.querySelector(".wrapper");
searchInput = wrapper.querySelector("input");
infoText = wrapper.querySelector(".info-text");

function fetchApi(word) {
  infoText.innerText = `Searching the meaning of <span>${word}</span>`;
}

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) fetchApi(e.target.value);
});
