# Releases

## 1.8.19, 2026-09-19

Sending an edited unread Draft now removes its reminder as soon as the send succeeds. Closing
the composer could start a Drafts refresh while Undo Send was still saving its durable copy;
that older response could then redraw the already-sent Draft until the minute poll. The send
success event now invalidates both the in-flight response and the rendered reminder before
querying the authoritative Drafts state again.

The browser regression holds the early refresh open, removes the fictional server-side Draft,
delivers send success, and proves that the late response cannot restore it. No transport or
mailbox is used.

## 1.8.18, 2026-09-19

The reader's reminder clock now uses the same icon pipeline as Reply, Mark unread, Archive and
Delete. It therefore shares their exact toolbar box, quiet resting colour, borderless surface,
hover treatment and responsive geometry instead of inheriting SnappyMail's generic bordered
button at the end of the group. The clock also uses the common 1.8 px stroke and optical size.

There is no reminder or mailbox behavior change. The fictional browser fixture now compares the
clock's computed box, border, surface, radius and icon dimensions directly with Mark unread.

## 1.8.17, 2026-09-18

The composer now gives **From**, **To**, **Cc**, **Bcc**, **Reply-To** and **Subject** the
same 36 px single-line height and the same right edge. SnappyMail's reserved identity-picker
space no longer shortens **From** when the picker is absent; when it is present, the picker
sits inside the full-width field without covering its text.

Recipient fields remain flexible rather than fixed-height: an empty field or one address stays
on one line, while multiple address chips may still wrap to a second line. Browser coverage uses
the native recipient-list shape and checks equal geometry, real wrapping, narrow screens and the
existing nearby Cc/Cci controls.

The action hierarchy now leaves **Send** as the only filled action, presents **Schedule** as its
outlined alternative and keeps **Save** and **Discard** quiet until interaction. Contacts, message
options, minimize and close share one 36 px utility measure (44 px on touch), have accessible names
and work from the keyboard; minimize keeps an explicit visible glyph instead of an empty target.

Field labels and nearby Cc/Cci shortcuts use the readable 14 px secondary-text step. Signing,
encryption and attachment controls lose their permanent grey blocks, retain a visible selected
state and also gain names and keyboard targets, including controls inserted later by Nextcloud.

Composer tabs now divide the available width between the modes that are actually visible, so a
hidden Mailvelope mode leaves no empty third. Selection uses a single accent line, tab arrows work
from the keyboard, narrow labels remain on one 44 px line and every panel spans the same width.
The editor itself rests on a one-pixel hairline and reserves the primary accent and ring for focus.

Inbox messages can now be given a reminder time from the reader or the existing
multi-selection bar. **This evening**, **Tomorrow morning**, **In one week** and a free local
date cover the usual triage choices. The message moves, read, to a visible `Reminders` IMAP
folder; at the chosen time the companion app returns it to Inbox unread, where the existing
unread-first flow makes it prominent again. The folder shows the reminder date, and an open
message can be rescheduled or returned immediately.

The mailbox remains the only message store. The time is an IMAP keyword, the server process
copies no subject, address or body, and a failed move restores the previous safe state. A stale
worker heartbeat or an IMAP server without custom keywords refuses the operation before hiding
mail. The scheduler app advances to 1.1.0 and shares its existing minute runner with scheduled
send. Endpoint, worker and fictional browser coverage exercise bulk/thread UIDs, time bounds,
failure rollback, keyboard focus, responsive geometry and wake-up as unread.

## 1.8.14, 2026-09-18

The **Cc** and **Cci** controls now sit directly below the **To** input, aligned to its right
edge as quiet grey text. Each control disappears as soon as its corresponding native field is
open, and returns if that field is closed from the existing advanced-fields menu. Hover adds a
subtle underline, keyboard focus remains explicit and touch layouts retain a 44 px target.

The native Cc/Bcc observables, inputs and advanced-fields menu are unchanged. Only their distant
duplicates in the composer header are hidden while Pied Web is active; leaving the theme restores
the native header unchanged. Fictional browser coverage checks placement, conditional visibility,
focus transfer, hover/focus treatment, narrow-screen containment and theme restoration.

## 1.8.13, 2026-09-18

Starting multi-selection from the reading pane now keeps the open message in the checked
group and adds the Ctrl/Command-clicked row. Previously the Pied Web capture handler bypassed
SnappyMail's native step that carries the active message into selection, so only the newly
clicked row received grouped actions.

The change remains limited to desktop Ctrl/Command+click. Later plain clicks still toggle one
row, and mobile long touch still starts a fresh selection with the held row. The fictional
browser fixture now models an actual active selector and verifies the two-message entry state,
selection count, subsequent toggles and grouped command targets.

## 1.8.12, 2026-09-18

Outlook forwarding now keeps the author's current note and signature visible, then folds the
forwarded message from its real **From / Sent / To / Subject** header. The 1.8.11 whole-message
guard was correct but exposed a broader detector flaw: a `dir="ltr"` mail wrapper inherited the
four bold labels and every line break from all its descendants, so it was rejected as an unsafe
all-or-nothing fold before the actual inner header was considered.

Header fields and line breaks must now belong to the candidate `div` itself rather than a nested
mail section. The horizontal rule Outlook puts immediately before a forwarded header is accepted
as the same visual boundary as the existing top-border, WordSection and Outlook-web shapes. This
preserves the current text, leaves the separator visible and puts only the forwarded history
behind the native quote disclosure. The production message used to diagnose the structure was
not copied into the fixture; its regression uses fictional content.

## 1.8.11, 2026-09-18

Outlook-style history is folded only when the message has real visible content before the
four-field mail header. A message that starts with such a header now stays entirely visible,
because that header can belong to the message being read rather than to quoted history. Hidden
preheaders and tracking markup do not count as a current answer and can no longer make the whole
mail disappear behind **Afficher la citation**.

The existing strict Outlook desktop/web recognition, native disclosure structure, collapse
preference, manual open state and reply/forward cleanup remain unchanged. Fictional browser
coverage now includes the whole-message false positive and a hidden-preheader variant.

## 1.8.10, 2026-09-18

**Unread: oldest first** now keeps the rows whose visible/root message is unread in one
continuous oldest-first group. Conversations whose root is read but whose badge reports an
older unread member follow in a separate oldest-first group, before fully read rows. This
prevents native grey/read indicators from appearing between the teal unread rows while still
bringing every unread conversation onto the first page.

The root's native read indicator and toggle remain truthful; no IMAP flag is changed or
invented for presentation. The change is only one extra integer comparison in the existing
in-memory sort, so it adds no request and no mailbox work. The browser fixture covers both
conversation groups and their chronological order.

## 1.8.9, 2026-09-18

**Unread: oldest first** now gathers the complete unread Inbox set on the first page,
instead of reordering only the unread rows that happened to be present in the native page.
Later pages remove those already gathered rows, so a message is not shown twice. In
Conversations mode, a row also belongs to the unread segment when an earlier member of its
thread is unread even if the newest/root message is read.

The extra work stays inside the native `MessageList` request: it reuses the authenticated
IMAP connection, native UID/thread caches and current sort, performs one targeted `UNSEEN`
search, and fetches headers only for the unread results. If the first native page already
covers every unread UID, no supplementary query runs. Search results, opened threads and
folders outside `INBOX` remain untouched, and any optional-query failure falls back to the
native page. The deployed 1.8.6.1 read-transition choice is preserved. Validation now has
24 endpoint checks and 18 browser scenarios, including native merging, cross-page
deduplication, unread conversation members and the existing transition setting.

## 1.8.8, 2026-09-18

Messages with several correspondents now put **Reply all** first in the reader toolbar and
give it a quiet accent, making the safer group action the natural target. The action below
the message changes from **Reply** to **Reply all** for the same recipient set, with a matching
icon; direct messages retain **Reply**, and **Forward** remains secondary. These controls keep
the native Reply, Reply all and Forward commands, including the inline composer behavior.

The active account is excluded before deciding, so a normal sender and recipient do not count
as a group. The choice updates when another message opens and preserves keyboard order, dark
mode and 44 px mobile targets. Browser validation uses fictional direct and group messages and
mocked commands; it does not send mail.

## 1.8.7, 2026-09-18

