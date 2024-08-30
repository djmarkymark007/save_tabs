
chrome.runtime.onStartup.addListener(() => {
  const status = document.getElementById('start');
  status.textContent = 'starting...';
});