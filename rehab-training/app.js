const KEY = 'rehabPro.v3';
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
function loadData(){return Object.assign({}, def, JSON.parse(localStorage.getItem(KEY) || '{}'))}
function saveData(){localStorage.setItem(KEY, JSON.stringify(data))}
function dateKey(d = new Date()){return d.toISOString().slice(0,10)}
function weekNow(){let start = new Date((data.start || def.start) + 'T00:00:00');let now = new Date();return Math.max(1, Math.min(20, Math.floor((now - start) / 604800000) + 1))}
function phaseOf(w){return phases.find(p => w >= p.f && w <= p.t) || phases[phases.length - 1]}
function dayCode(){return dkey[selectedDay]}
function workoutKey(){return schedule(selectedWeek)[dayCode()] || 'rest'}
function workout(){return W[workoutKey()] || W.rest}
function todayRecord(){return data.records[dateKey()]}
function init(){if(data.dark) document.body.classList.add('dark');$('startDate').value = data.start;renderNav();renderScoreInputs();renderAll()}
function renderNav(){$('nav').innerHTML = tabs.map(t => `<button class="btn ${t[0]===activeTab?'active':''}" onclick="openTab('${t[0]}')">${t[1]}</button>`).join('')}
function openTab(name){activeTab = name;document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));$(name).classList.add('active');renderNav();if(name === 'report') renderReport();if(name === 'plan') renderPlan();if(name === 'library') renderLibrary()}
function renderTop(){let records = Object.values(data.records);$('mToday').textContent = days[new Date().getDay()];$('mWeek').textContent = '第' + weekNow() + '周';$('mPhase').textContent = phaseOf(weekNow()).n.split('：')[0];$('mDone').textContent = records.length + '次';$('mStreak').textContent = streak() + '天';coach()}
function coach(){let list = Object.values(data.records).sort((a,b)=>b.date.localeCompare(a.date));let r = todayRecord() || list[0];let el = $('coach');if(!r){el.className = 'warning';el.textContent = '今天训练后保存一次记录，我会根据疼痛前后变化判断是否进阶、维持或降级。';return}let before = avg(r.before), after = avg(r.after), flags = (r.flags || []).length;if(flags || after - before >= 2 || after >= 7){el.className = 'danger';el.textContent = '建议降级：下次组数减半或退回上一阶段，并重点检查是否耸肩、憋气、腰顶。'}else if(after <= before && after <= 4){el.className = 'warning ok';el.textContent = '方向正确：不适没有加重，可以继续当前周；连续2次稳定后再小幅加量。'}else{el.className = 'warning';el.textContent = '建议维持：暂时不要加量，优先把动作做稳，尤其是不耸肩、不塌腰。'}}
function renderWeeks(){let html = '';for(let i=1;i<=20;i++){let p = phaseOf(i);html += `<button class="week ${i===selectedWeek?'active':''}" onclick="selectedWeek=${i};renderAll()">第${i}周<small>${p.n}</small></button>`}$('weeks').innerHTML = html}
function renderDays(){let order = [1,2,3,4,5,6,0];$('days').innerHTML = order.map(i => `<button class="day ${i===selectedDay?'active':''} ${i===new Date().getDay()&&selectedWeek===weekNow()?'today':''}" onclick="selectedDay=${i};renderAll()">${days[i]}</button>`).join('')}
function renderWorkout(){let w = workout();let p = phaseOf(selectedWeek);$('wTitle').textContent = w[0];$('wDesc').textContent = w[1];$('phaseTag').textContent = p.n;let ids = w[2];let checks = getChecks();$('exerciseList').innerHTML = ids.map((id,i) => exerciseCard(id,i,checks[id])).join('');let done = ids.filter(id => checks[id]).length;$('doneBar').style.width = (done / ids.length * 100 || 0) + '%'}
function exerciseCard(id, index, done=false){let e = E[id];return `<article class="exercise"><div class="ex-top"><div><h3>${index+1}. ${e[0]}</h3><div class="chips"><span class="chip">${e[1]}</span><span class="chip">${e[5]}</span></div></div><label class="check"><input type="checkbox" ${done?'checked':''} onchange="toggleCheck('${id}',this.checked)">完成</label></div><div class="cols"><div class="box"><b>目标</b><p>${e[2]}</p></div><div class="box"><b>细节</b><p>${e[3]}</p></div><div class="box"><b>注意</b><p>${e[4]}</p></div></div></article>`}
function checkKey(){return `${selectedWeek}-${dayCode()}-${dateKey()}`}
function getChecks(){return data.checks[checkKey()] || {}}
function toggleCheck(id, value){let key = checkKey();data.checks[key] = data.checks[key] || {};data.checks[key][id] = value;saveData();renderWorkout()}
function completeAll(){let key = checkKey();data.checks[key] = {};workout()[2].forEach(id => data.checks[key][id] = true);saveData();renderWorkout()}
function clearChecks(){data.checks[checkKey()] = {};saveData();renderWorkout()}
function renderScoreInputs(){['before','after'].forEach(type => {$(type + 'Scores').innerHTML = scoreNames.map(name => `<div class="score"><label>${name}</label><input type="range" min="0" max="10" value="0" data-${type}="${name}" oninput="this.nextElementSibling.textContent=this.value"><b>0</b></div>`).join('')});$('flags').innerHTML = flagNames.map(f => `<label class="check"><input type="checkbox" data-flag="${f}">${f}</label>`).join('')}
function readScores(type){let out = {};document.querySelectorAll(`[data-${type}]`).forEach(x => out[x.dataset[type]] = Number(x.value));return out}
function saveRecord(){let key = dateKey();data.records[key] = {date:key, week:selectedWeek, day:days[selectedDay], workout:workout()[0], done:$('done').checked || Object.values(getChecks()).some(Boolean), before:readScores('before'), after:readScores('after'), flags:[...document.querySelectorAll('[data-flag]:checked')].map(x => x.dataset.flag), note:$('note').value, checks:getChecks(), updated:new Date().toLocaleString()};saveData();renderAll();alert('已保存今日记录')}
function renderHistory(){let arr = Object.values(data.records).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12);$('history').innerHTML = arr.length ? arr.map(r => `<div class="hist"><b>${r.date} · ${r.workout}</b><small>第${r.week}周 · ${r.day} · ${r.done?'已完成':'未完成'} · 训练后均分 ${avg(r.after)}/10</small><p>${(r.flags||[]).length ? '异常：' + r.flags.join('、') : '无异常信号'}</p><p>${r.note || '无备注'}</p></div>`).join('') : '<p class="sub">还没有记录。</p>'}
function renderReport(){let arr = Object.values(data.records).sort((a,b)=>a.date.localeCompare(b.date));let last = arr.slice(-7);let done = last.filter(x => x.done).length;$('reportCards').innerHTML = `<div class="metric"><b>${done}/7</b><span>近7次完成</span></div><div class="metric"><b>${avgGroup(last,'before')}</b><span>训练前平均不适</span></div><div class="metric"><b>${avgGroup(last,'after')}</b><span>训练后平均不适</span></div>`;renderCalendar();let p = phaseOf(selectedWeek);$('criteria').innerHTML = p.c.map(x => `<label class="check"><input type="checkbox">${x}</label>`).join('') + '<p class="sub">满足多数标准且连续2次训练不加重，再进入下一阶段或小幅加量。</p>'}
function renderCalendar(){let now = new Date();let start = new Date(now);start.setDate(now.getDate() - 20);let html = '';for(let i=0;i<21;i++){let d = new Date(start);d.setDate(start.getDate()+i);let key = dateKey(d);let r = data.records[key];html += `<div class="cal ${r&&r.done?'done':''} ${key===dateKey()?'today':''}"><b>${key.slice(5)}</b><br>${days[d.getDay()]}<br>${r?'后'+avg(r.after)+'/10':''}</div>`}$('calendar').innerHTML = html}
function renderPlan(){let html = '';phases.forEach(p => {html += `<h3>${p.n}</h3><p class="sub">${p.g}</p><table><thead><tr><th>周数</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th><th>周日</th></tr></thead><tbody>`;for(let w=p.f;w<=p.t;w++){let s = schedule(w);html += `<tr><td>第${w}周</td>${[1,2,3,4,5,6,0].map(d => `<td>${W[s[dkey[d]] || 'rest'][0]}</td>`).join('')}</tr>`}html += '</tbody></table>'});$('fullPlan').innerHTML = html}
function renderLibrary(){let q = ($('q') && $('q').value || '').trim();let entries = Object.entries(E).filter(([id,e]) => !q || e.join('').includes(q));$('lib').innerHTML = entries.length ? entries.map(([id,e],i)=>exerciseCard(id,i,false)).join('') : '<p class="sub">没有找到动作。</p>'}
function renderAll(){renderTop();renderWeeks();renderDays();renderWorkout();renderHistory();if(activeTab==='report') renderReport();if(activeTab==='plan') renderPlan();if(activeTab==='library') renderLibrary()}
function avg(obj){let vals = Object.values(obj || {});return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0) / vals.length * 10) / 10 : 0}
function avgGroup(list, type){let vals = list.flatMap(r => Object.values(r[type] || {}));return vals.length ? Math.round(vals.reduce((a,b)=>a+b,0) / vals.length * 10) / 10 : 0}
function streak(){let n = 0;let d = new Date();while(data.records[dateKey(d)]){n++;d.setDate(d.getDate()-1)}return n}
function saveStart(){data.start = $('startDate').value || def.start;saveData();selectedWeek = weekNow();renderAll()}
function goToday(){selectedWeek = weekNow();selectedDay = new Date().getDay();openTab('today');renderAll()}
function toggleDark(){document.body.classList.toggle('dark');data.dark = document.body.classList.contains('dark');saveData()}
function sharePage(){navigator.clipboard && navigator.clipboard.writeText(location.href);alert('网址已复制')}
function exportJSON(){downloadFile('康复训练记录.json', JSON.stringify(data,null,2), 'application/json')}
function exportCSV(){let rows = ['date,week,day,workout,done,beforeAvg,afterAvg,flags,note'];Object.values(data.records).forEach(r => rows.push([r.date,r.week,r.day,r.workout,r.done,avg(r.before),avg(r.after),`"${(r.flags||[]).join('、')}"`,`"${(r.note||'').replaceAll('"','""')}"`].join(',')));downloadFile('康复训练记录.csv', rows.join('\n'), 'text/csv')}
function downloadFile(name,text,type){let a = document.createElement('a');a.href = URL.createObjectURL(new Blob([text],{type}));a.download = name;a.click();URL.revokeObjectURL(a.href)}
function importJSON(event){let file = event.target.files[0];if(!file) return;let reader = new FileReader();reader.onload = () => {try{data = Object.assign({}, def, JSON.parse(reader.result));saveData();renderAll();alert('导入成功')}catch(e){alert('导入失败')}};reader.readAsText(file)}
function clearData(){if(confirm('确定清空所有本地记录？')){localStorage.removeItem(KEY);data = loadData();renderAll()}}
function fmt(seconds){let m = Math.floor(seconds/60);let s = seconds % 60;return String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0')}
function timerStart(type){let t = timers[type];t.on = !t.on;if(t.on){t.id = setInterval(() => {if(type === 'train') t.seconds++;else t.seconds = Math.max(0, t.seconds - 1);$(type + 'Time').textContent = fmt(t.seconds);if(type === 'rest' && t.seconds === 0){t.on=false;clearInterval(t.id)}}, 1000)}else clearInterval(t.id)}
function timerReset(type){let t = timers[type];clearInterval(t.id);t.on = false;t.seconds = type === 'rest' ? Number($('restSec').value) : 0;$(type + 'Time').textContent = fmt(t.seconds)}
function setRest(){timerReset('rest')}
function breathToggle(){let t = timers.breath;t.on = !t.on;if(t.on){t.id = setInterval(() => {t.i++;$('breathText').textContent = t.i % 10 < 4 ? '吸气' : '呼气'},1000)}else clearInterval(t.id)}
init();