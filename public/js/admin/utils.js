const notification = document.querySelector('.dashboard__notification');

export function showNotification(message, statusCode) {
  notification.textContent = message;
  const color = statusCode >= 400 ? 'red' : 'green';
  notification.setAttribute('style', `background: var(--${color});`);
  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}