Reply and Reply all now open directly at the bottom of an active Inbox conversation.
This is the native composer itself, docked as a non-modal card: recipients, editor,
attachments, autosave, delayed and scheduled sending keep their existing contracts.
An **Expand** control promotes the same DOM back to the full composer, retaining the
draft and caret. Forward, new messages and replies outside the conversation view remain
full popups. After sending, the existing conversation refresh opens and scrolls to the
new Sent message.

Outlook desktop and web histories now follow the same **Afficher la citation**
disclosure as real blockquotes. Microsoft often emits a visual mail header and
plain following siblings instead of semantic quoted markup; Pied Web recognizes
only the strict multi-field header shape, then gives that trailing history the
native SnappyMail details/blockquote contract. The collapse preference, manual
open state, reply/forward cleanup and theme restoration remain native-compatible.

## 1.8.6.1, 2026-09-18

General settings can keep a newly read row in place until refresh, or reclassify it only
after the reader leaves that message. The account-scoped choice preserves the reader's
scroll anchor and remains independent from the Conversations preference.

## 1.8.6, 2026-09-18

General settings now offer **Squire 2.4 (test)** beside the native **Squire** editor.
The native editor remains the default; the saved per-account choice applies when the next
composer opens, never by replacing a live editor and its cursor or undo history.

The trial uses upstream Squire 2.4.9 behind the existing SnappyMail `SquireUI` and Pied Web
composer tools. It fixes the two motivating regressions: `Ctrl+I` formats the next typed
character, and quoting a partial sentence acts on its whole paragraph. Selections spanning
several paragraphs quote each complete paragraph. The vendor global is isolated so merely
loading the option cannot change the native editor.

A confirmed Reply or Reply all now updates the opened Inbox conversation as one
operation. Its feed row receives the native answered/« envoyé » mark immediately;
the conversation lookup runs as soon as the Sent copy exists, opens that new last
message and anchors it at the top of the reader. Previously the background sender
reloaded the feed model that carried the local flag, while the conversation reader
learned about the Sent copy only from its next 60-second poll.

The visual editor's suggested colors now use Tailwind 600: orange, amber, yellow, lime,
green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose and
slate. This replaces Tableau 10 in the native color control while Pied Web is active,
without replacing the control, its custom-color choice or its built-in neutral swatches.
Leaving the theme restores NextSnapMail's native suggestions.

Validation runs both editor choices in the native composer fixture, the exact italic and
blockquote scenarios, cross-paragraph quoting, the style adapter and representative email
HTML containing nested quotes, a table, a signature, a link and a CID image. No real mailbox
or message transport is used. The background-send and conversation fixtures also cover
the immediate feed flag, refresh and scroll after a successful mocked reply. See
`docs/SQUIRE_24.md`.

## 1.8.5, 2026-09-17

The Inbox has a second preference beside **Conversations**: **Unread: oldest first**.
It is independent, so both controls can remain active. When enabled, unread received
messages on the native Inbox page come first in chronological order; read messages
follow in reverse chronological order. A message that becomes read moves between those
segments without replacing its native model, selection or commands.

Unread Draft reminders follow the same direction. Their server query changes from
`REVERSE DATE` to `DATE`, so the first ten are the genuinely oldest reminders instead
of the newest ten displayed backwards. They remain a separate, folder-safe section:
Draft and Inbox UIDs are never mixed in native selection. Search, thread detail and every
folder outside `INBOX` retain their native order. Received messages retain native
pagination and are rearranged only within the current page.

The preference is stored per account in SnappyMail local settings. Disabling it reloads
the native list order; failures leave the previous state intact and visible. Validation:
11 endpoint checks, 24 unread-Draft endpoint checks and 13 fictional browser scenarios,
plus the existing Conversation, Draft and metadata browser suites. No real mail was read,
moved or changed. See `docs/UNREAD_ORDER.md`.

## 1.8.4, 2026-09-17

Conversations now belongs to the Inbox, rather than to every folder in the account.
The control is visible only in `INBOX`. Trash, Sent, Drafts, Archive and custom folders
always request and open individual messages, even when the saved Inbox preference is on.
This removes the slow, broken thread assembly from Trash without changing the preference
Robin uses in the Inbox.

The boundary is enforced on both native request shapes SnappyMail 2.38.2 uses: ordinary
POST parameters and cached base64url GET keys, for message lists and opened messages. The
Pied Web reader stack has the same boundary. A Sent reply found while an Inbox conversation
is already open remains part of that Inbox conversation; opening Sent directly does not
start one.

## 1.8.3, 2026-09-17

Two corrections from watching the feature run on the production mailbox.

Opening a scheduled message now asks the server for its due time when that message is not
already known, instead of accepting a cooled-down answer. The read cooldown exists to keep the
message list cheap; a reader that opens once should not inherit it and show no bar.

The sender stops writing a suppressed `unlink` warning into the Nextcloud log every time it
finds an empty queue and no note to remove. Nextcloud logs suppressed warnings anyway, and an
empty queue is the normal case — this was three hundred lines a day of nothing.

## 1.8.2, 2026-09-17

Scheduling works. 1.8.0 and 1.8.1 refused every schedule the interface could make: the composer
hands over `new Date(...).toISOString()`, which carries milliseconds, and the header stamp
accepted an instant only without them. The message stayed open and the notice said it had not
been scheduled — correct behaviour for a refusal, but the refusal itself was wrong.

The two sides had never met. The PHP checks fed hand-written instants and the browser check
asserted the millisecond form the composer produces; each passed against its own idea of the
format. Both now use the shape the composer actually sends, on both sides of the boundary, and
the sender reads a fractional instant too, so a message stamped by anything else still leaves.
The stored header is unchanged: whole seconds, in UTC.

Found by scheduling a real message on the production mailbox after deploying 1.8.1, which is
the only place the two sides meet.

## 1.8.1, 2026-09-17

The scheduling control drops the Nextcloud button border and grey fill it was wearing in
production. It carries the native `btn` class to keep the composer header's metrics, and the
preserved Nextcloud control sheet fills and borders `#rl-app button.btn` with `!important` and
one class more than the rule that was meant to override it. Naming the composer in the selector
outranks that sheet, which is what the theme's own composer rules already do.

The browser check now measures that control's own border and surface, not only the panel's.
The fixture reproduced the defect before the fix, which is why it is a check and not a note.

## 1.8.0, 2026-09-17

A message can now be given a time instead of a countdown. **Programmer l'envoi** stands beside
Send in the composer and opens a panel with the three times that are actually asked for — this
evening, tomorrow morning, Monday morning — and a field for any other one. The composer then
closes the way it does for an ordinary send, and the outgoing notice says when the message
will leave, with an Annuler that puts it straight back in the composer.

What makes this worth shipping is that the message leaves with the browser closed. The
scheduled message is stored in a `Scheduled` folder beside the account's own Drafts folder,
carrying one header, `X-Pied-Web-Send-At`, and a new Nextcloud app, `piedwebmailscheduler`,
hands it to the account's own SMTP server when its time comes. That app serves only the
mailboxes whose owner already asked NextSnapMail to remember the password: it stores no
secret of its own and adds none to the server.

The queue is the mailbox, not a table somewhere. A scheduled message can be read, searched and
moved with native commands; its row shows the time it leaves; opening it offers **Remettre en
brouillon**. What is stored is the finished message, prepared exactly as a send prepares it —
signatures, encryption, attachments and Bcc included — because that is what the sender will
hand over. The date a recipient reads is the moment it actually left.

Sending is at most once, and says so when it cannot be. A message is claimed with the IMAP
keyword `$pwsending` before its SMTP transaction, and the claim is never released: a pass
interrupted anywhere leaves a message that later passes report rather than send again. A
refused transaction releases the claim and is retried; a message still refused a day after its
time is marked `$pwsendfailed` and left alone. A mailbox whose server refuses custom keywords
is never sent from at all. Every one of those states is visible on the message itself.

The composer refuses to schedule when nothing is listening. Each pass leaves a heartbeat, and
the composer reads it before storing anything: no sender on this server, or none in the last
thirty minutes, and the message stays open with the reason on screen. The alternative was a
folder quietly filling with mail nobody would send.

