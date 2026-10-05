import {palette as P} from '../rendering/palette.js';
// 森林小徑：木柵、樹樁位置對應既有碰撞範圍。
export function draw({rand,rect,flower,rock}){
 rect(370,153,110,34,P.path);rect(372,158,108,23,P.pathLight);
 for(const [x,y] of [[112,115],[340,201]]){
  rect(x,y,19,8,P.trunk);rect(x+1,y-2,17,5,'#ab9275');rect(x+5,y-1,9,2,'#6c5b57');rect(x+2,y+5,3,3,P.bark);
 }
 rect(302,157,35,8,'#645562');rect(306,145,3,18,'#ac8c67');rect(329,148,3,15,'#b39976');rect(306,148,24,2,'#d3b88d');rock(303,166,8);rock(329,166,8);
 for(let j=0;j<14;j++)flower(120+rand()*40,140+rand()*45,j%3?'#b7bee5':'#eadab1');
}
