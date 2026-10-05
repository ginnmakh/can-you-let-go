// 2026-09-23 道具清單。座標單位為背包格。
export function updateCatalog(defs) {
  const add=(key,base,data)=>defs[key]={...defs[base],...data};
  Object.assign(defs.branch,{desc:'破破爛爛的木材，感覺輕輕一碰就會碎掉。'});
  add('wood','plank',{name:'普通木材',shape:[[0,0],[1,0]],desc:'常見的普通木材，小心木刺。'});
  Object.assign(defs.timber,{desc:'做工精良，十分堅固。沉甸甸的。應該能撐過很長、很長的日子。'});
  add('fineLath','timber',{name:'優質長木條',shape:[[0,0],[0,1],[0,2],[0,3]],desc:'平直而堅固的細長木條。適合做成支架。'});
  add('woodPeg','timber',{name:'優質短木塊',shape:[[0,0]],desc:'仔細修整過的短木塊，能填上小小的空缺。'});
  Object.assign(defs.scrap,{desc:'鏽斑下面，還有一點光。外型歪七扭八，感覺輕輕一碰就會碎。'});
  add('metal','scrap',{name:'普通金屬板',grade:'普通',shape:[[0,0],[1,0]],desc:'中規中矩的材質和外型，坊間普遍大量使用的材料。'});
  add('fineMetal','metal',{name:'優質金屬板',grade:'優質',shape:[[0,0],[1,0],[2,0],[3,0]],desc:'形狀和材質都無可挑剔，完美的金屬板。'});
  add('bentNails','scrap',{name:'破爛的釘子',shape:[[0,0],[1,0],[1,1]],desc:'尾部有點扭曲，釘起來應該很醜。'});
  add('nails','metal',{name:'普通的釘子',shape:[[0,0],[0,1]],desc:'沒什麼特別的，還算堪用。'});
  add('fineNails','nails',{name:'優質的釘子',grade:'優質',shape:[[0,0]],desc:'做工精良，就算有點釘歪了，看起來也還算高級。'});
  Object.assign(defs.silver,{grade:'普通',desc:'應該也曾有人守著這束光，等待著誰吧。'});
  Object.assign(defs.cloth,{name:'亞麻布料',desc:'非常常見的亞麻布料，用途廣泛。'});
  add('rag','cloth',{name:'破爛的布料',grade:'破爛',shape:[[0,0],[1,0],[0,1]],desc:'有許多線頭、破洞，摸起來非常粗糙的布料。'});
  Object.assign(defs.silk,{name:'優質布料',shape:[[0,0],[1,0],[2,0],[3,0]],desc:'觸感如絲絨，滑順又舒適，可遇不可求。'});
  Object.assign(defs.seed,{seedKind:'ordinary',grade:'普通',desc:'有機率長出金盞花、雛菊和錦葵。好像可以種在整理好的土地上。'});
  add('toxicSeed','seed',{name:'有毒的種子',seedKind:'toxic',grade:'有毒',color:'#89759b',desc:'開出的花當然也有毒。有機率長出夾竹桃、烏頭。很高機率會長出顛茄。好像可以種在整理好的土地上。'});
  add('edibleSeed','seed',{name:'可食用的種子',seedKind:'edible',grade:'可食用',desc:'能種出可食用的花。好像可以種在整理好的土地上。'});
  const changes={
    flower:{name:'鮮花',desc:'隨處可見的漂亮小花。可送給塔納，或用兩朵編成花圈。'},
    wreath:{name:'花圈'},
    poisonflower:{name:'有毒花朵',shape:[[0,0]],desc:'有著鮮艷顏色的漂亮花朵，它們就是這樣吸引獵物的。'},
    ring:{name:'戒指',unique:true,desc:'一枚沒有刻名字的精緻銀戒。或許就是因為這樣，誰都能擁有它。'},
    nametag:{name:'名字布條',unique:true,shape:[[0,0],[1,0]],desc:'刻著「COLYN」字樣的布條，針法有些不成熟，布的邊緣都纖維外露了。'},
    coat:{unique:true,desc:'這是塔納送我的。已經非常老舊了，他總是叫我丟掉。'},
    gem:{name:'寶石',desc:'寶石怎麼會出現在這種地方？也許是貿易商隊落下的。'},
    score:{unique:true,desc:'塔納送的。聽起來是一首童謠，我哼過很多次旋律。塔納不願告訴我歌詞在講些什麼。'},
    scissors:{name:'剪刀',unique:true,shape:[[0,0]],desc:'一隻老舊但仍鋒利的剪刀。看來可以將布料裁切成更小的形狀。'},
    letter:{name:'沒送出的信',unique:true,noGift:true,desc:'要說的話都在這裡了。其實……也沒有很多。'},
    book:{},ribbon:{}
  };
  for(const [key,data] of Object.entries(changes))Object.assign(defs[key],data,{grade:null});
  add('poetry','book',{name:'古老的詩集',grade:null,unique:true,shape:[[0,0]],after:'看起來非常古老的詩集，裝幀隨時會脫落。中間缺了幾頁。',desc:'看起來非常古老的詩集，裝幀隨時會脫落。中間缺了幾頁。'});
  add('oldBook','book',{name:'舊書本',desc:'紀載著許多傳說故事的書本，邊角有點磨損、內頁有些摺痕，看得出來這本書的主人曾不斷翻閱此書。'});
}

export function bloom(seedKind,random) {
  if(seedKind==='toxic')return random<.15?{name:'夾竹桃',color:'#d993aa'}:random<.3?{name:'烏頭',color:'#8c85c5'}:{name:'顛茄',color:'#aa78ad'};
  if(seedKind==='edible')return {name:'金盞花',color:'#e7b454'};
  return [{name:'金盞花',color:'#e7b454'},{name:'雛菊',color:'#eee7c9'},{name:'錦葵',color:'#cf9dbc'}][Math.min(2,Math.floor(random*3))];
}

export function applyChoice(s,id,delta) {
  s.appliedChoices??=[];
  if(s.appliedChoices.includes(id))return false;
  s.appliedChoices.push(id);s.affinity=Math.max(0,Math.min(100,s.affinity+delta));return true;
}

// 保留原物品的回憶來源；同一件衣物的碎片不會重複扣好感。
export function cutPieces(s,it) {
  return it.shape.map(()=>({...it,id:++s.serial,key:it.grade==='優質'?'silk':it.grade==='普通'?'cloth':'rag',type:'cloth',grade:it.grade||'破爛',name:it.name+'的碎布',unique:false,initial:false,noGift:false,shape:[[0,0]],x:-1,y:-1,originId:it.originId??it.id,originKey:it.originKey??it.key,originName:it.originName??it.name}));
}
