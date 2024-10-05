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

  // Add this at the end of the file, inside the DOMContentLoaded event listener

  const quickCmdsToggle = document.getElementById('quick-cmds-toggle');
  const quickCmds = document.getElementById('quick-cmds');

  // Set initial state
  quickCmds.style.display = 'none';

  quickCmdsToggle.addEventListener('change', () => {
    quickCmds.style.display = quickCmdsToggle.checked ? 'flex' : 'none';
  });

  // Log the toggle action
  console.log('Quick commands toggle functionality added');

  const quickCmdsForm = document.getElementById('quick-cmds');
  const searchBox = document.getElementById('search-box');

  quickCmdsForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting normally
    const command = searchBox.value.trim();
    if (command) {
      console.log('Command submitted:', command);
      // Here you can add logic to process the command
      // For example, send it to the main process or handle it directly
      searchBox.value = ''; // Clear the search box after submission
    }
  });
});

// Log when the script is loaded
console.log('renderer.js loaded');
