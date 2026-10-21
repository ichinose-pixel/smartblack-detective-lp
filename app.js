import {articleDialogue} from './article-story.js';

import {newGame,view,choose,back,memories,art} from './engine.js';
const $=id=>document.getElementById(id);let state=newGame(),gallery=[],paint=0, typingTimer, finishText, choiceUnlock=0, acting=false;
try{gallery=JSON.parse(localStorage.getItem('smartblack-detective-gallery-v3')||'[]').filter(k=>memories[k]);}catch{}
window.dataLayer=window.dataLayer||[];
const event=(name,data={})=>window.dataLayer.push({event:'sb_'+name,version:'detective-v3',...data});
const esc=t=>t.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const backgrounds={'bg-home':'朝日が入る家','bg-home-night':'灯りのともる夜の家','morning-street':'朝の通勤客と、明るい駅前の店','morning-ramen':'朝日の中で小さなラーメンを楽しむ夫','bg-store':'明るい昼休みのコンビニ','lunch':'弁当とチキンを食べる夫','bento-last':'最後に残った卵焼きを楽しむ夫','office-hall':'午後のオフィスの共用通路','office':'袖をまくって会議で説明する夫','sunset-station':'夕方の駅、工事の柵と迂回路'};
const heart='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21S2 14.5 2 7.7C2 2.8 8.2 1 12 5.3 15.8 1 22 2.8 22 7.7 22 14.5 12 21 12 21Z"/></svg>';
function updateSceneSpace(){
 const stage=$('stage'),box=document.querySelector('.dialogue-shell');
 stage.style.setProperty('--scene-space',Math.max(160,box.getBoundingClientRect().top-stage.getBoundingClientRect().top-112)+'px');
}
window.addEventListener('resize',updateSceneSpace);
async function render(){
 clearTimeout(typingTimer); finishText=null; const token=++paint, current=state,x=view(current);$('stage').setAttribute('aria-busy','true');
 $('stage').dataset.scene=current.node;
 for(const b of document.querySelectorAll('#choices button'))b.disabled=true;
 $('background').src=art(x.bg);$('background').alt=backgrounds[x.bg]||x.place;
 $('husband').hidden=!x.sprite;if(x.sprite){$('husband').src=art(x.sprite);$('husband').alt=x.sprite==='return'?'牛乳の入った買い物袋を持って帰宅した夫':x.sprite==='caught-calm'?'偶然会った妻に小さく挨拶をする夫':x.sprite==='phone-looking'?'両手で持ったスマートフォンへ視線を落とす夫':x.sprite==='phone'?'少し照れた夫':'夫の修司';}
 $('colleague').hidden=!x.colleague;
 await Promise.all([$('background'),...(x.sprite?[$('husband')]:[]),...(x.colleague?[$('colleague')]:[])].map(i=>i.decode().catch(()=>{})));
 if(token!==paint)return;
 $('stage').className='stage '+[x.title?'title':'',x.cg?'cg':'',x.peek?'peek':'',x.wide?'wide':'',x.warning?'warning':'',x.caught?'caught':'',x.failed?'failed':'',x.phone?'has-phone':'',x.message?'has-message':'',x.recap?'recap':'',x.focus?'focus-'+x.focus:'',x.bg==='office'?'office-cg':''].join(' ');
 $('title-art').hidden=!x.title;$('phone-card').hidden=!x.phone;
 $('time').textContent=x.time;$('place').textContent=x.recap?'今日の、あの場面':x.place;
 $('hearts').innerHTML=Array.from({length:3},(_,i)=>'<i class="'+(i<current.hearts?'':'lost')+'">'+heart+'</i>').join('')+'<b class="heart-count">'+current.hearts+'</b>';
 $('hearts').setAttribute('aria-label','残り'+current.hearts+'回');document.querySelector('.hud').hidden=x.phase>=6||x.title;
 $('notice').textContent=x.failed?'尾行終了':x.caught?'見つかった −1':x.warning?'こちらを見そう…':'';
 $('reveal-banner').textContent=x.caught?'あ、見つかった！':x.cutin||'';
 $('chapter-card').textContent=x.chapter||'';
 $('speaker').textContent=x.speaker;$('line').textContent='';$('sub').textContent=x.sub||'';$('sub').hidden=!x.sub;
 $('message-card').hidden=!x.message;$('message-text').textContent=x.message||'';
 $('scene-prop').hidden=!x.prop;
 $('scene-prop').className='scene-prop '+(x.prop||'');
 $('scene-prop').innerHTML=x.prop==='menu'?'<small>朝のメニュー</small><b>小さなラーメン</b><span class="bowl" aria-hidden="true">◡</span>':x.prop==='phone-back'?'<i></i>':x.prop==='screen'?'<i></i><b>?</b>':'';
 $('back').disabled=!current.history.length;$('choices').replaceChildren();
 x.choices.forEach(ch=>{const b=document.createElement('button');b.className='choice';b.dataset.choice=ch.id;b.innerHTML='<span>'+esc(ch.label)+'</span><span aria-hidden="true">›</span>';b.disabled=true;b.onclick=()=>{if(performance.now()>=choiceUnlock&&!acting)act(ch.id)};$('choices').append(b);});
 $('ending-actions').hidden=true;$('choices').style.visibility='hidden';
 $('stage').classList.toggle('shot-frame',x.cg||x.focus==='detour');
 $('stage').classList.toggle('phone-pose',x.sprite==='phone-looking');
 $('stage').classList.toggle('calm-pose',x.sprite==='caught-calm');
 $('stage').style.setProperty('--scene-image','url("'+art(x.bg)+'")');
 updateSceneSpace();
 gallery=[...new Set([...gallery,...current.memories])];try{localStorage.setItem('smartblack-detective-gallery-v3',JSON.stringify(gallery));}catch{}
 $('gallery-count').textContent=gallery.length;$('dialogue').focus({preventScroll:true});$('stage').setAttribute('aria-busy','false');document.body.dataset.node=current.node;
 let pos=0;const complete=()=>{if(token!==paint)return;clearTimeout(typingTimer);$('line').textContent=x.text;$('reveal-text').hidden=true;finishText=null;choiceUnlock=performance.now()+380;typingTimer=setTimeout(()=>{if(token!==paint)return;$('choices').style.visibility='visible';for(const b of $('choices').children)b.disabled=false;$('ending-actions').hidden=!x.ending;updateSceneSpace();},380);};
 finishText=complete;$('reveal-text').hidden=!x.text;
 const tick=()=>{if(token!==paint)return;pos++;$('line').textContent=x.text.slice(0,pos);updateSceneSpace();if(pos>=x.text.length)complete();else typingTimer=setTimeout(tick,/[。？！…]/.test(x.text[pos-1])?130:32)};
 if(!x.text||matchMedia('(prefers-reduced-motion: reduce)').matches)complete();else tick();
 event('scene',{scene:current.node,phase:x.phase,hearts:current.hearts,clues:current.clues.slice()});
}
async function act(id){if(acting)return;acting=true;const old=state;state=choose(state,id);event('choice',{scene:old.node,choice:id});if(state.hearts<old.hearts)event('found',{scene:old.node,hearts:state.hearts});if(state.failed&&!old.failed)event('failure');if(state.node==='ending')event('ending',{failed:state.failed,clues:state.clues.slice()});await render();acting=false;window.scrollTo(0,0);}
function product(source){const dialogue=articleDialogue(state);$('manga-known').textContent=dialogue.husband;$('manga-answer').textContent=dialogue.wife;event('product_view',{source,scene:state.node});$('game').hidden=true;$('product-area').hidden=false;window.scrollTo(0,0);$('return-game').focus({preventScroll:true});}
async function returnGame(){ $('game').hidden=false;$('product-area').hidden=true;await render();window.scrollTo(0,0);}
function restart(){event('replay');state=newGame();returnGame();}
$('dialogue').onclick=()=>finishText?.();$('reveal-text').onclick=e=>{e.stopPropagation();finishText?.()};
$('brand').onclick=restart;$('back').onclick=async()=>{state=back(state);event('back');await render();window.scrollTo(0,0)};
$('product-link').onclick=()=>product('header');$('skip').onclick=()=>product('skip');$('offer-button').onclick=()=>product('ending');$('return-game').onclick=returnGame;$('replay').onclick=restart;
$('official-cta').onclick=()=>event('official_click',{scene:state.node});
$('gallery-open').onclick=()=>{event('gallery_open');$('memories').innerHTML=Object.entries(memories).map(([key,m])=>gallery.includes(key)?'<article class="memory"><img src="'+art(m.image)+'" alt=""><div><h3>'+esc(m.title)+'</h3><p>'+esc(m.text)+'</p></div></article>':'<article class="memory locked-row"><div class="locked">?</div><div><h3>まだ知らない一面</h3><p>'+esc(m.hint)+'</p></div></article>').join('');$('gallery').showModal();};
for(const id of ['gallery','help']){$(id+'-close').onclick=()=>$(id).close();$(id).addEventListener('click',e=>{if(e.target===$(id)){const r=$(id).getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$(id).close()}})}
$('help-open').onclick=()=>$('help').showModal();
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('product-area').hidden)returnGame()});
render();
for(const k of ['morning-street','morning-ramen','lunch','office-hall','office','sunset-station','return','caught-calm','phone-looking','bento-last','phone','bg-home-night']){const i=new Image();i.src=art(k)}


