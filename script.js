const copyCSS = async (button, fileName) => {
  const file = await fetch(`./styles/${fileName}.css`);
  const contents = await file.text()
  navigator.clipboard.writeText(contents);
  button.innerHTML = "Copied!";
  setTimeout(() => {
    button.innerHTML = "Copy CSS";
  }, 2000);
}

// generate navigation dynamically because I'm a lazy ass
window.onload = () => {
  const main = document.getElementById('main');
  const nav = document.getElementById('nav');
  const originalTitles = main.getElementsByTagName("h2") || [];
  const titles = new Set();
  for (let element in originalTitles) {
    const title = originalTitles.item(element)
    titles.add(title);
  }
  titles.forEach(title => {
    let titleText = title.textContent.replace(" Copy CSS", "").trim();
    let titleSlug = encodeURI(titleText.replace(/ /g, "-").toLowerCase());
    let localLink = document.createElement("a");
    localLink.setAttribute("name", titleSlug);
    main.insertBefore(localLink, title)
    let navigationLink = document.createElement("a");
    navigationLink.setAttribute("href", `#${titleSlug}`);
    navigationLink.textContent = titleText;
    nav.appendChild(navigationLink);
  })
}
