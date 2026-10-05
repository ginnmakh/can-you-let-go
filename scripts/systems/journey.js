import {canWalk,portal,travelBlock,gameMinutes,dusk} from '../core/world-rules.js';
import {followStep} from '../core/following.js';
import {imageAsset,characterAsset,characterDisplayHeight,playAsset,syncAudio,stopAsset} from '../rendering/assets.js';
import {Art} from '../rendering/art.js';
import * as Core from '../core/rules.js';
export const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
export const maps=['營區基地','森林小徑','湖邊的廢棄修道院','石林草原'],days=['第一日','第二日','第三日','第四日','第五日','第六日','第七日'],parts=['木材組件（上）','木材組件（下）','金屬組件','布料內襯','搭建作品','預備墓地','送終之日'];
// 480 × 270 世界座標的像素／秒；Shift 使用同一基準倍率。
const WALK_SPEED=94,SPRINT_MULTIPLIER=2;
// 遊戲畫面放大四倍：原本 7 格世界像素，增加畫面上的 100px。
const TALK_DISTANCE=7+100/4;
// 平常跟隨由畫面上的 100px 增為 225px，離開對話提示的範圍。
const FOLLOW_DISTANCE=25+125/4;
const FOLLOW_SPEED_MULTIPLIER=1.4;
export const game={state:Core.newState(),mode:'',keys:{},target:null,selected:null,pending:null,craft:null,near:null,dialogues:[],scale:1,soundOn:true,volume:.2,actions:{}};
const world=$('#world'),ctx=world.getContext('2d'),overlay=$('#overlay');let audioCtx,lastTone=0,last=performance.now(),bubbleUntil=0,onDialogEnd;game.motion=null;game.returnMode='';game.hold=0;game.tapKeys={};
export function resize(){game.scale=Math.min(innerWidth/1920,innerHeight/1080);$('#stage').style.transform=`translate(-50%, -50%) scale(${game.scale})`}
export function toast(s){$('#toast').textContent=s;$('#toast').classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('#toast').classList.remove('show'),3500)}
export function bubble(s){$('#bubble').hidden=false;$('#bubble').textContent=s;bubbleUntil=performance.now()+5000}
export function tone(freq=440,dur=.1){if(!game.soundOn)return;try{audioCtx??=new(window.AudioContext||window.webkitAudioContext)();audioCtx.resume();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(Math.max(.001,game.volume*.1),audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur)}catch{}}
export function hud(){const s=game.state;if(s.started&&s.bag.filter(i=>i.x>=0&&!s.offerings.includes(i.id)).reduce((n,i)=>n+i.shape.length,0)===Core.capacity(s))game.actions.unlock?.('fullbag');let en=['FOREST’S EDGE','THE WOODLAND PATH','ABANDONED ABBEY','THE ANCIENT MEADOW'],goals=['收集木材','另一半的形狀','留下的微光','柔軟的地方','把約定拼起來','花開的地方','最後的約定'];$('#location').innerHTML=maps[s.map]+`<small>${en[s.map]}</small>`;$('#day').textContent=days[s.day-1];$('#days').textContent=Array.from({length:7},(_,i)=>i<s.day?'●':'○').join(' ');$('#questDay').textContent=`0${s.day} / 07`;$('#questTitle').textContent=goals[s.day-1];$('#questText').textContent=s.day===7?'今天，只剩下一個人的腳步。':s.day===5?'工作區裡，放著這幾天的約定。':s.day===6?'種一些花，再留下能被記住的東西。':'沿著小徑，找一些能用的東西。';$('#questSub').textContent=(s.day<5?'完成':'')+parts[s.day-1];$('#bagcount').textContent=`${s.bag.filter(i=>i.x>=0&&!s.offerings.includes(i.id)).reduce((n,i)=>n+i.shape.length,0)} / ${Core.capacity(s)}`;if($('#mapcount'))$('#mapcount').textContent=`0${s.map+1} / 04`;$('#maphint').textContent=['森林邊緣的一小片平地','樹影之間，藏著旅人的故事','風穿過破碎的彩繪玻璃','有些名字，已被風忘記'][s.map];$$('.mapstrip i').forEach((i,n)=>i.classList.toggle('active',n===3-s.map));$('#mapcard>div:first-child').innerHTML=maps[s.map]+`<small id="mapcount">0${s.map+1} / 04</small>`;$('#exitlabel').innerHTML=s.day===7?'':s.map===0?'修道院 ↑':s.map===3?'營區基地 ↑':'';$('#westexit').classList.toggle('east',s.map===1);$('#westexit').textContent=s.map===0&&s.day<7?'← 森林小徑':s.map===1?'營區基地 →':'';$('#southexit').textContent=s.map===0&&s.day<7?'石林草原 ↓':s.map===2?'營區基地 ↓':'';}
export function objects(){
 const s=game.state;let list=[];
 if(s.map===0){if(!s.epilogue&&s.day<7)list=[{x:318,y:181,kind:'fire',label:'坐在營火旁'},{x:129,y:193,kind:'work',label:`工作區 · 木工完成 ${Math.round(s.parts.slice(0,4).reduce((n,p)=>n+p.score,0)/4*100)}%`},{x:326,y:163,kind:'tent',label:'回帳篷休息'}];list.push({x:172,y:182,kind:'garden',label:s.day===7?'履行最後的約定':'整理花圃'})}
 else list=Core.loot(s,s.map).map(o=>({...o,kind:'loot',label:Core.defs[o.key].name}));
 if(s.day<7&&(s.map===0||(s.affinity>=50&&!s.stayingToday)))list.push({x:s.ax,y:s.ay,kind:'talk',label:'互動'});
 return list;
}
function changeMap(p){const s=game.state;
 const blocked=travelBlock(s,p);
 if(blocked){
  game.target=null;if(game.blockedExit===blocked)return;game.blockedExit=blocked;
  if(blocked==='last-day')bubble('就在這裡。');
  else if(blocked==='night')say([['Ａ',['天色已晚。','這不是明智的選擇。','黑暗的環境會讓你死得更快。','不要把無謀和勇敢混為一談。'][Math.floor(Math.random()*4)]]]);
  else if(blocked==='loose')toast('先安置暫放物品，或到營火清出空間。');
  else toast('先向西走，到森林撿起第一塊木板。');
  return;
 }
 game.blockedExit=null;
 s.map=p.map;s.x=p.x;s.y=p.y;s.ax=p.x;s.ay=p.y;s.visited=[...new Set([...s.visited,p.map])];game.target=null;game.trail=[];
 if(s.affinity<50||s.stayingToday){s.ax=287;s.ay=189}if(s.map===0&&gameMinutes(s)>=1200)s.campLocked=true;hud();tone(294,.2);
 if(p.map===1&&!s.tutorial&&s.day===1)say([['Ｂ','看起來是個好東西！靠近木板，按 F 撿起來吧。'],['Ｂ','沒有拿回營地的話，明天應該就會不見了。']]);
 if(p.map===0&&!s.returned&&s.tutorial){s.returned=true;say([['Ｂ','準備好就去工作臺開始加工，做完再回帳篷休息吧。']])}
}
export function animate(seconds,update,done){game.mode='cinematic';game.keys={};game.tapKeys={};game.target=null;game.motion={elapsed:0,seconds,update,done}}
export function fade(opacity,seconds=1){$('#fade').style.transition=`opacity ${seconds}s`;$('#fade').style.opacity=opacity}
export function walkScene(dest,seconds,done){const s=game.state,start={x:s.x,y:s.y,ax:s.ax,ay:s.ay},dx=dest.x-start.x,dy=dest.y-start.y;if(dx||dy)s.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';animate(seconds,p=>{s.x=start.x+(dest.x-start.x)*p;s.y=start.y+(dest.y-start.y)*p;s.ax=start.ax+((dest.ax??dest.x-20)-start.ax)*p;s.ay=start.ay+((dest.ay??dest.y)-start.ay)*p},done)}
export function startJourney(){game.state=Core.newState();let s=game.state;s.started=true;s.campBuilt=false;s.x=504;s.y=171;s.ax=532;s.ay=175;game.blockedExit=null;$('#intro').hidden=true;$('#overlay').hidden=true;fade(1,0);void $('#fade').offsetHeight;hud();tone(261,.4);
 requestAnimationFrame(()=>{fade(0,3);animate(1.5,()=>{},()=>{walkScene({x:250,y:171,ax:278,ay:176},3,()=>say([['Ｂ','是時候了，對吧？'],['Ａ','……'],['Ｂ','你會幫我吧？'],['Ａ','開始吧。']],()=>{fade(1,1);tone(95,.4);animate(1,()=>{},()=>{s.campBuilt=true;fade(0,1.5);animate(1.5,()=>{},()=>{game.mode='';say([['Ｂ','去西邊的森林看看吧！說不定能收集到需要的材料！']],()=>{bubble('向西。');game.actions.unlock('clock')})})})}))})});playAsset('forest',game.volume)
}

const iconCache={};for(const type of new Set(Object.values(Core.defs).map(i=>i.type))){let c=document.createElement('canvas');c.width=c.height=16;Art.icon(c.getContext('2d'),type);iconCache[type]=c}
function frame(t){
 const s=game.state,dt=Math.min((t-last)/1000,.05);last=t;
 if(s.started&&(s.day>1||s.tutorial)&&!s.ended&&!['cinematic','soul'].includes(game.mode))s.elapsed+=dt;
 if(s.started&&!s.ended&&!['cinematic','soul'].includes(game.mode))s.activeSeconds=(s.activeSeconds||0)+dt;
 let moving=false;const previousAX=s.ax,previousAY=s.ay;
 if(game.motion){let m=game.motion,oldX=s.x,oldY=s.y;m.elapsed+=dt;m.update(Math.min(1,m.elapsed/m.seconds));moving=oldX!==s.x||oldY!==s.y;if(m.elapsed>=m.seconds){game.motion=null;m.done?.()}}
 if(game.mode==='soul')game.actions.updateSoul?.(dt);
 if(s.started&&!game.mode&&!game.dialogues.length&&!s.ended){
  const k={...game.keys};for(const key of Object.keys(game.tapKeys))if(game.tapKeys[key])k[key]=true;game.tapKeys={};let dx=Number(!!(k.d||k.ArrowRight))-Number(!!(k.a||k.ArrowLeft)),dy=Number(!!(k.s||k.ArrowDown))-Number(!!(k.w||k.ArrowUp));
  if(dx||dy)game.target=null;
  if(!dx&&!dy&&game.target){let n=Math.hypot(game.target.x-s.x,game.target.y-s.y);if(n>2){dx=(game.target.x-s.x)/n;dy=(game.target.y-s.y)/n}else game.target=null}
  let n=Math.hypot(dx,dy)||1,speed=WALK_SPEED*(k.Shift?SPRINT_MULTIPLIER:1);if(dx||dy)s.direction=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up';dx=dx/n*dt*speed;dy=dy/n*dt*speed;
  let oldX=s.x,oldY=s.y;if(canWalk(s,s.x+dx,s.y))s.x+=dx;if(canWalk(s,s.x,s.y+dy))s.y+=dy;moving=oldX!==s.x||oldY!==s.y;
  const p=portal(s);
  if(p&&travelBlock(s,p)){s.x=oldX;s.y=oldY;moving=false;game.target=null}
  if(p)changeMap(p);else game.blockedExit=null;
  const gap=s.distant?75:FOLLOW_DISTANCE,dist=Math.hypot(s.x-s.ax,s.y-s.ay);
  if(s.day<7&&s.affinity>=50&&!s.stayingToday&&dist>gap){
   const next=followStep(s,dt*speed*FOLLOW_SPEED_MULTIPLIER,gap,canWalk,game.followerNav??={});s.ax=next.x;s.ay=next.y;
  }else game.followerNav=null;
  if(moving&&s.day<7&&s.affinity>=50&&!s.stayingToday){s.banterSeconds=(s.banterSeconds||0)+dt;if(s.activeSeconds>=20&&s.banterSeconds>=(s.affinity>=85&&!s.burnedMemories?13:23)){s.banterSeconds=0;game.actions.banter?.()}}
 }
 const followerMoving=Math.hypot(s.ax-previousAX,s.ay-previousAY)>1e-6;
 if(followerMoving){const dx=s.ax-previousAX,dy=s.ay-previousAY;s.aDirection=Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up'}
 Art.scene(ctx,s.map,t/1000,s);
 for(const o of objects())if(o.kind==='loot'){
  let color={'破爛':'#e1e4e1','普通':'#78bbeb','優質':'#edd085'}[Core.defs[o.key].grade]||'#a5c9aa';ctx.fillStyle=color+'33';ctx.fillRect(o.x-9,o.y-10,18,14);if(!imageAsset(ctx,'item.'+o.key,o.x-6,o.y-11,12,12))ctx.drawImage(iconCache[Core.defs[o.key].type],o.x-6,o.y-11,12,12);ctx.fillStyle=color;for(let i=0;i<3;i++)ctx.fillRect(o.x-6+i*5,o.y-14-(t/120+i*5)%13,1,1)
 }
 Art.setContext(ctx);
 const draw=(a,x,y)=>{const follower=a&&!s.soulTaken,direction=follower?s.aDirection||'down':s.direction,walking=follower?followerMoving:moving;if(!characterAsset(ctx,a?'tana':'colin',x,y,direction,walking,t/1000))Art.char(x,y,a,walking?t/100:0);if(a&&s.gifted.some(i=>i.key==='wreath'&&!s.offerings.includes(i.id))){const head=y-characterDisplayHeight('tana',direction)+3;ctx.fillStyle='#7c9d58';ctx.fillRect(x-5,head,11,3);ctx.fillStyle='#eadbbe';for(let j=0;j<3;j++)ctx.fillRect(x-4+j*4,head-1,2,2)}};
 if(s.day<7||!s.soulTaken){if((s.affinity>=50&&!s.stayingToday)||s.map===0)draw(true,s.ax,s.ay);if(!s.bodyDown)draw(false,s.x,s.y)}else draw(true,s.x,s.y+(s.sitting?4:0));if(s.bodyDown&&s.burial<2){Art.setContext(ctx);Art.char(s.bodyX??252,s.bodyY??180,false,0,true)}if(s.pouring){ctx.fillStyle='#b69c64';ctx.fillRect(s.x-7,s.y-12,7,3);ctx.fillStyle='#c5d9c1aa';for(let i=0;i<7;i++)ctx.fillRect(s.x-8-i,s.y-8+i,1,3)}
 ctx.fillStyle=`rgba(3,8,20,${s.day===7&&!s.epilogue?.45:dusk(s)})`;ctx.fillRect(0,0,480,270);
 if(s.map===0&&s.campBuilt&&!s.epilogue){let glow=ctx.createRadialGradient(318,180,0,318,180,45);glow.addColorStop(0,'#e8a45122');glow.addColorStop(1,'#e8a45100');ctx.fillStyle=glow;ctx.fillRect(270,130,96,96)}
 game.near=objects().filter(o=>Math.hypot(o.x-s.x,o.y-s.y)<=(o.kind==='talk'?TALK_DISTANCE:27)).sort((a,b)=>(a.kind==='talk')-(b.kind==='talk')||Math.hypot(a.x-s.x,a.y-s.y)-Math.hypot(b.x-s.x,b.y-s.y))[0];let near=game.near;
 $('#interact').hidden=!near||!!game.mode||!s.started||game.dialogues.length>0||s.ended;
 if(near){$('#interact').style.left=near.x*4+'px';$('#interact').style.top=(near.kind==='talk'?near.y+5:near.y-25)*4+'px';$('#interact span').textContent=near.label}
 $('#bubble').style.left=Math.max(12,Math.min(1570,(s.soulTaken?s.x:s.ax)*4-50))+'px';$('#bubble').style.top=Math.max(80,(s.soulTaken?s.y:s.ay)*4-180)+'px';if(t>bubbleUntil)$('#bubble').hidden=true;
 const minutes=Math.min(1439,gameMinutes(s));$('#time').textContent=`${minutes<720?'晨光':minutes<1080?'午後':'暮色'} · ${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`;
 if(s.started&&game.soundOn&&t-lastTone>6500){lastTone=t;tone([196,220,261.63,293.66,329.63][Math.floor(t/6500)%5],2.5)}requestAnimationFrame(frame)
}

export function say(lines,done){game.dialogues=lines.map(([who,text])=>[who,text.replaceAll('Ａ','塔納').replaceAll('Ｂ','柯林')]);onDialogEnd=done;game.keys={};game.tapKeys={};game.target=null;showLine()}
function showLine(){if(!game.dialogues.length){$('#dialogue').hidden=true;let f=onDialogEnd;onDialogEnd=null;f?.();return}let [who,text]=game.dialogues[0];$('#dialogue').hidden=false;$('#dialogue').innerHTML=`<canvas width="28" height="39"></canvas><b>${who==='Ａ'?'塔納':'柯林'}</b><p>${text}</p><small>F / 空白鍵 / 點擊繼續 ▾</small>`;Art.portrait($('#dialogue canvas'),who==='Ａ')}
function nextLine(){game.dialogues.shift();tone(520,.035);showLine()}
export function panel(title,body,eyebrow='旅途中'){overlay.hidden=false;game.keys={};game.tapKeys={};game.target=null;overlay.innerHTML=`<section class="panel" role="dialog" aria-modal="true" aria-label="${title}"><div class="panelhead"><div><div class="eyebrow">${eyebrow}</div><h2>${title}</h2></div><button class="close" aria-label="關閉">×</button></div>${body}</section>`;$('.close').onclick=closePanel;setTimeout(()=>$$('#overlay button:not(.close):not(:disabled)').find(b=>!b.hidden)?.focus(),0)}
export function closePanel(){if(game.state.ended){game.state.ended=false;game.state.postEnding=true;game.state.sitting=false;game.state.x=194;game.state.y=182;}if(['craft','assembly'].includes(game.mode)){toast('先完成今天的打造，才能收起工具。');return}if(['cinematic','soul','farewell'].includes(game.mode))return;game.mode='';stopAsset('fire');game.pending=null;game.selected=null;overlay.hidden=true;overlay.innerHTML='';if(!game.state.started)$('#intro').hidden=false;hud()}
export function confirmAction(title,text,yes){game.mode='confirm';panel(title,`<p>${text}</p><div class="actions"><button id="yes" class="primary">是，繼續</button><button id="no">否，返回</button></div>`);$('#yes').onclick=yes;$('#no').onclick=closePanel}
export const iconHTML=it=>`<canvas width="32" height="32" data-icon="${it.type}" data-key="${it.key}"></canvas>`;
export function paintIcons(){$$('[data-icon]').forEach(c=>imageAsset(c.getContext('2d'),'item.'+c.dataset.key,0,0,32,32)||Art.icon(c.getContext('2d'),c.dataset.icon,32))}
function handleChoiceKey(e,k){
 if(!game.mode&&game.state.started)return false;
 if(!['w','s','a','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter',' '].includes(k))return false;
 const scope=game.mode?'#overlay':'#intro';
 const options=$$(scope+' button:not(:disabled)').filter(b=>!b.hidden&&b.getClientRects().length>0&&!b.classList.contains('close'));
 if(!options.length)return false;e.preventDefault();
 let i=options.indexOf(document.activeElement);
 if(k==='Enter'||k===' '){if(!e.repeat)(options[i]||options[0]).click();return true}
 const backwards=['w','a','ArrowUp','ArrowLeft'].includes(k);
 options[i<0?0:(i+(backwards?-1:1)+options.length)%options.length].focus();return true;
}
function interact(){let near=game.near,s=game.state;if(!near){bubble(s.day===7?'去花圃吧。':'走近一點。');return}tone(392,.08);if(near.kind==='loot'){game.pending={point:near,item:Core.make(near.key,++s.serial)};game.actions.inventory('pickup');return}if(near.kind==='fire')game.actions.inventory('fire');if(near.kind==='garden')s.day===7?game.actions.burial():game.actions.garden();if(near.kind==='work')game.actions.work();if(near.kind==='tent')game.actions.sleep();if(near.kind==='talk')game.actions.talk()}
export function initJourney(){resize();addEventListener('resize',resize);$('#dialogue').onclick=nextLine;$('#start').onclick=startJourney;$('#continue').onclick=()=>game.actions.slots('load');$('#bagbtn').onclick=()=>{if(game.state.started&&!game.dialogues.length&&!game.mode)game.actions.inventory()};$('#menu').onclick=()=>{if(game.state.started&&!game.dialogues.length&&!game.mode)game.actions.menu()};$('#fullscreen').onclick=()=>{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen().catch(()=>toast('這個瀏覽器目前不支援全螢幕。'))};$('#sound').onclick=()=>{game.soundOn=!game.soundOn;syncAudio(game.soundOn,game.volume);if(game.soundOn)playAsset('forest',game.volume);$('#sound').style.opacity=game.soundOn?1:.45;tone(440);toast(game.soundOn?'森林的聲音已開啟':'聲音已關閉')};world.addEventListener('pointerdown',e=>{if(!game.state.started||game.mode||game.dialogues.length)return;let r=world.getBoundingClientRect();game.target={x:(e.clientX-r.left)/r.width*480,y:(e.clientY-r.top)/r.height*270}});
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','Tab'].includes(e.key)&&game.state.started)e.preventDefault();let k=e.code?.startsWith('Key')?e.code.slice(3).toLowerCase():e.key.length===1?e.key.toLowerCase():e.key;if(game.mode==='soul'){if(k==='f'){game.keys.f=true;e.preventDefault()}return}if(['cinematic','farewell'].includes(game.mode)&&!game.dialogues.length)return;if(e.repeat&&['f','e','r','Escape',' '].includes(k))return;if(game.dialogues.length){if(['f',' ','Enter','Escape'].includes(k))nextLine();return}if(handleChoiceKey(e,k))return;if(!game.state.started){if(k==='Escape'&&game.mode)closePanel();return}if(k==='Escape'){game.mode?closePanel():game.actions.menu();return}if(k==='e'&&!['craft','assembly','result','cinematic','soul','farewell','ending'].includes(game.mode)){game.mode?closePanel():game.actions.inventory();return}if(k==='r'&&['bag','pickup','fire','craft'].includes(game.mode)){game.actions.rotateSelected();return}if(k==='f'&&!game.mode){interact();return}if(k==='Tab'&&game.mode){let f=$$('#overlay button:not(:disabled),#overlay input'),n=f.indexOf(document.activeElement);f[(n+(e.shiftKey?-1:1)+f.length)%f.length]?.focus();return}game.keys[k]=true;if(!game.mode&&['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(k))game.tapKeys[k]=true});addEventListener('keyup',e=>{game.keys[e.code?.startsWith('Key')?e.code.slice(3).toLowerCase():e.key.length===1?e.key.toLowerCase():e.key]=false});addEventListener('blur',()=>{game.keys={};game.tapKeys={};game.target=null});hud();requestAnimationFrame(frame)}
