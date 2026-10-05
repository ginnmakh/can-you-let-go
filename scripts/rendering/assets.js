// 正式素材可透過 manifest.json 或指定角色資料夾置換。
export const Assets={manifest:{},images:new Map(),animations:new Map(),audio:new Map()};
const assetPath=s=>s.startsWith('data:')?s:'assets/'+s;
function loadImage(src){return new Promise(resolve=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>resolve(null);img.src=assetPath(src)})}
export async function loadAssets(){
 try{
  const embedded=document.querySelector('#asset-manifest');
  Assets.manifest=embedded?JSON.parse(embedded.textContent):await(await fetch('assets/manifest.json')).json();
  Assets.images.clear();Assets.animations.clear();
  await Promise.all(Object.entries(Assets.manifest.images||{}).map(async([key,entry])=>{
   if(entry?.src){const img=await loadImage(entry.src);if(img)Assets.images.set(key,img)}
   if(entry?.walkFrames){
    const sequences={};
    await Promise.all(Object.entries(entry.walkFrames).map(async([direction,files])=>{
     if(!Array.isArray(files)||files.length!==(entry.frames||6))return;
     const frames=await Promise.all(files.map(loadImage));
     if(frames.every(img=>img&&(entry.nativeSize||(img.width===frames[0].width&&img.height===frames[0].height))))sequences[direction]=frames;
    }));
    if(Object.keys(sequences).length)Assets.animations.set(key,sequences);
   }
  }));
  for(const [key,entry]of Object.entries(Assets.manifest.audio||{}))if(entry.src){const a=new Audio(assetPath(entry.src));a.loop=!!entry.loop;Assets.audio.set(key,a)}
 }catch(error){console.warn('素材索引載入失敗，使用暫用點陣圖。',error.message)}
}
export function imageAsset(ctx,key,x,y,w,h){const img=Assets.images.get(key);if(!img)return false;ctx.imageSmoothingEnabled=false;ctx.drawImage(img,x,y,w,h);return true}
export function characterDisplayHeight(name,direction){
 const key='character.'+name,m=Assets.manifest.images?.[key]||{},sequences=Assets.animations.get(key);
 const frames=sequences?.[direction]||sequences?.default||sequences?.down||Object.values(sequences||{})[0];
 return m.nativeSize&&frames?.length?frames[0].height:m.displayHeight||24;
}
export function characterAsset(ctx,name,x,y,direction,walking,t){
 const key='character.'+name,m=Assets.manifest.images?.[key]||{},sequences=Assets.animations.get(key);
 // 只有一組時沿用該朝向；不自動鏡射作者的角色設計。
 const frames=sequences?.[direction]||sequences?.default||sequences?.down||Object.values(sequences||{})[0];
 if(frames?.length){
  const img=frames[walking?Math.floor(t*(m.fps||8))%frames.length:0],height=m.nativeSize?img.height:m.displayHeight||24,width=m.nativeSize?img.width:m.displayWidth||height*img.width/img.height;
  ctx.imageSmoothingEnabled=false;ctx.drawImage(img,Math.round(x-width/2),Math.round(y-height),width,height);return true;
 }
 const img=Assets.images.get(key);if(!img)return false;
 const fw=m.frameWidth||32,fh=m.frameHeight||48,frame=walking?Math.floor(t*(m.fps||8))%(m.frames||4):0,row=({down:0,left:1,right:2,up:3})[direction]||0;
 ctx.imageSmoothingEnabled=false;ctx.drawImage(img,frame*fw,row*fh,fw,fh,x-(m.displayWidth||16)/2,y-(m.displayHeight||24),m.displayWidth||16,m.displayHeight||24);return true;
}
export function playAsset(key,volume=.3){const a=Assets.audio.get(key);if(!a)return false;a.volume=volume;void a.play().catch(()=>{});return true}
export function syncAudio(enabled,volume){for(const a of Assets.audio.values()){a.volume=enabled?volume:0;if(!enabled)a.pause()}}
export function stopAsset(key){Assets.audio.get(key)?.pause()}

