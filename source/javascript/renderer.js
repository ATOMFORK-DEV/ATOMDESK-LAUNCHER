const { ipcRenderer } = require('electron');

document.getElementById('min-button').addEventListener('click', () => {
  ipcRenderer.send('minimize-window');
});

document.getElementById('close-button').addEventListener('click', () => {
  ipcRenderer.send('close-window');
});

// Function to swap content
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

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const titlebarIcon = document.getElementById('titlebar-icon');
  
  // Left click event for swapping content
  titlebarIcon.addEventListener('click', (event) => {
    if (event.button === 0) {  // Left click
      swapContent();
      console.log('Titlebar icon clicked, swapping content');
    }
  });

  // Right click event for context menu
  titlebarIcon.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    ipcRenderer.send('show-titlebar-context-menu');
    console.log('Titlebar icon right-clicked, showing context menu');
  });

  // Tab functionality
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(tabId) {
    tabButtons.forEach(button => {
      button.classList.remove('active');
      if (button.dataset.tab === tabId) {
        button.classList.add('active');
      }
    });

    tabPanes.forEach(pane => {
      pane.classList.remove('active');
      if (pane.id === tabId) {
        pane.classList.add('active');
      }
    });
  }

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      switchTab(button.dataset.tab);
    });
  });
});

// Log when the script is loaded
console.log('renderer.js loaded');
