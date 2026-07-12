(function(){
  function checkinCoach(){
    var el=document.getElementById('coach');
    if(!el)return;
    el.className='warning';
    el.innerHTML='当前采用每日打卡模式，不再根据打卡自动判断疼痛。训练中若出现刺痛、麻木、放射痛、关节卡住或明显无力，请暂停训练。<div class="coach-note">身体不适时不要为了连续打卡硬练，本提示不能替代医生诊断。</div>';
  }
  try{coach=checkinCoach}catch(e){}
  window.coach=checkinCoach;
  var streak=document.getElementById('mStreak');if(streak&&streak.nextElementSibling)streak.nextElementSibling.textContent='连续打卡';
  var done=document.getElementById('mDone');if(done&&done.nextElementSibling)done.nextElementSibling.textContent='累计打卡';
  checkinCoach();
})();
