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
  
  if (content.style.display === 'none') {
    content.style.display = 'flex';
    alternateContent.style.display = 'none';
  } else {
    content.style.display = 'none';
    alternateContent.style.display = 'block';
  }
}

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const titlebarIcon = document.getElementById('titlebar-icon');
  
  // Left click event for swapping content
  titlebarIcon.addEventListener('click', (event) => {
    swapContent();
    console.log('Titlebar icon clicked, swapping content');
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
  const quickCmdsContent = document.getElementById('quick-cmds-content');
  const leftColumn = document.getElementById('left-column');
  const rightColumn = document.getElementById('right-column');

  // Set initial state
  quickCmds.style.display = 'none';
  
  // Ensure left and right columns are always visible
  leftColumn.style.display = 'block';
  rightColumn.style.display = 'block';

  quickCmdsToggle.addEventListener('change', () => {
    const display = quickCmdsToggle.checked ? 'flex' : 'none';
    quickCmds.style.display = display;
    
    // We don't toggle quickCmdsContent anymore
    // quickCmdsContent.style.display = display;
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
