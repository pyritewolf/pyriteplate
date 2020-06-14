const copyCSS = async (button, fileName) => {
  const file = await fetch(`./styles/${fileName}.css`);
  const contents = await file.text()
  navigator.clipboard.writeText(contents);
  button.innerHTML = "Copied!";
  setTimeout(() => {
    button.innerHTML = "Copy CSS";
  }, 2000);
}

let currentScrolling;
const isAtBottom = () => (window.innerHeight + window.pageYOffset) >= document.body.offsetHeight
const scrollTo = (to, duration) => () => {
  var difference = to.offsetTop - window.pageYOffset;
  var perTick = difference / duration * 10;

  if (currentScrolling !== undefined) clearTimeout(currentScrolling)
  currentScrolling = setTimeout(() => {
    window.scroll(0, window.pageYOffset + perTick);
    if (window.pageYOffset === to.offsetTop || (isAtBottom() && isScrollDown(window.pageYOffset))) return;
    scrollTo(to, duration - 10)();
  }, 10);
}


// making a cute scrollspy for the navbar
let currentlyActiveIndex;
let lastOffset = 0;
const isScrollDown = (newOffset) => {
  let retValue = false;
  if (newOffset > lastOffset) retValue = true;
  lastOffset = newOffset;
  return retValue;
}
const setSelectedNavLink = (index, removalIndex) => {
  if (!isNaN(index))
    anchors[index].element.setAttribute('data-selected', 'true')
  if (!isNaN(removalIndex))
    anchors[removalIndex].element.removeAttribute('data-selected')
  currentlyActiveIndex = index;
}

const anchors = [];
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
    let anchor = document.createElement("a");
    anchor.setAttribute("name", titleSlug);
    main.insertBefore(anchor, title)
    let navigationLink = document.createElement("a");
    navigationLink.onclick = scrollTo(anchor, 250);
    navigationLink.textContent = titleText;
    anchors.push({position: anchor.offsetTop, element: navigationLink});
    nav.appendChild(navigationLink);
  });
  anchors.sort((a, b) => a.position - b.position);

  window.onscroll = () => {
    let lookupIndex = 0;
    currentOffset = window.pageYOffset;
    if (isScrollDown(currentOffset)) {
      if (!isNaN(currentlyActiveIndex)) lookupIndex = currentlyActiveIndex + 1;
      if (!anchors[lookupIndex] || currentOffset >= anchors[lookupIndex].position)
        setSelectedNavLink(lookupIndex, currentlyActiveIndex);
    }
    else {
      if (currentlyActiveIndex !== 0) lookupIndex = currentlyActiveIndex - 1;
      else lookupIndex = undefined;
      if (!anchors[currentlyActiveIndex] || currentOffset < anchors[currentlyActiveIndex].position)
        setSelectedNavLink(lookupIndex, currentlyActiveIndex);
    }
  }
}
