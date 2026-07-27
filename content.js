function hideChannels() {
  chrome.storage.local.get('hiddenChannels', (result) => {
    const hiddenChannels = result.hiddenChannels || [];

    document.querySelectorAll('a[data-a-target="preview-card-image-link"]').forEach(link => {
      const channelName = link.getAttribute('href').replace('/', '');

      if (hiddenChannels.some(ch => ch.name === channelName)) {
        const card = link.closest('.shelf-card__impression-wrapper') || link.closest('article');
        if (card) {
          card.style.setProperty('display', 'none', 'important');
        }
      }
    });
  });
}

function addHideButtons() {
  document.querySelectorAll('a[data-a-target="preview-card-image-link"]').forEach(link => {
    const card = link.closest('.shelf-card__impression-wrapper') || link.closest('article');
    if (!card) return;

    if (card.dataset.hideButtonAdded) return;

    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }

    const button = document.createElement('button');
    button.textContent = 'X';
    button.className = 'twitch-hide-button';
    button.style.position = 'absolute';
    button.style.top = '-6px';
    button.style.right = '-6px';
    button.style.zIndex = '9999';
    card.appendChild(button);

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      chrome.storage.local.get('hiddenChannels', (result) => {
        const hiddenChannels = result.hiddenChannels || [];
        const channelName = link.getAttribute('href').replace('/', '');

        if (!hiddenChannels.some(ch => ch.name === channelName)) {
          const avatarImg = card.querySelector('img[src*="profile_image"]');
          const avatarUrl = avatarImg ? avatarImg.src : null;

          hiddenChannels.push({
            name: channelName,
            hiddenAt: new Date().toISOString().split('T')[0],
            avatarUrl: avatarUrl
          });
          chrome.storage.local.set({ hiddenChannels: hiddenChannels }, () => {
            card.style.setProperty('display', 'none', 'important');
          });
        }
      });
    });

    card.dataset.hideButtonAdded = 'true';
  });
}

function hideSidebarChannels() {
  chrome.storage.local.get('hiddenChannels', (result) => {
    const hiddenChannels = result.hiddenChannels || [];

    document.querySelectorAll('a.side-nav-card__link').forEach(link => {
      const channelName = link.getAttribute('href').replace('/', '');

      if (hiddenChannels.some(ch => ch.name === channelName)) {
        const card = link.closest('.side-nav-card');
        if (card) {
          card.style.setProperty('display', 'none', 'important');
        }
      }
    });
  });
}

function addSidebarHideButtons() {
  document.querySelectorAll('a.side-nav-card__link').forEach(link => {
    const card = link.closest('.side-nav-card');
    if (!card) return;

    if (card.dataset.hideButtonAdded) return;

    if (getComputedStyle(card).position === 'static') {
      card.style.position = 'relative';
    }

    const button = document.createElement('button');
    button.textContent = 'X';
    button.className = 'twitch-hide-button';
    button.style.position = 'absolute';
    button.style.top = '-6px';
    button.style.left = '-6px';
    button.style.right = 'auto';
    button.style.zIndex = '9999';
    card.appendChild(button);

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      chrome.storage.local.get('hiddenChannels', (result) => {
        const hiddenChannels = result.hiddenChannels || [];
        const channelName = link.getAttribute('href').replace('/', '');

        if (!hiddenChannels.some(ch => ch.name === channelName)) {
          const avatarImg = card.querySelector('img[src*="profile_image"]');
          const avatarUrl = avatarImg ? avatarImg.src : null;

          hiddenChannels.push({
            name: channelName,
            hiddenAt: new Date().toISOString().split('T')[0],
            avatarUrl: avatarUrl
          });
          chrome.storage.local.set({ hiddenChannels: hiddenChannels }, () => {
            card.style.setProperty('display', 'none', 'important');
          });
        }
      });
    });

    card.dataset.hideButtonAdded = 'true';
  });
}

hideChannels();
addHideButtons();
hideSidebarChannels();
addSidebarHideButtons();

const observer = new MutationObserver(() => {
  hideChannels();
  addHideButtons();
  hideSidebarChannels();
  addSidebarHideButtons();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});