Header rewriting is surgery, not reserialisation. Every header the message keeps is copied
byte for byte, so boundaries, encodings and signatures survive as the engine wrote them; only
`Date` is replaced, and `Bcc`, `X-Draft-Info` and the two Pied Web headers are dropped from
what leaves. The filed copy keeps the Bcc the author wrote, as the native send does.

101 checks accompany this: 43 over the endpoint and the stamped header against the native
message builder and header parser, 40 over the sender against the native header parser,
sequence sets and stream helpers with IMAP and SMTP simulated, and 18 in the browser over the
control and its panel, mounted on the engine's own composer header template. The due-time
badges on the queue's rows and the bar above an open scheduled message have no fixture yet;
`docs/SCHEDULED_SEND.md` says so.

## 1.7.53, 2026-09-16

The undo window drops from five seconds to three, and the pending-send notice
gains a second control: a Lucide `send-horizontal` glyph that skips the rest of
the wait. Until now the only way past the countdown was to sit through it, which
is the wrong trade when the message is already right and the next thing you need
is the reply. Three seconds still covers the moment a wrong recipient or a
missing attachment registers, which is when Undo is actually reached for.

The duration stops being a number written twice. `PiedWebUx.sendDelaySeconds`
holds it, `send-delay.js` counts against it, the notice takes its first label
from it, and the two browser checks that measure the window read it rather than
hard-coding a deadline.

It skips the countdown and nothing else. `sendNow()` cancels the delay, marks the
job ready and calls the same `pump()` the timer would have called, so the send
still waits for the draft to finish saving — the guarantee the delay exists for,
and the reason closing the window mid-countdown loses nothing. Undo stays
available in that gap, and the glyph disappears as soon as the countdown is over,
rather than sitting there as a control that no longer does anything.

Undo keeps the one filled surface in the notice; the new control rests on nothing
and takes the primary tint only on hover or focus, on a 44 px target with the
glyph at 20 px. Both are named in French and English, `Envoyer maintenant` and
`Send now`, on `aria-label` and `title`.

Two supporting corrections. `#rl-app button` in the preserved Nextcloud control
sheet carries an `!important` border, so the `border: 0` both notice buttons
already declared had never applied; the notice card is borderless by design, and
one rule now makes that true of the controls on it. And the click handlers stop
selecting `button` positionally, which a second button would have re-pointed at
the wrong control.

`test-send-now.js` builds the notice from the markup the plugin ships and covers
placement, geometry, the accessible name, the hidden state, resting and focused
surfaces, the focus ring, non-text contrast, the absent borders and the 390 px
layout, plus the delay contract: the window is three seconds, a tick short of the
deadline sends nothing, a cancelled countdown never sends and a completed one
sends exactly once. `image-markdown-regression.js` keeps its own delayed-send
assertions, now measured against the shared constant.

## 1.7.52, 2026-09-16

The hour goes back to hidden in the desktop message list. 1.7.38 had restored
it on the grounds that a timestamp is data rather than decoration; in this list
it is data that is already on screen. The rows are grouped under `.pw-day-label`
headings — "Aujourd'hui", "Hier", then a date — so an hour on every row repeats
what the heading above it just said and adds a third column of text to a row
that is meant to be scanned.

The desktop grid returns to its three columns, sender and conversation count on
the first line, subject with the star and the paperclip on the second, and
`comfort-desktop.css` carries the `display:none` again with a comment saying why,
so a later pass does not read it as an oversight. Narrow windows are untouched:
they have no day headings, so the hour is the only thing that dates a row there
and it stays visible.

`test-desktop-scan.js` and `test-mail-polish.js` return to the assertions they
had before 1.7.38 — every desktop row time hidden while the day headings remain
visible, and the conversation count sharing the attachment column.

## 1.7.51, 2026-09-16

The interface font stops travelling inside the stylesheet. Adwaita Sans was
embedded as 261 kB of base64 in `font-face.css`, which made the theme bundle
488 kB of render-blocking CSS, put `font-display: swap` in a position where it
could never do anything — the font arrived with the sheet, so there was no
fallback phase to swap out of — and, since the served bundle is keyed on the
plugin hash and `APP_VERSION`, made every release re-download the whole font.

The family is now two subsetted files served beside the stylesheet, declared
with matching `unicode-range`: Latin at 63 kB, always fetched, and
Latin-Extended at 60 kB, fetched only when a glyph needs it. Both keep the full
variable weight axis from 100 to 900 and the optical-size axis, so no weight the
theme uses is lost, and tabular figures survive the subsetting, which the
timestamps and counters depend on. The stylesheet drops from 488 kB to 226 kB,
and the font is cached independently of it.

The URL is written relative to the Nextcloud web root because
`RainLoop\Actions\Themes::compileCss()` rewrites a theme's relative `url()` that
way. The fixture server did not model that rewrite at all — nothing had needed
it, since every other asset in the theme is a `data:` URL, which the engine
leaves alone — so it now performs the same substitution and serves the theme
directory at the path the rewritten URL asks for. `docs/INSTALL.md` gains the
matching deployment check; if the file is blocked the interface falls back to
the system stack it already declares, with no other effect.

New: `tests/browser/test-font-delivery.js`, nine cases covering the two faces,
the preserved axes, the Latin face being applied, the Latin-Extended face
staying unloaded until a glyph needs it, and the stylesheet carrying no payload
of its own.

## 1.7.50, 2026-09-16

Colour is a palette. Sixteen different tints of the primary and twelve greys
were mixed inline, several of them a single percentage point apart and
indistinguishable — 73, 75 and 76 % of the foreground all in use at once — in
two different interpolation spaces, so the same "20 %" did not always land on
the same colour.

Every mix now resolves to one of two ramps of nine steps, or to a named accent,
all declared once in `tokens.css` and all interpolated in OKLCH. 36 inline mixes
became token references; the five surfaces the theme has always had — paper,
rail, line, muted, selected — move into the token file too, since they are
palette decisions and not rules.

Three values were deliberately changed rather than rounded:

- The folder rail is deeper. At 6 % of the primary it stood 1.07:1 from the
  reading surface and the boundary rested entirely on a hairline that is itself
  at 1.29:1; at 12 % it is 1.16:1 and the two panes read as two panes.
- Secondary text is softer, from 73 % of the foreground to 64 %. It was
  7.98:1 against the reading surface, nearly as strong as the primary text it was
  meant to sit behind; at 5.43:1 it is clearly secondary and still above the
  4.5:1 threshold at every size the theme uses.
- `--pw-flag-ink` was a second copy of the amber formula and is now an alias, so
  the accent is decided in one place.

Opacity no longer stands in for a colour on text: the send notice's subject, the
Markdown hint, the resting star and the day-heading rules take a step of the
grey ramp instead. The transparencies that remain are all on controls that are
genuinely disabled or in progress, which is what opacity is for.

Rings and hairlines mix into transparency rather than into a surface, so they
keep working over a tinted row; two strengths replace the five that existed.
All 23 browser fixtures pass unchanged.

## 1.7.49, 2026-09-16

Spacing is a scale. Padding, margins and gaps used thirty different pixel
values, eleven of them consecutive between 4 and 14 px, so choosing between 9 and
10 px was a decision taken hundreds of times and never once settled.

172 values moved onto nine steps — 2, 4, 8, 12, 16, 24, 32, 48, 64 — and are
named rather than written. The largest movements are 6 px to 8 and 10 px to 12,
which is why rows and folder entries have a little more air; 18 px comes down to
16 and 20 up to 24. The reading gutter joins the scale at 32 px, so the message
body measures 576 characters' worth of column instead of 568.

Offsets that reserve room for a control stay out of the scale and keep their
measured value: the 44 px touch targets, the 56 px clearance for the Nextcloud
app grid, the 48 px reserved for a folder's unread badge, the 62 px reserved for
the search button. Those are measured against a control, not chosen from a
scale, and rounding them would misalign what they align to.

Widths, heights and inset values are untouched; this pass is spacing only. All
23 browser fixtures pass, with two assertions in `test-mail-polish.js` rewritten
to check that a value belongs to the scale rather than to equal 18 px.

## 1.7.48, 2026-09-16

The type scale exists and is enforced. Text was set at fourteen different sizes
between 10 and 25 px, with steps of a single pixel — 12, 13, 14, 15 and 17, 18,
19, 20 all in use — eight font weights including 550, 580, 620 and 650 that no
eye separates from 500 or 600, and eleven hand-tuned tracking values between
-0.15 and -0.6 px.

