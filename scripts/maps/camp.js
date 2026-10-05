import {palette as P} from '../rendering/palette.js';
export function draw({rand,t,state:s,rect,flower,tent,bench,fire,rock,ground=true}){
 if(ground){for(let y=100;y<227;y++){let w=Math.sqrt(Math.max(0,1-((y-164)/67)**2))*124;rect(241-w,y,w*2,1,'#a2977f')}
 for(let i=0;i<170;i++){let x=rand()*238+122,y=rand()*117+105;if(((x-241)/124)**2+((y-164)/67)**2<.9)rect(x,y,2,1,i%3?'#b3a78b':'#8c897d')}
 rect(0,155,136,30,P.path);rect(215,0,50,105,P.path);rect(215,223,50,47,P.path);
 }
 if(s.campBuilt!==false&&!s.epilogue){tent();bench(s.parts||[]);fire(t);rock(283,173,9)}
 if(s.campBuilt!==false||s.epilogue){
  rect(151,127,40,49,'#51485b');
  for(let i=0;i<12;i++){let x=155+i%3*11,y=132+Math.floor(i/3)*10;rect(x,y,9,8,[4,7].includes(i)?'#393d52':'#786453');
   const f=s.flowers?.[i];if(f){if(s.day>f.plantedDay){flower(x+3,y+4,f.color||'#e3b9b0');flower(x+6,y+6,f.color||'#e4d492')}else{rect(x+4,y+4,1,4,'#82a15b');rect(x+2,y+4,3,1,'#779654')}}
  }
 }
 if(s.burial>=1){
  let q=s.parts.find(p=>p.day===5)?.quality,wood=q==='優質'?'#bf9d63':q==='普通'?'#967a4e':'#6d6048';
  rect(166,142,11,20,wood);rect(168,144,7,16,'#55442e');
  if(s.burial>=2)rect(170,145,3,13,'#d6c2a2');
  if(s.burial>=3)rect(168,144,7,16,wood);
  if(s.burial>=4){rect(165,141,13,23,'#64543b');rect(167,143,9,18,'#796346')}
  if(s.burial>=5&&s.cross){rect(171,128,2,19,'#bea16b');rect(165,133,14,2,'#bea16b')}
  if(s.nametag){rect(170,132,6,3,'#d3c59e');rect(171,133,3,1,'#645a47')}
  if(s.wreath){flower(167,139,'#e9d7bd');flower(176,138,'#e9d7bd');flower(171,142,'#e9d7bd')}
 }
}
