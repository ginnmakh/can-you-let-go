// 地圖幾何共用於繪圖與碰撞；座標為480×270的點陣世界。
export const stones=[[118,112],[172,131],[305,104],[344,153],[122,205],[280,214],[365,223],[200,224]];
export function obstacles(s){if(s.map===0)return s.campBuilt===false||s.epilogue?[[151,127,39,48]]:[[296,126,64,32],[108,174,42,13],[311,176,15,11],[151,127,39,48]];if(s.map===1)return[[302,149,37,20],[112,115,19,8],[340,201,18,8]];if(s.map===2)return[[111,98,17,89],[190,98,17,89],[133,110,65,13],[310,68,150,179]];return stones.map(([x,y])=>[x-2,y-7,23,12])}
export function canWalk(s,x,y){let allowed=s.map===0?(x>90&&x<390&&y>86&&y<235)||(x>0&&x<130&&Math.abs(y-170)<17)||(Math.abs(x-240)<25&&y>0&&y<270):(x>87&&x<389&&y>83&&y<239)||(s.map===1&&x>=380&&x<480&&Math.abs(y-170)<18)||(s.map===2&&Math.abs(x-240)<25&&y>=230&&y<270)||(s.map===3&&Math.abs(x-240)<25&&y>0&&y<90);if(!allowed)return false;return !obstacles(s).some(([a,b,w,h])=>x+3>a&&x-3<a+w&&y+1>b&&y-2<b+h)}
export function portal(s){if(s.map===0){if(s.x<6)return{map:1,x:468,y:170};if(s.y<6)return{map:2,x:240,y:258};if(s.y>264)return{map:3,x:240,y:12}}if(s.map===1&&s.x>474)return{map:0,x:12,y:170};if(s.map===2&&s.y>264)return{map:0,x:240,y:12};if(s.map===3&&s.y<6)return{map:0,x:240,y:258};return null}
export const gameMinutes=s=>420+Math.floor(s.elapsed);
export const dusk=s=>Math.min(.66,Math.max(0,(gameMinutes(s)-900)/660));
export function resolveEnding(s){const possessions=[...s.bag,...s.gifted];const offered=possessions.filter(i=>s.offerings.includes(i.id));if(offered.length>0&&!possessions.some(i=>i.memory)&&!s.nametag)return'relics';if(!s.nametag)return'john-doe';if(s.ringGifted&&offered.some(i=>i.key==='ring')&&offered.length===6&&offered.every(i=>i.memory)&&s.cross&&s.wreath)return'love';if(s.gifted.some(i=>i.key==='ring'&&!s.offerings.includes(i.id))&&s.burnedMemories===0)return'return';return'farewell'}

export function travelBlock(s,p){
 if(!p)return null;
 if(s.map===0){
  if(s.day===7)return 'last-day';
  if(s.campLocked||gameMinutes(s)>=1200)return 'night';
 }
 if(s.bag.some(i=>i.x<0&&!s.offerings.includes(i.id)))return 'loose';
 if(s.map===0&&s.day===1&&!s.tutorial&&p.map!==1)return 'tutorial';
 return null;
}
