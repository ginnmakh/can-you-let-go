import {playAsset} from '../rendering/assets.js';
import * as Core from '../core/rules.js';
import {scoreCraft,craftPlan} from '../core/puzzle-rules.js';
import {game,$,$$,parts,panel,toast,bubble,tone,hud,say,confirmAction,closePanel,iconHTML,paintIcons} from './journey.js';
import {beginDrag,paintPieces} from './inventory.js';
function work(){
 const s=game.state;if(s.day===7){bubble('作品已經做好了。去花圃。');return}if(s.day===1&&!s.tutorial){say([['Ｂ','先去西邊的森林，撿一塊木板回來吧。']]);return}
 if(s.craftDone){toast('今天的工作已完成。準備好後，到帳篷休息。');return}
 confirmAction('開始今天的打造？','完成前請留在工作臺。晚上8點前完成後，仍可繼續探索。',()=>{s.day===5?assembly():beginCraft()});
}
function beginCraft(){
 const day=game.state.day;game.mode='craft';game.selected=null;
 game.craft={placed:[],...craftPlan(day)};
 panel(parts[day-1],'<div class="columns"><div><div class="statline"><span>將材料拼入金色輪廓</span><span id="coverage"></span></div><div id="craftgrid" class="grid" style="grid-template-rows:repeat(4,66px)"></div><p class="hint">拖曳材料移動 · R 旋轉 · 點已放入的材料可選取<br>可重排、取回任意材料。輪廓以外的格子會扣分。</p></div><div style="width:430px"><div class="eyebrow">可用材料 · <span id="materialcount"></span> 件</div><div id="materials" class="itemlist scrolllist"></div><div class="actions"><button id="takeback">取回選取材料</button><button id="finishcraft" class="primary">完成今天的打造</button></div><p class="hint">品質由填滿程度、輪廓外格數與材料品質共同決定。<br>完成後仍可活動；20:00前還可外出探索。</p></div></div>');
 $('#takeback').onclick=()=>{let p=game.craft.placed.find(p=>p.it.id===game.selected?.id);if(!p)return;game.craft.placed=game.craft.placed.filter(x=>x!==p);p.it.x=-1;p.it.y=-1;Core.placeFirst(game.state,p.it);game.state.bag.push(p.it);game.selected=null;drawCraft()};
 $('#finishcraft').onclick=finishCraft;drawCraft();
}
function drawCraft(){
 const g=$('#craftgrid'),c=game.craft;if(!g||!c)return;g.innerHTML='';
 for(let y=0;y<4;y++)for(let x=0;x<6;x++){
  const d=document.createElement('div'),inside=c.target.some(([a,b])=>a===x&&b===y),p=c.placed.find(p=>p.shape.some(([a,b])=>a+p.x===x&&b+p.y===y));
  d.className='cell'+(inside?' targetcell':'')+(p?' itemcell':'');d.dataset.x=x;d.dataset.y=y;
  d.setAttribute('role','button');d.setAttribute('aria-label',p?.it.name||('打造第'+(y+1)+'列第'+(x+1)+'格'));
  if(p){d.style.setProperty('--itemcolor',p.it.color);d.onpointerdown=e=>beginDrag(e,p.it);d.onclick=()=>{game.selected=p.it;drawCraft()}}
  else d.onclick=()=>{if(game.selected)placeCraft(game.selected,x,y)};
  d.onpointerenter=()=>previewCraft(x,y);g.append(d);
 }
 const materials=game.state.bag.filter(i=>i.type===c.material&&i.key!=='nametag');
 $('#materialcount').textContent=materials.length;
 $('#materials').innerHTML=materials.map(i=>'<button class="itemchoice '+(game.selected?.id===i.id?'chosen':'')+'" data-material="'+i.id+'">'+iconHTML(i)+'<span class="minishape">'+i.shape.map(([x,y])=>'<i style="grid-column:'+(x+1)+';grid-row:'+(y+1)+'"></i>').join('')+'</span>'+i.name+'<small>'+i.grade+' · '+i.shape.length+' 格</small></button>').join('')||'<p>沒有相符的材料。也可以接受這份不完美。</p>';
 $$('[data-material]').forEach(b=>{const it=materials.find(i=>i.id===Number(b.dataset.material));b.onclick=()=>{game.selected=it;drawCraft()};b.onpointerdown=e=>beginDrag(e,it)});
 const q=scoreCraft(c);$('#coverage').textContent='覆蓋 '+Math.round(q.covered/c.target.length*100)+'% · '+Core.quality(q.score);
 $('#takeback').disabled=!c.placed.some(p=>p.it.id===game.selected?.id);paintIcons();paintPieces(g,c.placed.map(p=>({...p.it,x:p.x,y:p.y,shape:p.shape})));
}
function canCraft(it,x,y,shape=it.shape){return shape.every(([a,b])=>a+x>=0&&a+x<6&&b+y>=0&&b+y<4)&&!game.craft.placed.some(p=>p.it.id!==it.id&&p.shape.some(([a,b])=>shape.some(([c,d])=>c+x===a+p.x&&d+y===b+p.y)))}
function previewCraft(x,y){$$('#craftgrid .cell').forEach(c=>c.classList.remove('good','bad'));let it=game.selected;if(!it)return;let ok=canCraft(it,x,y);it.shape.forEach(([a,b])=>$('#craftgrid .cell[data-x="'+(a+x)+'"][data-y="'+(b+y)+'"]')?.classList.add(ok?'good':'bad'))}
function placeCraft(it,x,y){
 const c=game.craft,existing=c.placed.find(p=>p.it.id===it.id);if((!existing&&!game.state.bag.some(i=>i.id===it.id))||it.type!==c.material)return;
 if(!canCraft(it,x,y)){toast('材料重疊，或超出了工作檯。');return}
 if(existing){existing.x=x;existing.y=y;existing.shape=it.shape.map(p=>[...p])}
 else{c.placed.push({it:{...it},x,y,shape:it.shape.map(p=>[...p])});game.state.bag=game.state.bag.filter(i=>i.id!==it.id)}
 game.selected=null;drawCraft();tone(262,.1);
}
function rotateCraft(it){let shape=Core.rotate(it.shape),p=game.craft.placed.find(p=>p.it.id===it.id);if(p&&!canCraft(it,p.x,p.y,shape)){toast('這裡轉不過去，先移動材料。');return}it.shape=shape;if(p)p.shape=shape.map(x=>[...x]);drawCraft()}
function finishCraft(){
 const s=game.state,q=scoreCraft(game.craft),p={day:s.day,name:parts[s.day-1],score:q.score,quality:Core.quality(q.score),allPremium:game.craft.placed.length>0&&game.craft.placed.every(p=>p.it.grade==='優質'),placed:game.craft.placed.map(p=>({x:p.x,y:p.y,shape:p.shape,color:p.it.color,grade:p.it.grade}))};
 s.parts.push(p);if(s.day===6)s.cross=q.score>0;
 if(p.allPremium&&q.score===1)game.actions.unlock('artisan');
 showResult(p);
}
function showResult(p){
 if(game.soundOn)playAsset('craft',game.volume);
 game.state.craftDone=true;game.mode='result';game.craft=null;game.selected=null;hud();game.actions.autoSave();
 panel('今天，先做到這裡','<p class="quality">'+p.quality+'</p><p>'+(p.score>=.85?'每一道縫隙，都被你耐心填滿。':p.score>0?'有些地方不夠完美，但它是你親手做的。':'這裡留下了一個空缺。明天還是會來。')+'</p><p class="hint">成品留在工作區。今天仍可整理背包、送禮、種花。<br>準備好後，到帳篷結束一天。</p><button class="primary" id="finishwork">收起工具</button>');$('#finishwork').onclick=closePanel;
}
function assembly(){
 game.mode='assembly';game.selected=null;game.state.assembled=[];
 panel('把這幾天，拼在一起','<p>先選左側組件，再選右側對應位置。</p><div class="columns"><div id="assemblyparts" class="itemlist" style="width:270px;flex-direction:column"></div><div id="assemblyslots" class="assembly"></div></div><div class="actions"><button id="assemblefinish" class="primary" disabled>完成作品</button></div>');drawAssembly();
}
function drawAssembly(){
 const s=game.state,labels=['上半部木構','下半部木構','固定金屬','內側布料'];
 $('#assemblyparts').innerHTML=s.parts.slice(0,4).map((p,i)=>'<button data-part="'+i+'" '+(s.assembled.includes(i)?'disabled':'')+'>'+p.name+' · '+p.quality+'</button>').join('');
 $('#assemblyslots').innerHTML=labels.map((v,i)=>'<button data-aslot="'+i+'" '+(s.assembled.includes(i)?'disabled':'')+'>'+(s.assembled.includes(i)?'✓ 已放置':v)+'</button>').join('');
 $$('[data-part]').forEach(b=>b.onclick=()=>{game.selected=Number(b.dataset.part);$$('[data-part]').forEach(x=>x.style.borderColor=x===b?'#e5c886':'')});
 $$('[data-aslot]').forEach(b=>b.onclick=()=>{const n=Number(b.dataset.aslot);if(game.selected!==n){toast('試著放到對應的部位。');return}s.assembled.push(n);game.selected=null;drawAssembly();tone(330+n*40,.15)});
 $('#assemblefinish').disabled=s.assembled.length<4;
 $('#assemblefinish').onclick=()=>{const score=s.parts.slice(0,4).reduce((n,p)=>n+p.score,0)/4,p={day:5,name:'棺木',score,quality:Core.quality(score)};s.parts.push(p);say([['Ｂ','原來……拼起來是這個樣子。'],['Ｂ','我親手做的，應該可以睡得很安穩吧。'],['Ａ','會的。']],()=>showResult(p))};
}
export function initCrafting(){Object.assign(game.actions,{work,drawCraft,previewCraft,placeCraft,rotateCraft})}

