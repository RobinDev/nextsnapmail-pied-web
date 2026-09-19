# Pied Web for NextSnapMail

A responsive theme and companion plugin for NextSnapMail inside Nextcloud. Clearer folders and message actions, timed reminders, Markdown composition, image controls, a floating three-second Undo Send you can also cut short, and a scheduled send that leaves with the browser closed.

Independent customization, not an official NextSnapMail or Nextcloud release.

![Inline image controls](docs/screenshots/nextcloud-images-desktop.png)

## Included

- Clear folder hierarchy, quieter secondary counters and a compact icon sidebar that stays collapsed after a reload. A roomier desktop layout starts at 1200 px, leaving mobile unchanged. Desktop list rows have a clickable read-status dot, hover/focus stars, right-hand attachment and conversation-count columns, and resizable panes.
- Mobile account identity, usable account menus, consistent icons and message actions. Ctrl+click enters multi-selection on desktop, carrying the already-open message into the group before adding the clicked row; a long touch starts selection on mobile, with no visible checkboxes.
- Reply and Reply all compose inline at the bottom of an active Inbox conversation, with an
  Expand control that keeps the same draft and cursor in the full composer. Multi-correspondent
  messages put Reply all first in the reader and use it as the icon-labeled bottom action. Mark unread,
  visible Unsubscribe and Messages/Conversations switching remain in the reader toolbar.
  The reader's native label menu sits as an icon between message details and the star.
- In Inbox Conversations mode, the newest received or sent message opens in the native reader; earlier messages show a one-line text preview and stay one click away, without storing extra copies. Trash and every other folder always show individual messages.
- Selection of all filtered results across pages, with explicit deletion confirmation.
- Swipe to delete and Delete-key handling for selected list messages.
- Readable interleaved quotations, folded Outlook histories and native message flag controls.
- Floating three-second Undo Send while continuing to use the mailbox, with a send
  glyph that skips the rest of the countdown.
- Timed mail reminders from one message or a selection: the message waits, read, in a visible
  IMAP folder and returns to Inbox unread at the chosen time, even with the browser closed.
  See [mail reminders](docs/REMINDERS.md).
- Scheduled send: a time chosen beside Send, the message kept in its own mailbox folder, and a
  [companion Nextcloud app](integrations/scheduler/README.md) that hands it to SMTP at that time,
  at most once, browser open or not. See [scheduled send](docs/SCHEDULED_SEND.md).
- Markdown editing and formatted Markdown paste, alongside HTML source and visual editing.
- Clickable addresses in the message header: a click writes a new message with the display name,
  Ctrl/Cmd+click or Ctrl+Enter copies the bare address.
- Copy an open message body as Markdown from the reader toolbar, with compact text for common HTML signatures.
- A lighter editor toolbar with advanced controls behind More.
- Inline image sizing, pointer/keyboard resize, alt text and removal.
- Browser-side compression for clipboard images and local, Nextcloud or restored image attachments.
- Nextcloud files from the Image toolbar, compressed and inserted directly in the message body.
- Genuinely unread drafts at the top of the Inbox feed, with one-click resume.
- An Inbox-only mixed order that gathers every unread message on the first page, keeps visibly
  unread roots together, then conversations with an older unread member, and finally read
  messages newest-first, independently of Conversations.

The optional linked-account unread counter correction is a separate [upstream PR](https://github.com/oe79/NextSnapMail/pull/41) and [version-specific patch](patches/README.md).
Selected UX enhancements are proposed for upstream integration in [NextSnapMail issue #46](https://github.com/oe79/NextSnapMail/issues/46). This public repository provides the prototype and validation history; the proposal asks the maintainer which focused changes to accept and does not claim the plugin can be merged as-is.

This does **not** implement a unified inbox or a new vacation responder. Nextcloud invitation import and Sieve use the existing integrations and administrator configuration. Undo Send is a browser delay before SMTP submission, not recall after delivery. Scheduled delivery is a delayed submission by the companion app on this server, not a queue held by the mail server, and not a recall once the message has been handed over; without that app installed the composer refuses to schedule.

## Install and maintain

[Nextcloud Calendar](integrations/calendar/README.md) also has a full-window workspace,
with the native app grid beside the event filter. It is installed and versioned separately.

Release **1.8.19**, tested with Nextcloud **34.0.4**, NextSnapMail **0.1.11**, embedded SnappyMail **2.38.2**. Other versions are unverified.

1. Follow [installation and removal](docs/INSTALL.md).
2. Read [what survives upgrades](docs/UPDATES.md).
3. Run the read-only check after an update:

```sh
python3 tools/check-install.py --nextcloud /path/to/nextcloud
```

The plugin is stored in NextSnapMail's data directory, and the theme under Nextcloud's custom themes. Normal updates generally preserve those files. Preserved files do not guarantee compatibility with new DOM, editor or PHP APIs. The optional core patch is overwritten when the app is replaced.

[Inline replies](docs/INLINE_REPLY.md) · [Mail reminders](docs/REMINDERS.md) · [Unread drafts](docs/UNREAD_DRAFTS.md) · [Unread order](docs/UNREAD_ORDER.md) · [Header addresses](docs/READER_ADDRESSES.md) · [Image usage and limits](docs/IMAGES.md) · [Maintenance memory](docs/MAINTENANCE.md) · [Product decisions](docs/CONTEXT.md)

## Develop

No dependency download is needed to use the included release. Third-party browser libraries, fonts and icons are vendored with their notices.

```sh
python3 tools/verify.py
python3 -m unittest discover -s tests -p 'test_*.py'
python3 tools/package.py
```

`verify.py` checks payload hashes, JS/PHP syntax and a reproducible theme build. Run it with Python 3.9+, Node.js and PHP 8.1+. The library version matrix and third-party licenses are documented in [THIRD_PARTY.md](THIRD_PARTY.md).

[Tests and browser fixtures](tests/README.md) use a separate upstream source checkout and fictional mail data. [Release notes](CHANGELOG.md) record the published baseline and its validation boundaries.

<img src="docs/screenshots/nextcloud-images-mobile.png" alt="Image controls on mobile" width="300"> <img src="docs/screenshots/nextcloud-images-dark.png" alt="Dark theme" width="300">

## License

AGPL-3.0-only for this project, consistent with NextSnapMail. Bundled third-party components retain their respective licenses and attribution. See [LICENSE](LICENSE) and [THIRD_PARTY.md](THIRD_PARTY.md).
