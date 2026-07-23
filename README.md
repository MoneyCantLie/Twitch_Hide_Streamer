# Twitch Hide Streamer

Chrome extension that lets you hide unwanted or uninteresting streamers on Twitch/both in the main directory grid and in the sidebar/with a single click.

## Features

- 🚫 Hide any streamer directly from their card with one click (main grid, recommendations shelf, and sidebar)
- 📋 View all hidden channels in the popup, with the date each one was hidden
- 🔍 You can search through your hidden channels list
- ↩️ Unhide a channel anytime with the "Remove" button
- 🔢 Badge counter on the toolbar icon showing how many channels are currently hidden


## Installation

Since this extension isn't published on the Chrome Web Store yet, you can load it manually:

1. Download or clone this repository
2. Open `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the project folder

## How it works

The extension uses a content script that scans Twitch pages for streamer cards, checks each one against a list of hidden channel names stored in `chrome.storage.local`
hides matching cards. A `MutationObserver` keeps watching the page so newly loaded content (infinite scroll, recommendations) gets checked too.

## Tech stack

- Manifest V3
- JavaScript (Content Scripts, Service Worker/Background)
- Chrome Storage API
- HTML/CSS

## Known limitations

- The autoplay "featured content" carousel widget at the top of the homepage sidebar isn't supported — it uses a different, more complex structure than regular streamer cards
- Hiding a streamer in the middle of a horizontal "shelf" row (e.g. recommendations) leaves a small empty gap instead of the remaining cards reflowing, due to how Twitch positions items in that carousel

## License

MIT
