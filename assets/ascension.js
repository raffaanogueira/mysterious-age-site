/* Mysterious Age · Ascension v4. Accessibility & small UX refinements. */
(()=>{'use strict';
 let toggle=null;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 let manualOverride=false;
 function paint(off){document.body.classList.toggle('motion-off',off);if(toggle){toggle.setAttribute('aria-pressed',String(off));toggle.textContent=off?'✧ Efeitos off':'✦ Efeitos';toggle.title=off?'Ativar efeitos visuais':'Desativar efeitos visuais'}
  const canvas=document.querySelector('#embers'),b=document.querySelector('#embers-toggle');
  if(canvas)canvas.style.visibility=off?'hidden':'';
  if(b){const running=b.getAttribute('aria-pressed')!=='false';if(running===off)b.click();b.title=off?'Efeitos desativados':'Partículas animadas'}
 }
 function init(){
   toggle=document.querySelector('#motion-switch');
   paint(reduce.matches);
   toggle?.addEventListener('click',()=>{manualOverride=true;paint(!document.body.classList.contains('motion-off'))});
   reduce.addEventListener?.('change',e=>{if(!manualOverride)paint(e.matches)});
   // Some browsers load reflowed webfonts late. Overflow guards ensure no awkward horizontal page scroll.
   document.querySelectorAll('img').forEach(img=>{img.addEventListener('error',()=>{img.classList.add('asset-missing')})});
   // Preserve anchor selection on pages that respond to hash fragments.
   if(location.hash&&document.querySelector('.pact-tabs')){
     const key=location.hash.substring(1).toLowerCase();
     const tab=document.querySelector('[data-pact="'+CSS.escape(key)+'"]');
     if(tab){requestAnimationFrame(()=>tab.scrollIntoView({block:'nearest'}))}
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
