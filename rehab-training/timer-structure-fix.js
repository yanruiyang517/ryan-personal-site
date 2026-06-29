function fixTimerControls() {
  const timer = document.querySelector('#timer .timer');
  if (!timer || timer.dataset.fixed === '1') return;
  timer.dataset.fixed = '1';

  const boxes = timer.querySelectorAll('.box');
  boxes.forEach((box) => {
    const buttons = Array.from(box.querySelectorAll('button.btn'));
    if (!buttons.length) return;
    const row = document.createElement('div');
    row.className = 'timer-actions-row';
    buttons[0].parentNode.insertBefore(row, buttons[0]);
    buttons.forEach((button) => row.appendChild(button));
  });
}

function injectTimerStructureStyle() {
  if (document.getElementById('timer-structure-style')) return;
  const style = document.createElement('style');
  style.id = 'timer-structure-style';
  style.textContent = `
    #timer .timer .box {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: flex-start !important;
      gap: 14px !important;
      text-align: center !important;
    }
    #timer .timer .box > .search,
    #timer .timer .box > select {
      width: 100% !important;
      margin: 2px 0 0 0 !important;
    }
    #timer .timer .timer-actions-row {
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 16px !important;
      width: 100% !important;
      margin-top: 2px !important;
      flex-wrap: wrap !important;
    }
    #timer .timer .timer-actions-row .btn {
      margin: 0 !important;
      min-width: 112px !important;
      white-space: nowrap !important;
    }
    #timer .timer .timer-actions-row .btn.primary {
      min-width: 136px !important;
    }
    @media (max-width: 920px) {
      #timer .timer .timer-actions-row {
        display: grid !important;
        grid-template-columns: 1fr !important;
        gap: 10px !important;
      }
      #timer .timer .timer-actions-row .btn {
        width: 100% !important;
        min-width: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);
}

function applyTimerFix() {
  injectTimerStructureStyle();
  fixTimerControls();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyTimerFix);
} else {
  applyTimerFix();
}
setTimeout(applyTimerFix, 300);
setTimeout(applyTimerFix, 1000);
