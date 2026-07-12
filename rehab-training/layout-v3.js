(function(){
  var coreTabs=[['today','训练'],['timer','计时'],['record','打卡']];
  var moreTabs=[['report','周报'],['plan','计划'],['library','动作库'],['help','说明']];
  var openExercises=new Set();

  function tabLabel(name){
    var all=coreTabs.concat(moreTabs);
    var item=all.find(function(x){return x[0]===name});
    return item?item[1]:'更多';
  }

  function renderNavV3(){
    var nav=document.getElementById('nav');
    if(!nav)return;
    var isMore=moreTabs.some(function(x){return x[0]===activeTab});
    var html=coreTabs.map(function(t){return '<button class="btn '+(t[0]===activeTab?'active':'')+'" data-tab="'+t[0]+'">'+t[1]+'</button>'}).join('');
    html+='<div class="nav-more-v3 '+(isMore?'active':'')+'"><button class="btn '+(isMore?'active':'')+'" type="button" id="navMoreBtnV3">'+(isMore?tabLabel(activeTab):'更多')+'</button><div class="nav-more-menu-v3" id="navMoreMenuV3">';
    html+=moreTabs.map(function(t){return '<button class="btn '+(t[0]===activeTab?'active':'')+'" data-tab="'+t[0]+'">'+t[1]+'</button>'}).join('');
    html+='<div class="nav-more-divider-v3"></div><button class="btn" type="button" data-layout-action="dark">切换深色模式</button><button class="btn" type="button" data-layout-action="share">复制网页地址</button><button class="btn" type="button" data-layout-action="print">打印计划</button></div></div>';
    nav.innerHTML=html;
    var more=document.getElementById('navMoreBtnV3');
    if(more)more.onclick=function(e){e.stopPropagation();more.parentElement.classList.toggle('open')};
  }

  function currentStageText(){
    var p=phaseOf(selectedWeek);
    return {name:p.n.replace(/^第\d阶段：?/,''),desc:p.g};
  }

  function updateDrawerButton(){
    var btn=document.getElementById('weekDrawerToggleV3');
    if(btn)btn.firstElementChild.textContent='第'+selectedWeek+'周';
  }

  function renderWeeksV3(){
    var root=document.getElementById('weeks');
    if(!root)return;
    var stage=currentStageText();
    var options='';
    for(var i=1;i<=20;i++){
      var p=phaseOf(i);
      options+='<option value="'+i+'" '+(i===selectedWeek?'selected':'')+'>第'+i+'周 · '+p.n.replace(/^第\d阶段：?/,'')+'</option>';
    }
    root.innerHTML='<div class="week-picker-v3"><label for="weekSelectV3">当前训练周</label><select class="search" id="weekSelectV3">'+options+'</select><div class="week-stage-v3"><b>'+stage.name+'</b><span>'+stage.desc+'</span></div></div>';
    var select=document.getElementById('weekSelectV3');
    if(select)select.onchange=function(){selectedWeek=Number(select.value);renderAll();document.body.classList.remove('week-drawer-open')};
    updateDrawerButton();
  }

  function syncTabState(){
    Array.from(document.body.classList).forEach(function(c){if(/^tab-/.test(c))document.body.classList.remove(c)});
    document.body.classList.add('tab-'+activeTab);
    document.body.classList.remove('week-drawer-open');
    updateDrawerButton();
  }

  function installWeekDrawer(){
    var section=document.querySelector('.layout>section');
    if(section&&!document.getElementById('weekDrawerToggleV3')){
      var btn=document.createElement('button');
      btn.type='button';
      btn.id='weekDrawerToggleV3';
      btn.className='week-drawer-toggle-v3';
      btn.innerHTML='<span>第'+selectedWeek+'周</span>';
      btn.onclick=function(){document.body.classList.toggle('week-drawer-open')};
      section.insertBefore(btn,section.firstChild);
    }
    if(!document.getElementById('weekDrawerBackdropV3')){
      var back=document.createElement('div');
      back.id='weekDrawerBackdropV3';
      back.className='week-drawer-backdrop-v3';
      back.onclick=function(){document.body.classList.remove('week-drawer-open')};
      document.body.appendChild(back);
    }
  }

  function moveNavAboveOverview(){
    var nav=document.getElementById('nav');
    var hero=document.querySelector('.hero');
    if(nav&&hero&&hero.parentNode)hero.parentNode.insertBefore(nav,hero);
  }

  var oldOpenTab=openTab;
  openTab=function(name){
    oldOpenTab(name);
    syncTabState();
  };

  renderNav=renderNavV3;
  renderWeeks=renderWeeksV3;

  exerciseCard=function(id,index,done){
    var e=E[id];
    if(!e)return '';
    var expanded=openExercises.has(id)||(openExercises.size===0&&index===0);
    return '<article class="exercise '+(expanded?'expanded':'')+'" data-exercise-id="'+id+'"><div class="ex-top"><div><h3>'+(index+1)+'. '+e[0]+'</h3><div class="chips"><span class="chip">'+e[1]+'</span><span class="chip">'+e[5]+'</span></div></div><div class="exercise-actions-v3"><label class="check"><input type="checkbox" '+(done?'checked':'')+' data-check="'+id+'">完成</label><button class="btn exercise-expand-v3" type="button">'+(expanded?'收起要点':'查看要点')+'</button></div></div><div class="cols"><div class="box"><b>目标</b><p>'+e[2]+'</p></div><div class="box"><b>动作细节</b><p>'+e[3]+'</p></div><div class="box"><b>注意事项</b><p>'+e[4]+'</p></div></div></article>';
  };

  document.addEventListener('click',function(e){
    var expand=e.target.closest('.exercise-expand-v3');
    if(expand){
      var card=expand.closest('.exercise');
      var id=card&&card.getAttribute('data-exercise-id');
      if(!card||!id)return;
      card.classList.toggle('expanded');
      if(card.classList.contains('expanded'))openExercises.add(id);else openExercises.delete(id);
      expand.textContent=card.classList.contains('expanded')?'收起要点':'查看要点';
      return;
    }
    var action=e.target.closest('[data-layout-action]');
    if(action){
      var name=action.getAttribute('data-layout-action');
      if(name==='dark')toggleDark();
      if(name==='share')sharePage();
      if(name==='print')window.print();
      var wrap=action.closest('.nav-more-v3');if(wrap)wrap.classList.remove('open');
      return;
    }
    if(!e.target.closest('.nav-more-v3')){
      var more=document.querySelector('.nav-more-v3');if(more)more.classList.remove('open');
    }
  });

  moveNavAboveOverview();
  installWeekDrawer();
  renderAll();
  renderNavV3();
  syncTabState();
})();
