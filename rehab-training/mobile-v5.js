(function(){
  function mobile(){return window.matchMedia('(max-width: 920px)').matches}
  function applyMode(){document.body.classList.toggle('mobile-v5',mobile());if(!mobile())document.body.classList.remove('mobile-input-focus','week-drawer-open')}
  function centerActiveDay(){if(!mobile())return;requestAnimationFrame(function(){var el=document.querySelector('#days .day.active');if(el)el.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})})}
  function scrollPanel(name){if(!mobile())return;requestAnimationFrame(function(){var el=document.getElementById(name);if(!el)return;var top=Math.max(0,el.getBoundingClientRect().top+window.scrollY-70);window.scrollTo({top:top,behavior:'smooth'})})}

  applyMode();
  window.addEventListener('resize',applyMode,{passive:true});

  var viewport=window.visualViewport||null;
  var baseHeight=viewport?viewport.height:window.innerHeight;
  function resetViewportBase(){baseHeight=viewport?viewport.height:window.innerHeight;document.body.classList.remove('mobile-input-focus')}
  window.addEventListener('orientationchange',function(){document.body.classList.remove('week-drawer-open','mobile-input-focus');setTimeout(function(){resetViewportBase();applyMode();centerActiveDay()},280)});

  try{var previousRenderDays=renderDays;renderDays=function(){previousRenderDays();centerActiveDay()}}catch(e){}
  try{var previousOpenTab=openTab;openTab=function(name){previousOpenTab(name);scrollPanel(name)}}catch(e){}

  function editable(el){return !!(el&&el.matches&&el.matches('input:not([type="checkbox"]):not([type="range"]),select,textarea'))}
  document.addEventListener('focusin',function(e){if(mobile()&&editable(e.target))document.body.classList.add('mobile-input-focus')});
  document.addEventListener('focusout',function(){if(!mobile())return;setTimeout(function(){if(!editable(document.activeElement))document.body.classList.remove('mobile-input-focus')},220)});

  if(viewport){
    viewport.addEventListener('resize',function(){
      if(!mobile())return;
      if(viewport.height>baseHeight)baseHeight=viewport.height;
      var keyboardOpen=viewport.height<baseHeight*.74;
      var focused=editable(document.activeElement);
      document.body.classList.toggle('mobile-input-focus',keyboardOpen||focused);
      if(!keyboardOpen&&!focused)document.body.classList.remove('mobile-input-focus');
    });
  }

  document.addEventListener('click',function(e){
    if(!mobile())return;
    var actionable=e.target.closest('.nav .btn,.hero-actions-v4 .btn,.week-drawer-toggle-v3,.checkin-main-btn,.exercise-actions-v3 .btn');
    if(actionable&&navigator.vibrate)navigator.vibrate(8);
  });

  setTimeout(function(){resetViewportBase();applyMode();centerActiveDay()},160);
})();
