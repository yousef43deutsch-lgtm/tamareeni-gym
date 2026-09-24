self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const clientsList=await clients.matchAll({type:'window',includeUncontrolled:true});
    const existing=clientsList.find(client=>new URL(client.url).origin===self.location.origin);
    if(existing){await existing.focus();return}
    await clients.openWindow('./');
  })());
});
