function updateBadge() {
  chrome.storage.local.get('hiddenChannels', (result) => {
    const hiddenChannels = result.hiddenChannels || [];
    const count = hiddenChannels.length;

    chrome.action.setBadgeText({ text: count > 0 ? String(count) : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#9146FF' });
  });
}

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.hiddenChannels) {
    updateBadge();
  }
});

updateBadge();