Every piece of text now takes one of seven sizes, one of three weights and one
of two tracking values, named rather than written: 150 literal values became
token references. The two decisions worth noting: 13 px, the most common size in
the interface, went up to 14 px, which is what the desktop list, the folder rail
and the reader were already using above 1200 px, so the narrower layouts line up
with them; and the list subject came down from 15 px to the same 14 px as the
sender, because the subject is already marked by weight and did not need the
size as well.

Tracking is now tight only above 17 px, where it was doing something, and zero
below, where it was not. Uppercase labels keep one spacing value instead of
three.

Glyph sizes are deliberately left alone: `font-size` on an attachment paperclip,
a star, a collapsed-folder sign or a draft icon sets a picture, not text, and
belongs to the sizing scale rather than the type scale.

Two fixtures asserted a number the scale has moved: the label menu now compares
itself to `--pw-text-sm` and to the message subject rather than to a literal
15 px, and the no-JavaScript fallback checks the followed row's edge accent
introduced in 1.7.39 rather than the surface it replaced. All 23 browser
fixtures pass.

## 1.7.47, 2026-09-16

Three engine defaults still spoke their own language in the middle of a Lucide
icon set. The account switcher ended in the text glyph "▼" inherited from the
application stylesheet, the attachment section used the browser's own disclosure
triangle, and the composer's editing-mode menu was an unstyled system select
sitting between fully redrawn buttons.

All three now use the theme's chevron: a masked 14 px glyph after the account
name, a 16 px glyph before "Pièces jointes" that points sideways when the
section is closed and turns down when it opens, and a 14 px glyph at the end of
the mode menu, which also picks up the theme's border colour and radius.

The menu stays a native `select` with its native options, keyboard behaviour and
right-to-left placement; the attachment section stays a native `details`. No
markup or command changed. The rotation honours reduced-motion.

New: `theme-src/native-controls.css` and `tests/browser/test-native-controls.js`,
six cases covering each glyph, the open and closed states, and the select still
being a working native control.

## 1.7.46, 2026-09-16

Empty states exist. An empty folder, an emptied trash and a search with no
result all fell back to the engine's bare sentence, left-aligned at the top of
an otherwise blank pane — the one screen in an otherwise fully redrawn
interface that had never been designed. Until now the only rule in the theme
mentioning `listEmptyMessage` was one hiding it.

The sentence itself stays native, so it stays translated and stays accurate.
What it gains is a 56 px glyph above it, the middle of the pane, and room to
breathe. The glyph is an open tray for an empty folder and a magnifier when a
search is running, because a folder that is not empty and a result that is
should not look the same. The glyph is a pseudo-element, so the engine
rewriting the sentence never removes it.

Every control stays where it is. A search that returns nothing is precisely
when the reader needs the search field back, so nothing around the state is
hidden. The phone keeps the state at 44 px.

New: `theme-src/empty-state.css` and `tests/browser/test-empty-state.js`, seven
cases covering the layout, the glyph, the centring, the untouched sentence, the
search variant, the search field still being reachable, and the phone scale.

## 1.7.45, 2026-09-16

The phone row carried seven marks — sender, attachment glyph, conversation
pill, unread sub-count, unread dot, hour, star — for two questions: from whom,
and when. Nothing is removed, because on a phone each of them is reachable only
by touch; they are put back in their place instead.

The attachment glyph and the resting star drop to the 400 step of the grey
ramp, the conversation pill sits on the 100 step with 700 ink and loses the
divider inside it, and the unread dot gives way on rows where the pill already
spells the count out — a row with "4 non lus" no longer also carries a dot,
while a row with no conversation keeps one. The sender, the subject and the hour
keep full contrast and the bold subject still marks unread on its own, so the
state never depends on colour alone.

A followed star keeps its amber and its chip. Touch targets, the grid, the
narrow-phone layout below 360 px and every command are unchanged.
`test-list-metadata.js` gains a case measuring the glyph and star luminance
against the sender in sRGB and checking both dot outcomes.

## 1.7.44, 2026-09-16

The reader toolbar reads as groups instead of a wall. Eight icon buttons carried
the same weight as the text beside them and were told apart by a vertical rule.
Icons cover far more surface than a glyph of text, so at equal colour they feel
heavier, not equal.

Toolbar icons drop to the 500 step of the grey ramp and return to full contrast
under the pointer or keyboard focus, so they recede without becoming unreadable.
The reply group, the filing group, the copy control and the overflow menu are
separated by 12 px of space with 2 px inside each group, and the rule between
them is gone. The reply button keeps its tint, and the primary Répondre under the
message is now unmistakably the strongest action in the pane.

Only widths above 800 px change; the phone toolbar keeps its geometry. Commands,
order, titles, keyboard focus and the overflow menu are untouched.
`test-mail-polish.js` gains a case comparing the icon and subject luminance in
sRGB, the gap inside a group against the gap between groups, and the absence of
the separator.

## 1.7.43, 2026-09-16

Floating surfaces get an elevation system. The four of them — the Undo Send
notice, the bulk-delete confirmation, the copy confirmation and the inline image
toolbar — each carried an invented single-blur shadow, written in a different
notation (`#0002`, `#0003`, `rgba(0,0,0,.18)`, `#12343220`), each with its own
corner radius, and each with a one-pixel border underneath the shadow doing the
same job twice.

They now take a level from `--pw-elevation-1` to `--pw-elevation-5` and drop
their borders. Every level is a hairline ring plus a tight contact shadow plus a
soft cast one, with the contact shadow fading and the cast one growing as the
surface rises, so height is read rather than guessed: the confirmation toast sits
at level 2, the send notice and the image toolbar at level 3, the modal at
level 5. The ring keeps a card's edge legible when its background matches the
page, which a shadow alone cannot do in dark mode. All four share one radius.

The tokens moved from `#rl-app` to `:root` so page-level nodes — the copy
confirmation is a live region outside the application root — can reach them.

New: `tests/browser/test-elevation.js`, six cases covering presence, the absence
of borders, the shape of each shadow, that no shadow is invented outside the
scale, the order of the three heights, and the shared radius.

## 1.7.42, 2026-09-16

The reading column reads as one block. The message body was already capped at a
comfortable measure, but the header rule, the calendar action, the attachment
block and the reply row still ran the full width of the pane. On a 1 440 px
window that drew a 1 120 px rule under a 568 px column, so the empty half of the
pane was underlined instead of simply being left alone.

Every block of the reading column now shares one measure — 640 px border box,
568 px of text between two 36 px gutters — and its own margin is zero, so the
header rule, the attachment divider and the reply separator all stop where the
text stops. Folded conversation cards follow the same measure. The measure and
the gutter are two variables on the message view, not a value repeated in five
rules.

The paragraph width itself is unchanged and stays inside the readable range,
around 68 characters at the current body size. Only widths above 800 px are
affected; the phone reader is untouched. `test-mail-polish.js` gains a case
asserting that the header, the body and the reply row report one right edge.

## 1.7.41, 2026-09-16

A sender's image no longer dissolves into the page. Nothing protected an image
in the message body from carrying the same background as the reader, so a white
logo or a signature picture on a white card lost its outline entirely.

Message images get a one-pixel semi-transparent inner edge, drawn as an inset
outline so it sits over the picture instead of adding a border that would clash
with the image's own colours. It is black at 7 % on light surfaces and white at
9 % on dark ones, following the base theme's own dark-mode selectors. A tracking
pixel is too small to show it.

New in this release: `theme-src/reader.css`, scoped to the message view. The
composer's inline images, their resize handles and the attachment tiles are not
affected. `test-mail-polish.js` gains a case for the edge.

## 1.7.40, 2026-09-16

The composer had no action hierarchy. Send and Save were the same grey pill, so
nothing said which one the window exists for, and the only saturated element on
screen was a solid red square — an unlabeled glyph for a secondary, destructive
action.

Send is now the filled primary, Save an outlined secondary, and Discard a quiet
ghost control that turns red only under the pointer or keyboard focus. The three
share one corner radius. The destructive step keeps its red where it belongs,
in the confirmation dialog, which already worked this way.

