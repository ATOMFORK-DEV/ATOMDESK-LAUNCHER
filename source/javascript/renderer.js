const { ipcRenderer, contextBridge } = require('electron');

document.getElementById('min-button').addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

document.getElementById('max-button').addEventListener('click', () => {
  ipcRenderer.send('maximize-window');
});

document.getElementById('restore-button').addEventListener('click', () => {
  ipcRenderer.send('unmaximize-window');
});

document.getElementById('close-button').addEventListener('click', () => {
  ipcRenderer.send('close-window');
});

// Hide the restore button by default
document.getElementById('restore-button').style.display = 'none';

// Listen for window state changes
ipcRenderer.on('window-maximized', () => {
  document.getElementById('max-button').style.display = 'none';
  document.getElementById('restore-button').style.display = 'flex';
});

ipcRenderer.on('window-unmaximized', () => {
  document.getElementById('max-button').style.display = 'flex';
  document.getElementById('restore-button').style.display = 'none';
});

// Add event listener for the titlebar icon
document.getElementById('titlebar-icon').addEventListener('contextmenu', (e) => {
  e.preventDefault();
  ipcRenderer.send('show-titlebar-context-menu');
});

// Add this function to swap the content
function swapContent() {
  const content = document.getElementById('content');
  const alternateContent = document.getElementById('alternate-content');
  
  if (content.style.display !== 'none') {
    content.style.display = 'none';
    alternateContent.style.display = 'block';
  } else {
    content.style.display = 'block';
    alternateContent.style.display = 'none';
  }
}

// Add an event listener to the titlebar icon
document.addEventListener('DOMContentLoaded', () => {
  const titlebarIcon = document.getElementById('titlebar-icon');
  titlebarIcon.addEventListener('click', (event) => {
    // Check if it's a left click (button property is 0 for left click)
    if (event.button === 0) {
      swapContent();
    }
  });
});
