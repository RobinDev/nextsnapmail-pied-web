# Validation

Run payload, syntax, reproducible-build and diagnostic tests:

```sh
python3 tools/verify.py
python3 -m unittest discover -s tests -p 'test_*.py'
```

The diagnostic tests simulate a preserved install, changed files, a new version, a disabled plugin and an app update overwriting just the core patch. They verify that inspection leaves files unchanged.

## Native filtered-selection checks

Use a separate source checkout of the NextSnapMail revision recorded in `release.json`, with PHP 8.1+:

```sh
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php tests/filtered-selection.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php tests/attachment-image.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php tests/unread-drafts.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php tests/unread-order.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php tests/virtual-conversation-search.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php tests/conversation.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php tests/scheduled-send.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php tests/reminders.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php ../integrations/scheduler/tests/sender.php
NEXTSNAPMAIL_SOURCE=/path/to/NextSnapMail php ../integrations/scheduler/tests/reminders.php
```

IMAP transport is mocked. The tests use the actual native IMAP parsing/classes and the plugin endpoint; they do not connect to a mailbox or delete mail.
The image endpoint checks use the native account-scoped file storage with temporary, fictional images.
They verify login/POST requirements, account isolation, format/size/path rejection and unchanged originals.

## Browser fixtures

```sh
python3 tools/serve-fixtures.py --upstream /path/to/NextSnapMail
```

Open `http://127.0.0.1:8876/.local-work/images-native-preview.html`. The server binds only localhost and exposes curated fixture/plugin/theme paths and the upstream `app/` static files. Never point it at a production installation containing private data.

Fixtures run native Squire, HtmlEditor, ComposeAttachmentModel, Jua callbacks and message serialization. Their extracted methods are from SnappyMail 2.38.2. Transport and addresses are fictitious. If the upstream version changes, regenerate/review the extracted native code and test the new application too; serving newer static libraries alone is not sufficient.

Browser scripts use the dev-browser CLI's persistent `browser` API. Run these in order, using a standalone browser or an established browser connection:

```sh
dev-browser-agent --timeout 90 < tests/browser/test-squire-next.js
dev-browser-agent --timeout 60 < tests/browser/test-composer-images.js
dev-browser-agent --timeout 40 < tests/browser/test-image-edge-cases.js
dev-browser-agent --timeout 35 < tests/browser/image-toolbar-regression.js
dev-browser-agent --timeout 35 < tests/browser/image-markdown-regression.js
dev-browser-agent --timeout 30 < tests/browser/test-reader-copy-md.js
dev-browser-agent --timeout 30 < tests/browser/test-quote-readability.js
dev-browser-agent --timeout 40 < tests/browser/test-reader-addresses.js
dev-browser-agent --timeout 60 < tests/browser/test-virtual-conversation.js
dev-browser-agent --timeout 45 < tests/browser/test-inline-reply.js
dev-browser-agent --timeout 30 < tests/browser/test-reply-priority.js
dev-browser-agent --timeout 30 < tests/browser/test-reader-signature-cleanup.js
dev-browser-agent --timeout 60 < tests/browser/test-nextcloud-images.js
dev-browser-agent --timeout 60 < tests/browser/test-unread-drafts.js
dev-browser-agent --timeout 40 < tests/browser/test-list-metadata.js
dev-browser-agent --timeout 25 < tests/browser/test-list-metadata-fallback.js
dev-browser-agent --timeout 45 < tests/browser/test-desktop-scan.js
dev-browser-agent --timeout 45 < tests/browser/test-mail-polish.js
dev-browser-agent --timeout 45 < tests/browser/test-composer-actions.js
dev-browser-agent --timeout 45 < tests/browser/test-composer-recipients.js
dev-browser-agent --timeout 45 < tests/browser/test-elevation.js
dev-browser-agent --timeout 75 < tests/browser/test-send-now.js
dev-browser-agent --timeout 45 < tests/browser/test-empty-state.js
dev-browser-agent --timeout 50 < tests/browser/test-native-controls.js
dev-browser-agent --timeout 50 < tests/browser/test-font-delivery.js
dev-browser-agent --timeout 45 < tests/browser/test-selection-mode.js
dev-browser-agent --timeout 35 < tests/browser/test-conversation-toggle.js
dev-browser-agent --timeout 40 < tests/browser/test-unread-order.js
dev-browser-agent --timeout 45 < tests/browser/test-left-panel-state.js
dev-browser-agent --timeout 60 < tests/browser/test-scheduled-send.js
dev-browser-agent --timeout 90 < tests/browser/test-reminders.js
```

