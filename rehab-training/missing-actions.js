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
