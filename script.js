const copyCSS = async (button, fileName) => {
  const file = await fetch(`./styles/${fileName}.css`);
  const contents = await file.text()
  navigator.clipboard.writeText(contents);
  button.innerHTML = "Copied!";
  setTimeout(() => {
    button.innerHTML = "Copy CSS";
  }, 2000);
}