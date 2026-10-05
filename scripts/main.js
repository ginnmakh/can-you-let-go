import {initRelationships} from './systems/relationships.js';
import {initStory} from './systems/story.js';
import {loadAssets} from './rendering/assets.js';
// 程式入口：只負責把各功能連接起來。
import {initJourney,game,maps} from './systems/journey.js';
import {initInventory} from './systems/inventory.js';
import {initCrafting} from './systems/crafting.js';
import {initFarewell} from './systems/farewell.js';
import {initMenus} from './ui/menus.js';
import {capacity} from './core/rules.js';
initInventory();initCrafting();initFarewell();initMenus();initRelationships();initStory();await loadAssets();initJourney();
if(document.modelContext?.registerTool){const life=new AbortController();const add=t=>{try{Promise.resolve(document.modelContext.registerTool(t,{signal:life.signal})).catch(()=>{})}catch{}};add({name:'read_journey',description:'Read the current game day, location, inventory and available interactions.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({day:game.state.day,location:maps[game.state.map],started:game.state.started,mode:game.mode,position:{x:Math.round(game.state.x),y:Math.round(game.state.y)},dialogueLines:game.dialogues.length,craftDone:game.state.craftDone,capacity:capacity(game.state),items:game.state.bag.map(i=>({name:i.name,x:i.x,y:i.y})),nearby:game.near?.label||null})});add({name:'open_backpack',description:'Open the same backpack as the E key. Does not collect, consume or move items.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false},execute:()=>{if(!game.state.started||game.mode||game.dialogues.length)throw Error('Start the journey and finish the current interaction first.');game.actions.inventory();return{opened:true,capacity:capacity(game.state)}}});addEventListener('pagehide',()=>life.abort(),{once:true})}
