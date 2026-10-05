// 只以柯林目前的位置為目標；這些路徑點是避障用，不記錄玩家的足跡。
const GRID=4;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function clearLine(s,a,b,walkable){
 const steps=Math.max(1,Math.ceil(distance(a,b)/2));
 for(let i=1;i<=steps;i++)if(!walkable(s,a.x+(b.x-a.x)*i/steps,a.y+(b.y-a.y)*i/steps))return false;
 return true;
}
function routeToRange(s,start,target,gap,walkable){
 const queue=[],seen=new Set(),add=(x,y,parent)=>{
  const id=x+','+y;if(seen.has(id)||x<0||x>480||y<0||y>270)return;
  if(!walkable(s,x,y)||!clearLine(s,parent||start,{x,y},walkable))return;
  seen.add(id);
  queue.push({x,y,parent});
 };
 const gx=Math.round(start.x/GRID)*GRID,gy=Math.round(start.y/GRID)*GRID;
 for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)add(gx+dx*GRID,gy+dy*GRID,null);
 for(let i=0;i<queue.length;i++){
  const p=queue[i];
  if(distance(p,target)<=gap){const path=[];for(let n=p;n;n=n.parent)path.unshift({x:n.x,y:n.y});return path}
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(dx||dy)add(p.x+dx*GRID,p.y+dy*GRID,p);
 }
 return [];
}
export function followStep(s,budget,gap,walkable,nav){
 let here={x:s.ax,y:s.ay};const target={x:s.x,y:s.y};
 if(distance(here,target)<=gap+1e-6){nav.path=[];return here}
 const directEnd=()=>{const d=distance(here,target),step=d-gap;return{x:here.x+(target.x-here.x)/d*step,y:here.y+(target.y-here.y)/d*step}};
 if(clearLine(s,here,directEnd(),walkable))nav.path=[];
 else if(nav.owner!==s||nav.map!==s.map||!nav.target||distance(nav.target,target)>8||!nav.path?.length){
  nav.path=routeToRange(s,here,target,gap,walkable);nav.owner=s;nav.map=s.map;nav.target=target;
  if(!nav.path.length)return here;
 }
 while(budget>1e-6){
  const room=distance(here,target)-gap;if(room<=1e-6)break;
  // 將繞障路徑中可直達的中間點略過，避免多餘的轉折。
  if(nav.path?.length)for(let i=nav.path.length-1;i>0;i--)if(clearLine(s,here,nav.path[i],walkable)){nav.path.splice(0,i);break}
  const aim=nav.path?.[0]||target,d=distance(here,aim);
  if(d<=1e-6){if(nav.path?.length){nav.path.shift();continue}break}
  const step=Math.min(d,budget,room),next={x:here.x+(aim.x-here.x)/d*step,y:here.y+(aim.y-here.y)/d*step};
  if(!clearLine(s,here,next,walkable)){nav.path=[];break}
  here=next;budget-=step;if(nav.path?.length&&distance(here,aim)<=1e-6)nav.path.shift();
 }
 return here;
}
