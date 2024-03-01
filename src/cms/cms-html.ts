import('./cms-html-bootstrap').then(() => {
  function createScript(src: string) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    return script;
  }

  const netlifyIdentity = createScript('netlify-identity.js');
  const decapCmsApp = createScript('decap-cms-app.js');
  const cms = createScript('cms.js');

  netlifyIdentity.onload = () => document.head.appendChild(decapCmsApp);
  decapCmsApp.onload = () => document.head.appendChild(cms);

  document.head.appendChild(netlifyIdentity);
})

