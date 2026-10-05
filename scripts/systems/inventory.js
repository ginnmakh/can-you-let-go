import {imageAsset,playAsset} from '../rendering/assets.js';
import {dialogues as D} from '../data/dialogues.js';
import {cutPieces} from '../core/catalog.js';
import {Art} from '../rendering/art.js';
import * as Core from '../core/rules.js';
import {game,$,$$,panel,toast,bubble,tone,hud,say,confirmAction,iconHTML,paintIcons} from './journey.js';
let drag=null,cutTarget=null;
export function inventory(kind='bag'){game.mode=kind;let s=game.state,pending=game.pending,loose=s.bag.filter(i=>i.x<0&&!s.offerings.includes(i.id));panel(kind==='fire'?'把不再需要的，交給火':kind==='pickup'?'把旅途放進背包':'旅人的背包',`<div class="columns"><div class="pack-column"><div class="pack-surface"><div class="statline"><span>旅人的背包 · 第 ${s.day} 天</span><span>${Core.capacity(s)} 格可用 / 36 格</span></div><div id="baggrid" class="grid" aria-label="6 乘 6 背包格"></div></div><div id="detail" class="itemdetail belowbag"></div><p class="hint">拖曳移動物品 · R 旋轉 · 點選物品查看故事<br>也可先選物品，再點空格放置。斜紋格已經破損。</p>${pending?'<div class="eyebrow">地上的物品 · 尚未放入背包</div><div id="pending" class="itemlist"></div>':''}</div><div class="inventoryside"><div class="eyebrow">整理暫放區</div><div id="loose" class="itemlist staging" aria-label="背包外的物品暫放區"></div><p class="hint">拖到格子外暫放；換地圖前需收好。<br>旋轉不受阻擋，放下時仍需空位。</p><div id="cutpanel"></div><div id="itemactions" class="detailactions"></div>${kind==='fire'?'<canvas id="fireview" class="fireportrait" width="210" height="130"></canvas><p class="hint">火不會替你決定，什麼該留下。</p>':'<div class="travel-note"><div class="eyebrow">旅途的重量</div><p class="hint">留下的，是物品。<br>帶走的，是它們的故事。</p></div>'}</div></div>`);$('.panel').classList.add('inventory-panel');if(kind==='fire'){if(game.soundOn)playAsset('fire',game.volume);$('.inventoryside').style.width='430px';fireView()}function button(it,container){let b=document.createElement('button');b.className='itemchoice';b.innerHTML=iconHTML(it)+it.name;b.onclick=()=>choose(it);b.onpointerdown=e=>beginDrag(e,it);$(container).append(b)}if(pending)button(pending.item,'#pending');loose.forEach(i=>button(i,'#loose'));drawBag();choose(pending?.item||s.bag.find(i=>i.id===game.selected?.id&&!s.offerings.includes(i.id))||null);paintIcons()}
function drawBag(){let s=game.state,g=$('#baggrid');if(!g)return;g.innerHTML='';for(let y=0;y<6;y++)for(let x=0;x<6;x++){let it=s.bag.find(i=>i.x>=0&&!s.offerings.includes(i.id)&&Core.cells(i).some(([a,b])=>a===x&&b===y)),d=document.createElement('div');d.className='cell'+(y*6+x>=Core.capacity(s)?' blocked':'')+(it?' itemcell':'');d.dataset.x=x;d.dataset.y=y;d.setAttribute('role','button');d.setAttribute('aria-label',it?.name||`第${y+1}列第${x+1}格`);if(it){d.style.setProperty('--itemcolor',it.color);d.dataset.item=it.id;let first=Core.cells(it)[0];d.onpointerdown=e=>beginDrag(e,it);d.onclick=()=>choose(it)}else d.onclick=()=>{if(game.selected)placeBag(game.selected,x,y)};d.onpointerenter=()=>previewBag(x,y);g.append(d)}paintPieces(g,s.bag.filter(i=>i.x>=0&&!s.offerings.includes(i.id)));highlight()}
function choose(it){game.selected=it;let d=$('#detail');if(!d)return;d.innerHTML=it?`<div class="tag">${it.shape.length} 格 · ${it.memory?'隨身回憶':'旅途拾遺'}</div><h3 style="margin-top:13px">${it.name}${it.grade?` <small class="grade">${it.grade}</small>`:''}</h3><p>${game.state.day===7?it.after:it.desc}</p>`:'<h3>每一格，都有重量</h3><p>選一件物品，讀一讀它的故事。</p>';$('#itemactions').innerHTML=it?`<button id="rotate">旋轉物品 <kbd>R</kbd></button>${game.mode==='fire'&&!game.pending?'<button id="burn" class="danger">交給營火</button>':''}${!game.pending&&game.state.day<7&&!it.noGift?'<button id="gift">送給塔納</button>':''}${it.key==='scissors'&&game.state.day<7?'<button id="cut">剪裁</button>':''}${it.key==='flower'&&!game.pending&&game.state.day<7?'<button id="wreath">用兩朵野花編花圈</button>':''}`:'';if(it){$('#rotate').onclick=rotateSelected;if($('#burn'))$('#burn').onclick=()=>burn(it);if($('#gift'))$('#gift').onclick=()=>gift(it);if($('#cut'))$('#cut').onclick=cutCloth;if($('#wreath'))$('#wreath').onclick=makeWreath;}highlight()}
function highlight(){$$('.itemcell').forEach(c=>c.classList.toggle('selected',Number(c.dataset.item)===game.selected?.id))}
function previewBag(x,y){$$('#baggrid .cell').forEach(c=>c.classList.remove('good','bad'));let it=game.selected;if(!it)return;let ok=Core.fits(game.state,it,x,y);for(const [a,b]of it.shape)$(`#baggrid .cell[data-x="${a+x}"][data-y="${b+y}"]`)?.classList.add(ok?'good':'bad')}
export function rotateSelected(){let it=game.selected;if(!it)return;if(game.mode==='craft'){game.actions.rotateCraft(it);if(drag)updateGhost();return}let sh=Core.rotate(it.shape);it.shape=sh;if(it.x>=0&&!Core.fits(game.state,it,it.x,it.y)){it.x=-1;it.y=-1}inventory(game.mode);choose(it);if(drag)updateGhost();tone(350,.05)}
function placeBag(it,x,y){let s=game.state;if(!Core.fits(s,it,x,y)){toast('這裡放不下。試著旋轉或整理一下。');return false}it.x=x;it.y=y;if(game.pending?.item.id===it.id){let first=!s.tutorial;s.bag.push(it);s.looted.push(game.pending.point.id);if(it.unique&&!s.uniqueCollected.includes(it.key))s.uniqueCollected.push(it.key);s.tutorial=true;game.pending=null;if(game.soundOn)playAsset('pickup',game.volume);inventory();const pickupLines=(D.pickups?.[it.key]||[]).map(l=>[l.speaker==='tana'?'Ａ':'Ｂ',l.text]);if(first)pickupLines.unshift(...[['Ｂ','原來，帶走一樣東西，就要替它留個位置。'],['Ｂ','拖曳可以移動，R 可以旋轉。放不下的，暫時留在地上吧。'],['Ｂ','今天先加工木材。營地北邊是修道院，南邊是石林草原。'],['Ａ','那就走吧。']]);if(pickupLines.length)say(pickupLines);if(it.type==='seed'&&!s.seedHint){s.seedHint=true;say([['Ｂ','你喜歡花嗎？'],['Ａ','你喜歡嗎？'],['Ｂ','喜歡。'],['Ａ','那就種吧。']])}}else{drawBag();choose(it);if($('#loose'))inventory(game.mode)}hud();tone(554,.08);return true}
export function beginDrag(e,it){if(e.button!==0)return;choose(it);drag={it,startX:e.clientX,startY:e.clientY,active:false,craft:game.mode==='craft'};e.preventDefault()}
function updateGhost(){let el=$('.dragghost');if(!el)return;let sh=drag.it.shape;el.style.gridTemplateColumns=`repeat(${Math.max(...sh.map(p=>p[0]))+1},66px)`;el.style.gridTemplateRows=`repeat(${Math.max(...sh.map(p=>p[1]))+1},66px)`;el.innerHTML=sh.map(([x,y])=>`<i style="grid-column:${x+1};grid-row:${y+1}"></i>`).join('')}
function fireView(){let c=$('#fireview'),g=c.getContext('2d');g.fillStyle='#1b2948';g.fillRect(0,0,210,130);Art.setContext(g);g.save();g.translate(-210,-135);Art.fire(1,318,235);Art.char(287,237,true);Art.char(346,239,false);g.restore();g.fillStyle='#cbb37d';g.font='10px serif';g.fillText('有些話，說給火聽。',57,111)}
function burn(it){confirmAction('真的要燒掉嗎？','「'+it.name+'」會永遠消失。',()=>{let s=game.state;s.bag=s.bag.filter(i=>i.id!==it.id);game.actions.recordBurn(it);game.selected=null;inventory('fire');say([['Ｂ',it.memory?'這樣，應該會輕一點。':'借一點火，把多餘的重量留在這裡。']]);tone(130,.6);hud()})}
function gift(it){game.actions.gift(it)}
function replaceItems(remove,key){let s=game.state,it=Core.make(key,++s.serial),remaining=s.bag.filter(i=>!remove.includes(i.id));if(remove.some(id=>s.bag.find(i=>i.id===id)?.memory)){it.memory=true;it.fromTana=remove.some(id=>s.bag.find(i=>i.id===id)?.fromTana)}if(!Core.placeFirst({...s,bag:remaining},it)){toast('新物品放不下，先整理背包。');return false}s.bag=[...remaining,it];game.selected=it;inventory(game.mode);hud();return true}
function cutCloth(){
 const s=game.state;
 if(!s.bag.some(i=>i.key==='scissors')||s.day===7)return;
 cutTarget=null;
 $('#cutpanel').innerHTML='<div class="cutslots"><button id="clothslot" aria-label="放入要剪裁的布料">放入布料</button><div class="scissorsslot">'+iconHTML(s.bag.find(i=>i.key==='scissors'))+'</div></div><div id="clothchoices" class="itemlist"></div><button id="docut" disabled>剪裁</button>';
 const cloth=s.bag.filter(i=>(i.type==='cloth'||i.type==='coat')&&i.shape.length>1);
 $('#clothchoices').innerHTML=cloth.map(i=>'<button data-cloth="'+i.id+'">'+i.name+'</button>').join('')||'<p class="hint">沒有可剪裁的布料。</p>';
 $$('[data-cloth]').forEach(b=>b.onclick=()=>selectCloth(cloth.find(i=>i.id===Number(b.dataset.cloth))));
 $('#clothslot').onclick=()=>{if(game.selected)selectCloth(game.selected)};
 $('#docut').onclick=()=>{
  const it=cutTarget;if(!it)return;
  confirmAction('剪裁'+it.name+'？','將裁成 '+it.shape.length+' 片一格碎布，無法復原。剪刀會保留。',()=>{
   if(!s.bag.includes(it)){inventory();return}
   const pieces=cutPieces(s,it);s.bag=s.bag.filter(i=>i.id!==it.id);
   for(const piece of pieces){Core.placeFirst(s,piece);s.bag.push(piece)}
   cutTarget=null;inventory();hud();toast('布料裁好了。碎片保留原來的品質和回憶。');
  });
 };paintIcons();
}
function selectCloth(it){
 if(!$('#clothslot'))return;
 if(!game.state.bag.includes(it)||!['cloth','coat'].includes(it.type)||it.shape.length<2){toast('請放入至少兩格的布料或衣物。');return}
 cutTarget=it;$('#clothslot').innerHTML=iconHTML(it)+'<small>'+it.name+'</small>';$('#docut').disabled=false;paintIcons();
}
function makeWreath(){let f=game.state.bag.filter(i=>i.key==='flower');if(f.length<2){toast('需要兩朵白色野花。');return}replaceItems(f.slice(0,2).map(i=>i.id),'wreath')}
export function initInventory(){Object.assign(game.actions,{inventory,rotateSelected});addEventListener('pointermove',e=>{if(!drag)return;if(Math.hypot(e.clientX-drag.startX,e.clientY-drag.startY)>4)drag.active=true;if(!drag.active)return;let ghost=$('.dragghost');if(!ghost){ghost=document.createElement('div');ghost.className='dragghost';$('#stage').append(ghost);updateGhost()}let r=$('#stage').getBoundingClientRect();ghost.style.left=(e.clientX-r.left)/game.scale-25+'px';ghost.style.top=(e.clientY-r.top)/game.scale-25+'px';let grid=$(drag.craft?'#craftgrid':'#baggrid');if(grid){let gr=grid.getBoundingClientRect(),x=Math.floor(((e.clientX-gr.left)/game.scale-5)/69),y=Math.floor(((e.clientY-gr.top)/game.scale-5)/69);drag.craft?game.actions.previewCraft(x,y):previewBag(x,y)}});addEventListener('pointerup',e=>{if(!drag)return;let d=drag;drag=null;$('.dragghost')?.remove();if(!d.active)return;if(!d.craft&&$('#clothslot')){const slot=$('#clothslot').getBoundingClientRect();if(e.clientX>=slot.left&&e.clientX<=slot.right&&e.clientY>=slot.top&&e.clientY<=slot.bottom){selectCloth(d.it);return}}let g=$(d.craft?'#craftgrid':'#baggrid');if(g){let r=g.getBoundingClientRect();if(!d.craft&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)){if(game.state.bag.includes(d.it)){d.it.x=-1;d.it.y=-1;inventory(game.mode);hud()}return}let x=Math.floor(((e.clientX-r.left)/game.scale-5)/69),y=Math.floor(((e.clientY-r.top)/game.scale-5)/69);d.craft?game.actions.placeCraft(d.it,x,y):placeBag(d.it,x,y)}})}

export function paintPieces(grid,items){
 for(const it of items){
  const w=Math.max(...it.shape.map(p=>p[0]))+1,h=Math.max(...it.shape.map(p=>p[1]))+1;
  const c=document.createElement('canvas');c.className='pieceart';c.width=w*16;c.height=h*16;c.style.width=(w*69-3)+'px';c.style.height=(h*69-3)+'px';c.style.left=(it.x*69)+'px';c.style.top=(it.y*69)+'px';
  const g=c.getContext('2d');g.imageSmoothingEnabled=false;
  if(!imageAsset(g,'item.'+it.key,0,0,c.width,c.height)){
   const icon=document.createElement('canvas');icon.width=icon.height=32;Art.icon(icon.getContext('2d'),it.type,32);g.drawImage(icon,0,0,c.width,c.height);
  }
  g.globalCompositeOperation='destination-in';g.beginPath();for(const [x,y]of it.shape)g.rect(x*16,y*16,16,16);g.fill();grid.append(c);
 }
}
