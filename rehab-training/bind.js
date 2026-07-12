// Final mobile layout patch and full plan redesign loader. app.html loads this file last.
(function(){
  var css = `
  @media(max-width:920px){
    html,body{overflow-x:hidden!important;max-width:100%!important}
    .app{padding:12px 12px 112px!important;max-width:100%!important}
    .hero,.layout,.formgrid,.grid2,.grid3,.cols,.history{display:grid!important;grid-template-columns:1fr!important;gap:14px!important}
    .card{padding:16px!important;overflow:hidden!important}
    .actions,.tools,#record .tools{display:grid!important;grid-template-columns:1fr!important;gap:12px!important;width:100%!important}
    .actions .btn,.tools .btn,#record .tools .btn{width:100%!important;min-width:0!important;margin:0!important;min-height:48px!important}
    .metrics{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
    .side{position:static!important;width:100%!important}
    .weeks{max-height:none!important;overflow:visible!important;gap:10px!important}
    button.week{display:grid!important;grid-template-columns:64px minmax(0,1fr)!important;width:100%!important;min-height:68px!important;padding:12px!important}
    .week-number{white-space:nowrap!important}.week-title{font-size:13px!important;line-height:1.35!important}
    .days{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
    #timer .timer,#timer .timer .box{display:grid!important;grid-template-columns:1fr!important;gap:12px!important}
    #timer .timer .box>button.btn{width:100%!important;min-width:0!important;margin:0!important}
    .calendar{grid-template-columns:repeat(2,1fr)!important}
    .nav{position:fixed!important;left:10px!important;right:10px!important;bottom:10px!important;top:auto!important;z-index:100!important;overflow-x:auto!important;gap:8px!important;padding:8px!important}
    .nav .btn{flex:0 0 auto!important;min-width:max-content!important;font-size:13px!important}
  }`;
  var s=document.createElement('style');s.setAttribute('data-mobile-audit','true');s.textContent=css;document.head.appendChild(s);
  var l=document.createElement('link');l.rel='stylesheet';l.href='plan-redesign.css?v=0713p';document.head.appendChild(l);
  var j=document.createElement('script');j.src='plan-redesign.js?v=0713p';document.body.appendChild(j);
})();