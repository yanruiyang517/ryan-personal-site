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
})();
