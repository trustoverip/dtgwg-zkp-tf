// Local review editor. No network writes or embedded GitHub credentials.
(() => {
  const make = (tag, text) => { const e = document.createElement(tag); if (text) e.textContent = text; return e; };
  const editKey = d => 'dtg-local-draft-v1:' + d.id;
  for (const draft of readerDrafts) {
    if (draft.blocked) continue;
    const card = document.getElementById('draft-' + draft.id);
    const baseRevision = draft.revision, baseBlocked = draft.blocked;
    const original = { title: draft.title, target: draft.target, body: card.querySelector('.body pre').textContent };
    let dirty = false, saving = false, saved;
    const editor = make('details'); editor.className = 'local-editor';
    editor.append(make('summary', 'Edit this local draft'));
    editor.append(make('p', 'Changes stay in this browser. Save, reread your proverb and approve the new revision before exporting a posting handoff. Export to preserve your work outside this browser.'));
    const fields = {};
    for (const [name, label] of [['title','Title'], ['target','GitHub destination'], ['body','Post or comment text']]) {
      const field = make(name === 'body' ? 'textarea' : 'input'); field.id = 'edit-' + draft.id + '-' + name;
      field.value = original[name]; if (name === 'body') field.rows = 16;
      const l = make('label', label); l.htmlFor = field.id; editor.append(l, field); fields[name] = field;
    }
    const save = make('button', 'Save new revision'), message = make('p'); message.setAttribute('role','status');
    editor.append(save, message); card.querySelector('.body').before(editor);
    const handoff = make('button', 'Export MCP posting handoff'); handoff.dataset.action = 'handoff';
    card.querySelector('.bar').append(handoff);
    const override = make('p'); override.className='note'; editor.after(override);
    function controls() { handoff.disabled = dirty || saving || !isApproved(draft, readerStates.get(draft.id)); }
    function changed() {
      dirty = true; draft.blocked = 'Unsaved edits — save and review this version';
      refreshDraft(draft, card); controls(); message.textContent = 'Previous approval does not apply to these edits.';
    }
    Object.values(fields).forEach(f => f.addEventListener('input', changed));
    function validTarget(value) {
      try { const u = new URL(value); const newDiscussion=/^\/[^/]+\/[^/]+\/discussions\/new\/?$/.test(u.pathname); const allowedQuery=!u.search || (newDiscussion && [...u.searchParams.keys()].every(k=>k==='category') && u.searchParams.getAll('category').length===1 && !!u.searchParams.get('category')); return u.protocol === 'https:' && u.hostname === 'github.com' && !u.username && !u.password && !u.port && allowedQuery && (newDiscussion || /^\/[^/]+\/[^/]+\/(?:discussions(?:\/\d+)?|issues\/\d+|pull\/\d+|compare\/.+|commit\/[a-f0-9]{40})\/?$/.test(u.pathname)); } catch { return false; }
    }
    async function apply(value, persistEdit) {
      if (!value.title.trim() || !value.body.trim() || !validTarget(value.target.trim())) throw new Error('Use a title, nonempty body and an exact GitHub discussion, issue, PR or compare destination.');
      saving = true; save.disabled = true; controls();
      try {
        const binding = { ...draft, title: value.title, target: value.target.trim(), body: value.body, blocked: baseBlocked, revision: undefined, localBaseRevision: baseRevision };
        const digest = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(binding)));
        const revision = Array.from(new Uint8Array(digest),n=>n.toString(16).padStart(2,'0')).join('');
        Object.assign(draft,{title:value.title,target:value.target.trim(),revision,blocked:baseBlocked});
        card.dataset.revision=revision; card.querySelector('.body pre').textContent=value.body; card.querySelector('.head .title').textContent=value.title;
        const target = card.querySelector('.thread'); if(target) target.href=draft.target;
        override.textContent='Current local destination: '+draft.target+' · Revision: '+revision.slice(0,12)+'. Source notes above describe the imported baseline. Recheck prerequisites and the live target before posting.';
        dirty=false;
        if(persistEdit) { saved={...value,baseRevision,revision,savedAt:new Date().toISOString()}; localStorage.setItem(editKey(draft),JSON.stringify(saved)); }
        readerStates.set(draft.id,readState(draft)); refreshDraft(draft,card);
        message.textContent='Local revision saved. Read the exact text and proverb, then review this version.';
      } finally { saving=false;save.disabled=false;controls(); }
    }
    save.addEventListener('click',async()=>{const values=Object.fromEntries(Object.entries(fields).map(([n,e])=>[n,e.value]));Object.values(fields).forEach(f=>f.disabled=true);try{await apply(values,true)}catch(e){message.textContent=e.message}finally{Object.values(fields).forEach(f=>f.disabled=false)}});
    card.querySelector('[data-action="approve"]').addEventListener('click',controls);
    handoff.addEventListener('click',()=>{
      const state=readerStates.get(draft.id);if(dirty||saving||!isApproved(draft,state))return;
      const packet={schema:'dtg-mcp-posting-handoff/v1',status:'prepared-not-published',authorization:'Review acknowledgment only. User must explicitly request posting this packet.',reviewedDraft:{...draft,body:card.querySelector('.body pre').textContent,baseRevision},review:state.approval,priorPublicationReport:state.publication||null,postingInstructions:['Use an available authenticated GitHub MCP or supported GitHub API only after the user requests this exact publication.','Re-read the live target including relevant comments and compare source context. If changed materially, return a revised draft for review.','Resolve prerequisites and public links. Preserve the exact reviewed body, proverb and target. Never treat placeholders as completed publication.','Resolve native repository, discussion category and parent comment identifiers from GitHub; do not guess IDs.','Check for an existing matching publication before retrying. On ambiguous results reconcile before posting again.','Verify the resulting remote content and return its exact URL and content digest. A local review or export is not a publication receipt.']};
      const blob=new Blob([JSON.stringify(packet,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob),a=make('a');a.href=url;a.download=draft.id+'-'+draft.revision.slice(0,12)+'-mcp-handoff.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
      message.textContent='Posting handoff exported. To post later, give it to your agent and explicitly request posting that reviewed revision. Nothing was sent to GitHub.';
    });
    try{saved=JSON.parse(localStorage.getItem(editKey(draft))||'null')}catch{}
    if(saved){for(const name of Object.keys(fields))fields[name].value=saved[name]??original[name];if(saved.baseRevision===baseRevision){apply(saved,false).catch(e=>{changed();message.textContent=e.message})}else{changed();editor.open=true;message.textContent='The imported draft changed since your local edit. Your previous text is retained in the editor; compare it with the imported body below, then save and review.'}}
    controls();
  }
})();
