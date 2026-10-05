import {bloom} from '../core/catalog.js';
import {achievementData} from '../data/achievements.js';
import {resolveEnding} from '../core/world-rules.js';
import {Art} from '../rendering/art.js';
import {imageAsset,playAsset} from '../rendering/assets.js';
import {game,$,$$,panel,toast,bubble,tone,hud,say,confirmAction,closePanel,iconHTML,paintIcons,walkScene,animate,fade} from './journey.js';
function garden(){
 game.mode='garden';const s=game.state;
 panel('留一點地方，給花','<p>種子睡一晚後開花。中央兩格留給最後的約定。</p><div class="garden">'+s.flowers.map((v,i)=>'<button data-plot="'+i+'" '+([4,7].includes(i)?'disabled':'')+'>'+([4,7].includes(i)?'▧':v?s.day>v.plantedDay?'✿':'♧':'＋')+'<small>'+([4,7].includes(i)?'預留的土地':v?s.day>v.plantedDay?(v.name||'花已開放'):'等待明天':'種下種子')+'</small></button>').join('')+'</div><p class="hint">點選已種植的位置可移除，種子不會退回。</p>');
 $$('[data-plot]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.plot);if([4,7].includes(i))return;
  if(s.flowers[i]){confirmAction('移除這叢花？','花叢移除後，種子不會退回。',()=>{s.flowers[i]=null;garden()});return}
  const seeds=s.bag.filter(it=>it.type==='seed');if(!seeds.length){toast('背包裡還沒有野花種子。');return}
  panel('種下哪一顆？','<div class="actions">'+seeds.map(it=>'<button data-seed="'+it.id+'">'+it.name+'</button>').join('')+'</div>');
  $$('[data-seed]').forEach(b=>b.onclick=()=>{const seed=seeds.find(it=>it.id===Number(b.dataset.seed));s.bag=s.bag.filter(it=>it.id!==seed.id);const random=((Math.imul(s.seed+seed.id*31+i,1664525)>>>0)%10000)/10000;s.flowers[i]={plantedDay:s.day,seedKind:seed.seedKind,...bloom(seed.seedKind,random)};garden();hud();bubble('它會長大的。')});
 });
}
const allItems=s=>[...s.bag,...s.gifted];
const available=(s,key)=>allItems(s).find(i=>i.key===key&&!s.offerings.includes(i.id)&&(key!=='nametag'||i.initial));
function consume(s,it){s.bag=s.bag.filter(i=>i.id!==it.id);s.gifted=s.gifted.filter(i=>i.id!==it.id)}
function burial(){
 const s=game.state;if(s.postEnding){postEndingChoices();return}if(s.epilogue){returnChoices();return}if(!s.soulTaken){bubble('先把最後的約定完成。');return}
 if(s.burial>=8){finalChoices();return}game.mode='burial';
 const steps=['放入棺木','安放柯林','選擇陪葬品','埋土','插上十字架','留下名字','放上花圈','最後凝視'];
 if(s.burial===2){offerings();return}
 const hasName=!!available(s,'nametag')&&s.cross,hasWreath=!!available(s,'wreath');
 const descriptions=['這片異色的土地，原來一直替他留著位置。','你俯下身。他比記憶裡輕了。','','把泥土慢慢覆上。動作輕一點，再輕一點。',s.cross?'作品旁的十字架，還留著木材的味道。':'沒有十字架。風仍會經過這裡。',hasName?'把柯林的名字，繫在十字架上。':'沒有能綁在十字架上的原始名字布條。',hasWreath?'把編好的春天，留在他身邊。':'沒有花圈。風送來了花的氣味。','沒有誰催促你。可以慢慢告別。'];
 panel(steps[s.burial],'<div class="burialscene"><canvas id="graveart" width="320" height="240"></canvas><div><p>'+descriptions[s.burial]+'</p>'+(s.burial===0?'<p class="quality">'+(s.parts.find(p=>p.day===5)?.quality||'空物')+'的作品</p>':'')+'<div class="actions"><button id="burialnext" class="primary">'+((s.burial===5&&!hasName)||(s.burial===6&&!hasWreath)?'繼續':steps[s.burial])+'</button></div></div></div>');
 drawGrave($('#graveart'));
 $('#burialnext').onclick=()=>{
  if(s.burial===1)game.actions.unlock('goodnight');
  if(s.burial===5&&hasName){s.nametag=true;consume(s,available(s,'nametag'))}
  if(s.burial===6&&hasWreath){s.wreath=true;consume(s,available(s,'wreath'))}
  s.burial++;tone(196,.5);hud();game.actions.autoSave();s.burial>=8?finalChoices():burial();
 };
}
function offerings(){
 const s=game.state;
 panel('那些捨不得留下的東西','<p>最多六件陪葬品。塔納收下的禮物，也都在這裡。</p><div id="offeringlist" class="itemlist scrolllist" style="max-width:950px"></div><div id="offerdesc" class="itemdetail"><p>選一件物品，由塔納讀它的故事。</p></div><p class="hint">放進棺木的名字布條與花圈，就不能再留在墓上。</p><button id="offerconfirm" class="primary">確認陪葬品 · <span id="offercount">0</span> / 6 件</button>');
 const chosen=new Set(s.offerings);
 for(const it of allItems(s)){const b=document.createElement('button');b.className='itemchoice'+(chosen.has(it.id)?' chosen':'');b.innerHTML=iconHTML(it)+it.name+(s.gifted.some(g=>g.id===it.id)?'<small>塔納收著的</small>':'');
  b.onclick=()=>{if(chosen.has(it.id))chosen.delete(it.id);else if(chosen.size<6)chosen.add(it.id);else toast('最多六件。');b.classList.toggle('chosen',chosen.has(it.id));$('#offerdesc').innerHTML='<h3>'+it.name+'</h3><p>'+it.after+'</p>';$('#offercount').textContent=chosen.size};$('#offeringlist').append(b);
 }
 paintIcons();$('#offercount').textContent=chosen.size;$('#offerconfirm').onclick=()=>{s.offerings=[...chosen];s.burial=3;burial()};
}
const endings={
 'relics':{title:'只剩遺物',text:'你銷毀了關於自己、關於Ａ所有的一切。回憶、情感、連結都沒有意義了。'},
 'john-doe':{title:'John Doe',text:'你沒有名字、沒有出身、沒有被記錄的容貌和故事，只有一個魔鬼記得你，剛好他可以活很久。'},
 'love':{title:'這是愛嗎？',text:'你從來沒有這麼安心過，你在心裡偷偷問：這是愛嗎？……你已經沒辦法聽到答案，但你隱約感覺到有個魔鬼在你的墓旁待了很久。'},
 'return':{title:'總是回來',text:'他仍收著那枚戒指。路的盡頭，總有一個地方讓他回來。'},
 'farewell':{title:'花仍會開',text:'七天的旅途結束了。留下的約定，會陪著下一個春天。'}
};
function finalChoices(){
 const s=game.state;s.ending=resolveEnding(s);game.mode='burial';
 const only=s.ending==='relics';
 panel('最後的凝視','<div class="actions">'+(only?'<button id="gravewords">看看墳墓</button>':'<button id="sit" class="primary">坐下</button>')+'<button id="leave">離開</button></div>');
 if(only)$('#gravewords').onclick=()=>bubble('這樣就夠了。');
 else $('#sit').onclick=()=>{closePanel();walkScene({x:190,y:158},2,()=>{s.sitting=true;animate(5,()=>{},()=>{fade(1,2);animate(2,()=>{},()=>s.ending==='return'?returnVisit():endGame())})})};
 if(s.ending==='return')$('#leave').hidden=true;$('#leave').onclick=()=>{closePanel();walkScene({x:465,y:170},4,()=>{fade(1,2);animate(2,()=>{},endGame)})};
}
function finishToTitle(){
 fade(1,2);animate(2,()=>{},()=>{game.state.started=false;game.state.sitting=false;game.mode='';$('#overlay').hidden=true;$('#intro').hidden=false;fade(0,0)});
}
function postEndingChoices(){
 const s=game.state;game.mode='burial';
 const only=s.ending==='relics';
 panel('墓旁','<div class="actions">'+(only?'':'<button id="aftersit">坐下</button>')+'<button id="afterleave">離開這裡</button>'+(!only&&!s.graveTalked?'<button id="aftertalk">和墓對話</button>':'')+'</div>');
 if(only)bubble('這樣就夠了。');
 if($('#aftersit'))$('#aftersit').onclick=()=>{closePanel();walkScene({x:194,y:164},2,()=>{s.sitting=true;animate(5,()=>{},finishToTitle)})};
 $('#afterleave').onclick=()=>{closePanel();bubble('睡吧。');s.direction='right';walkScene({x:510,y:182},7,()=>animate(3,()=>{},finishToTitle))};
 if($('#aftertalk'))$('#aftertalk').onclick=()=>{s.graveTalked=true;closePanel();game.mode='farewell';const words=['我有一股奇怪的感覺。','這到底是什麼……？','你應該會知道，但我沒辦法問你了。'];let i=0;const next=()=>{if(i===words.length){game.mode='';game.actions.autoSave();return}bubble(words[i++]);animate(5,()=>{},next)};next()};
}
function returnVisit(){
 const s=game.state;
 animate(3,()=>{},()=>{s.epilogue=true;s.sitting=false;s.x=484;s.y=170;s.bodyDown=false;s.campBuilt=false;fade(0,2);walkScene({x:194,y:164},6,()=>{game.mode='';s.ended=false;hud();game.actions.autoSave();toast('走近墳墓，按 F。')})});
}
function returnChoices(){
 game.mode='burial';panel('又回到這裡','<div class="actions"><button id="returnsit">坐下</button><button id="wine" class="primary">把酒撒在墓上</button></div>');
 const finish=()=>{fade(1,2);animate(2,()=>{},endGame)};
 $('#returnsit').onclick=()=>{closePanel();game.state.sitting=true;animate(5,()=>{},finish)};
 $('#wine').onclick=()=>{closePanel();game.state.pouring=true;animate(2,()=>{},()=>{game.state.pouring=false;bubble('據說把酒撒在墓上，亡者就會記得回來的路。');animate(5,()=>{},()=>{bubble('……但你不喜歡喝酒。');animate(4,()=>{},finish)})})};
}
function achievements(){game.mode='achievements';panel('旅途留下的事',achievementData.map(([id,n,d])=>'<div class="achievement '+(game.state.achievements.includes(id)?'earned':'')+'">'+(game.state.achievements.includes(id)?'✦':'◇')+' '+n+'<p class="hint">'+d+'</p></div>').join(''))}
function drawGrave(c){
 const ctx=c.getContext('2d'),s=game.state,scene=document.createElement('canvas');scene.width=480;scene.height=270;
 Art.scene(scene.getContext('2d'),0,1,s);ctx.imageSmoothingEnabled=false;ctx.drawImage(scene,112,91,146,110,0,0,320,240);
}
function endGame(){
 const s=game.state;s.ended=true;s.ending??=resolveEnding(s);game.mode='ending';fade(0,0);game.actions.autoSave();playAsset('ending',game.volume);
 const e=endings[s.ending];
 panel(e.title,'<div class="endinglayout"><canvas id="endingart" width="640" height="480"></canvas><div><div class="eyebrow">第七日 · 旅途的終點</div><h2>'+e.title+'</h2><p>'+e.text.replaceAll('Ａ','塔納')+'</p><p class="hint">按 Esc 關閉說明，回到墓旁自由活動。</p><p class="hint">'+s.offerings.length+' 件遺物 · '+s.flowers.filter(v=>v&&s.day>v.plantedDay).length+' 叢花</p><div class="actions"><button id="endach">查看成就</button><button id="endtitle">回到起點</button></div></div></div>');
 $('.panelhead').hidden=true;
 const c=$('#endingart'),ctx=c.getContext('2d');if(!imageAsset(ctx,'ending.'+s.ending,0,0,640,480)){ctx.save();ctx.scale(2,2);const t=document.createElement('canvas');t.width=320;t.height=240;drawGrave(t);ctx.imageSmoothingEnabled=false;ctx.drawImage(t,0,0);ctx.restore()}
 $('#endach').onclick=achievements;$('#endtitle').onclick=()=>{game.mode='';$('#overlay').hidden=true;$('#intro').hidden=false;s.started=false};
}
export function initFarewell(){Object.assign(game.actions,{garden,burial,achievements,endGame})}