The discard glyph also had no accessible name. It now carries the native
`GLOBAL/DELETE` translation as its title and `aria-label`, so French and English
both read correctly and nothing is invented. Native commands, markup and the
glyph itself are unchanged.

New in this release: `theme-src/composer.css`, a file scoped to the composer
header, and `tests/browser/test-composer-actions.js` with seven cases covering
the fill, the outline, the ghost state, the hover, the shared radius, the
accessible name and the untouched native markup.

`tools/serve-fixtures.py` now answers `Cache-Control: no-store`. Without it a
browser could keep a previous plugin or theme file and silently test the earlier
release, which is exactly what happened while this change was being written.

## 1.7.39, 2026-09-16

A followed message no longer shouts louder than the message being read. The
star painted the whole row amber, so in a list where selection is a pale teal
tint, the user's own bookmark was the most prominent surface on screen — and
the star itself grew from 19 to 22 px and gained a filled chip, so the row
shifted as it was flagged.

Following is now an accent at the row edge: a 3 px amber bar drawn as a
positioned pseudo-element, so the row keeps its height, its selection ring and
its background. The filled amber star and its chip stay. The star glyph keeps
one size in both states. The open message and the checked messages are again
the only full tints in the list.

`--pw-follow-surface` is removed; it had no other use. Two fixture cases were
added: a followed row shares its background with an ordinary row while carrying
a 3 px accent an ordinary row does not have, and the star reports the same glyph
box whether or not the message is followed.

## 1.7.38, 2026-09-16

The desktop list gets its hour back. Above 1200 px `time` was hidden outright
and the day headings were left to carry the date, so fifteen messages under
"Aujourd'hui" gave no clue which arrived at 9 h and which at 17 h — while the
phone layout had kept the hour all along.

The hour returns as tertiary data rather than as another competing signal: 12 px,
the 600 step of the grey ramp, tabular figures so the column stays flush, right
aligned above the star and attachment columns. The desktop row grid grows from
three to four columns, the sender keeps the first, the conversation pill moves to
the second, and the subject spans the first two.

The stale grid in `comfort-desktop.css` was not edited: `mail-polish.css` loads
later with the same selectors and has owned the desktop row geometry since
1.7.23, so the earlier block never applied. The blanket `display:none` moved out
of `comfort-desktop.css` so that one file owns the column.

Two fixtures asserted the old contract and now assert the new one: the
conversation count sits on the sender line before the hour, and desktop rows
carry a quiet right-aligned hour whose right edges all line up. Phone and
medium-width layouts are untouched.

## 1.7.37, 2026-09-16

One colour now means one thing. Above 1200 px the desktop list painted its
unread dot amber, while `list-metadata.css` reserved amber for followed
messages and the conversation sub-counter in the same row stayed teal: amber
said both "unread" and "followed", and the meaning of the dot changed when the
window crossed 1200 px, because the phone layout had always used the primary
colour.

The desktop unread dot now uses `--pw-primary-500` like every other unread
signal. Amber is left to the star and the followed row alone. `#efc751`, the
last colour literal in the theme with no dark-mode counterpart, is gone.

Only that one declaration changed. Dot geometry, the click target that toggles
read state, its hover and focus ring, and the read dot's grey are untouched.

## 1.7.36, 2026-09-16

Adds `theme-src/tokens.css`, the design system the theme had been working
without. Five scales are decided once and named: seven type sizes, three
weights, three line heights and two tracking values; an eight-step spacing
scale; four corner radii; a ten-step grey ramp and a six-step primary ramp,
both mixed from the instance's own Nextcloud colours so a custom accent or the
dark theme still moves everything together; and five elevation levels, each a
two-part shadow rather than a single blur.

The sheet loads directly after the preserved base and before every Pied Web
rule, so any later sheet can use a token without minding the order.

Nothing consumes the tokens yet, so nothing moves: the winning declaration for
every `(media, selector, property)` triple already in the bundle is unchanged,
and the 42 new entries are all custom properties. Later releases replace the
literal values rule by rule.

## 1.7.35, 2026-09-16

Housekeeping with no visual change. `theme-src/studio.css` had grown as an
append-only log of thirty iterations, so a property was often declared five to
fourteen times for the same selector and only the last declaration could ever
apply. `#rl-app .messageListItem` declared `min-height` fourteen times; the
reader subject size was declared seven times. Nobody could read the effective
value without replaying the cascade.

293 declarations that a later, identical selector in the same media context
already overrode were removed, and 105 rules that held nothing else disappeared
with them. The file drops from 91 to 78 kB. A declaration was only removed when
a later one carried at least the same importance, so `!important` ordering is
preserved.

The rewrite is proved equivalent rather than reviewed by eye: the winning
declaration for all 2 262 `(media, selector, property)` triples in the bundle is
byte-identical before and after. The browser fixtures were re-run in full and
report the same geometry, colours and states.

## 1.7.34, 2026-09-15

Addresses in the message header are now links. The sender line, the À/Cc recipients under
the date and the From, To, Cc, Bcc and Reply-To rows of the expanded details each keep the
native `"Name" <address>` text, with the address itself linked exactly as SnappyMail already
links the sender. A click writes a new message to that address and carries its display name
into the composer; Ctrl+click, or Ctrl+Enter on the focused address, copies the bare address
instead and never opens the composer. Enter still writes a new message.

The composer is reached through SnappyMail's own reader: the address is a real `mailto:`
link, and the native view already turns a left click on one into its compose popup, so no
new mail command was added. The copy shortcut is captured before that handler, otherwise
Ctrl+click would copy and compose at once. A confirmation naming the copied address appears
beside it for 2.4 seconds, announced to screen readers, and is drawn over the page so the
clipped, scrollable recipient rows cannot cut it off or shift the header under it. A refused
Clipboard API falls back to a temporary selection and the legacy copy command, and says so in
the error colour when both fail.

The links belong to the theme: leaving Pied Web restores SnappyMail's own address text, and
the sender line keeps the muted colour it had, gaining only a hover underline and a focus
ring. On a phone a tap writes a new message and a long press offers the browser's own copy
item, since Ctrl+click has no touch equivalent.

`tests/browser/test-reader-addresses.js` adds 17 fixture cases for that behavior, on a reader
fixture that now carries native-shaped recipient rows, an expanded details table and the
native mailto interception of SnappyMail 2.38.2. The reader copy, label, signature, mail
polish, desktop scan, selection, list metadata, conversation toggle, panel state, app shell
and conversation fixtures were re-run unchanged.

## 1.7.33, 2026-09-15

The desktop calendar action no longer hangs off the divider above it. Its hover and
focus surface started exactly where the message metadata rule ends, so pointing at
"Ajouter au calendrier" painted a tinted block glued to that line. The row now keeps a
6 px gap below that rule, the spacing the owner chose, and the existing 12 px before
the attachment divider, so the tinted surface stands free of both separators.

Only the desktop rule above 800 px changed; the phone layout keeps its own spacing and
is untouched, as are the button geometry, colors, icon and keyboard focus ring. The
mail-polish browser fixture now hovers the action and checks both the tinted surface and
the distance to the metadata rule.

## 1.7.32, 2026-09-15

The compact desktop sidebar is remembered. Collapsing the folder panel used to last
only until the next page load, because the native `leftPanelDisabled` observable is
initialised from the viewport on every start. An explicit toggle now stores
`pw-left-panel` in the browser's `localStorage`, and the choice is restored while the
folder pane is being built, before it is shown, so the reader sees no expanded panel
first. Nothing is sent to the server and no native setting is written.

Only a deliberate desktop toggle is recorded. The same observable is the mobile folder
drawer and is also opened by the application itself while a message is dragged over the
folders; those changes are left alone, and the stored choice is not forced back on them.
On mobile the native closed drawer wins, and crossing back over the 800 px breakpoint,
where the application reopens the panel, restores the desktop choice. A browser that
refuses storage keeps the native default.

`tests/browser/test-left-panel-state.js` adds 11 fixture cases for that behavior, and
the fixture folder view now carries the native `toggleLeftPanel` and mirrors the native
breakpoint handler in both directions. The app-shell, list-metadata, selection,
mail-polish and conversation-toggle fixtures were re-run unchanged.

