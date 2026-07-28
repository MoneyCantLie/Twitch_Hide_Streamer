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
    if (link.getAttribute('href').includes('/clip/')) return;

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

function enforcePause(video) {
  video.pause();
  if (video.dataset.hidePauseBound === 'true') return;
  video.dataset.hidePauseBound = 'true';
  video._twitchHideHandler = () => video.pause();
  video.addEventListener('play', video._twitchHideHandler);
}

function releasePause(video) {
  if (video && video._twitchHideHandler) {
    video.removeEventListener('play', video._twitchHideHandler);
    delete video._twitchHideHandler;
    video.dataset.hidePauseBound = '';
  }
}

function showHiddenBanner(hiddenEntry) {
  const video = document.querySelector('video');
  const playerContainer = video
    ? (video.closest('[data-a-target="video-player"]') || video.parentElement)
    : document.body;

  if (getComputedStyle(playerContainer).position === 'static') {
    playerContainer.style.position = 'relative';
  }

  const overlay = document.createElement('div');
  overlay.id = 'twitch-hide-banner';

  const dateLine = document.createElement('p');
  dateLine.textContent = `You hid this streamer on ${hiddenEntry.hiddenAt}`;

  const questionLine = document.createElement('p');
  questionLine.textContent = `Do you want to unhide ${hiddenEntry.name}?`;

  const buttonRow = document.createElement('div');

  const unhideButton = document.createElement('button');
  unhideButton.textContent = 'Yes, unhide';

  const keepButton = document.createElement('button');
  keepButton.textContent = 'No, keep hidden';

  buttonRow.appendChild(unhideButton);
  buttonRow.appendChild(keepButton);

  overlay.appendChild(dateLine);
  overlay.appendChild(questionLine);
  overlay.appendChild(buttonRow);
  playerContainer.appendChild(overlay);

  keepButton.addEventListener('click', () => {
    overlay.remove();
  });

  unhideButton.addEventListener('click', () => {
    chrome.storage.local.get('hiddenChannels', (result) => {
      const hiddenChannels = result.hiddenChannels || [];
      const updated = hiddenChannels.filter(ch => ch.name !== hiddenEntry.name);
      chrome.storage.local.set({ hiddenChannels: updated }, () => {
        overlay.remove();
        const currentVideo = document.querySelector('video');
        if (currentVideo) {
          releasePause(currentVideo);
          currentVideo.play();
        }
      });
    });
  });
}

function checkCurrentChannelPage() {
  chrome.storage.local.get('hiddenChannels', (result) => {
    const hiddenChannels = result.hiddenChannels || [];
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const currentChannel = pathParts[0];

    const existingBanner = document.getElementById('twitch-hide-banner');
    const hiddenEntry = hiddenChannels.find(ch => ch.name === currentChannel);
    const video = document.querySelector('video');

    if (hiddenEntry) {
      if (video) enforcePause(video);
      if (!existingBanner) showHiddenBanner(hiddenEntry);
    } else if (!hiddenEntry) {
      if (existingBanner) existingBanner.remove();
      if (video) releasePause(video);
    }
  });
}

hideChannels();
addHideButtons();
hideSidebarChannels();
addSidebarHideButtons();
checkCurrentChannelPage();

const observer = new MutationObserver(() => {
  hideChannels();
  addHideButtons();
  hideSidebarChannels();
  addSidebarHideButtons();
  checkCurrentChannelPage();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});