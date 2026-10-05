import * as Core from '../core/rules.js';
import {dialogues as D} from '../data/dialogues.js';
import {imageAsset} from '../rendering/assets.js';
import {Art} from '../rendering/art.js';
import {game,$,panel,say,bubble,toast,hud,walkScene,animate,fade,closePanel} from './journey.js';

function sleep(){
  const s=game.state;if(s.day===7)return;
  if(!s.craftDone){say([['Ｂ',D.sleep.unfinished]]);return}
  game.mode='sleep';panel(D.sleep.question,'<div class="actions"><button id="sleepyes" class="primary">是。</button><button id="sleepno">再等等。</button></div>');
  $('#sleepno').onclick=()=>{s.campLocked=true;closePanel()};
  $('#sleepyes').onclick=()=>{
    $('#overlay').hidden=true;walkScene({x:326,y:154,ax:340,ay:159},2,()=>{
      fade(1,1.2);animate(1.2,()=>{},()=>{
        s.day++;s.map=0;s.elapsed=0;s.craftDone=false;s.campLocked=false;s.stayingToday=s.day===2&&s.affinity<60;s.distant=s.burnedMemories>0;Core.wear(s);hud();
        if(s.day===7){s.x=326;s.y=154;s.ax=340;s.ay=159;fade(0,2);walkScene({x:252,y:180,ax:232,ay:179},3,soulScene);return}
        s.x=326;s.y=154;s.ax=340;s.ay=159;fade(0,1.5);walkScene({x:270,y:188,ax:295,ay:190},2,()=>{game.mode='';game.actions.autoSave();say(s.day===2?[['Ｂ','今天也一起走吧。'],['Ａ',s.stayingToday?'我待在這就好。':'嗯。']]:[['Ｂ',['','','今天也一起走吧。','今天找些金屬吧。能把東西好好固定住的那種。','想找一點柔軟的布。躺著的時候，應該會舒服些。','這幾天做的東西，今天能拼起來了。','再種些花吧。這裡以後，應該會很好看。'][s.day]]],()=>{if(s.bag.some(i=>i.x<0)){game.actions.inventory();toast('背包又破了一點。請安置暫放物品。')}})})
      });
    });
  };
}
function soulScene(){
  const s=game.state;s.bodyDown=true;
  fade(1,3);animate(3,()=>{},()=>{
    game.mode='cinematic';panel('最後的約定','<canvas id="soulart" width="320" height="180" aria-label="塔納握著匕首柄，守在躺下的柯林身旁"></canvas><div id="holdarea" hidden><div id="holdring">F</div><p>長按 F，直到最後一點光離開。<br><small>放開按鍵會重新開始。</small></p></div>');
    $('.close').hidden=true;drawSoul(0);fade(0,3);
    animate(3,()=>{},()=>say(D.soul_extraction.lines.map(l=>[l.speaker==='tana'?'Ａ':'Ｂ',l.text]),()=>{game.mode='soul';game.hold=0;game.keys={};$('#holdarea').hidden=false}));
  });
}
function drawSoul(p){
  const c=$('#soulart');if(!c)return;let ctx=c.getContext('2d');ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#101b1e';ctx.fillRect(0,0,320,180);
  if(!imageAsset(ctx,'cutscene.soul',0,0,320,180)){
    ctx.fillStyle='#574d3b';ctx.fillRect(28,126,264,18);Art.setContext(ctx);
    ctx.save();ctx.translate(150,123);ctx.scale(3,3);Art.char(0,0,false,0,true);Art.char(12,-6,true);ctx.restore();
    ctx.fillStyle='#998e7b';ctx.fillRect(177,91,5,15);ctx.fillStyle='#d8eee6';ctx.fillRect(167,103-p*62,5+Math.sin(p*18)*2,8);ctx.fillStyle='#a9dacc66';ctx.fillRect(162,101-p*62,15,12);
  }
}
function updateSoul(dt){
  game.hold=game.keys.f?Math.min(5,game.hold+dt):0;
  $('#holdring').style.setProperty('--progress',`${game.hold/5*360}deg`);drawSoul(game.hold/5);
  if(game.hold>=5){const s=game.state;game.mode='cinematic';fade(1,1);animate(1,()=>{},()=>{s.soulTaken=true;s.bodyX=s.x;s.bodyY=s.y;s.x=s.ax;s.y=s.ay;$('#overlay').hidden=true;fade(0,1.5);animate(1.5,()=>{},()=>{game.mode='';game.keys={};bubble('這就是最後一個……');hud();game.actions.autoSave()})})}
}
export function initStory(){Object.assign(game.actions,{sleep,soulScene,updateSoul})}