This release also carries the conversation reader scroll anchor. The folded history is
drawn above the open message, so a long thread used to start the reader on its oldest
card: fifteen messages put about 1 300 px of folded cards before the message that was
just opened. The reader now places the opened message at the top of its scroller once
per message, 24 px below the previous card so the history stays in sight and one scroll
away. Opening the earliest message of a thread keeps its heading and the “Show latest
message” action in view instead. The position is taken exactly where the expanded reader
is revealed, after the cross-folder lookup and the native load settle, and never again
for the same message: a manual scroll, a revealed card summary and the periodic refresh
keep the position they find.

A failed conversation walk also used to leave its folder state behind. Only the origin
message stays on screen after the error, but the reader still sent the state it had been
answered with, so the next request took the unchanged shortcut added in 1.7.31 and the
folded stack never came back, neither on Try again nor on the periodic refresh. The
state is now dropped with the error.

`tests/browser/test-virtual-conversation.js` was reconnected to the 1.7.31 endpoint: its
fixture answered the removed client-side `MessageList` searches, so the whole script
stopped at its first wait. It now mocks the `PiedWebConversation` hook, including the
error and unchanged-state answers, and adds three cases for the scroll anchor. All 22
cases pass.

## 1.7.31, 2026-09-15

Performance release. The reader conversation stack no longer drives its search
from the browser. Opening a message in a long thread used to issue up to
twenty sequential `MessageList` requests plus one full `Message` fetch per
visible card; a fourteen-message conversation was measured at 31 backend
requests and 4,7 s of activity, and the scan repeated every 60 seconds while
the message stayed open. Each of those requests paid a full Nextcloud bootstrap
and a fresh IMAP connect and login, because PHP keeps no connection between
requests.

The same walk now runs in a new `PiedWebConversation` endpoint on a single
authenticated IMAP connection, so an extra search costs one IMAP command
instead of one HTTP request. The algorithm, the twenty-identifier ceiling and
the 200-message page ceiling are unchanged, and rows are still filtered on the
actual `References` and `In-Reply-To` headers rather than on the search hit.
The periodic refresh now sends back the folder state it was given: an unchanged
mailbox is answered from two IMAP `STATUS` commands, with no search and no
fetch.

Card summaries are fetched when the reader points at a card, by pointer or by
keyboard focus, instead of for every card the viewport crosses. When the IMAP
server offers RFC 8970 `PREVIEW`, the summary comes from the message list and
costs nothing.

Inline message images are left to the engine. A queue that held their sources
back was tried and dropped: SnappyMail already marks them `loading="lazy"`, and
taking the source away only interferes with the browser's own deferral, while
images in a hidden message body fire neither `load` nor `error`. A newsletter
with 62 inline images still opens 44 simultaneous PHP processes on first read,
because each image is a separate request that reopens its own IMAP connection.
The remedy is to give those images an intrinsic size so the native lazy
threshold applies, which needs a browser fixture and is not in this release.

The unread-drafts reminder takes the same folder-state shortcut, so the second
IMAP round trip after each Inbox refresh is skipped when the Drafts folder has
not moved.

New read-only checks cover the conversation endpoint: single login, folder
scoping, header verification, the bounded walk, the unchanged-mailbox shortcut
and the login/POST guards.

This release also carries the desktop attachment controls that were pending in
the working tree: the reader hides SnappyMail's ambiguous settings cog for a
single attachment, shows the native selection controls and “Download as zip”
from two attachments on, and gives the attachment tiles 18 px before the lower
divider.

## 1.7.30, 2026-09-15

Plugin-only intermediate step, superseded within the same session and never
published. The stylesheet had to travel with it: the served CSS bundle is keyed
on `Plugins()->Hash()`, the theme name and `APP_VERSION`, so deploying a new
`style.css` under an unchanged plugin version leaves the previous compiled
stylesheet cached and served.

## 1.7.29, 2026-09-15

Withdrawn during deployment and never published. The conversation scan called
the new endpoint through `rl.app.Remote.post`, which serves native message
actions; plugin hooks answer through `rl.pluginRemoteRequest`, as the unread
drafts reminder already did. Every scan rejected and the reader showed
“Conversation incomplète”. Fixed in 1.7.30.

## 1.7.27, 2026-09-15

Withdrawn during deployment and never published. Its inline-image queue waited
for `load` or `error` before releasing the next slot, but SnappyMail marks these
images `loading="lazy"`, so an image in a hidden message body fires neither. The
queue stalled as soon as the reader moved on and later inline images stayed
blank. 1.7.28 releases each slot on a timer as well.

## 1.7.26, 2026-09-15

Withdrawn during deployment and never published. Its inline-image queue also
watched the `src` attribute, so the mutation observer saw the queue's own write
and took each image back the instant it was released; inline images stayed
blank. Superseded by 1.7.27, which only watches insertions and takes over each
image once. Note for future payload changes on this engine: the served plugin
bundle is keyed on the plugin version and the script file names, never on file
content, so a same-version script change is answered from the SnappyMail cache.

## 1.7.25, 2026-09-15

Desktop message rows retain SnappyMail's native calendar glyph when their sole
attachment is an iCalendar file. The custom paperclip introduced in 1.7.23 is
now limited to generic/mixed and text-file indicators instead of overriding
every recognized attachment type. A fictional browser check covers the
computed `.icon-file-calendar` content and confirms that no paperclip mask is
applied. Mobile and reader attachment styling are unchanged.

The desktop reader also gives attachment tiles 18 px of space before the
lower divider. A single attachment no longer shows SnappyMail's ambiguous
settings cog because clicking its tile already downloads it. With two or more
attachments, the native selection controls and “Download as zip” action are
shown directly. The compact native disclosure remains unchanged on mobile.

## 1.7.24, 2026-09-14

Remove the extra top margin above the sender line in the desktop message
reader. The rule still starts at 800 px, so the established phone layout is
unchanged. A fictional browser check covers the computed desktop margin.

## 1.7.23, 2026-09-14

Desktop Mail now uses a tighter, more consistent reader header, a clear divider
before Reply/Forward, compact calendar import and file attachments, and a
quieter back-to-list control. Conversation counts move to the far right above
the attachment indicator; the broken native text-file glyph is replaced by a
consistent paperclip. The Conversations toggle is optically centered. The
desktop pane widths again accept SnappyMail's native drag-resizer changes.
Folded conversation cards show a one-line plain-text excerpt instead of
repeating the subject. Visible excerpts are fetched through the native
read-only `Message` endpoint, at most two at a time; the underlying IMAP fetch
uses `BODY.PEEK` and does not mark mail read. The established mobile CSS and
calendar button position remain unchanged.

## 1.7.22, 2026-09-14

The conversation heading now shows the earliest message's subject instead of
the generic “Conversation” label. It stays stable while switching between
folded messages. The expanded message keeps its own subject below the stack,
at the same 14 px size as the sender line. The heading stays hidden during the
initial read-only lookup so it does not briefly show a later subject.

## 1.7.21, 2026-09-14

The reader stack now shows one border per folded message. On desktop, the
native Close button sits beside the previous/next arrows; the redundant Close
inside the expanded subject is hidden. Mobile retains its existing header Back
action and all message commands. During a new conversation lookup, the reader
waits to reveal the expanded message until the read-only search and native
message load finish, preventing cards from visibly pushing an already open
message downward. Unchanged background refreshes leave the reader in place.

The owner confirmed that the 1.7.20 stack appeared in Mail and supplied the
layout feedback. Eighteen fictional browser checks covered the new states,
alongside existing reader and release checks. No mailbox data was modified.

## 1.7.20, 2026-09-14

In Conversations mode, opening a received message now assembles its native
folder thread with historical replies from Sent. The newest message, whether
received or sent, opens in SnappyMail's native reader; the others are folded
cards one click away. The earlier list-only panel required a selected native
thread and did not appear in an ordinary opened Inbox message. Read-only
header searches find Sent replies, and native opening keeps attachments and
message actions tied to the displayed folder/UID. No mailbox copy or move is
needed. Search failures offer Retry, and account changes discard stale
results. The reader also mounts when its DOM appears after the plugin event.
The 1.7.19 reader label-menu typography is retained.

