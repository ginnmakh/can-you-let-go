import {dialogues as D} from '../data/dialogues.js';
import {achievementData} from '../data/achievements.js';
import {applyChoice} from '../core/catalog.js';
import {burnedGift,talkTier,availableTalks,rotatingChoices} from '../core/relationship-rules.js';
import * as Core from '../core/rules.js';
import {game,$,$$,panel,closePanel,say,bubble,hud} from './journey.js';

const sample=a=>a[Math.floor(Math.random()*a.length)];
const lines=a=>a.map(l=>[l.speaker==='tana'?'Ａ':'Ｂ',l.text.replace('{burned_gift_name}',burnedGift(game.state)||'')]);
const awardQueue=[];let awardActive=false;
function showAward(){
  if(awardActive||!awardQueue.length)return;
  awardActive=true;const id=awardQueue.shift(),data=achievementData.find(a=>a[0]===id);
  let el=$('#achievement-toast');if(!el){el=document.createElement('div');el.id='achievement-toast';el.setAttribute('role','status');$('#stage').append(el)}
  el.innerHTML='<small>成就解鎖</small><strong>'+data[1]+'</strong><p>'+data[2]+'</p>';
  // 新建立的第一個通知也先確立下方的起始樣式，再套用共同的滑入動畫。
  el.classList.remove('show');
  void el.offsetHeight;
  el.classList.add('show');
  setTimeout(()=>{el.classList.remove('show');setTimeout(()=>{awardActive=false;showAward()},650)},7000);
}
export function unlock(id){const a=game.state.achievements;if(!a.includes(id)){a.push(id);awardQueue.push(id);showAward()}}
function syncFollowing(){const s=game.state;if(s.affinity>=60)s.stayingToday=false;if(s.affinity<50){s.ax=287;s.ay=189;game.trail=[]}}
export function changeAffinity(delta){const s=game.state;s.affinity=Math.max(0,Math.min(100,s.affinity+delta));syncFollowing()}
export function recordBurn(it){
  const s=game.state;s.burned++;s.burnedOrigins??=[];s.burnedKeys??=[];
  const origin=it.originId??it.id;
  if(it.memory&&!s.burnedOrigins.includes(origin)){s.burnedOrigins.push(origin);s.burnedMemories++;s.burnedMemory=true;changeAffinity(-20)}
  if(!s.burnedKeys.includes(it.originKey||it.key))s.burnedKeys.push(it.originKey||it.key);
  if(it.fromTana&&!s.burnedNames.includes(it.originName||it.name))s.burnedNames.push(it.originName||it.name);
}
function gift(it){
  const s=game.state;
  if(s.day===7||it.noGift||!s.bag.some(i=>i.id===it.id))return;
  const key=D.gifts.specific.some(g=>g.id===it.key)?it.key:it.key==='flower'?'flower_safe':it.key==='poisonflower'?'flower_toxic':it.key==='nametag'&&it.initial?'name_strip':it.type==='book'?'book':it.key;
  const entry=D.gifts.specific.find(g=>g.id===key);
  if(!entry){s.rejectedGifts++;if(s.rejectedGifts>=3)unlock('garbage');closePanel();bubble(sample(D.gifts.rejection.pool).lines[0].text);return}
  if(entry.max_accepted&&s.gifted.filter(g=>g.key===it.key).length>=entry.max_accepted){closePanel();say(lines(entry.limit_lines));return}
  if(entry.affinity_delta){applyChoice(s,'gift:'+entry.id,entry.affinity_delta);syncFollowing()}
  if(entry.accepted){s.bag=s.bag.filter(i=>i.id!==it.id);s.gifted.push({...it,memory:true,x:-1,y:-1});s.gifts++;if(it.key==='ring')s.ringGifted=true;if(it.key==='nametag')unlock('remember')}
  closePanel();say(lines(entry.lines));hud();
}
function talk(){
  const s=game.state,id=talkTier(s);if(s.day>=7)return;
  const tier=D.interactions.tiers.find(t=>t.id===(id==='neutral'?'high':id));
  const pool=rotatingChoices(s,'talk:'+id,availableTalks(s));
  say(lines([sample(tier.opening_pool)]),()=>{
    // 這個好感區間的話都說完了：塔納仍會回應，但不再出現選項。
    if(!pool.length)return;
    game.mode='talk';panel('想對塔納說的話','<div class="talkchoices">'+pool.map((t,i)=>'<button data-talk="'+i+'">'+t.label+'</button>').join('')+'</div>');
    $$('[data-talk]').forEach(b=>b.onclick=()=>{const t=pool[Number(b.dataset.talk)];applyChoice(s,t.id,t.affinity_delta||0);syncFollowing();closePanel();say(lines(t.lines))});
  });
}
function banter(){
  const s=game.state;if(s.affinity<50||s.stayingToday||s.day===7)return;
  const high=s.affinity>=85&&s.burnedMemories===0;
  let pool=D.following.modes.find(t=>t.id===(high?'high':'low')).pool;
  pool=pool.filter(t=>(t.id!=='follow_joke'||(!s.jokeTold&&s.banterCount>=7))&&(t.id!=='follow_song'||s.burnedKeys?.includes('score'))&&(!t.requires?.current_map_has_hidden_good_loot||Core.loot(s,s.map).some(i=>Core.defs[i.key].grade==='優質'&&Math.hypot(i.x-s.x,i.y-s.y)>45)));
  const line=high&&!s.jokeTold&&s.banterCount>=7?pool.find(t=>t.id==='follow_joke'):rotatingChoices(s,'banter:'+(high?'high':'low'),pool,1)[0];
  if(!line)return;if(line.id==='follow_joke')s.jokeTold=true;else s.banterCount=(s.banterCount||0)+1;
  bubble(line.text);
}
export function initRelationships(){Object.assign(game.actions,{gift,talk,banter,unlock,recordBurn})}

