async function waitForNonNull(getThing, interval = 100) {
  while (true) {
    const thing = getThing();
    if (thing) return thing;
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}

waitForNonNull(
  () => document.getElementById("preview-pane")?.contentDocument?.head
).then((head) => {
  const fontAwesome = document.createElement('script');
  fontAwesome.setAttribute('src', 'https://kit.fontawesome.com/74c5cf378a.js')
  fontAwesome.setAttribute('crossorigin', 'anonymous')
  head.appendChild(fontAwesome)

  const init = document.createElement('script');
  init.setAttribute('src', 'preview-pane.js')
  init.setAttribute('crossorigin', 'anonymous')
  head.appendChild(init)
});