Fourteen fictional browser checks covered reader placement, native opening,
read-only requests, retries, account changes, theme exit and narrow screens.
The native header parser and reproducible theme/build checks passed. The owner
confirmed the interim 1.7.19 Web runtime but reported that its conversation
module had not mounted; the 1.7.20 reader result remains to be checked.

## 1.7.19, 2026-09-14

Fix the reader label dropdown's oversized, bold text after moving it beside the message controls. Its entries now use the same 15 px regular typography as the other Mail menus. The icon placement, native label actions and mobile target are unchanged. A fictional browser check now asserts the open menu typography.

## 1.7.18, 2026-09-14

The message reader now places SnappyMail's native Étiquettes icon between the message information control and the star. The separate label row disappears, including its assigned-label text; the native dropdown still handles label actions. The icon has a French/English accessible name and a 44 px target on desktop and mobile. Leaving Pied Web restores the original row. Fictional reader checks covered click, keyboard, mobile, dark mode, theme exit and native row rebuilding; no real label was changed during validation.

## 1.7.17, 2026-09-14

Desktop day headings now have a short line before the label and the existing long line after it, forming a single balanced separator (`— Hier ———`). The label stays at its prior horizontal position. Mobile headings remain unchanged.

## 1.7.16, 2026-09-14

Desktop message rows no longer show their relative time; the day headings still mark the timeline, and the full date remains available in the opened message. The star and attachment columns stay at the right of the row. At a day boundary, the preceding row's bottom border becomes transparent so the heading has one separator instead of two. Both changes start at 1200 px; mobile retains its existing dates and dividers.

## 1.7.15, 2026-09-14

Visible list checkboxes and the mobile selection-menu entry are removed when the Pied Web selection script is active. Ctrl+click (or Command+click) on a desktop message starts native multi-selection; a 550 ms long touch starts it on mobile. Further plain clicks/taps toggle messages without opening them. A count and Done button appear while selecting, and Escape exits on desktop. Native grouped commands still receive the checked messages. Scroll movement cancels the long-touch timer, and swipe deletion remains available outside selection mode. If the script is unavailable, native checkboxes stay visible as a fallback.

The Nextcloud shell now resets a pending animation-frame handle during page hide so its integration reliably returns from browser history.

Fictional browser checks covered click and touch entry, selected action targets, exit behavior, normal opening, scroll cancellation, mobile geometry and dark mode. The resting 390 px mobile capture is pixel-identical to 1.7.14. No production message state was changed during fixture validation.

## 1.7.14, 2026-09-14

Desktop message rows now show a small amber dot for unread mail and a pale gray dot for read mail. Clicking or pressing Space on the dot uses SnappyMail's native seen/unseen action without selecting or opening the row. The checkbox remains a separate, centered control. Unstarred messages reveal their star on hover or keyboard focus; starred messages remain visible. Attachment indicators occupy a fixed column at the right of each row, freeing the subject line for scanning. These layout rules start at 1200 px. Mobile keeps its existing visible star and tap target because SnappyMail already uses row double-tap/double-click for another action.

Fictional browser checks covered native read actions, keyboard use, hover, checkbox alignment, attachment placement, and theme exit. The 390 px mobile capture is pixel-identical to 1.7.13; no real message state was changed during validation.

## 1.7.13, 2026-09-14

Desktop Confort refinement: restore the native 72 px icon rail when folders are collapsed, add a faint divider between message rows, and align each row checkbox with Select all while keeping its vertical center level with the star. These rules still begin at 1200 px; the 390 px fictional screenshot is pixel-identical to 1.7.12. The plugin version changes to give the compiled stylesheet a fresh cache key.

The collapsed width, checkbox alignment, divider, mobile geometry, dark selection states and shell restoration passed the fictional browser checks. See `docs/previews/1.7.13/` and the deployment record.

## 1.7.12, 2026-09-14

First Pied Web Confort proposal for desktop widths of at least 1200 px: a wider folder pane and message list, 40 px folder rows, more breathing room in the message list and reading pane, and slightly larger sender text. The existing mobile and medium-width layout keeps its previous geometry. The plugin version gives SnappyMail's compiled CSS a fresh cache key; the 1.7.10 virtual Sent conversation behavior remains intact.

Fictional browser previews at 1200/1440 px in light and dark mode showed no horizontal overflow. A 390 px screenshot before and after the theme change was pixel-identical; 320 px had no horizontal overflow. See `docs/previews/1.7.12/` and the deployment record.

## 1.7.10, 2026-09-14

The open conversation now searches the configured Sent folder for replies by
`References` and `In-Reply-To`, showing matches in a clearly marked read-only
part of the stack. Matches open through the native reader with their real Sent
folder and UID. This works for older replies without migrating mail. The 1.7.8
send hook that added another copy to the original folder has been removed, so
future replies are stored only according to SnappyMail's normal Sent setting.
Copies already created by 1.7.8 or 1.7.9 remain untouched and are deduplicated
in this view by Message-ID. The query is scoped to the active account's Sent
folder and runs only for an opened thread. See `docs/VIRTUAL_CONVERSATIONS.md`
for matching and limits.

Validation: native 2.38.2 header-search parser, eleven fictional browser
scenarios including historical replies, native reader opening, account races,
retry and mobile layout; release checks. No real mail was sent or moved.

## 1.7.9, 2026-09-14

The Conversations button now reads SnappyMail's actual `useThreads` setting.
Previously it read the differently cased `UseThreads` key, so it displayed an
inactive state even when conversations were enabled. The corrected pressed state
drives the visible highlight introduced in 1.7.7, including after page reload.
The native grouping setting and message queries remain unchanged.

Validation: 16 fictional browser checks for both setting values, click targets,
desktop/mobile styling and dark mode; syntax, release and installation checks.
The authenticated production browser showed the active state after targeted
LiteSpeed OPcache invalidation. See `docs/deployments/1.7.9.md`.

## 1.7.8, 2026-09-14

Newly sent replies are copied into the folder of the message being answered, so
SnappyMail's folder-scoped conversation view can include them. The normal Sent copy
is preserved. Reply all follows the same path; forwards and replies already saved
in the original folder are not duplicated. The copy is marked read and keeps the
native Message-ID/References headers. This applies to future sends only, and
stores an additional message in the original folder. If that extra IMAP append
fails, sending and the normal Sent copy continue.

Validation: native 2.38.2 send-hook contract and eight fictional transport checks,
including stream rewind and failed-copy fallback; release checks.

## 1.7.7, 2026-09-14

The Conversations toggle now has a clearly visible pressed state in desktop and
mobile toolbars. Its icon follows the button color, and the selected background
and outline remain legible in light and dark mode. The underlying grouping
setting, reload behavior and accessible pressed state are unchanged.

Validation: fictional browser fixture at desktop and mobile widths, both color
schemes; reproducible theme build and release checks.

## 1.7.6, 2026-09-13

The reader's Copy as Markdown button now confirms a completed copy with a brief
contrasting checkmark, or shows a distinct failure mark if clipboard access fails.
The existing French/English status announcement remains; the button returns to its
copy icon after 2.4 seconds and honors reduced-motion preferences. The feedback
replays on consecutive copies without changing the clipboard result.

Validation: reader-copy browser checks including visual success, failure and reset;
signature and compose-Markdown regression checks. See `docs/COPY_MARKDOWN.md` and
the deployment record for production activation.

## 1.7.5, 2026-09-13

Copy as Markdown now recognizes common image-heavy HTML signature tables and
replaces their layout with compact contact lines. Names, roles, phone numbers,
addresses and useful email/site links remain; logos, tiny icons and empty spacer
cells are omitted. Quoted signatures are cleaned too. Data tables with headers
and the compose Markdown editor keep their existing behavior.

Validation: six fictional signature fixture checks, seven reader-copy checks and
25 existing compose-Markdown checks. See `docs/COPY_MARKDOWN.md` and the
deployment record for installation and Web activation.

## 1.7.4, 2026-09-13

The reader toolbar now has a **Copier en MD / Copy as Markdown** button beside
the message actions. It copies the currently displayed message body as Markdown,
including collapsed quotations, without changing the message or its read state.
The compose Markdown view still preserves rich HTML when editing drafts.

Validation: seven reader-copy browser fixture checks cover formatting, keyboard
activation, quotations, clipboard fallback and narrow mobile layout. See
`docs/COPY_MARKDOWN.md` and the deployment record for installation and web checks.

