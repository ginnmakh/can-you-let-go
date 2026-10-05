import {palette as P} from '../rendering/palette.js';
// 修道院：湖水、牆磚與舊彩窗採用冷藍層次，碰撞位置沿用原配置。
export function draw({rand,t,rect,flower,rock}){
 for(let y=52;y<247;y++){
  let x=315+Math.sin(y/21)*5;
  rect(x-3,y,480-x+3,1,P.shore);rect(x,y,480-x,1,P.water);
  if(y%9===0)for(let j=0;j<4;j++)rect(x+8+rand()*135+Math.sin(t*.5+y)*2,y,6+rand()*15,1,j%2?P.ripple:'#607db2');
 }
 const brick=(x,y,w=13)=>{rect(x,y,w,10,P.stoneShade);rect(x+1,y,w-2,7,P.stone);rect(x+1,y,w-4,2,P.stoneLight);rect(x+2,y+7,3,2,'#73978d')};
 for(let j=0;j<10;j++)brick(112+j*11,113-(j%3)*7,10);
 for(let y=97;y<185;y+=12){brick(113,y);brick(191,y)}
 rect(148,105,20,28,'#26334f');rect(147,102,22,4,'#c5c2b7');rect(153,108,4,9,'#c295a8');rect(160,111,4,8,'#8baae1');rect(151,121,9,4,'#ecd9a0');
 for(let j=0;j<6;j++){rect(116+j%2*3,136+j*5,2,6,'#42746d');rect(117+j%2*3,138+j*5,4,2,'#78a68b')}
 for(let i=0;i<12;i++)rock(125+rand()*80,177+rand()*30,9);
 for(let i=0;i<6;i++)flower(204+i*3,180+(i%3)*5,i%2?'#d1caeb':'#e8dcb2');
}
