/* Mysterious Age — Legendary v3: enhancements, all progressive and dependency-free. */
(()=>{'use strict';
 const $=(s,c=document)=>c.querySelector(s);
 const $$=(s,c=document)=>Array.from(c.querySelectorAll(s));
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 function progress(){
  const bar=$('#reading-progress'),back=$('#back-to-top');if(!bar&&!back)return;
  let busy=false;
  const update=()=>{const h=Math.max(1,document.documentElement.scrollHeight-innerHeight);const y=Math.max(0,scrollY);if(bar)bar.style.width=(Math.min(1,y/h)*100).toFixed(2)+'%';if(back)back.classList.toggle('is-visible',y>640);busy=false};
  update();addEventListener('scroll',()=>{if(!busy){busy=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);
 }
 const pacts={
  mystar:{symbol:"✧",name:"Mystar",subtitle:"O domínio arcano",text:"Um caminho de conhecimento, magia e evolução. A força de Mystar nasce de escolhas conscientes e de sua conexão com o poder arcano."},
  valyron:{symbol:"♜",name:"Valyron",subtitle:"A força da resistência",text:"Para aventureiros que valorizam disciplina e sobrevivência. Firmeza para encarar batalhas longas e perigos crescentes."},
  labora:{symbol:"⚒",name:"Labora",subtitle:"A marca da dedicação",text:"Uma trilha de construção, perseverança e aprimoramento contínuo. Cada conquista começa com o trabalho de quem não desiste."},
  elixia:{symbol:"✥",name:"Elixia",subtitle:"A arte da alquimia",text:"Preparo, elixires e estratégias especiais. A força de quem transforma conhecimento em recursos na hora decisiva."},
  bestiar:{symbol:"♞",name:"Bestiar",subtitle:"O elo com as criaturas",text:"Um caminho dedicado ao vínculo com criaturas, à evolução dos companheiros e à jornada de quem escolhe explorar com aliados extraordinários."},
  sagaris:{symbol:"⚔",name:"Sagaris",subtitle:"O espírito da conquista",text:"Um caminho para aqueles que buscam superar desafios, avançar em sua jornada e deixar sua marca no campo de batalha."},
  bastion:{symbol:"⬡",name:"Bastion",subtitle:"A vontade inabalável",text:"Firme como uma fortaleza: uma identidade de persistência, proteção e determinação diante dos desafios do mundo."},
  nocthar:{symbol:"☾",name:"Nocthar",subtitle:"O poder das sombras",text:"Uma trilha envolta em mistério, segredos e escolhas próprias para os que não temem enfrentar o desconhecido."}
 };
 function altar(){
  const buttons=$$('[data-altar]'),box=$('#altar-display');if(!box||!buttons.length)return;
  const name=$('#altar-title'),description=$('#altar-description'),symbol=$('#altar-symbol'),detail=$('#altar-detail');
  function select(key,focus){const p=pacts[key];if(!p)return;
   buttons.forEach(b=>{const active=b.dataset.altar===key;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
   name.innerHTML=p.name+' <small>· '+p.subtitle+'</small>'; description.textContent=p.text;symbol.textContent=p.symbol;detail.href='sistemas.html#'+key;
   box.classList.remove('is-changing');void box.offsetWidth;box.classList.add('is-changing');
   if(focus)buttons.find(b=>b.dataset.altar===key)?.focus();
  }
  buttons.forEach((b,i)=>{b.addEventListener('click',()=>select(b.dataset.altar,false));b.addEventListener('keydown',e=>{if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;e.preventDefault();let idx=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;select(buttons[idx].dataset.altar,true)})});
 }
 const monsters={
  mordrak:{title:'Mordrak, o Rei Escarlate',sub:'Castelo Escarlate · Grande chefe',text:'Um poderoso chefe de Guild Dungeon. Sua legião participa do confronto, e momentos decisivos exigem coordenação e preparação. O progresso do grupo importa tanto quanto o equipamento.'},
  firetryx:{title:'Firetryx',sub:'Ameaça elemental · Fogo',text:'A presença das chamas vivas obriga a equipe a manter atenção ao campo de batalha, e não apenas ao inimigo principal. Preparação e posicionamento fazem a diferença.'},
  frostryx:{title:'Frostryx',sub:'Ameaça elemental · Gelo',text:'Onde as geadas vivas surgem, cada segundo pode exigir uma decisão. Conheça o encontro e encontre aliados para enfrentar o desafio.'},
  bruthekk:{title:'Bruthekk',sub:'Colosso · Grande chefe',text:'Força bruta e presença intimidadora definem este inimigo. Enfrentá-lo requer disciplina, boa estratégia de grupo e coragem.'},
  legionario:{title:'Legionário Escarlate',sub:'Criatura · Combate',text:'Parte da ameaça escarlate, uma figura de guerra que reforça o perigo do castelo e de seus confrontos. Mesmo os inimigos menores merecem respeito.'},
  imp:{title:'Imp Tormentoso',sub:'Criatura · Magia',text:'Um adversário que utiliza magia de fogo. Seus ataques lembram aos aventureiros que tamanho e ameaça nem sempre caminham juntos.'}
 };
 function bestiary(){
  const cards=$$('.beast-card'),filters=$$('[data-beast-filter]'),dialog=$('#beast-dialog');if(!cards.length)return;
  filters.forEach(f=>f.addEventListener('click',()=>{
   const type=f.dataset.beastFilter;filters.forEach(b=>{const active=b===f;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
   cards.forEach(c=>{c.hidden=type!=='all'&&c.dataset.beastType!==type});
  }));
  if(!dialog||typeof dialog.showModal!=='function')return;
  const closer=$('.dialog-close',dialog);
  function close(){dialog.close()}
  closer?.addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
  $$('[data-beast]').forEach(b=>b.addEventListener('click',()=>{const item=monsters[b.dataset.beast];if(!item)return;$('#beast-dialog-title').textContent=item.title;$('#beast-dialog-subtitle').textContent=item.sub;$('#beast-dialog-text').textContent=item.text;dialog.showModal()}));
  if(location.hash==='#mordrak')setTimeout(()=>{const c=$('#mordrak');if(c){c.classList.add('visible');c.scrollIntoView({block:'center',behavior:reduced.matches?'instant':'smooth'})}},100);
 }
 function enhanceMenu(){
  const nav=$('#main-nav'),t=$('#menu-trigger');if(!nav||!t)return;
  const update=()=>{t.setAttribute('aria-label',nav.classList.contains('mobile-open')?'Fechar menu':'Abrir menu')};
  t.addEventListener('click',()=>requestAnimationFrame(update));
  const mq=matchMedia('(max-width:1220px)');
  const reset=()=>{if(!mq.matches&&nav.classList.contains('mobile-open')){nav.classList.remove('mobile-open');document.body.classList.remove('menu-open');t.setAttribute('aria-expanded','false');t.setAttribute('aria-label','Abrir menu');t.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.8"><path d="M4 6h16M4 12h16M4 18h16"/></svg>'}};
  mq.addEventListener?.('change',reset);
  $$('a',nav).forEach(link=>link.addEventListener('click',()=>{if(nav.classList.contains('mobile-open')){t.setAttribute('aria-label','Abrir menu')}}));
 }
 function init(){progress();altar();bestiary();enhanceMenu()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
