(function(){
  var WAKE_KEY='rehabWakeLockEnabled';
  var wakeLock=null;
  function todayInfo(){
    var w=weekNow(),day=new Date().getDay(),code=dkey[day],key=schedule(w)[code]||'rest';
    return {date:dateKey(),week:w,dayIndex:day,day:days[day],workout:W[key]?W[key][0]:W.rest[0]};
  }
  function doneRecords(){return Object.values(data.records||{}).filter(function(r){return r&&r.done}).sort(function(a,b){return b.date.localeCompare(a.date)})}
  function checkinStreak(){
    var n=0,d=new Date();
    while(true){var r=data.records[dateKey(d)];if(!r||!r.done)break;n++;d.setDate(d.getDate()-1)}
    return n;
  }
  function monthCount(){var p=dateKey().slice(0,7);return doneRecords().filter(function(r){return r.date.slice(0,7)===p}).length}
  function completedExercises(){var c=0,total=0;try{var ids=workout()[2]||[],checks=getChecks();total=ids.length;c=ids.filter(function(id){return !!checks[id]}).length}catch(e){}return {done:c,total:total}}
  function safeText(v){return String(v||'').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
  function renderRecent(){
    var root=document.getElementById('checkinRecent');if(!root)return;var arr=doneRecords().slice(0,10);
    if(!arr.length){root.innerHTML='<div class="checkin-empty">还没有打卡记录。完成今天的训练后，点击“一键打卡”。</div>';return}
    root.innerHTML=arr.map(function(r){var md=r.date.slice(5).split('-');return '<div class="checkin-item"><div class="checkin-day"><b>'+md[1]+'</b>'+md[0]+'月</div><div class="checkin-item-title">'+safeText(r.workout||'康复训练')+'<div class="sub">'+safeText(r.day||'')+' · 第'+safeText(r.week||'-')+'周</div></div><span class="checkin-badge">已打卡</span></div>'}).join('')
  }
  function updateSummary(){
    var total=doneRecords().length;
    var a=document.getElementById('checkinStreak');if(a)a.textContent=checkinStreak()+'天';
    var b=document.getElementById('checkinTotal');if(b)b.textContent=total+'次';
    var c=document.getElementById('checkinMonth');if(c)c.textContent=monthCount()+'次';
    var m=document.getElementById('mDone');if(m)m.textContent=total+'次';
    var s=document.getElementById('mStreak');if(s)s.textContent=checkinStreak()+'天';
  }
  function renderCheckinState(){
    var info=todayInfo(),r=data.records[info.date],done=!!(r&&r.done),progress=completedExercises();
    var dateEl=document.getElementById('checkinDate');if(dateEl)dateEl.textContent=info.date+' · '+info.day;
    var workoutEl=document.getElementById('checkinWorkout');if(workoutEl)workoutEl.textContent=info.workout;
    var p=document.getElementById('checkinProgress');if(p)p.textContent=progress.total?'今日动作已勾选 '+progress.done+'/'+progress.total+' 项。未全部勾选也可以打卡。':'完成今天安排后即可打卡。';
    var status=document.getElementById('checkinStatus');if(status){status.className='checkin-status'+(done?' done':'');status.innerHTML='<span class="checkin-dot"></span>'+(done?'今天已经打卡':'今天还没有打卡')}
    var btn=document.getElementById('checkinBtn');if(btn){btn.textContent=done?'今日已打卡':'完成训练，一键打卡';btn.disabled=done}
    var undo=document.getElementById('undoCheckinBtn');if(undo)undo.hidden=!done;
    updateSummary();renderRecent();
  }
  function doCheckin(){
    var info=todayInfo(),old=data.records[info.date]||{};
    data.records[info.date]=Object.assign({},old,{date:info.date,week:info.week,day:info.day,workout:info.workout,done:true,checkin:true,checkinAt:new Date().toLocaleString(),updated:new Date().toLocaleString()});
    saveData();renderCheckinState();if(typeof renderCalendar==='function')renderCalendar();if(navigator.vibrate)navigator.vibrate(90);
  }
  function undoCheckin(){
    var info=todayInfo(),r=data.records[info.date];if(!r)return;
    if(!confirm('取消今天的打卡？'))return;
    var hasDetail=(r.note&&r.note.trim())||(r.flags&&r.flags.length)||(r.before&&Object.keys(r.before).length)||(r.after&&Object.keys(r.after).length);
    if(hasDetail){r.done=false;r.checkin=false;r.updated=new Date().toLocaleString()}else delete data.records[info.date];
    saveData();renderCheckinState();if(typeof renderCalendar==='function')renderCalendar();
  }
  function wakeSupported(){return 'wakeLock' in navigator}
  function setWakeStatus(text,active){document.querySelectorAll('[data-wake-status]').forEach(function(el){el.textContent=text;el.classList.toggle('active',!!active)});document.querySelectorAll('[data-wake-toggle]').forEach(function(btn){btn.textContent=active?'关闭屏幕常亮':'开启屏幕常亮'})}
  async function requestWake(){
    if(!wakeSupported()){setWakeStatus('当前浏览器不支持屏幕常亮',false);return false}
    try{
      if(wakeLock)return true;
      wakeLock=await navigator.wakeLock.request('screen');
      setWakeStatus('屏幕常亮已开启',true);
      wakeLock.addEventListener('release',function(){wakeLock=null;if(localStorage.getItem(WAKE_KEY)==='1')setWakeStatus('常亮已暂停，点按可重新开启',false);else setWakeStatus('屏幕常亮已关闭',false)});
      return true;
    }catch(e){wakeLock=null;setWakeStatus('无法开启，请保持页面前台并再次点按',false);return false}
  }
  async function releaseWake(){try{if(wakeLock)await wakeLock.release()}catch(e){}wakeLock=null;setWakeStatus('屏幕常亮已关闭',false)}
  async function toggleWake(){
    if(localStorage.getItem(WAKE_KEY)==='1'){localStorage.removeItem(WAKE_KEY);await releaseWake()}else{localStorage.setItem(WAKE_KEY,'1');var ok=await requestWake();if(!ok)localStorage.removeItem(WAKE_KEY)}
  }
  function wakePanel(){return '<div class="wake-panel"><div><b>训练时保持屏幕常亮</b><p>开启后，训练和计时期间屏幕不会自动熄灭。离开页面或系统限制时可能暂停。</p></div><div class="wake-control"><span class="wake-status" data-wake-status>屏幕常亮已关闭</span><button class="btn primary" type="button" data-wake-toggle>开启屏幕常亮</button></div></div>'}
  function buildCheckin(){
    var root=document.getElementById('record');if(!root)return;
    root.innerHTML='<h2>每日打卡</h2><p class="sub">不需要填写评分和备注。完成当天训练后，一键打卡即可。</p><div class="checkin-layout"><section class="checkin-card"><div class="checkin-label">今天</div><div class="checkin-date" id="checkinDate"></div><div class="checkin-workout" id="checkinWorkout"></div><p class="checkin-progress" id="checkinProgress"></p><div class="checkin-status" id="checkinStatus"><span class="checkin-dot"></span>今天还没有打卡</div><div class="checkin-actions"><button class="btn green checkin-main-btn" id="checkinBtn">完成训练，一键打卡</button><button class="btn" id="undoCheckinBtn" hidden>取消今天打卡</button></div><div class="checkin-safety">出现刺痛、麻木、放射痛、关节卡住或明显无力时，不要为了打卡继续硬练，应暂停训练并视情况就医。</div>'+wakePanel()+'</section><section class="checkin-card"><h3>打卡概览</h3><div class="checkin-summary"><div class="checkin-stat"><b id="checkinStreak">0天</b><span>连续打卡</span></div><div class="checkin-stat"><b id="checkinMonth">0次</b><span>本月打卡</span></div><div class="checkin-stat"><b id="checkinTotal">0次</b><span>累计打卡</span></div></div><h3>最近打卡</h3><div class="checkin-history" id="checkinRecent"></div><div class="checkin-backup"><button class="btn" id="checkinExport">导出备份</button><label class="btn">导入备份<input id="checkinImport" type="file" accept="application/json" hidden></label><button class="btn red" id="checkinClear">清空全部数据</button></div></section></div>';
    document.getElementById('checkinBtn').onclick=doCheckin;
    document.getElementById('undoCheckinBtn').onclick=undoCheckin;
    document.getElementById('checkinExport').onclick=exportJSON;
    document.getElementById('checkinImport').onchange=importJSON;
    document.getElementById('checkinClear').onclick=clearData;
    root.querySelectorAll('[data-wake-toggle]').forEach(function(btn){btn.onclick=toggleWake});
    renderCheckinState();
  }
  function addTimerWakePanel(){
    var panel=document.getElementById('timer');if(!panel||panel.querySelector('.wake-panel'))return;
    var wrap=document.createElement('div');wrap.innerHTML=wakePanel();panel.insertBefore(wrap.firstChild,panel.querySelector('.timer'));
    panel.querySelectorAll('[data-wake-toggle]').forEach(function(btn){btn.onclick=toggleWake});
  }
  function renameUI(){
    if(typeof tabs!=='undefined'&&tabs[2])tabs[2][1]='每日打卡';
    var open=document.getElementById('openRecordBtn');if(open)open.textContent='完成后打卡';
    if(typeof renderNav==='function')renderNav();
  }
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&localStorage.getItem(WAKE_KEY)==='1')requestWake()});
  window.addEventListener('pagehide',function(){if(wakeLock)wakeLock.release().catch(function(){})});
  setTimeout(function(){renameUI();buildCheckin();addTimerWakePanel();if(localStorage.getItem(WAKE_KEY)==='1')requestWake()},900);
})();