`test-squire-next.js` first proves that the optional bundle registers without replacing the
native default, then selects `Squire 2.4 (test)` through the native editor-name contract. It
covers `Ctrl+I`, partial and cross-paragraph blockquotes, the SnappyMail style adapter and a
representative HTML round trip. The selected setting affects newly created composers only.

The edge-case script continues on the image-check page created by the first script. Clipboard/file inputs are populated with generated image Files; OS dialogs and real mail transport are not tested. Cases cover compression, alpha/animation safeguards, resizing, undo, Markdown, serialization, upload replacement/failure/retry/removal and stale callbacks after changing draft.

The Nextcloud script uses `?nextcloud=1`, which loads the actual bundled WebDAV picker and
attachment command. Popup lifecycle and network are mocked. It verifies authenticated URL
construction, native selection/cancellation, inline compression, Nextcloud/restored attachments,
failure/retry, draft changes, HTML-only image paste and mixed-format selection feedback.

This curated harness accompanies the baseline's image/editor validation. It does not claim to cover every legacy customization or substitute for testing the upgraded application in an authenticated test mailbox.

The unread-draft fixture uses `?drafts=1&mode=list&side=1`, extracting the actual native
MessageCollectionModel, MessageModel, EmailModel and attachment models from the reference
engine. IMAP/network, popup opening and the HTML rendering helper are simulated. Cases cover
actual UNSEEN filtering, folder/UID collisions, native draft metadata, account races,
pagination, search exclusion, an in-flight compose-close refresh after successful send,
empty Inbox, retry, text escaping and mobile geometry.

The metadata script uses the actual native list click dispatcher with mocked flag updates
and conversation navigation. It checks pointer/keyboard actions, existing multi-selection
semantics, unread updates, language/theme restoration and responsive geometry.

The metadata fallback fixture loads the theme with no plugin or pw-theme class, then loads
the metadata script after the DOM exists without a view-model event. It checks base CSS,
followed rows, late binding, live counts and native stylesheet replacement.

`test-conversation-toggle.js` checks the actual bootstrap key, pressed styling and
opposite setting request in desktop/mobile and light/dark fictional list fixtures.
It also switches the list to Trash, where the control must disappear, and verifies
that both POST and cached GET list/reader requests have their thread parameters
removed while Inbox requests keep the saved preference.

`test-unread-order.js` keeps the Inbox Conversation and mixed-order controls active together,
checks complete first-page unread merging and later-page deduplication, treats a conversation
with an unread member as its own group after visibly unread roots, verifies oldest-first
unread/read segmentation, moves a row
between those segments when its read state changes, and verifies true oldest-first Draft
pagination. It also covers the existing per-account read-transition setting, load/save calls,
Inbox/search scope, failure feedback and the mobile control group. The fixture uses fictional
rows and mocked preference/mail endpoints.

`test-send-now.js` builds the outgoing notice from the markup `background-send.js`
ships, so a change to `render()` cannot leave it passing, and checks the Send now
control: its place beside Undo, its 44 px target and 20 px glyph, its accessible
name, the hidden state once the countdown ends, the resting and focused surfaces
and ring, non-text contrast, both controls free of the Nextcloud button border,
and the 390 px layout. It also drives `createSendDelay` with an injected clock to
confirm that a cancelled delay never sends and a completed one sends once. The
fixture root is pinned to `data-themes="light"`, so the dark pass compares the
glyph with the subject line's token rather than reading an absolute dark ratio.
It additionally drives the real background-send success path with a native-shaped
reply model: the source and its conversation row gain `\\answered`, the reader event
is account/folder/UID scoped, and no eager list reload erases that immediate state.
Transport remains mocked; no message is sent.

