const selectTag = document.querySelectorAll("select"),
    fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchangeIcon = document.querySelector(".exchange"),
    icons = document.querySelectorAll(".row i"),
    translationBtn = document.querySelector("button");

selectTag.forEach((tag, id) => {
    for (const countryCode in countries) {
        let selected;
        if (id == 0 && countryCode == "en-GB") {
            selected = "selected";
        } else if (id == 1 && countryCode == "hi-IN") {
            selected = "selected"
        }
        let option = `<option value=${countryCode} ${selected}>${countries[countryCode]}</option>`
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    selectTag[0].value = selectTag[1].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[1].value = tempLang;
});

translationBtn.addEventListener("click", () => {
    let text = fromText.value,
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) return //when text area is empty we just return 
    toText.setAttribute("placeholder", "Translating....")
    let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`
    fetch(apiUrl).then(res => res.json()).then(data => {
        toText.value = data.responseData.translatedText;
        toText.setAttribute("placeholder", "Translation");
    })
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }
            speechSynthesis.speak(utterance);
        }
    })
})