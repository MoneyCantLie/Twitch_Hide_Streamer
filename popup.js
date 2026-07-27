function renderList(searchTerm = '') {
  chrome.storage.local.get('hiddenChannels', (result) => {
    const hiddenChannels = result.hiddenChannels || [];
    const filtered = hiddenChannels.filter(channel =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const list = document.getElementById('channelsList');
    list.innerHTML = '';

    document.querySelector('h3').textContent = `Hidden channels (${filtered.length})`;

    if (filtered.length === 0) {
      const emptyMessage = document.createElement('p');
      emptyMessage.className = 'empty-state';
      emptyMessage.textContent = hiddenChannels.length === 0
        ? 'No hidden channels yet. Click X on a streamer card to hide them.'
        : 'No channels match your search.';
      list.appendChild(emptyMessage);
      return;
    }

    filtered.forEach(channel => {
      const li = document.createElement('li');

      const avatar = document.createElement('img');
      avatar.src = channel.avatarUrl || '';
      avatar.width = 24;
      avatar.height = 24;
      avatar.style.borderRadius = '50%';
      avatar.style.marginRight = '8px';
      avatar.style.background = '#2c2c35';

      const label = document.createElement('span');
      label.textContent = `${channel.name} (${channel.hiddenAt})`;
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.flex = '1';
      label.prepend(avatar);

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';

      removeButton.addEventListener('click', () => {
        chrome.storage.local.get('hiddenChannels', (result) => {
          const hiddenChannels = result.hiddenChannels || [];
          const updated = hiddenChannels.filter(ch => ch.name !== channel.name);

          chrome.storage.local.set({ hiddenChannels: updated }, () => {
            renderList(document.getElementById('searchInput').value);
          });
        });
      });

      li.appendChild(label);
      li.appendChild(removeButton);
      list.appendChild(li);
    });
  });
}

document.getElementById('addButton').addEventListener('click', () => {
  const input = document.getElementById('channelInput');
  const channelName = input.value.trim();

  if (!channelName) return;

  chrome.storage.local.get('hiddenChannels', (result) => {
    const hiddenChannels = result.hiddenChannels || [];

    if (!hiddenChannels.some(ch => ch.name === channelName)) {
      hiddenChannels.push({
        name: channelName,
        hiddenAt: new Date().toISOString().split('T')[0],
        avatarUrl: null
      });
      chrome.storage.local.set({ hiddenChannels: hiddenChannels }, () => {
        renderList();
      });
    }

    input.value = '';
  });
});

document.getElementById('searchInput').addEventListener('input', (event) => {
  renderList(event.target.value);
});

renderList();