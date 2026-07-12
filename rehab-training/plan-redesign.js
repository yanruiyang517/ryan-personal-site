(function(){
  function dayName(i){return ['周一','周二','周三','周四','周五','周六','周日'][i]}
  function dayCodes(){return ['mon','tue','wed','thu','fri','sat','sun']}
  function workoutName(key){return W[key] ? W[key][0] : W.rest[0]}
  window.renderPlan = function renderPlanRedesigned(){
    var root = document.getElementById('fullPlan');
    if(!root || typeof phases === 'undefined') return;
    var html = '';
    phases.forEach(function(p){
      html += '<section class="plan-stage"><div class="plan-stage-head"><h3>'+p.n+'</h3><p>'+p.g+'</p></div><div class="plan-week-grid">';
      for(var w=p.f; w<=p.t; w++){
        var s = schedule(w);
        html += '<article class="plan-week-card"><h4 class="plan-week-title">第'+w+'周</h4><div class="plan-day-list">';
        dayCodes().forEach(function(code, idx){
          html += '<div class="plan-day-row"><div class="plan-day-name">'+dayName(idx)+'</div><div class="plan-day-work">'+workoutName(s[code])+'</div></div>';
        });
        html += '</div></article>';
      }
      html += '</div></section>';
    });
    root.innerHTML = html;
  };
  function loadCss(href){var l=document.createElement('link');l.rel='stylesheet';l.href=href;document.head.appendChild(l)}
  loadCss('health-enhancements.css?v=0713v');
  loadCss('checkin-mode.css?v=0713v');
  loadCss('button-system-v6.css?v=0713v');
  loadCss('mobile-screenshot-fixes-v7.css?v=0713v');
  var health=document.createElement('script');
  health.src='health-enhancements.js?v=0713v';
  health.onload=function(){
    var checkin=document.createElement('script');
    checkin.src='checkin-mode.js?v=0713v';
    checkin.onload=function(){
      var safety=document.createElement('script');
      safety.src='checkin-coach.js?v=0713v';
      safety.onload=function(){
        var layout=document.createElement('script');
        layout.src='layout-v3.js?v=0713v';
        layout.onload=function(){
          var premium=document.createElement('script');
          premium.src='premium-v4.js?v=0713v';
          premium.onload=function(){
            var mobile=document.createElement('script');
            mobile.src='mobile-v5.js?v=0713v';
            document.body.appendChild(mobile);
          };
          document.body.appendChild(premium);
        };
        document.body.appendChild(layout);
      };
      document.body.appendChild(safety);
    };
    document.body.appendChild(checkin);
  };
  document.body.appendChild(health);
})();