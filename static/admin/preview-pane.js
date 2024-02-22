// Disable all links and buttons in the preview pane
document.querySelectorAll("a, button").forEach((el) => {
  el.addEventListener("click", (e) => e.preventDefault());
});
