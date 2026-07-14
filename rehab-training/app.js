
/* ===== SOURCE: compat.js ===== */
var structuredClone = typeof window.structuredClone === 'function'
  ? function(value){ return window.structuredClone(value); }
  : function(value){ return JSON.parse(JSON.stringify(value)); };


/* ===== SOURCE: legacy-app-core.js ===== */
const KEY = 'rehabPro.v4';
const OLD_KEYS = ['rehabPro.v3', 'rehabPro.v2'];
const days = ['周日','周一','周二','周三','周四','周五','周六'];
const dkey = ['sun','mon','tue','wed','thu','fri','sat'];
const tabs = [['today','今日训练'],['timer','计时器'],['record','训练记录'],['report','周报'],['plan','完整计划'],['library','动作库'],['help','说明']];
const scoreNames = ['脖子酸','斜方肌酸','肩胛酸','胸小肌酸','腰酸','背挺直呼吸不顺','右肩弹响疼痛'];
const flagNames = ['刺痛','麻木','放射痛','关节卡住','明显无力','疼痛超过48小时'];
const phases = [
  {f:1,t:1,n:'第0阶段：降代偿周',g:'降低上斜方肌、脖子、胸小肌抢活。',c:['训练后斜方肌不酸爆','收下巴后脖子不更酸','push-up plus 不明显耸肩','B0后腰不明显加重']},
  {f:2,t:4,n:'第1阶段：建立正确发力',g:'让前锯肌、下斜方肌、核心、臀部开始工作。',c:['斜方肌酸较第1周下降约30%','墙面 push-up plus 3组×12 不耸肩','俯卧W后脖子不酸爆','死虫每侧10次腰不拱','背自然挺直呼吸更顺']},
  {f:5,t:8,n:'第2阶段：强化基础控制',g:'从康复动作过渡到基础力量，准备健身房。',c:['日常酸痛下降约50%','背自然挺起来不明显卡','push-up plus 3组×15 不耸肩','W/Y后脖子不酸爆','死虫每侧10次腰不拱','右肩弹响不伴疼痛、卡住、无力']},
  {f:9,t:16,n:'第3阶段：健身房康复型增肌',g:'用器械增加肌肉，但不让肩颈腰加重。',c:['训练后肩颈腰不明显更酸','器械划船不耸肩','腿举不腰顶','推胸无肩前痛','第二天可正常活动']},
  {f:17,t:20,n:'第4阶段：正常增肌过渡',g:'康复动作变成热身维护，逐步进入正式增肌。',c:['可稳定完成上肢拉、推、下肢训练','仍保留肩胛和核心维护','无连续加重记录']}
];
const E = {
  breath:['90/90呼吸','2–3分钟','放松胸廓，减少脖子、斜方肌和腰代偿','仰卧，髋膝约90度，鼻吸嘴呼；呼气时肋骨往下收','不挺胸吸气，不耸肩，不憋气','呼吸/胸廓'],
  chin:['仰卧收下巴','2–3组 × 8–10次','激活深层颈屈肌，改善头前伸','像轻微双下巴，后颈轻轻拉长，力度20%–30%','不是低头，不用力压脖子，做完不应更酸','颈部'],
  cat:['猫牛式','10次','活动脊柱和胸椎','四点跪，慢慢拱背再伸展，配合呼吸','不甩头，不塌腰硬顶','胸椎/脊柱'],
  open:['开书式胸椎旋转','每侧6–8次','改善胸椎僵硬和圆肩','侧卧，手臂像翻书打开，重点转上背','不要猛扭腰，不追求幅度','胸椎'],
  wallplus:['墙面 push-up plus','2–3组 × 8–15次','激活前锯肌，让肩胛骨贴住肋骨','双手扶墙，手肘基本伸直，把墙推远','重点推远，不耸肩，头别前探，腰别塌','前锯肌/翼状肩胛'],
  punch:['仰卧前锯肌拳击','2–3组 × 10–12次','低负荷激活前锯肌','仰卧，手臂伸向天花板，拳头轻轻向上送','肩膀不要往耳朵方向顶','前锯肌'],
  pronew:['俯卧W','2–3组 × 6–8次','激活中下斜方肌，改善圆肩','俯卧，手臂呈W，肩胛轻轻往后下方走','幅度小，不抬太高，不耸肩','中下斜方肌'],
  y:['俯卧Y','1–2组 × 5–6次','强化下斜方肌，帮助肩胛上旋','俯卧，手臂呈Y字，轻轻抬起一点','只有W不酸爆时再做，不追求高度','下斜方肌'],
  door:['门框拉胸','每侧20–30秒','放松胸小肌，减少肩膀前扣','前臂扶门框，身体轻轻向前','不顶腰，不拉到疼','胸小肌'],
  scap:['四点跪肩胛俯卧撑','2–3组 × 8–10次','提高肩胛控制','四点跪，手肘不弯，只让肩胛靠近/推开','一耸肩就减小幅度','肩胛控制'],
  dead:['死虫','2–3组 × 每侧6–10次','建立核心稳定，减少腰代偿','仰卧，对侧手脚慢慢伸出再收回','腰不能拱，动作慢，不能憋气','核心/腰'],
  bird:['鸟狗','2–3组 × 每侧6–10次','训练核心、腰背和骨盆稳定','四点跪，对侧手脚伸出，保持骨盆平','腿别抬太高，头别前探，骨盆别晃','核心/骨盆'],
  bridge:['臀桥','3–4组 × 10–15次','激活臀部，让腰少代偿','仰卧屈膝，用臀发力抬起','不要用腰顶，不抬过高','臀部/腰'],
  side:['屈膝侧桥','每侧2–3组 × 15–30秒','强化侧腹和骨盆稳定','侧卧屈膝，用侧腹撑起身体，保持呼吸','腰酸就缩短，肩不要耸','侧腹/骨盆'],
  squat:['椅子深蹲','2–3组 × 8–12次','建立下肢基础力量','坐向椅子再站起，膝盖和脚尖一致','脖子别前探，膝盖别内扣','腿部'],
  hinge:['髋铰链','2–3组 × 8–12次','学会用髋折叠，为硬拉划船打基础','屁股往后推，背自然，髋部折叠','不弯腰驼背，不脖子前探','髋/腰'],
  walk:['散步','20–40分钟','促进恢复，减少久坐僵硬','轻松走，不追求速度','不适就缩短时间','恢复'],
  angel:['墙天使','2组 × 6次','改善胸椎和肩胛活动','背靠墙，手臂缓慢上下滑动','腰别拱，手贴不住墙也没事','胸椎/肩胛'],
  slide:['墙面滑手 wall slide','2组 × 8次','练肩胛上旋，为下拉推胸准备','前臂贴墙，慢慢向上滑再回来','不耸肩，不拱腰','肩胛上旋'],
  lunge:['扶墙反向弓步 / 分腿蹲准备','每侧2组 × 6–8次','训练单腿控制和骨盆稳定','手扶墙，后脚向后，慢慢下蹲再站起','膝盖对准脚尖，不要晃','单腿/骨盆'],
  row:['坐姿划船 / 胸托划船','3–4组 × 10–12次','练背和肩胛后缩控制','胸口稳定，拉到身体附近，肩胛后下','不耸肩，头别前探，别用腰甩','背/肩胛'],
  pull:['高位下拉，中立握','3组 × 10次','练背阔肌和肩胛下沉控制','先肩胛下沉，再拉向上胸','不耸肩，不把头往前伸','背阔肌'],
  leg:['腿举','3–4组 × 10–12次','练腿，同时更容易控制腰','脚踩稳，膝盖顺脚尖，慢上慢下','不憋气，不锁膝，不让腰离垫','腿部'],
  curl:['腿弯举','3组 × 12次','训练腘绳肌，帮助骨盆稳定','控制速度，顶峰轻停再还原','不要甩重量','腿后侧'],
  hip:['臀推机 / 臀桥机','3–4组 × 8–12次','强化臀部，减少腰酸','用臀发力顶起，身体稳定','不要用腰顶，不憋气','臀部'],
  chest:['器械推胸，轻重量','2–3组 × 10次','重新建立推的模式','肩胛稳定，推起时肩膀别顶到耳朵','肩前痛或弹响伴痛就停','胸/推'],
  face:['绳索面拉，极轻','2–3组 × 12次','训练后肩和肩胛稳定协同','轻重量，绳索拉向脸部附近','一耸肩就删掉','后肩'],
  lat:['哑铃侧平举，极轻','2–3组 × 12次','轻练三角肌中束','小重量，手臂向两侧抬到舒适高度','不能耸肩，不能甩','肩'],
  press:['坐姿器械肩推，极轻','2组 × 8次','测试肩推能力','坐稳，轻重量，路径自然','右肩不适就删','肩推']
};
const W = {
  reset:['基础重置','每天早上或训练前做，降代偿、顺呼吸',['breath','chin','cat','open','wallplus']],
  light:['轻恢复','不追求累，只恢复胸椎、呼吸和肩颈状态',['breath','cat','open','door','walk']],
  rest:['休息 / 散步','避免久坐，可轻松散步',['walk','breath']],
  walk:['散步 + 基础重置','轻松散步，配合呼吸重置，不追求疲劳',['walk','breath','cat','open']],
  A0:['A0：颈肩肩胛降级版','降低斜方肌代偿',['breath','chin','wallplus','punch','pronew','door']],
  B0:['B0：核心臀腿降级版','核心和臀部开始工作，减少腰代偿',['breath','dead','bird','bridge','side','squat','hinge']],
  A1:['A1：肩胛 + 颈肩基础版','建立前锯肌、下斜方肌和颈部发力',['breath','chin','wallplus','punch','scap','pronew','door']],
  B1:['B1：核心 + 臀腿基础版','建立核心、臀部、下肢控制',['breath','dead','bird','bridge','side','squat','hinge']],
  A2:['A2：肩胛上背强化版','从康复动作过渡到基础力量',['breath','chin','wallplus','scap','pronew','y','angel','door']],
  B2:['B2：核心臀腿强化版','强化核心、臀腿和髋控制',['dead','bird','bridge','side','squat','hinge','lunge']],
  A2p:['A2进阶：肩胛上旋准备','加入墙面滑手，为下拉和推胸准备',['breath','chin','wallplus','scap','pronew','y','slide','door']],
  B2p:['B2进阶：下肢单腿控制','加入分腿蹲准备，提高髋膝骨盆控制',['dead','bird','bridge','side','hinge','lunge']],
  gymA:['健身房A：背 + 臀腿 + 核心','器械增肌，但以稳定和不代偿为第一标准',['walk','row','leg','curl','hip','dead']],
  gymB:['健身房B：下拉 + 轻推 + 臀腿','恢复拉和推的训练模式，重量必须轻',['walk','pull','row','chest','leg','face','side']],
  pullDay:['上肢拉：正式增肌过渡','保留肩胛维护，逐渐进入正常背部训练',['pull','row','face','pronew']],
  pushDay:['上肢推：轻推胸 + 轻肩部','只在肩不痛、不耸肩时做',['chest','lat','press','wallplus']],
  lower:['下肢 + 核心','腿、臀、核心训练，继续避免腰代偿',['leg','curl','hip','side','dead']]
};
function schedule(week) {
  if (week <= 1) return {mon:'A0',tue:'light',wed:'B0',thu:'A0',fri:'light',sat:'B0',sun:'rest'};
  if (week <= 4) return {mon:'A1',tue:'B1',wed:'light',thu:'A1',fri:'B1',sat:'light',sun:'rest'};
  if (week <= 6) return {mon:'A2',tue:'B2',wed:'light',thu:'A2',fri:'B2',sat:'reset',sun:'rest'};
  if (week === 7) return {mon:'A2p',tue:'B2p',wed:'light',thu:'A2p',fri:'B2p',sat:'light',sun:'rest'};
  if (week === 8) return {mon:'A2',tue:'B2',wed:'light',thu:'A2',fri:'B2',sat:'walk',sun:'rest'};
  if (week <= 12) return {mon:'gymA',tue:'reset',wed:'gymB',thu:'light',fri:'gymA',sat:'walk',sun:'rest'};
  if (week <= 16) return {mon:'gymA',tue:'A2',wed:'gymB',thu:'light',fri:'gymA',sat:'B2',sun:'rest'};
  return {mon:'pullDay',tue:'lower',wed:'rest',thu:'pushDay',fri:'lower',sat:'A2',sun:'rest'};
}
const def = {start:'2026-06-29', records:{}, checks:{}, dark:false};
let data = loadData();
let selectedWeek = weekNow();
let selectedDay = new Date().getDay();
let activeTab = 'today';
let timers = {train:{seconds:0,on:false,id:null}, rest:{seconds:45,on:false,id:null}, breath:{on:false,id:null,i:0}};
function $(id){return document.getElementById(id)}
function safeJson(text){try{return JSON.parse(text)}catch{return null}}
function loadData(){let current = safeJson(localStorage.getItem(KEY));if(current) return Object.assign({}, def, current);for(const k of OLD_KEYS){let old = safeJson(localStorage.getItem(k));if(old){let merged = Object.assign({}, def, old);localStorage.setItem(KEY, JSON.stringify(merged));return merged}}return structuredClone ? structuredClone(def) : JSON.parse(JSON.stringify(def))}
function saveData(){localStorage.setItem(KEY, JSON.stringify(data))}
function localISO(d = new Date()){let y=d.getFullYear();let m=String(d.getMonth()+1).padStart(2,'0');let day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function parseLocalDate(str){let [y,m,d] = (str || def.start).split('-').map(Number);return new Date(y, (m || 1) - 1, d || 1)}
function dateKey(d = new Date()){return localISO(d)}
function weekNow(){let start = parseLocalDate(data.start || def.start);let now = new Date();let startDay = new Date(start.getFullYear(),start.getMonth(),start.getDate());let nowDay = new Date(now.getFullYear(),now.getMonth(),now.getDate());return Math.max(1, Math.min(20, Math.floor((nowDay - startDay) / 604800000) + 1))}
function phaseOf(w){return phases.find(p => w >= p.f && w <= p.t) || phases[phases.length - 1]}
function dayCode(){return dkey[selectedDay]}
function workoutKey(){return schedule(selectedWeek)[dayCode()] || 'rest'}
function workout(){return W[workoutKey()] || W.rest}
function todayRecord(){return data.records[dateKey()]}
function init(){if(data.dark) document.body.classList.add('dark');$('startDate').value = data.start;bindUI();renderNav();renderScoreInputs();renderAll()}
function bindUI(){
  bindClick('darkBtn', toggleDark); bindClick('printBtn', () => window.print()); bindClick('shareBtn', sharePage);
  bindClick('saveStartBtn', saveStart); bindClick('todayBtn', goToday); bindClick('completeAllBtn', completeAll); bindClick('clearChecksBtn', clearChecks); bindClick('openRecordBtn', () => openTab('record'));
  bindClick('trainTimerBtn', () => timerStart('train')); bindClick('trainResetBtn', () => timerReset('train')); bindClick('restTimerBtn', () => timerStart('rest')); bindClick('restResetBtn', () => timerReset('rest')); bindClick('breathBtn', breathToggle);
  bindClick('saveRecordBtn', saveRecord); bindClick('exportJsonBtn', exportJSON); bindClick('exportCsvBtn', exportCSV); bindClick('clearDataBtn', clearData);
  bindChange('restSec', setRest); bindChange('importFile', importJSON); bindInput('q', renderLibrary);
  $('nav')?.addEventListener('click', e => {let b=e.target.closest('[data-tab]'); if(b) openTab(b.dataset.tab)});
  $('weeks')?.addEventListener('click', e => {let b=e.target.closest('[data-week]'); if(b){selectedWeek=Number(b.dataset.week); renderAll()}});
  $('days')?.addEventListener('click', e => {let b=e.target.closest('[data-day]'); if(b){selectedDay=Number(b.dataset.day); renderAll()}});
  $('exerciseList')?.addEventListener('change', e => {let cb=e.target.closest('[data-check]'); if(cb) toggleCheck(cb.dataset.check, cb.checked)});
  document.addEventListener('input', e => {if(e.target.matches('input[type="range"]')) e.target.nextElementSibling.textContent = e.target.value});
}
function bindClick(id, fn){let el=$(id); if(el) el.addEventListener('click', fn)}
function bindChange(id, fn){let el=$(id); if(el) el.addEventListener('change', fn)}
function bindInput(id, fn){let el=$(id); if(el) el.addEventListener('input', fn)}
function renderNav(){$('nav').innerHTML = tabs.map(t => `<button class="btn ${t[0]===activeTab?'active':''}" data-tab="${t[0]}">${t[1]}</button>`).join('')}
function openTab(name){activeTab = name;document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));$(name)?.classList.add('active');renderNav();if(name === 'record') loadTodayForm();if(name === 'report') renderReport();if(name === 'plan') renderPlan();if(name === 'library') renderLibrary()}
function renderTop(){let records = Object.values(data.records);$('mToday').textContent = days[new Date().getDay()];$('mWeek').textContent = '第' + weekNow() + '周';$('mPhase').textContent = phaseOf(weekNow()).n.split('：')[0];$('mDone').textContent = records.length + '次';$('mStreak').textContent = streak() + '天';coach()}
function coach(){let list = Object.values(data.records).sort((a,b)=>b.date.localeCompare(a.date));let r = todayRecord() || list[0];let el = $('coach');if(!el) return;if(!r){el.className = 'warning';el.textContent = '今天训练后保存一次记录，我会根据疼痛前后变化判断是否进阶、维持或降级。';return}let before = avg(r.before), after = avg(r.after), flags = (r.flags || []).length;if(flags || after - before >= 2 || after >= 7){el.className = 'danger';el.textContent = '建议降级：下次组数减半或退回上一阶段，并重点检查是否耸肩、憋气、腰顶。'}else if(after <= before && after <= 4){el.className = 'warning ok';el.textContent = '方向正确：不适没有加重，可以继续当前周；连续2次稳定后再小幅加量。'}else{el.className = 'warning';el.textContent = '建议维持：暂时不要加量，优先把动作做稳，尤其是不耸肩、不塌腰。'}}
function renderWeeks(){let html = '';for(let i=1;i<=20;i++){let p = phaseOf(i);html += `<button class="week ${i===selectedWeek?'active':''}" data-week="${i}">第${i}周<small>${p.n}</small></button>`}$('weeks').innerHTML = html}
function renderDays(){let order = [1,2,3,4,5,6,0];$('days').innerHTML = order.map(i => `<button class="day ${i===selectedDay?'active':''} ${i===new Date().getDay()&&selectedWeek===weekNow()?'today':''}" data-day="${i}">${days[i]}</button>`).join('')}
function renderWorkout(){let w = workout();let p = phaseOf(selectedWeek);$('wTitle').textContent = w[0];$('wDesc').textContent = w[1];$('phaseTag').textContent = p.n;let ids = w[2];let checks = getChecks();$('exerciseList').innerHTML = ids.map((id,i) => exerciseCard(id,i,checks[id])).join('');let done = ids.filter(id => checks[id]).length;$('doneBar').style.width = (done / ids.length * 100 || 0) + '%'}
function exerciseCard(id, index, done=false){let e = E[id];return `<article class="exercise"><div class="ex-top"><div><h3>${index+1}. ${e[0]}</h3><div class="chips"><span class="chip">${e[1]}</span><span class="chip">${e[5]}</span></div></div><label class="check"><input type="checkbox" ${done?'checked':''} data-check="${id}">完成</label></div><div class="cols"><div class="box"><b>目标</b><p>${e[2]}</p></div><div class="box"><b>细节</b><p>${e[3]}</p></div><div class="box"><b>注意</b><p>${e[4]}</p></div></div></article>`}
function checkKey(){return `${selectedWeek}-${dayCode()}-${dateKey()}`}
function getChecks(){return data.checks[checkKey()] || {}}
function toggleCheck(id, value){let key = checkKey();data.checks[key] = data.checks[key] || {};data.checks[key][id] = value;saveData();renderWorkout()}
function completeAll(){let key = checkKey();data.checks[key] = {};workout()[2].forEach(id => data.checks[key][id] = true);saveData();renderWorkout()}
function clearChecks(){data.checks[checkKey()] = {};saveData();renderWorkout()}
function renderScoreInputs(){['before','after'].forEach(type => {$(type + 'Scores').innerHTML = scoreNames.map(name => `<div class="score"><label>${name}</label><input type="range" min="0" max="10" value="0" data-${type}="${name}"><b>0</b></div>`).join('')});$('flags').innerHTML = flagNames.map(f => `<label class="check"><input type="checkbox" data-flag="${f}">${f}</label>`).join('')}
function readScores(type){let out = {};document.querySelectorAll(`[data-${type}]`).forEach(x => out[x.dataset[type]] = Number(x.value));return out}
function setScores(type, obj = {}){document.querySelectorAll(`[data-${type}]`).forEach(x => {let v = Number(obj[x.dataset[type]] || 0);x.value = v;x.nextElementSibling.textContent = v})}
function loadTodayForm(){let r = todayRecord();if(!r){$('done').checked = Object.values(getChecks()).some(Boolean);setScores('before',{});setScores('after',{});document.querySelectorAll('[data-flag]').forEach(x => x.checked = false);$('note').value = '';return}$('done').checked = !!r.done;setScores('before', r.before);setScores('after', r.after);document.querySelectorAll('[data-flag]').forEach(x => x.checked = (r.flags || []).includes(x.dataset.flag));$('note').value = r.note || ''}
function saveRecord(){let key = dateKey();data.records[key] = {date:key, week:selectedWeek, day:days[selectedDay], workout:workout()[0], done:$('done').checked || Object.values(getChecks()).some(Boolean), before:readScores('before'), after:readScores('after'), flags:[...document.querySelectorAll('[data-flag]:checked')].map(x => x.dataset.flag), note:$('note').value.trim(), checks:getChecks(), updated:new Date().toLocaleString()};saveData();renderAll();alert('已保存今日记录')}
function renderHistory(){let arr = Object.values(data.records).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12);$('history').innerHTML = arr.length ? arr.map(r => `<div class="hist"><b>${r.date} · ${r.workout}</b><small>第${r.week}周 · ${r.day} · ${r.done?'已完成':'未完成'} · 训练后均分 ${avg(r.after)}/10</small><p>${(r.flags||[]).length ? '异常：' + r.flags.join('、') : '无异常信号'}</p><p>${r.note || '无备注'}</p></div>`).join('') : '<p class="sub">还没有记录。</p>'}
function renderReport(){let arr = Object.values(data.records).sort((a,b)=>a.date.localeCompare(b.date));let last = arr.slice(-7);let done = last.filter(x => x.done).length;let delta = Math.round((avgGroup(last,'after') - avgGroup(last,'before')) * 10) / 10;$('reportCards').innerHTML = `<div class="metric"><b>${done}/7</b><span>近7次完成</span></div><div class="metric"><b>${avgGroup(last,'before')}</b><span>训练前平均不适</span></div><div class="metric"><b>${avgGroup(last,'after')}</b><span>训练后平均不适，变化 ${delta}</span></div>`;renderCalendar();let p = phaseOf(selectedWeek);$('criteria').innerHTML = p.c.map(x => `<label class="check"><input type="checkbox">${x}</label>`).join('') + '<p class="sub">满足多数标准且连续2次训练不加重，再进入下一阶段或小幅加量。</p>'}
function renderCalendar(){let now = new Date();let start = new Date(now);start.setDate(now.getDate() - 20);let html = '';for(let i=0;i<21;i++){let d = new Date(start);d.setDate(start.getDate()+i);let key = dateKey(d);let r = data.records[key];html += `<div class="cal ${r&&r.done?'done':''} ${key===dateKey()?'today':''}"><b>${key.slice(5)}</b><br>${days[d.getDay()]}<br>${r?'后'+avg(r.after)+'/10':''}</div>`}$('calendar').innerHTML = html}
function renderPlan(){let html = '';phases.forEach(p => {html += `<h3>${p.n}</h3><p class="sub">${p.g}</p><table><thead><tr><th>周数</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th><th>周日</th></tr></thead><tbody>`;for(let w=p.f;w<=p.t;w++){let s = schedule(w);html += `<tr><td>第${w}周</td>${[1,2,3,4,5,6,0].map(d => `<td>${W[s[dkey[d]] || 'rest'][0]}</td>`).join('')}</tr>`}html += '</tbody></table>'});$('fullPlan').innerHTML = html}
function renderLibrary(){let q = ($('q') && $('q').value || '').trim();let entries = Object.entries(E).filter(([id,e]) => !q || e.join('').includes(q));$('lib').innerHTML = entries.length ? entries.map(([id,e],i)=>exerciseCard(id,i,false)).join('') : '<p class="sub">没有找到动作。</p>'}
function renderAll(){renderTop();renderWeeks();renderDays();renderWorkout();renderHistory();if(activeTab==='record') loadTodayForm();if(activeTab==='report') renderReport();if(activeTab==='plan') renderPlan();if(activeTab==='library') renderLibrary()}
function avg(obj){let vals = Object.values(obj || {});return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0) / vals.length * 10) / 10 : 0}
function avgGroup(list, type){let vals = list.flatMap(r => Object.values(r[type] || {}));return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0) / vals.length * 10) / 10 : 0}
function streak(){let n = 0;let d = new Date();while(data.records[dateKey(d)]){n++;d.setDate(d.getDate()-1)}return n}
function saveStart(){data.start = $('startDate').value || def.start;saveData();selectedWeek = weekNow();renderAll()}
function goToday(){selectedWeek = weekNow();selectedDay = new Date().getDay();openTab('today');renderAll()}
function toggleDark(){document.body.classList.toggle('dark');data.dark = document.body.classList.contains('dark');saveData()}
function sharePage(){if(navigator.clipboard) navigator.clipboard.writeText(location.href);alert('网址已复制')}
function exportJSON(){downloadFile('康复训练记录.json', JSON.stringify(data,null,2), 'application/json')}
function exportCSV(){let rows = ['date,week,day,workout,done,beforeAvg,afterAvg,flags,note'];Object.values(data.records).forEach(r => rows.push([r.date,r.week,r.day,r.workout,r.done,avg(r.before),avg(r.after),`"${(r.flags||[]).join('、')}"`,`"${(r.note||'').replaceAll('"','""')}"`].join(',')));downloadFile('康复训练记录.csv', rows.join('\n'), 'text/csv;charset=utf-8')}
function downloadFile(name,text,type){let a = document.createElement('a');a.href = URL.createObjectURL(new Blob([text],{type}));a.download = name;a.click();URL.revokeObjectURL(a.href)}
function importJSON(event){let file = event.target.files[0];if(!file) return;let reader = new FileReader();reader.onload = () => {let imported = safeJson(reader.result);if(imported){data = Object.assign({}, def, imported);saveData();renderAll();alert('导入成功')}else alert('导入失败')};reader.readAsText(file)}
function clearData(){if(confirm('确定清空所有本地记录？')){localStorage.removeItem(KEY);data = loadData();renderAll()}}
function fmt(seconds){let m = Math.floor(seconds/60);let s = seconds % 60;return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0')}
function timerStart(type){let t = timers[type];t.on = !t.on;if(t.on){t.id = setInterval(() => {if(type === 'train') t.seconds++;else t.seconds = Math.max(0, t.seconds - 1);$(type + 'Time').textContent = fmt(t.seconds);if(type === 'rest' && t.seconds === 0){t.on=false;clearInterval(t.id)}}, 1000)}else clearInterval(t.id)}
function timerReset(type){let t = timers[type];clearInterval(t.id);t.on = false;t.seconds = type === 'rest' ? Number($('restSec').value) : 0;$(type + 'Time').textContent = fmt(t.seconds)}
function setRest(){timerReset('rest')}
function breathToggle(){let t = timers.breath;t.on = !t.on;if(t.on){t.id = setInterval(() => {t.i++;$('breathText').textContent = t.i % 10 < 4 ? '吸气' : '呼气'},1000)}else clearInterval(t.id)}
window.addEventListener('DOMContentLoaded', init);


/* ===== SOURCE: week-label-fix.js ===== */
/* Keeps week labels on one line and separates phase text. */
renderWeeks = function renderWeeksFixed() {
  let html = '';
  for (let i = 1; i <= 20; i++) {
    const p = phaseOf(i);
    html += `<button class="week ${i === selectedWeek ? 'active' : ''}" data-week="${i}"><span class="week-number">第${i}周</span><span class="week-title">${p.n}</span></button>`;
  }
  const weeks = document.getElementById('weeks');
  if (weeks) weeks.innerHTML = html;
};


/* ===== SOURCE: missing-actions.js ===== */
/* Adds exercises that were missing from the original rehab plan. */
E.warm = ['快走 / 椭圆机热身','8–10分钟','训练前提高血流，让肩颈腰先进入状态','轻松快走或椭圆机，呼吸平稳，不追求累','不要上来就冲强度，不要憋气','热身'];
E.inclineChest = ['上斜器械推胸','2–3组 × 10次','练上胸，同时测试上肢推的稳定性','选择轻重量，肩胛保持稳定，动作路径自然','不耸肩，肩前痛就停','上胸/推'];
E.legExt = ['坐姿腿屈伸','3组 × 12次','补充股四头肌力量，为下肢训练打基础','坐稳，慢慢伸膝，顶峰轻停，再慢慢放下','不要甩重量，不要锁死膝盖','股四头肌'];
E.hipAbd = ['坐姿髋外展','3组 × 12次','训练臀中肌，帮助骨盆和膝盖稳定','坐稳，双腿向外打开，控制速度回来','不要甩，不要用腰代偿','臀中肌/骨盆'];
W.gymA = ['健身房A：背 + 臀腿 + 核心','器械增肌，但以稳定和不代偿为第一标准',['warm','row','leg','curl','hip','dead']];
W.gymB = ['健身房B：下拉 + 轻推 + 臀腿','恢复拉和推的训练模式，重量必须轻',['warm','pull','row','chest','leg','face','side']];
W.gymA2 = ['健身房A进阶：背 + 臀腿 + 补充腿部','第13–16周使用，加入腿屈伸和髋外展，但仍然轻重量',['warm','row','leg','curl','hip','legExt','hipAbd','dead']];
W.gymB2 = ['健身房B进阶：下拉 + 轻推 + 臀腿','第13–16周使用，加入轻推和臀中肌稳定',['warm','pull','row','chest','leg','face','hipAbd','side']];
W.pushDay = ['上肢推：器械推胸 + 上斜推胸 + 轻肩部','第17周以后正常增肌过渡，仍以不耸肩为标准',['chest','inclineChest','lat','press','wallplus']];
W.lower = ['下肢 + 核心','腿、臀、核心训练，继续避免腰代偿',['leg','curl','hip','hipAbd','dead','side']];
const rehabOriginalSchedule = schedule;
schedule = function patchedSchedule(week) {
  if (week >= 13 && week <= 16) return {mon:'gymA2',tue:'A2',wed:'gymB2',thu:'light',fri:'gymA2',sat:'B2',sun:'rest'};
  return rehabOriginalSchedule(week);
};


/* ===== SOURCE: plan-redesign.js (renderPlan only) ===== */
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

/* ===== SOURCE: health-enhancements.js ===== */
(function(){
  var seriousFlags=['刺痛','麻木','放射痛','关节卡住','明显无力'];
  function avg(o){var v=Object.values(o||{}).filter(function(x){return typeof x==='number'&&!isNaN(x)});return v.length?Math.round(v.reduce(function(a,b){return a+b},0)/v.length*10)/10:0}
  function records(){var store=(typeof data!=='undefined'&&data.records)?data.records:{};return Object.values(store).sort(function(a,b){return a.date.localeCompare(b.date)})}
  function hasScores(r){return !!(r&&((r.before&&Object.keys(r.before).length)||(r.after&&Object.keys(r.after).length)))}
  function scoredRecords(){return records().filter(hasScores)}
  function lastRecords(n){var r=records();return r.slice(Math.max(0,r.length-n))}
  function lastScored(n){var r=scoredRecords();return r.slice(Math.max(0,r.length-n))}
  function hasSerious(r){return !!(r&&(r.flags||[]).some(function(f){return seriousFlags.indexOf(f)>=0}))}
  function highPainTwice(){var r=lastScored(2);return r.length>=2&&r.every(function(x){return avg(x.after)>=6||avg(x.before)>=6})}
  function insertAlert(){var old=document.querySelector('.health-alert');if(old)old.remove();var latest=lastRecords(1)[0];if(!latest||!hasScores(latest))return;var msg='';if(hasSerious(latest))msg='已记录刺痛、麻木、放射痛、关节卡住或明显无力等异常信号。建议暂停训练；若持续、加重或影响日常活动，请及时就医。';else if(highPainTwice())msg='最近连续2次疼痛评分达到6分或以上。建议暂停加量，降低训练强度；若持续不缓解，建议咨询医生或康复治疗师。';if(!msg)return;var div=document.createElement('div');div.className='health-alert';div.textContent=msg;var hero=document.querySelector('.hero');if(hero)hero.parentNode.insertBefore(div,hero)}
  function patchedCoach(){var el=document.getElementById('coach');if(!el)return;var latest=lastRecords(1)[0];if(latest&&!hasScores(latest)){el.className='warning';el.innerHTML='当前已启用每日打卡模式，不再根据打卡自动判断疼痛。训练中若出现刺痛、麻木、放射痛、关节卡住或明显无力，请暂停训练。<div class="coach-note">本提示不能替代医生诊断。</div>';return}var r=lastScored(1)[0];if(!r){el.className='warning';el.innerHTML='当前已启用每日打卡模式。完成训练后打卡即可；身体不适时不要为了连续打卡硬练。<div class="coach-note">本提示不能替代医生诊断。</div>';return}var b=avg(r.before),a=avg(r.after);if(hasSerious(r)){el.className='danger';el.innerHTML='建议暂停训练：最近一次详细记录包含异常信号。若症状持续存在，请及时就医。<div class="coach-note">此建议不能替代医生诊断。</div>'}else if(highPainTwice()){el.className='danger';el.innerHTML='建议就医/咨询康复专业人士：最近连续2次详细记录的疼痛评分达到6分或以上。<div class="coach-note">此建议仅基于历史评分，不能替代诊断。</div>'}else if(a-b>=2||a>=6){el.className='danger';el.innerHTML='建议降级：最近一次详细记录显示训练后评分升高较明显，或训练后评分较高。<div class="coach-note">若持续加重，请及时就医。</div>'}else{el.className='warning';el.innerHTML='当前已改为打卡模式。历史评分仅用于趋势参考，日常训练以动作质量和第二天反应为准。<div class="coach-note">出现异常信号时应暂停训练。</div>'}}
  function drawTrend(){var holder=document.getElementById('painTrendBox');if(!holder)return;var r=scoredRecords().slice(-14);if(r.length<2){holder.innerHTML='<div class="trend-empty">目前没有足够的历史评分记录。打卡模式不会自动生成疼痛评分。</div>';return}holder.innerHTML='<canvas class="trend-canvas" id="painTrendCanvas"></canvas>';var c=document.getElementById('painTrendCanvas'),dpr=window.devicePixelRatio||1,w=Math.max(280,holder.clientWidth-24),h=Math.max(220,holder.clientHeight-24);c.width=w*dpr;c.height=h*dpr;c.style.width=w+'px';c.style.height=h+'px';var ctx=c.getContext('2d');ctx.scale(dpr,dpr);var pad={l:34,r:12,t:18,b:34},cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;function x(i){return pad.l+(r.length===1?0:i*cw/(r.length-1))}function y(v){return pad.t+ch-(v/10)*ch}ctx.clearRect(0,0,w,h);ctx.lineWidth=1;ctx.strokeStyle='rgba(148,163,184,.35)';ctx.fillStyle='rgba(100,116,139,.9)';ctx.font='12px -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';[0,2,4,6,8,10].forEach(function(v){ctx.beginPath();ctx.moveTo(pad.l,y(v));ctx.lineTo(w-pad.r,y(v));ctx.stroke();ctx.fillText(v,pad.l-26,y(v)+4)});function line(key,color){ctx.beginPath();r.forEach(function(o,i){var v=avg(o[key]);if(i)ctx.lineTo(x(i),y(v));else ctx.moveTo(x(i),y(v))});ctx.lineWidth=3;ctx.strokeStyle=color;ctx.stroke();r.forEach(function(o,i){ctx.beginPath();ctx.arc(x(i),y(avg(o[key])),3.5,0,Math.PI*2);ctx.fillStyle=color;ctx.fill()})}line('before','#2563eb');line('after','#dc2626');ctx.fillStyle='rgba(100,116,139,.95)';r.forEach(function(o,i){if(i%Math.ceil(r.length/5)===0||i===r.length-1)ctx.fillText(o.date.slice(5),x(i)-14,h-10)});ctx.fillStyle='#2563eb';ctx.fillText('训练前',pad.l,14);ctx.fillStyle='#dc2626';ctx.fillText('训练后',pad.l+58,14)}
  function addTrend(){var report=document.getElementById('report');if(!report||document.getElementById('painTrendCard'))return;var card=document.createElement('div');card.className='trend-card';card.id='painTrendCard';card.innerHTML='<h3>历史疼痛趋势</h3><p class="sub">只显示过去真正填写过评分的记录；每日打卡不会生成新的疼痛评分。</p><div class="trend-wrap" id="painTrendBox"></div>';var cards=document.getElementById('reportCards');if(cards)cards.parentNode.insertBefore(card,cards.nextSibling);else report.appendChild(card);setTimeout(drawTrend,80)}
  function beep(){try{var A=window.AudioContext||window.webkitAudioContext;if(!A)return;var a=new A(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.06;o.start();setTimeout(function(){o.stop();a.close()},260)}catch(e){}}
  function notifyTimer(){if(navigator.vibrate)navigator.vibrate([180,80,180]);beep()}
  var oldTimerStart=window.timerStart;window.timerStart=function(type){if(type!=='rest'){oldTimerStart(type);return}var t=timers.rest;if(!t)return;if(t.on){clearInterval(t.id);t.on=false;t._endAt=null;return}t.on=true;t._endAt=Date.now()+t.seconds*1000;clearInterval(t.id);function tick(){var left=Math.max(0,Math.ceil((t._endAt-Date.now())/1000));t.seconds=left;var el=document.getElementById('restTime');if(el)el.textContent=fmt(left);if(left<=0){clearInterval(t.id);t.on=false;t._endAt=null;notifyTimer()}}tick();t.id=setInterval(tick,500)};
  var oldSave=window.saveRecord;window.saveRecord=function(){oldSave();setTimeout(function(){patchedCoach();insertAlert();addTrend();drawTrend()},100)};
  var oldClear=window.clearData;window.clearData=function(){var text='再次确认：清空后，本设备里的所有康复训练记录会删除。建议先导出JSON备份。请输入“清空”继续。';if(prompt(text)==='清空')oldClear()};
  var oldReport=window.renderReport;window.renderReport=function(){oldReport();addTrend();drawTrend()};
  window.showGuide=function(){var old=document.querySelector('.guide-backdrop');if(old)old.remove();var b=document.createElement('div');b.className='guide-backdrop';b.innerHTML='<div class="guide-modal"><h2>训练前先看这几条</h2><p>当前网页采用每日打卡模式，不要求填写评分。手机锁屏或浏览器进入后台后，系统仍可能暂停页面；休息计时会按实际时间自动校正。</p><ul><li>进阶：连续2次训练不加重、动作不耸肩不憋气，再小幅加量。</li><li>降级：第二天明显更酸、疼痛持续超过48小时，或动作代偿明显。</li><li>暂停/就医：刺痛、麻木、放射痛、关节卡住或明显无力。</li></ul><div class="guide-actions"><button class="btn primary" id="guideOk">我知道了</button><button class="btn" id="guideLater">下次再看</button></div></div>';document.body.appendChild(b);document.getElementById('guideOk').onclick=function(){localStorage.setItem('rehabGuideSeen','1');b.remove()};document.getElementById('guideLater').onclick=function(){b.remove()}};
  function addGuideButton(){var help=document.getElementById('help');if(help&&!document.getElementById('guideAgain')){var btn=document.createElement('button');btn.id='guideAgain';btn.className='btn primary';btn.textContent='重新查看进阶/降级规则';btn.onclick=window.showGuide;help.insertBefore(btn,help.children[1]||null)}}
  setTimeout(function(){patchedCoach();insertAlert();addTrend();addGuideButton();if(!localStorage.getItem('rehabGuideSeen'))window.showGuide()},700);
})();


/* ===== SOURCE: checkin-mode.js ===== */
(function(){
  var WAKE_KEY='rehabWakeLockEnabled';
  var wakeLock=null;
  var selectedCheckinDate=dateKey();
  function dateFromKey(key){var p=String(key||dateKey()).split('-').map(Number);return new Date(p[0],p[1]-1,p[2])}
  function weekForDate(key){var start=parseLocalDate(data.start||def.start),d=dateFromKey(key),startDay=new Date(start.getFullYear(),start.getMonth(),start.getDate()),target=new Date(d.getFullYear(),d.getMonth(),d.getDate());return Math.max(1,Math.min(20,Math.floor((target-startDay)/604800000)+1))}
  function selectedInfo(){var d=dateFromKey(selectedCheckinDate),week=weekForDate(selectedCheckinDate),day=d.getDay(),code=dkey[day],key=schedule(week)[code]||'rest';return {date:selectedCheckinDate,week:week,dayIndex:day,day:days[day],code:code,key:key,workout:W[key]?W[key][0]:W.rest[0]}}
  function doneRecords(){return Object.values(data.records||{}).filter(function(r){return r&&r.done}).sort(function(a,b){return b.date.localeCompare(a.date)})}
  function checkinStreak(){var n=0,d=new Date(),today=data.records[dateKey(d)];if(!today||!today.done)d.setDate(d.getDate()-1);while(true){var r=data.records[dateKey(d)];if(!r||!r.done)break;n++;d.setDate(d.getDate()-1)}return n}
  function monthCount(){var p=dateKey().slice(0,7);return doneRecords().filter(function(r){return r.date.slice(0,7)===p}).length}
  function completedExercises(){var info=selectedInfo(),ids=(W[info.key]&&W[info.key][2])||[],k=info.week+'-'+info.code+'-'+info.date,checks=(data.checks&&data.checks[k])||{};return {done:ids.filter(function(id){return !!checks[id]}).length,total:ids.length}}
  function safeText(v){return String(v||'').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}
  function renderRecent(){var root=document.getElementById('checkinRecent');if(!root)return;var arr=doneRecords().slice(0,10);if(!arr.length){root.innerHTML='<div class="checkin-empty">还没有打卡记录。完成训练后选择对应日期，再点击“一键打卡”。</div>';return}root.innerHTML=arr.map(function(r){var md=r.date.slice(5).split('-');return '<button type="button" class="checkin-item" data-checkin-date="'+safeText(r.date)+'"><div class="checkin-day"><b>'+md[1]+'</b>'+md[0]+'月</div><div class="checkin-item-title">'+safeText(r.workout||'康复训练')+'<div class="sub">'+safeText(r.day||'')+' · 第'+safeText(r.week||'-')+'周</div></div><span class="checkin-badge">已打卡</span></button>'}).join('');root.querySelectorAll('[data-checkin-date]').forEach(function(btn){btn.onclick=function(){setSelectedDate(btn.getAttribute('data-checkin-date'))}})}
  function updateSummary(){var total=doneRecords().length,st=checkinStreak();var a=document.getElementById('checkinStreak');if(a)a.textContent=st+'天';var b=document.getElementById('checkinTotal');if(b)b.textContent=total+'次';var c=document.getElementById('checkinMonth');if(c)c.textContent=monthCount()+'次';var m=document.getElementById('mDone');if(m)m.textContent=total+'次';var s=document.getElementById('mStreak');if(s)s.textContent=st+'天'}
  function setSelectedDate(key){var today=dateKey();if(!key)key=today;if(key>today)key=today;selectedCheckinDate=key;var input=document.getElementById('checkinDateInput');if(input)input.value=key;renderCheckinState()}
  function renderCheckinState(){var info=selectedInfo(),r=data.records[info.date],done=!!(r&&r.done),progress=completedExercises(),isToday=info.date===dateKey();var dateEl=document.getElementById('checkinDate');if(dateEl)dateEl.textContent=info.date+' · '+info.day+' · 第'+info.week+'周';var workoutEl=document.getElementById('checkinWorkout');if(workoutEl)workoutEl.textContent=info.workout;var p=document.getElementById('checkinProgress');if(p)p.textContent=progress.total?'该日期动作已勾选 '+progress.done+'/'+progress.total+' 项。未全部勾选也可以打卡。':'完成该日期安排后即可打卡。';var label=document.getElementById('checkinSelectedLabel');if(label)label.textContent=isToday?'今天':'所选锻炼日';var status=document.getElementById('checkinStatus');if(status){status.className='checkin-status'+(done?' done':'');status.innerHTML='<span class="checkin-dot"></span>'+(done?'该日期已经打卡':'该日期还没有打卡')}var btn=document.getElementById('checkinBtn');if(btn){btn.textContent=done?'该日期已打卡':'完成训练，一键打卡';btn.disabled=done}var undo=document.getElementById('undoCheckinBtn');if(undo){undo.hidden=!done;undo.textContent='取消该日期打卡'}updateSummary();renderRecent()}
  function doCheckin(){var info=selectedInfo(),old=data.records[info.date]||{};data.records[info.date]=Object.assign({},old,{date:info.date,week:info.week,day:info.day,workout:info.workout,done:true,checkin:true,checkinAt:new Date().toLocaleString(),updated:new Date().toLocaleString()});saveData();renderCheckinState();if(typeof renderCalendar==='function')renderCalendar();if(navigator.vibrate)navigator.vibrate(90)}
  function undoCheckin(){var info=selectedInfo(),r=data.records[info.date];if(!r)return;if(!confirm('取消 '+info.date+' 的打卡？'))return;var hasDetail=(r.note&&r.note.trim())||(r.flags&&r.flags.length)||(r.before&&Object.keys(r.before).length)||(r.after&&Object.keys(r.after).length);if(hasDetail){r.done=false;r.checkin=false;r.updated=new Date().toLocaleString()}else delete data.records[info.date];saveData();renderCheckinState();if(typeof renderCalendar==='function')renderCalendar()}
  function wakeSupported(){return 'wakeLock' in navigator}
  function setWakeStatus(text,active){document.querySelectorAll('[data-wake-status]').forEach(function(el){el.textContent=text;el.classList.toggle('active',!!active)});document.querySelectorAll('[data-wake-toggle]').forEach(function(btn){btn.textContent=active?'关闭屏幕常亮':'开启屏幕常亮';btn.classList.toggle('green',!!active)})}
  async function requestWake(){if(!wakeSupported()){setWakeStatus('当前浏览器不支持屏幕常亮',false);return false}try{if(wakeLock)return true;wakeLock=await navigator.wakeLock.request('screen');setWakeStatus('屏幕常亮已开启',true);wakeLock.addEventListener('release',function(){wakeLock=null;if(localStorage.getItem(WAKE_KEY)==='1')setWakeStatus('常亮已暂停，点按可重新开启',false);else setWakeStatus('屏幕常亮已关闭',false)});return true}catch(e){wakeLock=null;setWakeStatus('无法开启，请保持页面前台并再次点按',false);return false}}
  async function releaseWake(){try{if(wakeLock)await wakeLock.release()}catch(e){}wakeLock=null;setWakeStatus('屏幕常亮已关闭',false)}
  async function toggleWake(){var enabled=localStorage.getItem(WAKE_KEY)==='1';if(enabled&&wakeLock){localStorage.removeItem(WAKE_KEY);await releaseWake();return}if(enabled&&!wakeLock){await requestWake();return}localStorage.setItem(WAKE_KEY,'1');var ok=await requestWake();if(!ok&&!wakeSupported())localStorage.removeItem(WAKE_KEY)}
  function wakePanel(){return '<div class="wake-panel"><div class="wake-copy"><b>训练时保持屏幕常亮</b><p>开启后，训练和计时期间屏幕不会自动熄灭。离开页面或系统限制时可能暂停。</p></div><div class="wake-control"><span class="wake-status" data-wake-status>屏幕常亮已关闭</span><button class="btn primary" type="button" data-wake-toggle>开启屏幕常亮</button></div></div>'}
  function compatibilityNodes(){return '<div class="checkin-compat" hidden><input id="done" type="checkbox"><div id="beforeScores"></div><div id="afterScores"></div><div id="flags"></div><textarea id="note"></textarea><div id="history"></div></div>'}
  function datePicker(){return '<div class="checkin-date-picker"><label for="checkinDateInput">选择锻炼日期</label><div class="checkin-date-controls"><input class="search" id="checkinDateInput" type="date" max="'+dateKey()+'"><button class="btn" type="button" id="checkinTodayBtn">今天</button><button class="btn" type="button" id="checkinYesterdayBtn">昨天</button></div><p>凌晨补练时，可以选择昨天；也可以补打更早的训练日期。</p></div>'}
  function buildCheckin(){var root=document.getElementById('record');if(!root)return;root.innerHTML='<h2>每日打卡</h2><p class="sub">自由选择实际锻炼日期，完成后点击一键打卡。</p><div class="checkin-layout"><section class="checkin-card">'+datePicker()+'<div class="checkin-label" id="checkinSelectedLabel">今天</div><div class="checkin-date" id="checkinDate"></div><div class="checkin-workout" id="checkinWorkout"></div><p class="checkin-progress" id="checkinProgress"></p><div class="checkin-status" id="checkinStatus"><span class="checkin-dot"></span>该日期还没有打卡</div><div class="checkin-actions"><button class="btn green checkin-main-btn" id="checkinBtn">完成训练，一键打卡</button><button class="btn" id="undoCheckinBtn" hidden>取消该日期打卡</button></div><div class="checkin-safety">出现刺痛、麻木、放射痛、关节卡住或明显无力时，不要为了打卡继续硬练，应暂停训练并视情况就医。</div>'+wakePanel()+'</section><section class="checkin-card"><h3>打卡概览</h3><div class="checkin-summary"><div class="checkin-stat"><b id="checkinStreak">0天</b><span>连续打卡</span></div><div class="checkin-stat"><b id="checkinMonth">0次</b><span>本月打卡</span></div><div class="checkin-stat"><b id="checkinTotal">0次</b><span>累计打卡</span></div></div><h3>最近打卡</h3><div class="checkin-history" id="checkinRecent"></div><div class="checkin-backup"><button class="btn" id="checkinExport">导出备份</button><label class="btn">导入备份<input id="checkinImport" type="file" accept="application/json" hidden></label><button class="btn red" id="checkinClear">清空全部数据</button></div></section></div>'+compatibilityNodes();var input=document.getElementById('checkinDateInput');input.value=selectedCheckinDate;input.min=data.start||def.start;input.onchange=function(){setSelectedDate(input.value)};document.getElementById('checkinTodayBtn').onclick=function(){setSelectedDate(dateKey())};document.getElementById('checkinYesterdayBtn').onclick=function(){var d=new Date();d.setDate(d.getDate()-1);setSelectedDate(dateKey(d))};document.getElementById('checkinBtn').onclick=doCheckin;document.getElementById('undoCheckinBtn').onclick=undoCheckin;document.getElementById('checkinExport').onclick=exportJSON;document.getElementById('checkinImport').onchange=function(e){importJSON(e);setTimeout(renderCheckinState,350)};document.getElementById('checkinClear').onclick=clearData;root.querySelectorAll('[data-wake-toggle]').forEach(function(btn){btn.onclick=toggleWake});renderCheckinState()}
  function addTimerWakePanel(){var panel=document.getElementById('timer');if(!panel||panel.querySelector('.wake-panel'))return;var wrap=document.createElement('div');wrap.innerHTML=wakePanel();panel.insertBefore(wrap.firstChild,panel.querySelector('.timer'));panel.querySelectorAll('[data-wake-toggle]').forEach(function(btn){btn.onclick=toggleWake})}
  function renameUI(){if(typeof tabs!=='undefined'&&tabs[2])tabs[2][1]='每日打卡';var open=document.getElementById('openRecordBtn');if(open)open.textContent='完成后打卡';var a=document.getElementById('mStreak');if(a&&a.nextElementSibling)a.nextElementSibling.textContent='连续打卡';var b=document.getElementById('mDone');if(b&&b.nextElementSibling)b.nextElementSibling.textContent='累计打卡';if(typeof renderNav==='function')renderNav()}
  function installCompatibility(){try{var originalTop=renderTop;renderTop=function(){originalTop();updateSummary()}}catch(e){}try{loadTodayForm=function(){renderCheckinState()}}catch(e){}try{renderHistory=function(){renderRecent()}}catch(e){}}
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible'&&localStorage.getItem(WAKE_KEY)==='1')requestWake()});window.addEventListener('pagehide',function(){if(wakeLock)wakeLock.release().catch(function(){})});
  setTimeout(function(){installCompatibility();renameUI();buildCheckin();addTimerWakePanel();if(localStorage.getItem(WAKE_KEY)==='1')requestWake()},250);
})();

/* ===== SOURCE: checkin-coach.js ===== */
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


/* ===== SOURCE: layout-v3.js ===== */
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


/* ===== SOURCE: premium-v4.js ===== */
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
    if(orbit)orbit.style.setProperty('--progress',s.percent+'%');
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


/* ===== SOURCE: mobile-v5.js ===== */
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


/* ===== SOURCE: quality-audit-v8.js ===== */
(function(){
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
    var url=location.origin+location.pathname;
    try{
      if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);toast('网页地址已复制');return}
      var area=document.createElement('textarea');area.value=url;area.style.position='fixed';area.style.opacity='0';document.body.appendChild(area);area.select();var ok=document.execCommand('copy');area.remove();if(ok){toast('网页地址已复制');return}
      if(navigator.share){await navigator.share({title:document.title,url:url});return}
      throw new Error('copy failed');
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
        var safeRecords={};
        Object.keys(records).forEach(function(k){
          if(!/^\d{4}-\d{2}-\d{2}$/.test(k)||!plain(records[k]))return;
          var raw=records[k],rec=Object.assign({},raw,{date:k,done:!!raw.done,checkin:!!raw.checkin});
          rec.before=plain(raw.before)?raw.before:{};rec.after=plain(raw.after)?raw.after:{};rec.flags=Array.isArray(raw.flags)?raw.flags.filter(function(v){return typeof v==='string'}):[];
          rec.note=typeof raw.note==='string'?raw.note:'';rec.workout=typeof raw.workout==='string'?raw.workout:'康复训练';rec.day=typeof raw.day==='string'?raw.day:'';rec.week=Number.isFinite(Number(raw.week))?Number(raw.week):1;
          safeRecords[k]=rec;
        });
        var next=Object.assign({},def,imported,{records:safeRecords,checks:checks});
        if(typeof next.start!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(next.start))next.start=def.start;
        next.dark=!!next.dark;data=next;selectedWeek=weekNow();saveData();document.body.classList.toggle('dark',data.dark);if(document.getElementById('startDate'))document.getElementById('startDate').value=data.start;renderAll();toast('备份导入成功');
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

