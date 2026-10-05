export function craftPlan(day){
 const target=day<=2?Array.from({length:18},(_,i)=>[i%6,Math.floor(i/6)+1]):day===3?[[1,1],[2,1],[3,1],[4,1],[1,2],[4,2],[1,3],[2,3],[3,3],[4,3]]:day===4?Array.from({length:16},(_,i)=>[i%4+1,Math.floor(i/4)]):day===6?[[2,0],[2,1],[2,2],[2,3],[1,1],[3,1]]:[];
 return {target,material:day<=2||day===6?'wood':day===3?'metal':day===4?'cloth':null};
}
export function scoreCraft(c){
 const cells=c.placed.flatMap(p=>p.shape.map(([x,y])=>[x+p.x,y+p.y]));
 const covered=cells.filter(([x,y])=>c.target.some(([a,b])=>a===x&&b===y)).length,outside=cells.length-covered;
 const weight=c.placed.reduce((n,p)=>n+p.shape.length*({'優質':1,'普通':.85,'破爛':.6}[p.it.grade]??.85),0)/(cells.length||1);
 return {covered,outside,score:Math.max(0,Math.min(1,(covered-outside*.35)/c.target.length*weight))};
}
