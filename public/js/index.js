// Load color generator when new confession page is open
(async function () {
  if (window.location.pathname === '/new') {
    const form = await import('./form.js');
    form.handleGenerateColorBtn();
  }
})();
