import { handleDashboardBtns } from './handleDashboardBtns.js';

const allConfessionContainer = document.querySelector(
  '.dashboard__all-confessions'
);
const allConfessionTable = allConfessionContainer.querySelector(
  '.dashboard__table-container table'
);
const loadingAnimation =
  allConfessionContainer.querySelector('.loading-animation');
const prevPageBtn = allConfessionContainer.querySelector('.btn-prev');
const nextPageBtn = allConfessionContainer.querySelector('.btn-next');
const tables = document.querySelectorAll('table');

// Holds the current paginated confessions
let allConfessions;
let isLoading = true;

export function updateAllConfessionState(confessions) {
  allConfessions = { ...allConfessions, confessions };
  allConfessionTable.dispatchEvent(new CustomEvent('update'));
}

tables.forEach((table) =>
  table.addEventListener('click', (e) =>
    handleDashboardBtns(e, updateAllConfessionState, allConfessions)
  )
);

async function fetchAllConfessions(page) {
  let url = '/api/confessions';
  if (page) url += `?page=${page}`;
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  });
  const result = await response.json();
  return result;
}

function setPageBtnVisibility(page, pageBtn) {
  // Resetting visibility
  pageBtn.classList.remove('hide');

  // Setting visibility based on the value of prev or next page
  if (page) {
    pageBtn.setAttribute('data-page', page);
  } else {
    pageBtn.classList.add('hide');
  }
}

function updateAllConfessions() {
  const { confessions, nextPage, prevPage } = allConfessions;
  const tbody = document.createElement('tbody');

  setPageBtnVisibility(prevPage, prevPageBtn);
  setPageBtnVisibility(nextPage, nextPageBtn);

  const html = confessions
    .map(
      ({ title, markedByStaff, slug, id }) => /* html */ `<tr class="${
        markedByStaff ? 'marked' : ''
      }">
      <td><a href="/confessions/${slug}">${title}</a></td>
      <td>${
        markedByStaff
          ? `<a href="/profile/${markedByStaff}">${markedByStaff}</a>`
          : 'None'
      }</td>
      <td><a class="btn btn-yellow btn-edit" href="/edit/${id}">Edit</a></td>
      <td><button class="btn btn-purple btn-mark" data-id="${id}" ${
        markedByStaff ? 'disabled' : ''
      }>Mark</button></td>
      </tr>`
    )
    .join('');

  tbody.innerHTML = html;

  // If tbody already exists then just replace with new one
  const oldTbody = allConfessionTable.querySelector('tbody');
  if (oldTbody) oldTbody.replaceWith(tbody);
  else allConfessionTable.insertAdjacentElement('beforeend', tbody);
}

function toggleAnimation() {
  // If loading animation is shown, then set its container height and width
  // To match that of the table on screen, so to avoid content jump
  if (loadingAnimation.classList.contains('hide')) {
    const width = allConfessionTable.clientWidth;
    const height = allConfessionTable.clientHeight;
    loadingAnimation.style.height = `${height}px`;
    loadingAnimation.style.width = `${width}px`;
  }

  const allConfessionTableContainer = allConfessionTable.closest(
    '.dashboard__table-container'
  );
  if (isLoading) {
    allConfessionTableContainer.classList.add('hide');
    loadingAnimation.classList.remove('hide');
  } else {
    allConfessionTableContainer.classList.remove('hide');
    loadingAnimation.classList.add('hide');
  }
  isLoading = !isLoading;
}

async function fetchNewPage(e) {
  toggleAnimation();
  allConfessions = await fetchAllConfessions(e.target.dataset.page);
  allConfessionTable.dispatchEvent(new CustomEvent('update'));
  toggleAnimation();
}

prevPageBtn.addEventListener('click', fetchNewPage);
nextPageBtn.addEventListener('click', fetchNewPage);
allConfessionTable.addEventListener('update', updateAllConfessions);

// Load all confessions when DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
  toggleAnimation();
  allConfessions = await fetchAllConfessions();

  // If no confession found
  if (!allConfessions?.confessions.length) {
    allConfessionContainer.innerHTML = '<h4>No confessions found</h4>';
  } else {
    allConfessionTable.dispatchEvent(new CustomEvent('update'));
  }
  toggleAnimation();
});