## Nextcloud 34.0.4 compatibility verified, 2026-09-12

Nextcloud updated from 34.0.3 to 34.0.4. Its native app upgrade also installed
NextSnapMail 0.1.11. Mail 1.7.3, Calendar workspace 1.0.1 and Office workspace
1.0.3 remain active. The app update replaced the five unread-account patch files;
a pristine 0.1.11 checkout accepted the reviewed patch, all nine patch tests passed,
and the restored payload matches its original fingerprints exactly. Other custom
payload files were preserved. See [full verification](docs/deployments/nextcloud-34.0.4.md).

## Calendar workspace 1.0.1, 2026-09-12

Calendar fills the viewport, with its native app grid before the event filter. A separate
`piedwebcalendar` add-on preserves Mail 1.7.3. Fourteen live desktop/390/320 px checks passed.
Native navigation to Files and back and dark colors also passed. The initial 1.0.0 trial
revealed a mobile focus-trap conflict; 1.0.1 mounts the original menu inside the drawer.
See [deployment evidence](docs/deployments/calendar-1.0.1.md).

## 1.7.3 activation completed, 2026-09-12

The remaining Nextcloud wrapper was caused by web OPcache still executing plugin 1.7.2.
Targeted authenticated invalidation activated the already installed 1.7.3 release.
The actual desktop and mobile mail now fill the viewport and the native app grid works.
Temporary maintenance code was removed, configuration restored exactly, and all 39
installation checks passed. Runtime files, release tag and archive are unchanged.
See [deployment evidence](docs/deployments/1.7.3.md).

## 1.7.3, 2026-09-12

Mail now fills the window while Pied Web is active in Nextcloud. The native applications
grid stays at top left beside the account; the surrounding Nextcloud bar disappears.
Mobile search expands from an icon below the single mail header. The original launcher
and search bindings are preserved, with safe theme/host restoration.

Message checkboxes align vertically with stars. Checked rows have a stronger teal surface
and thin full outline, distinct from the current message and unread subject weight.

Validation: 18 shell/selection cases (desktop, 390/320 px, dark, theme changes, compact
rail and iframe) plus 15 native metadata cases. Actual desktop launcher/selection geometry
was also previewed in the authenticated session. See docs/MAIL_SHELL.md and the deployment
record for the final installation and web activation checks.


## 1.7.2 activation repair, 2026-09-12

An authenticated session finally identified the missing changes: LiteSpeed OPcache was
still executing plugin 1.6.4 with timestamp validation disabled. Targeted invalidation
activated the existing 1.7.2 payload. The framed counter is gone in the live Inbox and
the unread-draft module now loads. No unread drafts were present on the checked account.
The temporary maintenance helper was removed and configuration restored exactly.
Runtime files/tag remain unchanged; the repository now records the guarded maintenance
workflow and requires web validation after PHP deployment/rollback.
See [web activation repair](docs/deployments/1.7.2-web-runtime-repair.md).

## 1.7.2, 2026-09-12

Followed messages have a filled amber star, a stronger star surface and a tinted row;
selection retains its teal treatment. Conversation metadata styling now ships in the
compiled Pied Web theme, independent of the plugin initialization class. Without JavaScript,
the original numeric text still displays with a quiet borderless style and no chevron.
The optional labels and keyboard controls also initialize if the native view event was missed.
A theme stylesheet marker governs activation and native style replacement restores attributes.

The owner still saw the old 13/4 badge after 1.7.1. Installed hashes matched and the actual
server-compiled CSS rendered the new badge locally. The live authenticated session was
unavailable (HTTP 401); a stale browser/FPM resource was not confirmed. This release hardens
the style/init boundary and improves followed-message visibility; it does not claim that
the previous session mismatch was diagnosed. See the deployment record for verification.

Validation: 15 native-dispatch metadata checks, 5 theme-only/late-init checks, desktop,
390/320 px and dark previews, payload syntax, reproducible theme and installation diagnostics.

## 1.7.1, 2026-09-12

Conversation counts now separate the total from an explicit unread label, for example
13 and “4 non lus”, with a quiet background and an explanatory accessible tooltip.
List stars remain visible at rest, with a filled accent star for followed messages.
They align on the right in split/mobile lists and retain a 44 px phone target. On screens
up to 360 px, conversation metadata moves below the subject to preserve sender width.
Reader stars also have a stronger contrast and a 20 px glyph.

Native Knockout text bindings, conversation navigation and flag/multi-selection commands
are preserved. Enter/Space activate the same native controls; labels follow French/English
and restore original attributes when leaving Pied Web.

Validation: 15 metadata browser checks and 25 unread-draft regressions using the extracted native list click dispatcher with mocked
flag transport; desktop, 390/320 px and dark-mode snapshots. No actual mail flag changes.
Payload syntax/build and installation diagnostics passed. See the deployment record.

## 1.7.0, 2026-09-12

Genuinely unread drafts now appear in a dedicated section at the top of the first Inbox
page. The server uses the current account’s configured Drafts folder and native UNSEEN
search; read and deleted drafts are excluded. Three reminders appear initially, with further
results available through Show more. Clicking resumes native Draft composition with its
original UID, recipients, attachments and reply references.

The section deliberately keeps draft UIDs outside the received-message selection, because
native multi-select commands assume a single folder. Search and later Inbox pages remain
unchanged. Account changes invalidate pending requests; refresh, retry, empty-Inbox,
mobile and dark-mode behavior are covered. See `docs/UNREAD_DRAFTS.md` for limits.

Validation: 25 browser draft scenarios, 19 native parser/endpoint checks, 22 editor image
regressions, 25 filtered-selection checks, 10 attachment storage checks and 5 installation
diagnostics. Native models are used with fictional mail and mocked transport/popup opening;
no real mail operations or authenticated live browser session. Payload syntax and reproducible
theme build passed; the deployment record documents actual server compilation and hashes.

## 1.6.6, 2026-09-12

The compose Image button now opens the native Nextcloud file selector. Selected raster images
are downloaded with the current authenticated session, compressed locally and inserted inline.
Compression also handles clipboard HTML containing a single embedded image. Local file paste
and drag/drop keep their established inline/attachment behavior.

Compress now appears on Nextcloud-imported and restored JPEG/PNG/WebP attachments, which
previously lacked a browser File. An authenticated, account-scoped image-read endpoint retrieves
the temporary original on demand. The original is retained unless the smaller replacement
uploads successfully. Metadata subscriptions handle native completion ordering. Compress has a contrasting surface
and border so it no longer blends into the attachment card.

Repository maintenance memory now lives in `AGENTS.md`, `docs/CONTEXT.md`, `docs/MAINTENANCE.md`
and deployment records. The verifier also rejects missing payload files and version mismatches; the installation
diagnostic supports hosting accounts without Python’s newer `str.removeprefix`.
Image behavior and limits are documented in `docs/IMAGES.md`.

Validation: 17 Nextcloud/native picker scenarios, 10 native storage/endpoint checks, 22 image
checks, 11 edge cases, 23 toolbar and 25 Markdown regressions; 25 filtered-selection checks,
5 installation diagnostics, syntax and reproducible theme. Browser transport/popup lifecycle
and mail transport are mocked; no real mail is sent or deleted. See the deployment record
for actual server compilation and installed fingerprint verification.

## 1.6.5, 2026-09-12

First standalone distribution of the complete Pied Web customization. Plugin and compiled theme are byte-identical to the validated deployed baseline. Repository packaging adds no production behavior change.

Includes the accumulated navigation, reader, filtered-selection, swipe/keyboard, background Undo Send, Markdown, toolbar and image improvements. The account unread correction remains a separate upstream patch.

Image release validation before packaging: 22 native image/attachment checks, 11 edge cases, 23 toolbar regression checks and 25 Markdown checks. Actual Squire/HtmlEditor, native attachment callbacks and serialization were used with synthetic data and mocked transport. Responsive previews were checked at 1280/390/320 pixels, including dark mode. No authenticated live-mail browser or real mail operations were used for these checks.

Repository validation additionally checks byte-identical payloads, reproducible theme generation, syntax, read-only upgrade diagnostics and filtered-selection behavior. Future releases should update the version matrix only after verifying compatibility.
