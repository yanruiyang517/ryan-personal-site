function bindClick(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', fn);
}
function bindChange(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('change', fn);
}
function bindInput(id, fn) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', fn);
}
bindClick('darkBtn', toggleDark);
bindClick('printBtn', () => window.print());
bindClick('shareBtn', sharePage);
bindClick('saveStartBtn', saveStart);
bindClick('todayBtn', goToday);
bindClick('completeAllBtn', completeAll);
bindClick('clearChecksBtn', clearChecks);
bindClick('openRecordBtn', () => openTab('record'));
bindClick('trainTimerBtn', () => timerStart('train'));
bindClick('trainResetBtn', () => timerReset('train'));
bindClick('restTimerBtn', () => timerStart('rest'));
bindClick('restResetBtn', () => timerReset('rest'));
bindClick('breathBtn', breathToggle);
bindClick('saveRecordBtn', saveRecord);
bindClick('exportJsonBtn', exportJSON);
bindClick('exportCsvBtn', exportCSV);
bindClick('clearDataBtn', clearData);
bindChange('restSec', setRest);
bindChange('importFile', importJSON);
bindInput('q', renderLibrary);