import {updateCatalog} from './catalog.js';
export const defs={
branch:{name:'分岔的枯枝',type:'wood',shape:[[0,0],[0,1],[1,1],[0,2]],color:'#725d3b',desc:'被風折下的枝椏。彎曲也有彎曲的用處。',after:'他說，彎曲也有彎曲的用處。'},
plank:{name:'完整木板',type:'wood',shape:[[0,0],[0,1],[0,2]],color:'#80683f',desc:'馬車上掉下來的木板。剛好，還沒有腐朽。',after:'邊緣留著他仔細摸過的痕跡。'},
timber:{name:'老橡木',type:'wood',shape:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]],color:'#796445',desc:'沉甸甸的。應該能撐過很長、很長的日子。',after:'他比劃了好久，才騰出放它的位置。'},
scrap:{name:'生鏽的鉸鏈',type:'metal',shape:[[0,0],[1,0],[0,1]],color:'#536c63',desc:'鏽斑下面，還有一點光。',after:'他總能在鏽斑下面找到光。'},
silver:{name:'銀製燭台',type:'metal',shape:[[0,0],[0,1],[0,2],[1,2]],color:'#69827a',desc:'曾有人守著這束光，等一個不會回來的人。',after:'以後，不必再等了。'},
cloth:{name:'粗布料',type:'cloth',shape:[[0,0],[1,0],[0,1],[1,1]],color:'#88816b',desc:'粗糙，卻有很柔軟的背面。',after:'是他親手剪下的布。'},
silk:{name:'褪色的祭布',type:'cloth',shape:[[0,0],[1,0],[2,0],[1,1]],color:'#8e8171',desc:'陽光從破窗落下來，照著褪色的花紋。',after:'他曾把這塊布披在肩上，假裝是披風。'},
coat:{name:'舊外套',type:'coat',shape:[[0,0],[1,0],[0,1],[1,1],[0,2]],color:'#506e65',desc:'再舊一點也沒關係。我還捨不得丟。可用剪刀裁成布料。',after:'Ｂ的東西。明明老舊不堪，他卻一直說捨不得丟。'},
scissors:{name:'小剪刀',type:'scissors',shape:[[0,0],[0,1]],color:'#6b7867',desc:'還算鋒利。可以把衣物裁成布料。',after:'他做事的時候，難得那麼安靜。'},
seed:{name:'野花種子',type:'seed',shape:[[0,0]],color:'#616d3f',desc:'好像可以種在營地整理好的土地上。',after:'他問我喜不喜歡花。我問他，你喜歡嗎。'},
flower:{name:'白色野花',type:'flower',shape:[[0,0],[0,1]],color:'#60754c',desc:'把一點春天帶走。可送給Ａ，或用兩朵編成花圈。',after:'他說，花開的時候，要記得替他看。'},
ring:{name:'無名的戒指',type:'ring',shape:[[0,0]],color:'#82713f',desc:'沒有刻名字。或許就是因為這樣，誰都能擁有它。',after:'沒有刻名字。有些約定也不需要名字。'},
book:{name:'旅人的詩集',type:'book',shape:[[0,0],[0,1]],color:'#7b634b',desc:'最後一頁寫著：路走到這裡，花仍會開。',after:'他的聲音，停在最後一頁。'},
ribbon:{name:'Ａ留下的髮帶',type:'memory',shape:[[0,0],[1,0]],color:'#536d6e',desc:'他說只是多的。我知道不是。關於Ａ的回憶。',after:'我說只是多的。他一直都知道不是。'},
letter:{name:'沒有寄出的信',type:'memory',shape:[[0,0]],color:'#8b7b56',desc:'要說的話，都在這裡了。其實，也沒有很多。',after:'字跡很端正。只有我的名字，被寫過很多遍。'},
wreath:{name:'手編花圈',type:'flower',shape:[[0,0],[1,0],[0,1],[1,1]],color:'#688055',desc:'把春天編成一個圓，像不會結束的約定。',after:'圓圈沒有盡頭。'},
nametag:{name:'繡字名條',type:'cloth',shape:[[0,0],[1,0]],color:'#8d866c',desc:'一小條布，足夠让名字留在這裡。',after:'Ｂ。我會記得。'}};
defs.nametag={...defs.nametag,name:'刻有柯林名字的布條',shape:[[0,0]],memory:true,initial:true,desc:'柯林。這個名字，請你記得。',after:'他的名字。不是無名的旅人。'};
defs.coat={...defs.coat,memory:true,fromTana:true,desc:'塔納送的舊外套。我還捨不得丟。可用剪刀裁成布料。'};
defs.score={name:'一首歌的簡譜',type:'book',shape:[[0,0]],color:'#8d8160',memory:true,fromTana:true,desc:'塔納送的簡譜。我曾哼過很多次。',after:'那首歌。他很久沒哼了。'};
defs.gem={name:'透光的寶石',type:'ring',shape:[[0,0]],color:'#6b989a',desc:'比陽光更固執的一點光。',after:'他說，自己也閃閃發光。'};
defs.poisonflower={...defs.flower,name:'有毒的紫花',desc:'漂亮，卻有毒。不要碰嘴巴。',after:'我提醒過他。對他有影響。',color:'#807398'};
defs.pebble={name:'路邊石頭',type:'metal',shape:[[0,0]],color:'#70786d',desc:'很普通的石頭。',after:'他也帶走了這個。'};
defs.letter.memory=true;defs.ribbon.memory=true;defs.ribbon.fromTana=true;
for(const [key,d]of Object.entries(defs)){d.grade=['branch','scrap','coat','pebble'].includes(key)?'破爛':['timber','silver','silk','gem','ring'].includes(key)?'優質':'普通';d.name=d.name.replaceAll('Ａ','塔納').replaceAll('Ｂ','柯林');d.desc=d.desc.replaceAll('Ａ','塔納').replaceAll('Ｂ','柯林');d.after=d.after.replaceAll('Ａ','塔納').replaceAll('Ｂ','柯林')}
updateCatalog(defs);
export const rotate=shape=>{let h=Math.max(...shape.map(p=>p[1]));return shape.map(([x,y])=>[h-y,x])};
export const capacity=s=>36-(s.day-1)*3;
export const cells=it=>it.shape.map(([x,y])=>[x+it.x,y+it.y]);
export function fits(s,it,x,y,shape=it.shape){if(!shape.every(([a,b])=>a+x>=0&&a+x<6&&b+y>=0&&b+y<6&&(b+y)*6+a+x<capacity(s)))return false;return !s.bag.some(o=>o.id!==it.id&&!s.offerings?.includes(o.id)&&o.x>=0&&cells(o).some(([a,b])=>shape.some(([c,d])=>c+x===a&&d+y===b)))}
export const make=(key,id)=>({...defs[key],key,id,shape:defs[key].shape.map(p=>[...p]),x:-1,y:-1});
export function placeFirst(s,it){for(let y=0;y<6;y++)for(let x=0;x<6;x++)if(fits(s,it,x,y)){it.x=x;it.y=y;return true}return false}
export function newState(){let s={version:2,activeSeconds:0,banterSeconds:0,banterCount:0,jokeTold:false,appliedChoices:[],burnedOrigins:[],burnedKeys:[],uniqueCollected:[],graveTalked:false,day:1,map:0,x:254,y:176,ax:229,ay:183,parts:[],flowers:Array(12).fill(null),affinity:85,gifted:[],burnedMemories:0,burnedNames:[],rejectedGifts:0,achievements:[],campBuilt:true,craftDone:false,campLocked:false,soulTaken:false,ringGifted:false,epilogue:false,direction:'down',visited:[0],bag:[],started:false,elapsed:0,seed:Math.floor(Math.random()*1e8),serial:10,looted:[],tutorial:false,seedHint:false,returned:false,burnedMemory:false,distant:false,gifts:0,burned:0,burial:0,offerings:[],wreath:false,nametag:false,cross:false,assembled:[],ended:false};s.bag=[{...make('coat',1),x:0,y:0},{...make('nametag',2),x:3,y:2},{...make('score',3),x:4,y:4},{...make('letter',4),x:5,y:4}];return s}
export function wear(s){for(const it of s.bag)if(it.x>=0&&!cells(it).every(([x,y])=>y*6+x<capacity(s))){it.x=-1;it.y=-1}for(const it of s.bag.filter(i=>i.x<0))placeFirst(s,it)}
export const quality=score=>score===0?'空物':score>=.85?'優質':score>=.5?'普通':'破爛';
function rng(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}}
export function loot(s,map){
 if(!map||s.day===7)return[];
 const r=rng(s.seed+s.day*2137+map*837);
 const essentials=s.day<=2?['plank','branch','timber']:s.day===3?['scrap','metal','fineMetal']:s.day===4?['cloth','rag','silk']:s.day===6?['plank','fineLath','woodPeg']:['flower','oldBook','book'];
 // 第三天起不再採木，第四、五天不再採金屬；第六天為十字架重新提供木材。
 // 石頭沿用金屬圖示分類，但不是金屬材料退場規則中的金屬製品。
 const pool=[...essentials,'wood','nails','bentNails','fineNails','silver','cloth','seed','toxicSeed','edibleSeed','book','oldBook','flower','gem','poisonflower','pebble'].filter(key=>
  !(s.day>=3&&s.day<=5&&defs[key].type==='wood')&&
  !(s.day>=4&&s.day<=5&&defs[key].type==='metal'&&key!=='pebble'));
 const pts=[[255,220],[160,195],[282,142],[215,96],[283,210],[143,138]];
 if(map===2)pts.push([235,192]);
 return pts.map(([x,y],i)=>{
  let key=i<3?essentials[(i+map-1)%3]:pool[Math.floor(r()*pool.length)],id=`${s.day}-${map}-${i}`;
  if(s.day===1&&map===1&&i===0){key='plank';x=370;y=170}
  if(s.day===1&&map===1&&i===3)key='seed';
  if(s.day>=2&&map===1&&i===4){key='ring';id='unique-ring'}
  if(map===1&&i===5){key='scissors';id='unique-scissors'}
  if(s.day===3&&map>=2&&i===5)key='fineNails';
  if(s.day===4&&map===2&&i===5)key='silk';
  if(map===2&&i===6){key='poetry';id='unique-poetry'}
  return{id,x:x+(i>0?(s.day%3-1)*5:0),y,key};
 }).filter(p=>!s.looted.includes(p.id)&&(!defs[p.key].unique||!([...s.bag,...s.gifted].some(i=>i.key===p.key)||(s.uniqueCollected||[]).includes(p.key))));
}
