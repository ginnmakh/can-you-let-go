// 跨存檔保留的紀錄（已達成的結局、成就），與存讀檔分開，存在目前的瀏覽器。
export const ENDINGS_KEY='seventh-endings',ACHIEVEMENTS_KEY='seventh-achievements';
export function readRecord(key){try{const v=JSON.parse(localStorage.getItem(key));return Array.isArray(v)?v:[]}catch{return[]}}
export function addRecord(key,id){const list=readRecord(key);if(list.includes(id))return false;try{localStorage.setItem(key,JSON.stringify([...list,id]))}catch{}return true}
