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
