const p=await browser.getPage('nextsnapmail-unread-drafts');p.setDefaultTimeout(5000);
await p.setViewportSize({width:1440,height:1000});await p.goto('http://127.0.0.1:8876/.local-work/images-native-preview.html?drafts=1&mode=list&side=1');
await p.waitForSelector('.pw-draft-row');
const results=[];const check=(name,ok)=>{if(!ok)throw new Error(name);results.push(name);console.log('PASS '+name);};
const refresh=async()=>{await p.evaluate(()=>{listVM.messageList.loading(true);listVM.messageList.loading(false);});};
check('Only genuinely unread, undeleted drafts appear',await p.evaluate(()=>[...document.querySelectorAll('.pw-draft-row')].map(b=>b.dataset.uid).join(',')==='2,3'));
check('Draft flag is not required; received mail remains separate',await p.evaluate(()=>!draftData[0].flags.includes('\\draft')&&listVM.messageList()===inboxSnapshot&&listVM.messageList()[0].folder==='INBOX'&&listVM.messageList()[0].uid===2));
check('Draft reminders have no native Inbox checkbox/selection hooks',await p.evaluate(()=>document.querySelectorAll('.pw-unread-drafts .messageListItem,.pw-unread-drafts .messageCheckbox').length===0));
check('Unread draft count does not alter Inbox count or pagination',await p.evaluate(()=>document.querySelector('.pw-unread-drafts header').textContent.includes('(2)')&&listVM.messageList.count()===128&&listVM.messageList.page()===1));
await p.locator('.pw-draft-row').first().click();await p.waitForFunction(()=>openedDrafts.length===1);
check('Click opens native Draft mode in the correct folder despite UID collision',await p.evaluate(()=>openedDrafts[0][0]===5&&openedDrafts[0][1].constructor.name==='MessageModel'&&openedDrafts[0][1].folder==='INBOX.Brouillons'&&openedDrafts[0][1].uid===2));
check('HTML, CID image, recipients, attachment and reply references survive native revival',await p.evaluate(()=>{const m=openedDrafts[0][1];return m.isHtml()&&m.bodyAsHTML().includes('cid:illustration')&&m.to[0].email==='camille@example.test'&&m.attachments()[0].fileName==='document.pdf'&&m.references==='older parent-id'&&m.inReplyTo==='parent-id'&&m.draftInfo[0]==='reply';}));
check('Listing and opening do not set Seen or rewrite the draft',await p.evaluate(()=>draftData[0].flags.length===0&&draftRequests.every(r=>['PiedWebUnreadDrafts','Message'].includes(r.action))));
await p.evaluate(()=>{draftData[0].flags.push('\\seen');listVM.popupVisibility(false);});await p.waitForFunction(()=>document.querySelectorAll('.pw-draft-row').length===1);
check('A draft marked read disappears after composer closes',await p.evaluate(()=>document.querySelector('.pw-draft-row').dataset.uid==='3'));
// Composer close can start a Drafts query before background Send has removed its
// durable copy. The later success event must invalidate that stale response.
await p.evaluate(()=>{
 draftData[0].flags=[];window.holdDraftList=true;window.releaseDraftList=null;
 listVM.popupVisibility(true);listVM.popupVisibility(false);
});await p.waitForFunction(()=>window.releaseDraftList);
await p.evaluate(()=>{
 window.oldSentDraftResponse=releaseDraftList;holdDraftList=false;
 window.sentRaceDraft=structuredClone(draftData.find(item=>Number(item.uid)===2));
 draftData=draftData.filter(item=>Number(item.uid)!==2);
 dispatchEvent(new CustomEvent('pw-message-sent',{detail:{account:'fixture-A',folder:'',uid:0,flag:''}}));
});
await p.waitForFunction(()=>[...document.querySelectorAll('.pw-draft-row')].map(row=>row.dataset.uid).join(',')==='3');
await p.evaluate(()=>oldSentDraftResponse());await p.waitForTimeout(100);
check('A sent edited draft disappears despite an older in-flight refresh',await p.evaluate(()=>(
 [...document.querySelectorAll('.pw-draft-row')].map(row=>row.dataset.uid).join(',')==='3'
)));
await p.evaluate(()=>draftData.unshift(sentRaceDraft));
await p.locator('.pw-draft-row').click();await p.waitForFunction(()=>openedDrafts.length===2);
check('Plain draft remains plain in native compose mode',await p.evaluate(()=>!openedDrafts[1][1].isHtml()&&openedDrafts[1][1].plain()==='Mardi prochain ?'));
await p.evaluate(()=>{listVM.popupVisibility(false);listVM.messageList.page(2);});await p.waitForFunction(()=>document.querySelector('.pw-unread-drafts').hidden);
check('Draft reminders are confined to the first Inbox page',await p.evaluate(()=>listVM.messageList.page()===2&&document.querySelector('.pw-unread-drafts').hidden));
await p.evaluate(()=>{listVM.messageList.page(1);listVM.messageList().search='from:example.test';listVM.messageList.valueHasMutated();});
check('Inbox search retains its original scope and selection',await p.evaluate(()=>document.querySelector('.pw-unread-drafts').hidden&&listVM.messageList().search==='from:example.test'));
await p.evaluate(()=>{listVM.messageList().search='';listVM.messageList().folder='Archive';listVM.messageList.valueHasMutated();});
check('Other folders do not receive unread draft reminders',await p.evaluate(()=>document.querySelector('.pw-unread-drafts').hidden));
await p.evaluate(()=>{listVM.messageList().folder='INBOX';draftData[0].flags=[];listVM.messageList.valueHasMutated();});await p.waitForFunction(()=>document.querySelectorAll('.pw-draft-row').length===2);
await p.evaluate(()=>{window.baseDrafts=structuredClone(draftData);draftData=Array.from({length:23},(_,i)=>({...structuredClone(baseDrafts[0]),uid:100+i,hash:'many-'+i,subject:'Brouillon '+(i+1),dateTimestamp:1789217000-i*60}));});await refresh();
await p.waitForFunction(()=>document.querySelector('.pw-unread-drafts header').textContent.includes('(23)'));
check('Long draft list starts with three reminders and the true total',await p.evaluate(()=>document.querySelectorAll('.pw-draft-row').length===3&&!document.querySelector('.pw-drafts-more').hidden));
await p.click('.pw-drafts-more');check('First expansion uses the already fetched page',await p.locator('.pw-draft-row').count().then(n=>n===10));
await p.click('.pw-drafts-more');await p.waitForFunction(()=>document.querySelectorAll('.pw-draft-row').length===20);
await p.click('.pw-drafts-more');await p.waitForFunction(()=>document.querySelectorAll('.pw-draft-row').length===23);
check('Every matching draft can be revealed across pages without duplicates',await p.evaluate(()=>{const ids=[...document.querySelectorAll('.pw-draft-row')].map(b=>b.dataset.uid);return new Set(ids).size===23&&document.querySelector('.pw-drafts-more').hidden&&draftRequests.some(r=>r.offset===20)&&listVM.messageList.count()===128;}));
await p.evaluate(()=>{draftData=structuredClone(baseDrafts);window.holdDraftList=true;window.releaseDraftList=null;});await refresh();await p.waitForFunction(()=>window.releaseDraftList);
await p.evaluate(()=>{window.oldDraftResponse=releaseDraftList;holdDraftList=false;draftAccount='fixture-B';draftData=[];listVM.messageList.valueHasMutated();});await p.waitForFunction(()=>document.querySelector('.pw-unread-drafts').hidden);
await p.evaluate(()=>oldDraftResponse());
check('Old-account draft response cannot repopulate the new account',await p.evaluate(()=>document.querySelector('.pw-unread-drafts').hidden&&document.querySelectorAll('.pw-draft-row').length===0));
await p.evaluate(()=>{draftData=structuredClone(baseDrafts);draftAccount='fixture-A';listVM.messageList.valueHasMutated();});await p.waitForSelector('.pw-draft-row');
await p.evaluate(()=>{window.holdDraftOpen=true;window.releaseDraftOpen=null;window.openCount=openedDrafts.length;});await p.locator('.pw-draft-row').first().click();await p.waitForFunction(()=>window.releaseDraftOpen);
await p.evaluate(()=>{draftAccount='fixture-B';draftData=[];listVM.messageList.valueHasMutated();holdDraftOpen=false;releaseDraftOpen();});
check('An in-flight click cannot open a draft after changing account',await p.evaluate(()=>openedDrafts.length===openCount));
// Empty Inbox still carries the native MessageCollectionModel constructor.
await p.evaluate(()=>{draftAccount='fixture-A';draftData=structuredClone(baseDrafts);const empty=NativeDraftCollection.reviveFromJson([]);empty.folder='INBOX';empty.search='';listVM.messageList(empty);});await p.waitForSelector('.pw-draft-row');
await p.locator('.pw-draft-row').first().click();await p.waitForFunction(()=>openedDrafts.length===openCount+1);
check('An empty Inbox still supports native draft opening',await p.evaluate(()=>listVM.messageList().length===0&&openedDrafts.at(-1)[1].constructor.name==='MessageModel'));
await p.evaluate(()=>{listVM.popupVisibility(false);window.draftFailure=true;});await refresh();await p.waitForFunction(()=>document.querySelector('.pw-draft-status').textContent.includes('indisponibles'));
check('Network failure keeps an explicit retry action',await p.evaluate(()=>document.querySelector('.pw-drafts-more').textContent==='Réessayer'&&!document.querySelector('.pw-drafts-more').disabled));
await p.evaluate(()=>draftFailure=false);await p.click('.pw-drafts-more');await p.waitForFunction(()=>document.querySelector('.pw-draft-status').hidden);
check('Retry restores the filtered draft feed',await p.locator('.pw-draft-row').count().then(n=>n===2));
await p.evaluate(()=>{draftData[0].subject='<img src=x onerror=alert(1)>';draftData[0].to[0].name='<b>Nom</b>';draftData[0].dateTimestamp=1e20;});await refresh();await p.waitForFunction(()=>document.querySelector('.pw-draft-subject').textContent.startsWith('<img'));
check('Subject/recipient markup is text and invalid dates do not break the feed',await p.evaluate(()=>!document.querySelector('.pw-unread-drafts img,.pw-unread-drafts b')&&fixtureErrors.length===0));
await p.evaluate(()=>{draftData=[];});await refresh();await p.waitForFunction(()=>document.querySelector('.pw-unread-drafts').hidden);
check('No unread drafts leaves no empty section',await p.evaluate(()=>!document.querySelector('.pw-has-unread-drafts')));
await p.evaluate(()=>{draftData=structuredClone(baseDrafts);});await refresh();await p.waitForSelector('.pw-draft-row');
await p.evaluate(()=>document.documentElement.classList.remove('pw-theme'));
check('Leaving Pied Web hides the extension',await p.evaluate(()=>document.querySelector('.pw-unread-drafts').hidden));
await p.evaluate(()=>document.documentElement.classList.add('pw-theme'));await p.waitForSelector('.pw-draft-row');
await p.setViewportSize({width:390,height:900});
check('Mobile rows remain inside the viewport with large touch targets',await p.evaluate(()=>[...document.querySelectorAll('.pw-draft-row')].every(b=>{const r=b.getBoundingClientRect();return r.height>=44&&r.left>=0&&r.right<=innerWidth;})&&document.documentElement.scrollWidth<=innerWidth));
check('No runtime errors',await p.evaluate(()=>fixtureErrors.length===0));
console.log(JSON.stringify({passed:results.length,results},null,2));
