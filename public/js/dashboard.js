const allConfessionContainer = document.querySelector(
  '.dashboard__all-confessions'
);

// Holds the current paginated confessions
let allConfessions;

const allConfessionTableTemplate = /* html */ `
  <div class="dashboard__table-container">
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Marked by</th>
          <th>Edit</th>
          <th>Mark as spam</th>
        </tr>
      </thead>
    </table>
    <button class="btn btn-grey btn-prev">Previous</button>
    <button class="btn btn-grey btn-next">Next</button>
  </div>
`;

// Convert template to document fragment
const allConfessionTableFragment = document
  .createRange()
  .createContextualFragment(allConfessionTableTemplate);

allConfessionContainer.appendChild(allConfessionTableFragment);
const allConfessionTable = allConfessionContainer.querySelector('table');
const prevPageBtn = allConfessionContainer.querySelector('.btn-prev');
const nextPageBtn = allConfessionContainer.querySelector('.btn-next');

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

  // Setting visibility based on the existence of prev or next page
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
      ({ title, markedByStaff, slug, id }) => /* html */ `<tr>
      <td><a href="/confessions/${slug}">${title}</a></td>
      <td>${
        markedByStaff
          ? `<a href="/profile/${markedByStaff}">${markedByStaff}</a>`
          : 'None'
      }</td>
      <td><a class="btn btn-yellow" href="/edit/${id}">Edit </a></td>
      <td><button class="btn btn-purple" data-id="${id}">Mark</button></td>
      </tr>`
    )
    .join('');

  tbody.innerHTML = html;
  allConfessionTable.querySelector('tbody')?.remove();
  allConfessionTable.insertAdjacentElement('beforeend', tbody);
}

async function fetchNewPage(e) {
  allConfessions = await fetchAllConfessions(e.target.dataset.page);
  allConfessionTable.dispatchEvent(new CustomEvent('update'));
}

prevPageBtn.addEventListener('click', fetchNewPage);
nextPageBtn.addEventListener('click', fetchNewPage);
allConfessionTable.addEventListener('update', updateAllConfessions);

// Load all confessions when DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
  allConfessions = await fetchAllConfessions();
  allConfessionTable.dispatchEvent(new CustomEvent('update'));
});
