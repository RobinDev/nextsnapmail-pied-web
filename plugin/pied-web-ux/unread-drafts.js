/* Read-only draft reminders inside the Inbox feed. Never mix folder-scoped native selections. */
(() => {
    'use strict';
    const active = () => document.documentElement.classList.contains('pw-theme');
    const t = (fr, en) => (document.documentElement.lang || 'fr').startsWith('fr') ? fr : en;
    const unseen = message => Array.isArray(message?.flags)
        && !message.flags.some(flag => ['\\seen','\\deleted'].includes(String(flag).toLowerCase()));
    addEventListener('rl-view-model', ({detail:vm}) => {
        if (vm.viewModelTemplateID !== 'MailMessageList' || vm.pwUnreadDrafts) return;
        const list = vm.messageList, dom = vm.viewModelDom, content = dom.querySelector('.messageList > .b-content');
        if (!content) return;
        vm.pwUnreadDrafts = true;
        const section = document.createElement('section'); section.className = 'pw-unread-drafts'; section.hidden = true;
        section.setAttribute('aria-label', t('Brouillons non lus', 'Unread drafts'));
        const header = document.createElement('header'), title = document.createElement('h2'), count = document.createElement('span');
        title.textContent = t('Brouillons non lus', 'Unread drafts'); header.append(title,count);
        const rows = document.createElement('div'); rows.className = 'pw-draft-rows';
        const note = document.createElement('p'); note.className = 'pw-draft-status'; note.setAttribute('role','status'); note.hidden = true;
        const more = document.createElement('button'); more.type = 'button'; more.className = 'pw-drafts-more'; more.hidden = true;
        section.append(header,rows,note,more); content.prepend(section);
        let scope = '', generation = 0, entries = [], folder = '', total = 0, visible = 3, nextOffset = 0, etag = '';
        let loading = false, opening = false, disposed = false, timer, CollectionModel, error = '', failedPage = false;
        const currentScope = () => JSON.stringify([rl.settings.get('accountHash'),list()?.folder,list.page?.(),list()?.search,list.threadUid?.()]);
        const eligible = () => active() && String(list()?.folder || '').toUpperCase() === 'INBOX'
            && (list.page?.() || 1) === 1 && !(list()?.search || '').trim() && !list.threadUid?.();
        const valid = (version, snapshot) => !disposed && version === generation && snapshot === currentScope() && eligible();
        const message = text => { note.textContent = text; note.hidden = !text; };
        const render = () => {
            section.hidden = !eligible() || (!entries.length && !error);
            content.classList.toggle('pw-has-unread-drafts', !section.hidden && !!entries.length);
            count.textContent = total ? '(' + total + ')' : '';
            const focusedUid = section.contains(document.activeElement) ? document.activeElement.dataset.uid : null;
            rows.replaceChildren();
            entries.slice(0,visible).forEach(item => {
                const button = document.createElement('button'); button.type = 'button'; button.className = 'pw-draft-row'; button.dataset.uid = item.uid;
                button.disabled = opening;
                const recipient = document.createElement('span'); recipient.className = 'pw-draft-recipient';
                const emails = item.to?.['@Collection'] || item.to || [];
                recipient.textContent = emails.length ? t('À : ', 'To: ') + emails.map(email => email.name || email.email).filter(Boolean).join(', ') : t('Sans destinataire', 'No recipient');
                const date = document.createElement('time');
                const stamp = Number(item.dateTimestamp);
                const value = new Date(stamp*1000);
                if (stamp > 0 && Number.isFinite(value.getTime())) {
                    date.dateTime = value.toISOString();
                    date.textContent = value.toLocaleDateString(document.documentElement.lang || 'fr', {day:'numeric',month:'short'});
                    date.title = value.toLocaleString();
                }
                const subject = document.createElement('span'); subject.className = 'pw-draft-subject'; subject.textContent = item.subject || t('(Sans objet)', '(No subject)');
                const badge = document.createElement('span'); badge.className = 'pw-draft-badge'; badge.textContent = t('Brouillon', 'Draft');
                const icon = document.createElement('span'); icon.className = 'fontastic pw-draft-icon'; icon.textContent = '🗎'; icon.setAttribute('aria-hidden','true');
                button.title = t('Reprendre : ', 'Resume: ') + subject.textContent; button.append(icon,recipient,badge,date,subject);
                button.addEventListener('click', () => open(item)); rows.append(button);
            });
            if (focusedUid) rows.querySelector('[data-uid="'+focusedUid+'"]')?.focus();
            more.hidden = !error && visible >= total;
            more.disabled = loading || opening;
            more.textContent = error ? t('Réessayer', 'Try again') : loading ? t('Chargement…', 'Loading…') : t('Afficher les suivants', 'Show more');
            message(error);
        };
        async function open(item) {
            if (opening || loading || !eligible() || vm.popupVisibility?.()) return;
            const version = generation, snapshot = currentScope(); opening = true; error = ''; render();
            message(t('Ouverture du brouillon…', 'Opening draft…'));
            try {
                // Use the native full-message endpoint and native MessageModel (also when Inbox is empty).
                const response = await rl.app.Remote.post('Message', null, {folder:item.folder, uid:item.uid}, 60000);
                if (!valid(version,snapshot) || vm.popupVisibility?.()) return;
                const data = response?.Result;
                if (data?.folder !== folder || Number(data.uid) !== Number(item.uid) || !CollectionModel) throw new Error('message');
                const draft = CollectionModel.reviveFromJson([data])[0];
                if (!draft?.bodyAsHTML || !draft.revivePropertiesFromJson || draft.encrypted?.()) throw new Error('message');
                draft.isHtml(!!draft.html());
                // Native Draft mode preserves recipients, attachments, draft UID and reply references.
                rl.app.showMessageComposer([5, draft]);
            } catch {
                if (valid(version,snapshot)) error = t('Impossible d’ouvrir ce brouillon ici. Réessayez ou ouvrez le dossier Brouillons.', 'Could not open this draft here. Retry or open the Drafts folder.');
            } finally {
                if (version === generation) opening = false;
                if (valid(version,snapshot)) render();
            }
        }
        async function refresh(append = false) {
            if (!eligible() || disposed || loading || opening || list.loading?.() || vm.popupVisibility?.() || document.hidden) return;
            const candidate = list()?.constructor;
            if (typeof candidate?.reviveFromJson === 'function') CollectionModel = candidate;
            const version = ++generation, snapshot = currentScope(), offset = append ? nextOffset : 0;
            scope = snapshot; loading = true; error = ''; failedPage = append; render();
            try {
                const result = await new Promise((resolve,reject) => rl.pluginRemoteRequest((code,data) => {
                    const result = data?.Result;
                    code || !result || result.error ? reject(new Error('drafts')) : resolve(result);
                }, 'PiedWebUnreadDrafts', append ? {offset} : {offset, etag}, 60000));
                if (!valid(version,snapshot)) return;
                etag = String(result.etag || '');
                // The Drafts folder did not move, so the list on screen still holds.
                if (result.unchanged) { failedPage = false; return; }
                const collection = result.messages, next = collection?.['@Collection'] || [];
                if (collection && (!Array.isArray(next) || Number(collection.offset) !== offset || collection.folder?.name !== result.folder)) throw new Error('response');
                if (!append || result.folder !== folder) entries = [];
                folder = result.folder;
                const ids = new Set(entries.map(item => item.uid));
                next.forEach(item => {
                    if (item.folder === folder && Number.isInteger(Number(item.uid)) && Number(item.uid) > 0 && unseen(item) && !ids.has(item.uid)) {
                        entries.push(item); ids.add(item.uid);
                    }
                });
                total = Math.max(entries.length, Number(collection?.totalEmails) || 0);
                nextOffset = offset + 10;
                if (append) visible = entries.length; else visible = Math.min(Math.max(3,visible), entries.length);
                // A concurrently emptied final page must not leave an endless Show more action.
                if (next.length < 10) total = entries.length;
                failedPage = false;
            } catch {
                if (valid(version,snapshot)) error = t('Brouillons non lus indisponibles. Réessayez.', 'Unread drafts unavailable. Try again.');
            } finally {
                if (version === generation) { loading = false; render(); }
            }
        }
        more.addEventListener('click', () => {
            if (error) { void refresh(failedPage); return; }
            if (visible < entries.length) { visible = entries.length; render(); }
            else void refresh(true);
        });
        const schedule = () => {
            if (disposed) return;
            const snapshot = currentScope();
            if (scope !== snapshot || !eligible()) {
                ++generation; scope = snapshot; loading = false; opening = false; entries = []; total = 0; visible = 3; error = ''; folder = ''; etag = '';
                render();
            }
            clearTimeout(timer); timer = setTimeout(() => void refresh(), 150);
        };
        const subscriptions = [list,list.loading,list.page,list.threadUid,vm.popupVisibility].filter(value => value?.subscribe).map(value => value.subscribe(schedule));
        const theme = new MutationObserver(schedule); theme.observe(document.documentElement,{attributes:true,attributeFilter:['class']});
        const wake = () => { if (!document.hidden) schedule(); };
        const orderChanged = () => {
            ++generation; loading = false; opening = false; entries = []; total = 0;
            visible = 3; error = ''; folder = ''; etag = ''; render(); schedule();
        };
        // Closing the composer schedules a refresh before background Send has necessarily
        // deleted its durable draft. A successful send is the authoritative later edge:
        // discard both that possibly stale response and the rows it may have rendered.
        const messageSent = () => orderChanged();
        addEventListener('focus',wake); document.addEventListener('visibilitychange',wake);
        addEventListener('pw-unread-order-changed', orderChanged);
        addEventListener('pw-message-sent', messageSent);
        const poll = setInterval(() => void refresh(),60000); schedule();
        ko.utils.domNodeDisposal.addDisposeCallback(dom, () => {
            disposed = true; ++generation; clearTimeout(timer); clearInterval(poll); theme.disconnect();
            subscriptions.forEach(sub => sub.dispose()); removeEventListener('focus',wake); document.removeEventListener('visibilitychange',wake);
            removeEventListener('pw-unread-order-changed', orderChanged);
            removeEventListener('pw-message-sent', messageSent);
        });
    });
})();
