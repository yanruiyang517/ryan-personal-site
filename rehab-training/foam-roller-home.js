(function () {
  'use strict';

  if (typeof E === 'undefined' || typeof W === 'undefined') return;

  var FOAM_IDS = [
    'foamChestOpen',
    'foamUpperBack',
    'foamThoracicExt',
    'foamLat',
    'foamGlute'
  ];

  E.foamChestOpen = [
    '居家训练前｜纵向仰卧胸廓打开',
    '60–90秒',
    '降低胸前紧张，帮助胸椎自然伸展，为肩胛控制、前锯肌训练和顺畅呼吸做准备。',
    '① 将泡沫轴纵向放在垫子中央，尾骨上方、整段脊柱和后脑勺都要有支撑；泡沫轴太短、头部悬空时不要勉强。<br>② 仰卧屈膝，双脚与髋同宽踩稳，骨盆保持自然中立，肋骨轻轻回收。<br>③ 双臂先打开成T字；肩前紧张明显时改成较低角度，能够放松后再弯肘成W字。<br>④ 鼻吸气时让胸廓向两侧和后方扩张，缓慢呼气时保持肩膀远离耳朵，全程不需要来回滚动。',
    '腰部只能保留自然弧度，不能为了“打开胸口”明显塌腰或挺肋；不要用力把肩膀压向地面。以轻柔拉伸感为准，出现肩前锐痛、手臂麻木或呼吸不适立即停止。',
    '仅居家训练 · 训练前'
  ];

  E.foamUpperBack = [
    '居家训练前｜泡沫轴上背慢滚',
    '45–60秒',
    '放松胸椎两侧和上背软组织，减少训练时耸肩、头前伸和腰部代偿。',
    '① 泡沫轴横放在肩胛骨下缘附近，双膝弯曲、双脚踩稳。<br>② 双手抱胸或抱住肩膀，让肩胛骨稍微向外打开；颈部保持自然，不要仰头。<br>③ 臀部只抬到能够控制的位置，用双腿带动身体，以约每秒2–3厘米的速度缓慢滚动。<br>④ 范围只在肩胛骨下缘到颈根下方的上背；遇到酸紧点可停10–15秒并正常呼吸，再继续移动。',
    '训练前力度控制在3–4/10，不要追求疼痛。禁止滚到颈椎、腰椎或直接碾压肩胛骨尖；不要快速来回冲击。出现刺痛、麻木、放射感或头晕立即停止。',
    '仅居家训练 · 训练前'
  ];

  E.foamThoracicExt = [
    '居家训练前｜泡沫轴胸椎分节伸展',
    '3个位置 × 每处3次',
    '改善胸椎伸展能力，让抬手、墙面滑手和肩胛上旋更容易由上背完成，而不是靠腰椎硬顶。',
    '① 泡沫轴横放在中上背，臀部留在地面，双脚踩稳。<br>② 双手托住后脑勺，手肘稍微向内，头部重量交给双手但不要拉脖子。<br>③ 先缓慢呼气、轻收肋骨，再让上背围绕泡沫轴向后展开；只到舒适范围，然后回到中立。<br>④ 完成3次后，将泡沫轴向上移动约2–3厘米，重复；总共选择3个胸椎位置。',
    '动作发生在上背，不是腰部。臀部不要抬起，腰椎不要明显拱起，颈部不要后仰。泡沫轴不能放在颈椎或腰椎正中；出现卡住、锐痛或眩晕立即停止。',
    '仅居家训练 · 训练前'
  ];

  E.foamLat = [
    '居家训练后｜泡沫轴背阔肌放松',
    '左右各30–45秒',
    '缓解腋后侧和背阔肌紧张，减少肩膀前扣，为肩胛自然上旋保留活动空间。',
    '① 侧躺，将泡沫轴放在腋窝下方约一掌的位置，压在侧背肌肉而不是腋窝正中心。<br>② 下侧手臂伸过头顶，拇指朝上；上侧手撑地帮助控制重量。<br>③ 身体轻微向后转，让压力落在腋后侧到肩胛骨外下方的肌肉。<br>④ 在约5–10厘米范围内慢慢滚动，酸紧点停10–15秒并保持呼吸，然后换侧。',
    '不要压腋窝正中心、肩关节、肋骨边缘或肩胛骨尖；不要把全部体重突然压上去。出现手臂麻木、触电感、放射痛或肩前疼痛立即停止。',
    '仅居家训练 · 训练后'
  ];

  E.foamGlute = [
    '居家训练后｜泡沫轴臀部放松',
    '左右各45秒',
    '缓解久坐和臀腿训练后的臀部紧张，减少腰部代偿，但不直接碾压腰椎。',
    '① 坐在泡沫轴上，双手在身后撑地，先把身体重心移向要放松的一侧。<br>② 将该侧脚踝放到对侧膝盖上，膝盖自然向外打开；无法稳定时保持双脚踩地即可。<br>③ 身体轻微向该侧倾斜，在臀部肌肉上做小范围前后、左右移动。<br>④ 找到酸紧点后停10–15秒，缓慢呼吸，压力下降后再继续，完成后换侧。',
    '不要滚骶骨、尾骨、髋骨外侧突出点或腰椎；力度保持3–5/10。若疼痛沿腿向下放射、出现麻木、针刺感或髋关节卡住，立即停止。',
    '仅居家训练 · 训练后'
  ];

  function patchHomeWorkout(key, beforeIds, afterIds) {
    var item = W[key];
    if (!item || !Array.isArray(item[2])) return;

    var baseIds = item[2].filter(function (id) {
      return FOAM_IDS.indexOf(id) === -1;
    });

    item[2] = beforeIds.concat(baseIds, afterIds);

    if (item[1].indexOf('泡沫轴仅用于居家训练') === -1) {
      item[1] += '；泡沫轴仅用于居家训练，按顺序完成训练前准备和训练后放松。';
    }
  }

  ['reset', 'light', 'A0', 'A1', 'A2', 'A2p'].forEach(function (key) {
    patchHomeWorkout(
      key,
      ['foamChestOpen', 'foamUpperBack', 'foamThoracicExt'],
      ['foamLat']
    );
  });

  ['B0', 'B1', 'B2', 'B2p'].forEach(function (key) {
    patchHomeWorkout(
      key,
      ['foamChestOpen', 'foamUpperBack'],
      ['foamGlute']
    );
  });

  var gymKeys = ['gymA', 'gymB', 'gymA2', 'gymB2', 'pullDay', 'pushDay', 'lower'];
  gymKeys.forEach(function (key) {
    if (!W[key] || !Array.isArray(W[key][2])) return;
    W[key][2] = W[key][2].filter(function (id) {
      return FOAM_IDS.indexOf(id) === -1;
    });
  });

  window.__rehabFoamRollerHomeOnly = {
    version: '2026-07-26',
    exerciseIds: FOAM_IDS.slice(),
    homeWorkoutKeys: ['reset', 'light', 'A0', 'A1', 'A2', 'A2p', 'B0', 'B1', 'B2', 'B2p'],
    excludedGymWorkoutKeys: gymKeys.slice()
  };

  function refreshAfterLoad() {
    if (typeof renderAll === 'function') renderAll();
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', refreshAfterLoad, { once: true });
  } else {
    refreshAfterLoad();
  }
})();
