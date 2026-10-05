import {palette as P} from '../rendering/palette.js';
import {stones} from '../core/world-rules.js';
export function draw({rand,rect,flower,rock}){
 rect(215,0,50,112,P.path);
 for(const [x,y]of stones){rect(x+2,y-24,13,26,P.stoneShade);rect(x+4,y-27,9,3,P.stoneLight);rect(x+4,y-22,2,20,P.stone);rect(x+8,y-15,5,1,P.shadow);rock(x,y,18)}
 for(let i=0;i<100;i++)flower(90+rand()*290,90+rand()*140,i%3?'#eadcaf':'#c2c9eb');
}
