/* Secondary on-device copy of the gym log. Data never leaves this browser. */
const GymStorage=(()=>{
  let opening;
  function database(){
    if(!('indexedDB' in window))return Promise.resolve(null);
    if(!opening)opening=new Promise(resolve=>{
      let request;
      try{request=indexedDB.open('tamareeni-local-copy',1)}catch{resolve(null);return}
      request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains('snapshots'))request.result.createObjectStore('snapshots')};
      request.onsuccess=()=>resolve(request.result);
      request.onerror=()=>resolve(null);
      request.onblocked=()=>resolve(null);
    });
    return opening;
  }
  async function read(){
    const db=await database();if(!db)return null;
    return new Promise(resolve=>{try{const req=db.transaction('snapshots','readonly').objectStore('snapshots').get('latest');req.onsuccess=()=>resolve(req.result||null);req.onerror=()=>resolve(null)}catch{resolve(null)}});
  }
  async function write(snapshot){
    const db=await database();if(!db)return false;
    return new Promise(resolve=>{try{const tx=db.transaction('snapshots','readwrite');tx.objectStore('snapshots').put(snapshot,'latest');tx.oncomplete=()=>resolve(true);tx.onerror=()=>resolve(false);tx.onabort=()=>resolve(false)}catch{resolve(false)}});
  }
  return {read,write};
})();
