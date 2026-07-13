(function(){
  var DAY=86400000;
  var audioContext=null;
  var toastTimer=null;

  function toast(text){
    var el=document.getElementById('qualityToastV8');
    if(!el){el=document.createElement('div');el.id='qualityToastV8';el.className='quality-toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');document.body.appendChild(el)}
    el.textContent=text;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(function(){el.classList.remove('show')},2200);
  }
  function plain(v){return !!v&&typeof v==='object'&&!Array.isArray(v)}
  function hasScores(r){return !!(r&&((plain(r.before)&&Object.keys(r.before).length)||(plain(r.after)&&Object.keys(r.after).length)))}
  function scoreAvg(obj){var values=Object.values(obj||{}).filter(function(v){return typeof v==='number'&&isFinite(v)});return values.length?Math.round(values.reduce(function(a,b){return a+b},0)/values.length*10)/10:0}
  function completed(){return Object.values((typeof data!=='undefined'&&data.records)||{}).filter(function(r){return r&&r.done})}
  function keyFor(d){return dateKey(d)}
  function streakV8(){var n=0,d=new Date();if(!(data.records[keyFor(d)]&&data.records[keyFor(d)].done))d.setDate(d.getDate()-1);while(data.records[keyFor(d)]&&data.records[keyFor(d)].done){n++;d.setDate(d.getDate()-1)}return n}
  function sevenDayDone(){var n=0,d=new Date();for(var i=0;i<7;i++){var r=data.records[keyFor(d)];if(r&&r.done)n++;d.setDate(d.getDate()-1)}return n}

  function renderCalendarV8(){
    var root=document.getElementById('calendar');if(!root)return;
    var now=new Date(),start=new Date(now);start.setDate(now.getDate()-20);var html='';
    for(var i=0;i<21;i++){
      var d=new Date(start);d.setDate(start.getDate()+i);var key=keyFor(d),r=data.records[key],detail='';
      if(r&&r.done)detail='已打卡';
      if(r&&hasScores(r))detail='训练后 '+scoreAvg(r.after)+'/10';
      html+='<div class="cal '+(r&&r.done?'done ':'')+(key===keyFor(now)?'today':'')+'"><b>'+key.slice(5)+'</b><span>'+days[d.getDay()]+'</span>'+(detail?'<small>'+detail+'</small>':'')+'</div>';
    }
    root.innerHTML=html;
  }
  try{renderCalendar=renderCalendarV8;window.renderCalendar=renderCalendarV8}catch(e){}

  var reportBase=typeof renderReport==='function'?renderReport:null;
  if(reportBase){
    renderReport=function(){
      reportBase();
      var cards=document.getElementById('reportCards');
      if(cards)cards.innerHTML='<div class="metric"><b>'+sevenDayDone()+'/7</b><span>近7天打卡</span></div><div class="metric"><b>'+streakV8()+'天</b><span>当前连续打卡</span></div><div class="metric"><b>'+completed().length+'次</b><span>累计完成训练</span></div>';
      renderCalendarV8();
      var report=document.getElementById('report');
      if(report){var title=report.querySelector('h2');if(title)title.textContent='周报与训练进度';Array.from(report.querySelectorAll('h3')).forEach(function(h){if(h.textContent.trim()==='本周日历')h.textContent='近21天打卡'})}
      enhance();
    };
    window.renderReport=renderReport;
  }

  function ensureAudio(){
    try{var A=window.AudioContext||window.webkitAudioContext;if(!A)return null;if(!audioContext)audioContext=new A();if(audioContext.state==='suspended')audioContext.resume().catch(function(){});return audioContext}catch(e){return null}
  }
  function notifyTimer(){
    if(navigator.vibrate)navigator.vibrate([180,80,180]);
    try{var a=ensureAudio();if(!a)return;var o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.setValueAtTime(.0001,a.currentTime);g.gain.exponentialRampToValueAtTime(.08,a.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+.28);o.start();o.stop(a.currentTime+.3)}catch(e){}
  }
  function timerButton(type,on){var id=type==='train'?'trainTimerBtn':'restTimerBtn',el=document.getElementById(id);if(el){el.textContent=on?'暂停':'开始';el.setAttribute('aria-pressed',on?'true':'false')}}
  function drawTimer(type){var t=timers[type],el=document.getElementById(type+'Time');if(el)el.textContent=fmt(Math.max(0,t.seconds))}
  function stopTimer(type){var t=timers[type];clearInterval(t.id);t.id=null;t.on=false;timerButton(type,false)}
  function tickTimer(type){
    var t=timers[type];if(!t||!t.on)return;
    if(type==='train')t.seconds=Math.max(0,Math.floor((Date.now()-t._startedAt)/1000));
    else t.seconds=Math.max(0,Math.ceil((t._endAt-Date.now())/1000));
    drawTimer(type);
    if(type==='rest'&&t.seconds<=0){stopTimer(type);t._endAt=null;notifyTimer();toast('休息结束，可以开始下一组')}
  }
  timerStart=function(type){
    if(type!=='train'&&type!=='rest')return;
    var t=timers[type];if(!t)return;
    if(t.on){tickTimer(type);stopTimer(type);return}
    ensureAudio();
    if(type==='rest'&&t.seconds<=0){var select=document.getElementById('restSec');t.seconds=select?Number(select.value)||45:45}
    t.on=true;
    if(type==='train')t._startedAt=Date.now()-t.seconds*1000;else t._endAt=Date.now()+t.seconds*1000;
    timerButton(type,true);tickTimer(type);t.id=setInterval(function(){tickTimer(type)},250);
  };
  window.timerStart=timerStart;
  var resetBase=typeof timerReset==='function'?timerReset:null;
  timerReset=function(type){
    var t=timers[type];if(t){clearInterval(t.id);t.id=null;t.on=false;t._startedAt=null;t._endAt=null}
    if(resetBase)resetBase(type);
    timerButton(type,false);drawTimer(type);
  };
  window.timerReset=timerReset;

  breathToggle=function(){
    var t=timers.breath,btn=document.getElementById('breathBtn'),label=document.getElementById('breathText');if(!t)return;
    if(t.on){clearInterval(t.id);t.id=null;t.on=false;if(btn){btn.textContent='开始';btn.setAttribute('aria-pressed','false')}return}
    t.on=true;t._startedAt=Date.now();if(btn){btn.textContent='暂停';btn.setAttribute('aria-pressed','true')}
    function tick(){var phase=Math.floor((Date.now()-t._startedAt)/1000)%10;if(label)label.textContent=phase<4?'吸气':'呼气'}
    tick();t.id=setInterval(tick,250);
  };
  window.breathToggle=breathToggle;
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'){tickTimer('train');tickTimer('rest')}});

  var clearChecksBase=typeof clearChecks==='function'?clearChecks:null;
  if(clearChecksBase){clearChecks=function(){if(confirm('清空当前日期的动作勾选？'))clearChecksBase()};window.clearChecks=clearChecks}

  sharePage=async function(){
    var url=location.href.split('#')[0];
    try{
      if(navigator.share){await navigator.share({title:document.title,url:url});toast('已打开系统分享');return}
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);toast('网页地址已复制');return}
      var area=document.createElement('textarea');area.value=url;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();var ok=document.execCommand('copy');area.remove();if(!ok)throw new Error('copy failed');toast('网页地址已复制');
    }catch(e){if(e&&e.name==='AbortError')return;toast('复制失败，请使用浏览器分享按钮')}
  };
  window.sharePage=sharePage;

  importJSON=function(event){
    var input=event&&event.target,file=input&&input.files&&input.files[0];if(!file)return;
    var reader=new FileReader();
    reader.onload=function(){
      try{
        var imported=JSON.parse(reader.result);
        if(!plain(imported))throw new Error('invalid root');
        var records=plain(imported.records)?imported.records:{},checks=plain(imported.checks)?imported.checks:{};
        var safeRecords={};Object.keys(records).forEach(function(k){if(/^\d{4}-\d{2}-\d{2}$/.test(k)&&plain(records[k]))safeRecords[k]=records[k]});
        var next=Object.assign({},def,imported,{records:safeRecords,checks:checks});
        if(typeof next.start!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(next.start))next.start=def.start;
        next.dark=!!next.dark;data=next;saveData();if(document.getElementById('startDate'))document.getElementById('startDate').value=data.start;renderAll();toast('备份导入成功');
      }catch(e){toast('导入失败：请选择本站导出的 JSON 备份')}
      if(input)input.value='';
    };
    reader.onerror=function(){toast('读取文件失败');if(input)input.value=''};
    reader.readAsText(file);
  };
  window.importJSON=importJSON;

  function enhance(){
    var nav=document.getElementById('nav');if(nav){nav.setAttribute('aria-label','主要导航');nav.querySelectorAll('[data-tab]').forEach(function(btn){btn.setAttribute('aria-current',btn.classList.contains('active')?'page':'false')})}
    var ids=(workout()&&workout()[2])||[],checks=getChecks()||{},done=ids.filter(function(id){return !!checks[id]}).length,percent=ids.length?Math.round(done/ids.length*100):0;
    var progress=document.querySelector('#today .progress');if(progress){progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','今日动作完成度');progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax','100');progress.setAttribute('aria-valuenow',String(percent))}
    var orbit=document.getElementById('progressOrbitV4');if(orbit){orbit.setAttribute('role','progressbar');orbit.setAttribute('aria-label','今日训练完成度');orbit.setAttribute('aria-valuemin','0');orbit.setAttribute('aria-valuemax','100');orbit.setAttribute('aria-valuenow',String(percent))}
    ['trainTime','restTime','breathText'].forEach(function(id){var el=document.getElementById(id);if(el){el.setAttribute('role',id==='breathText'?'status':'timer');el.setAttribute('aria-live',id==='restTime'?'polite':'off')}});
    document.querySelectorAll('[data-wake-status]').forEach(function(el){el.setAttribute('role','status');el.setAttribute('aria-live','polite')});
    var date=document.getElementById('checkinDateInput');if(date)date.setAttribute('aria-label','选择实际锻炼日期');
  }
  try{var workoutBase=renderWorkout;renderWorkout=function(){workoutBase();enhance()};window.renderWorkout=renderWorkout}catch(e){}
  try{var navBase=renderNav;renderNav=function(){navBase();enhance()};window.renderNav=renderNav}catch(e){}
  var mutationPending=false,observer=new MutationObserver(function(){if(mutationPending)return;mutationPending=true;requestAnimationFrame(function(){mutationPending=false;enhance()})});observer.observe(document.body,{childList:true,subtree:true});
  var resizeTimer=null;window.addEventListener('resize',function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(function(){if(typeof activeTab!=='undefined'&&activeTab==='report'&&typeof renderReport==='function')renderReport()},220)},{passive:true});
  setTimeout(function(){enhance();if(typeof activeTab!=='undefined'&&activeTab==='report'&&typeof renderReport==='function')renderReport()},500);
})();
