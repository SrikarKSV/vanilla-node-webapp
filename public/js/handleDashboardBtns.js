async function fetchControl(url, method, confessionId) {
  const response = await fetch(url, {
    method,
    headers: { Accept: 'application/json' },
    body: JSON.stringify({ id: confessionId }),
  });
  return response.json();
}

export async function handleDashboardBtns(e) {
  const button = e.target;

  if (button.classList.contains('btn-delete')) {
    console.log('DELETE');
    const confessionId = button.dataset.id;
    const data = await fetchControl('/api/delete', 'DELETE', confessionId);
    console.log(data);
  } else if (button.classList.contains('btn-mark')) {
    console.log('MARK');
    const confessionId = button.dataset.id;
    const data = await fetchControl('/api/mark', 'PATCH', confessionId);
    console.log(data);
  } else if (button.classList.contains('btn-unmark')) {
    console.log('UNMARK');
    const confessionId = button.dataset.id;
    const data = await fetchControl('/api/unmark', 'PATCH', confessionId);
    console.log(data);
  }
}