`tests/scheduled-send.php` covers the `PiedWebScheduledSend` endpoint and the header it
stamps, using the native message builder and header parser: the queue folder derived from the
account's own Drafts setting, the refusal to stamp anywhere else, unusable and out-of-range
times, the UTC form written into the message, the note left for the sender and its heartbeat,
the states read back from the folder, both cancel modes, and the refusal to cancel a message
the sender has claimed. `../integrations/scheduler/tests/sender.php` covers the server-side
pass with IMAP and SMTP simulated: claim before transaction, header surgery, recipients from
To/Cc/Bcc, the Sent copy, the reply flag, retry, abandonment after a day, a send that could
not be filed, and a server without custom keywords. Neither opens a mailbox or sends mail.

`test-scheduled-send.js` mounts the composer control on the engine's own `PopupsCompose`
header template, then checks its place beside Send, its accessible name, the panel it opens,
the times offered, the free field's lower bound, 44 px targets, the resting and focused
surfaces, the focus ring under the keyboard, Escape returning the focus, the UTC instant
handed over once, the refusal of a past time, the control hidden when the mailbox cannot keep
drafts, and the 390 px layout. The compose view model, the endpoint and the sender are
simulated; the message rows and reader bar of the queue folder have no fixture yet.

`tests/reminders.php`, `../integrations/scheduler/tests/reminders.php` and
`test-reminders.js` cover the timed-reminder path without opening a mailbox: IMAP keyword and
folder operations, safe rollback, due wake-up as unread, list/reader controls, thread-aware bulk
selection, worker errors, keyboard focus and responsive geometry. All message data is fictional
and browser transport is mocked.

`test-left-panel-state.js` uses `?panel=1`, the only fixture page that keeps a stored
sidebar choice. It checks the native default, storing a collapse and an expansion,
restoration after reload at the 72 px rail width, the mobile drawer left alone in both
directions, the return over the 800 px breakpoint and an application-driven expansion
that is neither stored nor undone.

`test-selection-mode.js` opens one fictional message before entering desktop selection.
It verifies that Ctrl/Cmd+click carries that active row into the checked group and adds the
clicked row, then covers further toggles, grouped commands, Done/Escape, touch hold, scroll
cancellation, native-control independence and the checkbox fallback. No mailbox is opened.

`test-reader-addresses.js` uses the reader fixture's native-shaped recipient rows,
expanded details table and a copy of the mailto interception that the native reader of
SnappyMail 2.38.2 performs. It checks the linked address lines, composing with and
without a display name, Ctrl+click and Ctrl+Enter copying without composing, Enter still
composing, the placement and clearing of the confirmation, the focus ring, the sender
line, a refused clipboard, theme exit and a 320 px reader. The clipboard is mocked; no
message is sent.

`test-virtual-conversation.js` opens the native reader fixture with fictional
received and Sent messages. It verifies late mounting, the newest message from
either folder opening natively, one-click access to earlier messages, read-only
searches, retry, account isolation, theme exit, narrow layout, one card border,
native Close placement, the earliest-subject heading, open-subject typography,
conceal/reveal during delayed searches, and the successful-reply event that fetches,
opens and scrolls to a new Sent copy while marking the feed row. It does not use an
authenticated mailbox.

`test-inline-reply.js` docks the native Reply and Reply all composer in a fictional
active conversation, then promotes that exact editor DOM to its modal form. It checks
recipient/editor visibility, the Expand control, locked duplicate compose actions,
content and caret preservation, Forward remaining modal, narrow geometry and safe
restoration when the Pied Web theme is left. No transport is opened and no mail is sent.

`test-reply-priority.js` switches the same reader between a fictional group message and a
direct message. It checks that the first/emphasized toolbar command and icon-labeled bottom
primary follow the actual recipient count, that the native Reply/Reply all/Forward commands
still run, and that the 390 px controls retain their touch targets without overflow.

`test-quote-readability.js` covers the strict Outlook desktop and web header shapes that
carry earlier messages without a blockquote. It checks native disclosure structure,
manual state, the collapse preference, theme restoration, a ruled-note false positive and
the guard that keeps a whole message visible when its Outlook-shaped header comes first. It
also checks the Outlook forwarding shape with a broad `dir="ltr"` wrapper and a ruled inner
header, where the current note stays visible and only the forwarded message is folded,
using fictional content only.
