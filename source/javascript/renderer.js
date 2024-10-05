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

  // Start menu functionality
  const pinnedAppGrid = document.getElementById('pinned-app-grid');
  const allAppList = document.getElementById('all-app-list');

  let apps = [
    { name: 'Calculator', icon: 'fa-calculator', pinned: true },
    { name: 'Editor', icon: 'fa-pen', pinned: true },
    { name: 'Terminal', icon: 'fa-terminal', pinned: true },
    { name: 'Browser', icon: 'fa-globe', pinned: true },
    { name: 'Explorer', icon: 'fa-folder-open', pinned: true },
    { name: 'Settings', icon: 'fa-gear', pinned: true },
    { name: 'Music', icon: 'fa-music', pinned: false },
    { name: 'Camera', icon: 'fa-camera', pinned: false },
    // Add more apps as needed
  ];

  function createAppItem(app) {
    const appItem = document.createElement('div');
    appItem.className = app.pinned ? 'app-item' : 'app-list-item';
    
    const icon = document.createElement('i');
    icon.className = `app-icon fas ${app.icon}`;
    
    const name = document.createElement('span');
    name.className = 'app-name';
    name.textContent = app.name;
    
    const pinButton = document.createElement('button');
    pinButton.className = 'pin-button';
    pinButton.innerHTML = app.pinned ? '<i class="fas fa-thumbtack"></i>' : '<i class="fas fa-plus"></i>';
    
    appItem.appendChild(icon);
    appItem.appendChild(name);
    appItem.appendChild(pinButton);
    
    appItem.addEventListener('click', (e) => {
      if (e.target !== pinButton && e.target.parentElement !== pinButton) {
        console.log(`Launching ${app.name}`);
        // Add logic to launch the app
      }
    });
    
    pinButton.addEventListener('click', () => {
      app.pinned = !app.pinned;
      updateStartMenu();
    });
    
    return appItem;
  }

  function updateStartMenu() {
    pinnedAppGrid.innerHTML = '';
    allAppList.innerHTML = '';
    
    apps.forEach(app => {
      if (app.pinned) {
        pinnedAppGrid.appendChild(createAppItem(app));
      } else {
        allAppList.appendChild(createAppItem(app));
      }
    });
  }

  updateStartMenu();

  console.log('Start menu populated with pin/unpin functionality');

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
  const accordionItems = document.querySelectorAll('.accordion-item');
  const accordionButtons = document.querySelectorAll('.accordion-button');

  function filterAccordion(searchTerm) {
    searchTerm = searchTerm.toLowerCase();
    
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header span').textContent.toLowerCase();
      const buttons = Array.from(item.querySelectorAll('.accordion-button span')).map(span => span.textContent.toLowerCase());
      
      const headerMatch = header.includes(searchTerm);
      const buttonMatch = buttons.some(button => button.includes(searchTerm));
      
      if (headerMatch || buttonMatch) {
        item.style.display = 'block';
        if (buttonMatch) {
          item.querySelector('.accordion-content').style.maxHeight = 'none';
          item.querySelector('.accordion-header i').classList.replace('fa-chevron-down', 'fa-chevron-up');
        }
      } else {
        item.style.display = 'none';
      }
    });
  }

  searchBox.addEventListener('input', (e) => {
    const searchTerm = e.target.value.trim();
    filterAccordion(searchTerm);
  });

  quickCmdsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const command = searchBox.value.trim();
    if (command) {
      console.log('Command submitted:', command);
      filterAccordion(command);
      // Here you can add additional logic to process the command
      // searchBox.value = ''; // Uncomment this line if you want to clear the search box after submission
    }
  });

  // Add this new code for the accordion functionality
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const accordionItem = header.parentElement;
      const accordionContent = header.nextElementSibling;
      const icon = header.querySelector('i');

      // Close all other accordion items
      accordionItems.forEach(item => {
        if (item !== accordionItem) {
          item.querySelector('.accordion-content').style.maxHeight = null;
          item.querySelector('.accordion-header i').classList.replace('fa-chevron-up', 'fa-chevron-down');
        }
      });

      // Toggle the clicked accordion item
      if (accordionContent.style.maxHeight) {
        accordionContent.style.maxHeight = null;
        icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
      } else {
        accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
        icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
      }
    });
  });

  console.log('Accordion functionality added');
});

// Log when the script is loaded
console.log('renderer.js loaded');
