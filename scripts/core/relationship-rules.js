import {dialogues as D} from '../data/dialogues.js';

export function burnedGift(s){return (s.burnedNames||[]).find(n=>!s.bag.some(i=>(i.originName||i.name)===n))}
export function talkTier(s){return s.affinity<=60?'cold':s.affinity<=80?'low':s.affinity<85?'neutral':'high'}
export function availableTalks(s){
 if(s.day>=7)return [];
 const tier=talkTier(s),pool=D.interactions.tiers.find(t=>t.id===(tier==='neutral'?'high':tier)).pool;
 return pool.filter(t=>(tier!=='neutral'||['high_nothing','high_look'].includes(t.id))&&(!t.requires?.min_day||s.day>=t.requires.min_day)&&(!t.requires?.has_burned_gift_from_tana||!!burnedGift(s)));
}

// Shuffle a full cycle, rather than repeatedly drawing the same two choices.
// Store the remaining IDs in the save so reloading does not restart the cycle.
export function rotatingChoices(s,key,pool,count=2,random=Math.random){
 if(!pool.length)return [];
 s.dialogueRotations??={};
 const ids=pool.map(t=>t.id),old=s.dialogueRotations[key]||{eligible:[],remaining:[]};
 let remaining=old.remaining.filter(id=>ids.includes(id));
 remaining.push(...ids.filter(id=>!old.eligible.includes(id)&&!remaining.includes(id)));
 const shuffle=list=>{list=[...list];for(let i=list.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[list[i],list[j]]=[list[j],list[i]]}return list};
 if(!s.dialogueRotations[key])remaining=shuffle(remaining);
 const selected=[];
 while(selected.length<Math.min(count,pool.length)){
  if(!remaining.length)remaining=shuffle(ids.filter(id=>!selected.includes(id)));
  selected.push(remaining.shift());
 }
 s.dialogueRotations[key]={eligible:ids,remaining};
 return selected.map(id=>pool.find(t=>t.id===id));
}
