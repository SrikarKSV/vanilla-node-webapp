const tables = document.querySelectorAll('table');

function handleDashboardBtns(e) {
  const button = e.target.classList;

  if (button.contains('btn-delete')) {
    console.log('DELETE');
  }
}

tables.forEach((table) => table.addEventListener('click', handleDashboardBtns));
