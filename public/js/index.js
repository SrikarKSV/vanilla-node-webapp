const hamburger = document.querySelector('.hamburger');
const closeBtn = document.querySelector('.close');
const navbar = document.querySelector('nav');

function toggleSideBar() {
  navbar.classList.toggle('show');
}

function closeSideBar(e) {
  if (e?.key === 'Escape') navbar.classList.remove('show');
}

hamburger.addEventListener('click', toggleSideBar);
closeBtn.addEventListener('click', toggleSideBar);
window.addEventListener('keyup', closeSideBar);

// Load color generator when new confession page is open
(async function () {
  if (window.location.pathname === '/new') {
    const form = await import('./form.js');
    form.handleGenerateColorBtn();
  }
})();
