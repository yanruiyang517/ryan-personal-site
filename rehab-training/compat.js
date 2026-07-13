var structuredClone = typeof window.structuredClone === 'function'
  ? function(value){ return window.structuredClone(value); }
  : function(value){ return JSON.parse(JSON.stringify(value)); };
