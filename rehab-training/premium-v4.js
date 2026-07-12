(function(){
  function stats(){
    var w=workout();
    var ids=(w&&w[2])||[];
    var checks=getChecks()||{};
    var done=ids.filter(function(id){return !!checks[id]}).length;
    var percent=ids.length?Math.round(done/ids.length*100):0;
    var minutes=Math.max(12,Math.round(ids.length*3.8));
    return {workout:w||W.rest,count:ids.length,done:done,percent:percent,minutes:minutes};
  }

  function buildHero(){
    var hero=document.querySelector('.hero');
    if(!hero||hero.querySelector('.hero-stage-v4'))return;
    hero.innerHTML='<section class="hero-stage-v4">'
      +'<div class="hero-copy-v4">'
        +'<div class="hero-kicker-v4">Today movement</div>'
        +'<h1 class="hero-title-v4">今天，完成比完美更重要。</h1>'
        +'<p class="hero-sub-v4" id="heroSubtitleV4">用稳定、自然的动作，把身体一点点练回来。只专注今天这一组。</p>'
        +'<div class="hero-actions-v4">'
          +'<button class="btn primary" type="button" data-v4-go="today">开始今天的训练</button>'
          +'<button class="btn secondary-v4" type="button" data-v4-go="timer">打开计时器</button>'
          +'<button class="btn secondary-v4" type="button" data-v4-go="record">完成后打卡</button>'
        +'</div>'
        +'<div class="hero-safety-v4">不追求疼痛和疲劳。出现刺痛、麻木、放射痛、卡住或明显无力时立即停止。</div>'
        +'<p id="coach" hidden>身体不适时不要为了连续打卡硬练。</p>'
      +'</div>'
      +'<div class="hero-visual-v4">'
        +'<div class="progress-orbit-v4" id="progressOrbitV4"><div><strong id="heroProgressV4">0%</strong><span>今日完成度</span></div></div>'
        +'<div class="hero-plan-v4">'
          +'<div><b id="heroWorkoutV4">今日训练</b><span>训练内容</span></div>'
          +'<div><b id="heroCountV4">0 个动作</b><span>动作数量</span></div>'
          +'<div><b id="heroMinutesV4">约 20 分钟</b><span>预计时间</span></div>'
        +'</div>'
      +'</div>'
      +'<div class="hero-metrics-v4 metrics">'
        +'<div class="metric"><b id="mToday">-</b><span>今天</span></div>'
        +'<div class="metric"><b id="mWeek">-</b><span>当前周</span></div>'
        +'<div class="metric"><b id="mPhase">-</b><span>当前阶段</span></div>'
        +'<div class="metric"><b id="mStreak">0天</b><span>连续打卡</span></div>'
        +'<div class="metric"><b id="mDone">0次</b><span>累计打卡</span></div>'
      +'</div>'
    +'</section>';
  }

  function wrapToday(){
    var today=document.getElementById('today');
    if(!today||today.querySelector('.today-shell-v4'))return;
    var shell=document.createElement('div');
    shell.className='today-shell-v4';
    var over=document.createElement('div');
    over.className='today-overline-v4';
    over.innerHTML='<span>Your session</span><span id="todayCompletionTextV4">0% 完成</span>';
    shell.appendChild(over);
    while(today.firstChild)shell.appendChild(today.firstChild);
    today.appendChild(shell);
  }

  function refresh(){
    var s=stats();
    var orbit=document.getElementById('progressOrbitV4');
    if(orbit)orbit.style.setProperty('--p',s.percent);
    var progress=document.getElementById('heroProgressV4');if(progress)progress.textContent=s.percent+'%';
    var workoutName=document.getElementById('heroWorkoutV4');if(workoutName)workoutName.textContent=s.workout[0];
    var count=document.getElementById('heroCountV4');if(count)count.textContent=s.count+' 个动作';
    var minutes=document.getElementById('heroMinutesV4');if(minutes)minutes.textContent='约 '+s.minutes+' 分钟';
    var subtitle=document.getElementById('heroSubtitleV4');if(subtitle)subtitle.textContent=s.workout[1]+'。稳定呼吸，不耸肩，不憋气。';
    var completion=document.getElementById('todayCompletionTextV4');if(completion)completion.textContent=s.done+'/'+s.count+' 完成';
  }

  function go(name){
    openTab(name);
    requestAnimationFrame(function(){
      var target=document.getElementById(name);
      if(target)target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }

  document.addEventListener('click',function(e){
    var button=e.target.closest('[data-v4-go]');
    if(button)go(button.getAttribute('data-v4-go'));
  });

  document.body.classList.add('experience-v4');
  buildHero();
  wrapToday();

  var originalRenderAll=renderAll;
  renderAll=function(){originalRenderAll();wrapToday();refresh()};

  var originalRenderWorkout=renderWorkout;
  renderWorkout=function(){originalRenderWorkout();refresh()};

  var originalOpenTab=openTab;
  openTab=function(name){originalOpenTab(name);refresh()};

  renderTop();
  refresh();
})();
