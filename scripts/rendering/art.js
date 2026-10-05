import {palette as P,terrains} from './palette.js';
import {imageAsset,characterAsset} from './assets.js';
import { draw as drawCamp } from "../maps/camp.js";
import { draw as drawForest } from "../maps/forest.js";
import { draw as drawMonastery } from "../maps/monastery.js";
import { draw as drawGrassland } from "../maps/grassland.js";
/* Original low-resolution bitmap renderer. Every world pixel is drawn at 480 × 270. */
export const Art=(()=>{let ctx;const rect=(x,y,w,h,c)=>{ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),w,h)};function rng(seed){return()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}}function tree(x,y,s=1,t=0){
 ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(s,s);
 rect(-16,-1,36,5,P.shadow+'60');rect(-3,-14,7,23,P.trunk);rect(1,-10,2,18,P.bark);
 // 延續原有三層樹冠；把平整矩形分成疏密不同的葉片與冷色暗部。
 for(let j=0;j<3;j++){
  let w=35-j*8,yy=-23-j*12;
  rect(-w/2,yy,w,14,P.leafDark);rect(-w/2+3,yy-5,w-6,14,t?'#567b70':P.leaf);
  rect(-w/2+6,yy-8,w-14,5,t?'#84a48a':P.leafLight);
  rect(-w/2+2,yy+5,7,5,P.shadow);rect(w/2-8,yy+7,6,4,P.leafDark);
  rect(-w/2+5,yy-3,6,2,P.leafLight);rect(2,yy-5,4,2,P.leafTip);
  rect(-5,yy+2,6,3,P.leafDark);rect(w/2-4,yy+1,5,3,P.leaf);
 }
 ctx.restore();
}
function rock(x,y,w=12){rect(x+1,y-5,w-2,7,P.stone);rect(x,y-3,w,7,P.stoneShade);rect(x+2,y-6,w-5,2,P.stoneLight);rect(x+2,y-3,Math.max(2,w/3),2,P.stone);rect(x+3,y+3,w,2,P.shadow+'80')}
function flower(x,y,c='#d8cb93'){rect(x,y,1,4,'#789050');rect(x-1,y-1,3,2,c);rect(x,y,1,1,'#d1a05d')}function char(x,y,a=false,walking=0,dead=false){ctx.save();ctx.translate(Math.round(x),Math.round(y));if(dead)ctx.rotate(-Math.PI/2);if(characterAsset(ctx,a?'tana':'colin',0,0,'down',!!walking,walking/10)){ctx.restore();return}rect(-5,0,11,3,'#142c2377');let foot=walking?Math.sin(walking)*2:0;rect(-3,-3,2,4+foot,'#292d29');rect(2,-3,2,4-foot,'#292d29');rect(-5,-13,10,10,a?'#263a38':'#baa578');rect(-4,-11,8,5,a?'#435254':'#cfbc8c');rect(-5,-7,10,3,a?'#1a2d2e':'#a78c60');rect(-6,-12,2,7,'#a69d80');rect(5,-12,2,7,'#b6ac8b');rect(-4,-20,8,8,'#e0c49b');rect(-5,-23,10,5,a?'#1b2727':'#bc9d65');rect(-5,-20,3,5,a?'#222f2c':'#d4b47c');rect(3,-19,2,4,a?'#24312d':'#aa8957');rect(-1,-17,1,1,'#303d33');rect(3,-17,1,1,'#303d33');if(!a){rect(-5,-10,3,9,'#655c40');rect(-6,-10,3,5,'#8c7950')}ctx.restore()}function tent(){if(imageAsset(ctx,'prop.tent',291,114,75,51))return;rect(294,156,67,9,'#233a2b');for(let i=0;i<36;i++){rect(324-i*.85,117+i,2+i*1.8,1,i<4?'#e0c18b':'#bd9d65')}for(let i=0;i<32;i++)rect(324-i*.46,123+i,1+i*.94,1,'#5d553c');rect(327,116,2,43,'#e4c48d');rect(297,155,61,2,'#e0bd80');rect(293,155,2,7,'#98845a');rect(362,154,2,7,'#98845a');rect(306,149,8,5,'#a38553');rect(346,149,8,5,'#a38553')}
function fire(t,x=318,y=182){if(imageAsset(ctx,'prop.fire',x-12,y-23,26,30))return;for(let i=0;i<5;i++)rock(x-10+i*5,y+1+(i%2)*3,5);rect(x-7,y-1,15,3,'#776041');rect(x-4,y-5,8,5,'#ea9f4b');rect(x-3,y-11+Math.sin(t*8)*2,6,8,'#d98540');rect(x-1,y-14+Math.sin(t*6)*2,3,12,'#eec174');rect(x,y-8,2,7,'#fae6a3');rect(x+3+Math.sin(t)*3,y-21-(t*6%8),1,1,'#ddbb7b')}
function bench(parts=[]){if(imageAsset(ctx,'prop.workbench',108,170,42,24))return;rect(110,178,38,6,'#846b46');rect(112,184,3,10,'#4d4731');rect(142,184,3,10,'#4d4731');rect(113,175,30,3,'#b89960');rect(119,173,11,2,'#737e6c');rect(127,170,2,7,'#a59569');for(let i=0;i<parts.length;i++){rect(99+i*9,200,8,3,'#b69964');rect(99+i*9,197,8,2,'#826c46')}}
function scene(context,map,t,state={}){ctx=context;const rand=rng(921+map*723);const terrain=terrains[map]||terrains[0];rect(0,0,480,270,terrain.base);
 // 稀疏的成簇草紋降低噪點，讓拾取物和可行走路線更容易辨識。
 for(let i=0;i<900;i++){let x=rand()*480,y=rand()*270;rect(x,y,rand()>0.65?4:2,1,terrain.flecks[i%4]);if(i%5===0)rect(x+2,y-2,1,2,terrain.flecks[(i+1)%4])}
 // 路線銜接真正的出入口；森林向東、修道院向南、草原向北。
 const start=[0,113,158,0][map],end=[270,203,270,233][map];
 for(let y=start;y<end;y++){
  let x=map===2?Math.min(240,169+Math.max(0,y-183)*.85):234+Math.sin(y/37+map)*10;
  let width=map===0?41:30;
  if(map===1||map===2)width*=Math.min(1,(y-start+5)/21);
  if(map===3)width*=Math.min(1,(end-y+5)/22);
  rect(x-width/2,y,width,1,P.path);rect(x-width/2+3,y,Math.max(1,width-6),1,P.pathLight);
  if(y%3===0)rect(x+(rand()-.5)*Math.max(1,width-7),y,2,1,P.pathShade);
 }
 if(map===1)for(let x=234;x<480;x++){
  let y=190-Math.min(20,Math.max(0,x-355)/6),width=30;
  rect(x,y-width/2,1,width,P.path);rect(x,y-width/2+3,1,width-6,P.pathLight);
  if(x%4===0)rect(x,y+(rand()-.5)*24,2,1,P.pathShade);
 }

if(map===0)drawCamp({rand,t,state,rect,flower,tent,bench,fire,rock,char});
if(map===1)drawForest({rand,t,state,rect,flower,tent,bench,fire,rock,char});
if(map===2)drawMonastery({rand,t,state,rect,flower,tent,bench,fire,rock,char});
if(map===3)drawGrassland({rand,t,state,rect,flower,tent,bench,fire,rock,char});
for(let i=0;i<42;i++){let x=rand()*480,y=rand()*250+24;if((x<83||x>390)&&!(map===2&&x>300)&&!((map===0&&x<130||map===1&&x>370)&&Math.abs(y-170)<38))tree(x,y,.85+rand()*.5,map===3?1:0)}for(let i=0;i<23;i++){let x=rand()*480;if(!(map===2&&x>300)&&(![0,3].includes(map)||Math.abs(x-237)>33))tree(x,59+rand()*24,1+rand()*.5)}for(let i=0;i<11;i++){let x=rand()*480;if(![0,2].includes(map)||Math.abs(x-240)>62)tree(x,280+rand()*14,1.1+rand()*.6)}for(let i=0;i<28;i++){let x=(i*63.4+t*(1+i%3)*.4)%480,y=(i*37.7+Math.sin(t+i)*3)%240;rect(x,y,1,1,i%3?'#b6cafa55':'#f0dfa488')}
if(state.day===7){ctx.fillStyle='#06131188';ctx.fillRect(0,0,480,95)}const bg=state.epilogue?'return-camp':state.campBuilt===false?'empty-camp':['camp','forest','monastery','grassland'][map];if(imageAsset(ctx,'background.'+bg,0,0,480,270)&&map===0)drawCamp({rand,t,state,rect,flower,tent,bench,fire,rock,char,ground:false});return ctx}
function icon(context,type,w=16){let old=ctx;ctx=context;ctx.clearRect(0,0,w,w);if(imageAsset(ctx,'item.'+type,0,0,w,w)){ctx=old;return}ctx.save();ctx.scale(w/16,w/16);if(type==='wood'){rect(3,3,3,11,'#967448');rect(7,2,3,11,'#c19a61');rect(11,5,2,8,'#b2874f');rect(7,6,3,1,'#805e3d')}else if(type==='metal'){rect(4,3,8,2,'#bdc5b6');rect(3,5,3,7,'#778d84');rect(6,10,7,3,'#a3b3a2');rect(11,6,2,5,'#617b74')}else if(type==='cloth'){rect(3,3,10,10,'#bbb39b');rect(4,4,7,1,'#e5d7b4');rect(3,10,3,3,'#818d7a');rect(10,5,2,7,'#9d987e')}else if(type==='seed'||type==='flower'){rect(7,6,2,8,'#76934e');rect(4,9,3,2,'#799956');rect(9,7,3,2,'#8fac5d');rect(5,3,7,4,'#dfc39b');rect(7,2,3,6,'#e4b6a1');rect(8,4,1,2,'#e7d38a')}else if(type==='ring'){rect(5,4,6,2,'#d7bb73');rect(3,6,2,5,'#c2a168');rect(11,6,2,5,'#ecd296');rect(5,11,6,2,'#b18e58');rect(7,2,3,3,'#88b4a1')}else if(type==='book'){rect(3,2,9,12,'#aa8760');rect(5,3,8,10,'#c0af87');rect(3,2,2,12,'#745e43');rect(7,5,4,1,'#7e785e');rect(7,7,4,1,'#7e785e')}else if(type==='scissors'){rect(4,2,2,7,'#aeb8a8');rect(10,2,2,7,'#b8c2b2');rect(6,7,4,2,'#808d7c');rect(3,10,4,4,'#b9a271');rect(9,10,4,4,'#b9a271');rect(4,11,2,2,'#344b36');rect(10,11,2,2,'#344b36')}else if(type==='coat'){rect(4,3,8,10,'#798d88');rect(2,4,3,6,'#849e95');rect(11,4,3,6,'#697e7b');rect(7,3,2,10,'#b2aa89');rect(6,2,4,2,'#c0b291')}else{rect(5,2,6,11,'#d2b780');rect(4,3,8,2,'#b99663');rect(6,6,4,4,'#657964')}ctx.restore();ctx=old}
function portrait(canvas,a){let old=ctx;ctx=canvas.getContext('2d');ctx.clearRect(0,0,28,39);if(imageAsset(ctx,'portrait.'+(a?'tana':'colin'),0,0,28,39)||characterAsset(ctx,a?'tana':'colin',14,38,'down',false,0)){ctx=old;return}ctx.save();ctx.translate(14,54);ctx.scale(2,2.3);char(0,0,a);ctx.restore();ctx=old}
return{scene,char,icon,portrait,fire,setContext:c=>ctx=c};})();
