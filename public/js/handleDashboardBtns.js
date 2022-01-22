import { showNotification } from './utils';

async function fetchControl(url, method, confessionId) {
  const response = await fetch(url, {
    method,
    headers: { Accept: 'application/json' },
    body: JSON.stringify({ id: confessionId }),
  });
  return response.json();
}

async function handleDeleteBtn(button) {
  console.log('DELETE');
  const confessionId = button.dataset.id;
  const { msg: message, status: statusCode } = await fetchControl(
    '/api/delete',
    'DELETE',
    confessionId
  );
  showNotification(message, statusCode);

  if (statusCode === 200 || statusCode === 410) {
    const parentTr = button.closest('tr');
    parentTr.remove();
  }
}

async function handleMarkBtn(button, updateAllConfessionState, allConfessions) {
  console.log('MARK');
  const confessionId = button.dataset.id;
  const {
    msg: message,
    status: statusCode,
    markedByStaff,
  } = await fetchControl('/api/mark', 'PATCH', confessionId);
  showNotification(message, statusCode);

  if (statusCode === 200 || statusCode === 422) {
    const { confessions: outdatedConfessions } = allConfessions;
    const confessions = outdatedConfessions.map((c) => {
      const confession = { ...c };
      if (confession.id === confessionId) {
        confession.markedByStaff = markedByStaff;
      }
      return confession;
    });

    updateAllConfessionState(confessions);
  }
}

async function handleUnMarkBtn(button) {
  console.log('UNMARK');
  const confessionId = button.dataset.id;
  const { msg: message, status: statusCode } = await fetchControl(
    '/api/unmark',
    'PATCH',
    confessionId
  );
  showNotification(message, statusCode);

  if (statusCode === 200 || statusCode === 422) {
    const parentTr = button.closest('tr');
    parentTr.remove();
  }
}

export async function handleDashboardBtns(
  e,
  updateAllConfessionState,
  allConfessions
) {
  const button = e.target;

  if (button.classList.contains('btn-delete')) handleDeleteBtn(button);
  else if (button.classList.contains('btn-mark'))
    handleMarkBtn(button, updateAllConfessionState, allConfessions);
  else if (button.classList.contains('btn-unmark')) handleUnMarkBtn(button);
}
