(() => {
'use strict';
const config = window.MYSTERIOUS_CONFIG || {};
const $ = (s,ctx=document)=>ctx.querySelector(s);
const $$ = (s,ctx=document)=>[...ctx.querySelectorAll(s)];
const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)');
const icon = (name)=>`<svg aria-hidden="true" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round"><use href="#${name}"></use></svg>`;
// Actions configured externally; don't silently redirect to false URLs.
function toast(title, message) {
 let el = $('#site-toast'); if (!el) return;
 el.innerHTML = `<button type="button" aria-label="Fechar aviso" class="toast-close">×</button><h3></h3><p></p>`;
 $('h3',el).textContent=title;$('p',el).textContent=message;
 el.classList.add('visible');el.setAttribute('role','status');
 $('.toast-close',el).onclick=()=>el.classList.remove('visible');
 clearTimeout(window.__maToast);window.__maToast=setTimeout(()=>el.classList.remove('visible'),6500);
}
function externalLinks() {
 $$('[data-link]').forEach(el=>{
  const type=el.dataset.link, url=String(config[type+'Url']||'').trim();
  if (url && /^https?:\/\//i.test(url)){
    el.setAttribute('href',url);el.setAttribute('target','_blank');el.setAttribute('rel','noopener noreferrer');
  }else{
    el.setAttribute('href','#');
    el.addEventListener('click',e=>{e.preventDefault();toast('Link em preparação',type==='launcher'?'O link do launcher ainda não foi cadastrado. Configure launcherUrl em config.js.':type==='discord'?'O convite do Discord ainda não foi cadastrado. Configure discordUrl em config.js.':'Este endereço ainda não foi configurado em config.js.');});
  }
 });
}
function nav(){
 const h=$('.site-header'), n=$('#main-nav'), t=$('#menu-trigger');
 const update=()=>h?.classList.toggle('scrolled',window.scrollY>24);update();addEventListener('scroll',update,{passive:true});
 if(t && n){
  const close=()=>{n.classList.remove('mobile-open');t.setAttribute('aria-expanded','false');t.innerHTML=icon('menu');document.body.classList.remove('menu-open')};
  t.addEventListener('click',()=>{if(n.classList.contains('mobile-open'))close();else{n.classList.add('mobile-open');t.setAttribute('aria-expanded','true');t.innerHTML=icon('close');document.body.classList.add('menu-open')}});
  $$('#main-nav a').forEach(a=>a.addEventListener('click',close));
  addEventListener('resize',()=>{if(innerWidth>1220)close()});addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 }
}
function reveals(){
 const blocks=$$('.reveal');if(!('IntersectionObserver' in window)||prefersReduce.matches){blocks.forEach(x=>x.classList.add('visible'));return;}
 const observer=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');observer.unobserve(x.target)}}),{rootMargin:'0px 0px -30px 0px',threshold:.06}); blocks.forEach(x=>observer.observe(x));
}
// Fire/embers: DPR-aware canvas, minimal workload, respects reduced motion and tab visibility.
function fire(){
 const canvas=$('#embers');if(!canvas||prefersReduce.matches)return;
 let enabled=true, w=0,h=0,dpr=1,particles=[],frame=0,request=0;
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
 const resize=()=>{const b=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=b.width;h=b.height;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
 const newParticle=(base=false)=>({x:Math.random()*w,y:base?Math.random()*h:h+15,r:Math.random()*1.55+.3,vx:(Math.random()-.5)*.66,vy:-(.28+Math.random()*1.3),life:Math.random()*.75+.25,t:Math.random()*6,red:Math.random()>.75});
 const init=()=>{resize();particles=Array.from({length:Math.min(100,Math.max(28,Math.floor(w/14)))},()=>newParticle(true))};
 function tick(){if(!enabled||document.hidden)return;ctx.clearRect(0,0,w,h);frame++;
  for(let i=0;i<particles.length;i++){
   const p=particles[i];p.x+=p.vx+Math.sin(frame*.012+p.t)*.12;p.y+=p.vy;p.life-=.0015;
   if(p.y<-10||p.life<=0||p.x<0||p.x>w){particles[i]=newParticle();continue}
   const alpha=Math.max(0,Math.min(.88,p.life*.95))*(p.y<h*.22?.5:1);
   ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.red?`rgba(255,69,34,${alpha})`:`rgba(255,164,77,${alpha})`;ctx.fill();
   if(p.r>1.1){ctx.beginPath();ctx.arc(p.x,p.y,p.r*3.5,0,Math.PI*2);ctx.fillStyle=`rgba(251,58,22,${alpha*.06})`;ctx.fill()}
  }request=requestAnimationFrame(tick)
 }
 init();tick();
 let ro;if('ResizeObserver' in window){ro=new ResizeObserver(init);ro.observe(canvas)}else addEventListener('resize',init);
 document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(request);if(!document.hidden&&enabled)tick()});
 const toggle=$('#embers-toggle');if(toggle)toggle.addEventListener('click',()=>{enabled=!enabled;toggle.setAttribute('aria-pressed',String(enabled));toggle.setAttribute('title',enabled?'Desativar partículas':'Ativar partículas');canvas.style.opacity=enabled?'':'0';cancelAnimationFrame(request);if(enabled)tick()});
}
function tilt(){if(prefersReduce.matches)return;const hero=$('.hero');if(!hero||matchMedia('(max-width:980px)').matches)return;
 let raf=0;hero.addEventListener('pointermove',e=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{const x=(e.clientX/innerWidth-.5)*9,y=(e.clientY/innerHeight-.5)*8;const warrior=$('.hero-warrior');if(warrior)warrior.style.transform=`translate(${x*-.9}px,${y*.35}px)`;})});hero.addEventListener('pointerleave',()=>{const warrior=$('.hero-warrior');if(warrior)warrior.style.transform=''})
}
const PACTS={
 'mystar':{name:"Mystar",line:"O domínio arcano",tag:"Sabedoria e magia",desc:"Um caminho de conhecimento, magia e evolução. A força de Mystar nasce de escolhas conscientes e de sua conexão com o poder arcano.",keywords:["Sabedoria e magia", "Evolução de Pacto", "Estilo de jogo"]},
 'valyron':{name:"Valyron",line:"A força da resistência",tag:"Disciplina e defesa",desc:"Para aventureiros que valorizam disciplina e sobrevivência. Firmeza para encarar batalhas longas e perigos crescentes.",keywords:["Disciplina e defesa", "Evolução de Pacto", "Estilo de jogo"]},
 'labora':{name:"Labora",line:"A marca da dedicação",tag:"Ofício e dedicação",desc:"Uma trilha de construção, perseverança e aprimoramento contínuo. Cada conquista começa com o trabalho de quem não desiste.",keywords:["Ofício e dedicação", "Evolução de Pacto", "Estilo de jogo"]},
 'elixia':{name:"Elixia",line:"A arte da alquimia",tag:"Alquimia e elixires",desc:"Preparo, elixires e estratégias especiais. A força de quem transforma conhecimento em recursos na hora decisiva.",keywords:["Alquimia e elixires", "Evolução de Pacto", "Estilo de jogo"]},
 'bestiar':{name:"Bestiar",line:"O elo com as criaturas",tag:"Criaturas e domínio",desc:"Um caminho dedicado ao vínculo com criaturas, à evolução dos companheiros e à jornada de quem escolhe explorar com aliados extraordinários.",keywords:["Criaturas e domínio", "Evolução de Pacto", "Estilo de jogo"]},
 'sagaris':{name:"Sagaris",line:"O espírito da conquista",tag:"Combate e conquista",desc:"Um caminho para aqueles que buscam superar desafios, avançar em sua jornada e deixar sua marca no campo de batalha.",keywords:["Combate e conquista", "Evolução de Pacto", "Estilo de jogo"]},
 'bastion':{name:"Bastion",line:"A vontade inabalável",tag:"Proteção e firmeza",desc:"Firme como uma fortaleza: uma identidade de persistência, proteção e determinação diante dos desafios do mundo.",keywords:["Proteção e firmeza", "Evolução de Pacto", "Estilo de jogo"]},
 'nocthar':{name:"Nocthar",line:"O poder das sombras",tag:"Mistério e sombras",desc:"Uma trilha envolta em mistério, segredos e escolhas próprias para os que não temem enfrentar o desconhecido.",keywords:["Mistério e sombras", "Evolução de Pacto", "Estilo de jogo"]}
};
function pacts(){
 const panel=$('#pact-info');if(!panel)return;
 function select(key, updateHash=false){const p=PACTS[key];if(!p)return;$$('.pact-tab').forEach(b=>{const on=b.dataset.pact===key;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1});panel.innerHTML=`<div class="eyebrow">${p.tag}</div><h3>${p.name}</h3><div class="kicker">${p.line}</div><p>${p.desc}</p><div class="pact-features">${p.keywords.map(t=>`<span>${t}</span>`).join('')}</div><a href="guia.html#pactos" class="text-link">Entenda a progressão ${icon('arrow')}</a>`;
  if(updateHash && location.hash.slice(1)!==key)history.replaceState(null,'','#'+key)
 }
 $$('.pact-tab').forEach(b=>{b.addEventListener('click',()=>select(b.dataset.pact,true));b.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(e.key))return;e.preventDefault();const list=$$('.pact-tab'),i=list.indexOf(b),j=(i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1)+list.length)%list.length;list[j].focus();select(list[j].dataset.pact,true)})});
 select(PACTS[location.hash.slice(1)]?location.hash.slice(1):'mystar');
}
const ARTICLES=[
 {slug:'pactos',category:'Sistemas',title:'Pactos: forje seu próprio caminho',teaser:'Descubra o que torna a progressão por Pactos uma parte central da experiência Mysterious.',image:'pactos',intro:'O poder tem muitas formas. No Mysterious, sua trajetória é marcada pelas escolhas que faz ao longo da jornada.',paragraphs:['Os Pactos dão identidade à evolução de cada personagem. São caminhos de especialização que se relacionam com estilos de jogo distintos e recompensam a dedicação em aventuras de longo prazo.','Entre as possibilidades do universo do shard estão os Pactos Mystar, Valyron, Labora, Elixia, Bestiar, Sagaris, Bastion e Nocthar. Cada um propõe uma maneira diferente de pensar combate, progresso e estratégia.','Quer conhecer os caminhos disponíveis? Acesse a página de Sistemas e explore cada Pacto no painel interativo.']},
 {slug:'guild-dungeons',category:'Aventuras',title:'Guild Dungeons: a força da sua aliança',teaser:'Aventure-se em masmorras coletivas, enfrente criaturas e conquiste vitórias em equipe.',image:'dungeons',intro:'Algumas batalhas não foram feitas para serem enfrentadas sozinho.',paragraphs:['As Guild Dungeons transformam uma guilda em uma verdadeira equipe de exploração. Coordenação, disciplina e preparação fazem parte da experiência.','Avançar por áreas perigosas exige uma combinação de funções: guerreiros que sustentam a linha de frente, magos atentos e companheiros prontos para responder a cada ameaça.','Uma vitória compartilhada pode virar a próxima história da sua guilda.']},
 {slug:'bosses',category:'Aventuras',title:'Os grandes chefes não perdoam',teaser:'Conheça a proposta das batalhas mais difíceis do Mysterious e prepare seu grupo.',image:'bosses',intro:'Nem toda criatura é apenas mais um inimigo no caminho.',paragraphs:['Bosses são encontros que colocam equipamentos, comunicação e estratégia à prova. Algumas lutas apresentam novas ameaças durante o confronto, exigindo atenção até o último instante.','O mundo Mysterious reúne desafios para jogadores que buscam evolução e também para grupos veteranos em busca de conquistas.','Organize seus companheiros, conheça suas habilidades e enfrente a batalha preparado.']},
 {slug:'bestiar',category:'Sistemas',title:'Bestiar: sua aventura tem companheiros',teaser:'Explore o universo dos domadores e seu vínculo com criaturas do mundo.',image:'events',intro:'Há guerreiros que escolhem a espada. Outros constroem sua força lado a lado com uma criatura.',paragraphs:['O universo de Taming tem um papel especial no Mysterious. O sistema Bestiar amplia a identidade de personagens que valorizam o treinamento e o vínculo com seus companheiros.','No caminho de um domador, conquistar confiança é tão importante quanto vencer em combate. Entender seu estilo e aprender a trabalhar com criaturas faz parte da jornada.','Acompanhe nossos canais oficiais para novidades sobre atualizações do sistema.']},
 {slug:'aventura-em-malas',category:'Mundo',title:'Além do familiar: os desafios de Malas',teaser:'Territórios hostis e encontros para aventureiros em busca de novos desafios.',image:'news-castle',intro:'Existem regiões em que a preparação é tão importante quanto a coragem.',paragraphs:['Malas integra o universo de aventuras do shard e faz parte de uma etapa de desafios para jogadores que buscam conteúdo mais exigente.','O domínio das habilidades, a qualidade dos equipamentos e o trabalho em equipe passam a fazer diferença conforme os perigos aumentam.','Explore com cuidado. Um caminho desconhecido pode guardar tanto recompensas quanto perigos.']},
 {slug:'primeiros-passos',category:'Guias',title:'Seus primeiros passos no Mysterious',teaser:'Tudo começa com o launcher, um personagem e a vontade de escrever uma nova história.',image:'news-community',intro:'Todo herói precisa começar em algum lugar.',paragraphs:['O primeiro passo é obter o launcher oficial e preparar o cliente de jogo. A página Como Jogar reúne o caminho recomendado para começar.','Ao entrar, conheça o mundo, aprenda as mecânicas de sua profissão e explore o sistema de Pactos para definir os objetivos do personagem.','Se precisar de ajuda, a comunidade é o lugar ideal para tirar dúvidas e conhecer outros aventureiros.']}
];
function news(){const root=$('#news-list');if(!root)return;const filters=$$('[data-filter]'),search=$('#news-search');let selected='Todos';
 function render(){const q=(search?.value||'').trim().toLocaleLowerCase('pt-BR');const list=ARTICLES.filter(a=>(selected==='Todos'||selected===a.category)&&`${a.title} ${a.teaser} ${a.category}`.toLocaleLowerCase('pt-BR').includes(q));
  root.innerHTML=list.length?list.map(a=>`<article class="news-card"><a href="artigo.html?slug=${encodeURIComponent(a.slug)}" class="news-image" aria-label="Abrir: ${a.title}"><img loading="lazy" src="assets/img/${a.image}.webp" alt="Ilustração do universo medieval Mysterious"></a><div class="news-body"><span class="news-meta">${a.category} · Crônica do shard</span><h3>${a.title}</h3><p>${a.teaser}</p><a class="text-link" href="artigo.html?slug=${encodeURIComponent(a.slug)}">Ler crônica ${icon('arrow')}</a></div></article>`).join(''):'<div class="empty-state" style="grid-column:1/-1">Nenhuma crônica corresponde à sua pesquisa. Experimente outra palavra.</div>';
 }
 filters.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;filters.forEach(x=>x.classList.toggle('active',x===b));render()}));if(search)search.addEventListener('input',render);render();}
function article(){const root=$('#article-container');if(!root)return;const slug=new URLSearchParams(location.search).get('slug');const a=ARTICLES.find(a=>a.slug===slug);if(!a){root.innerHTML='<h1>Crônica não encontrada</h1><p>Este conteúdo não está disponível.</p><a href="noticias.html" class="btn btn-secondary">Voltar às crônicas</a>';return}
 document.title=a.title+' | Mysterious Age Shard';root.innerHTML=`<div class="breadcrumbs"><a href="index.html">Início</a> / <a href="noticias.html">Crônicas</a> / <b>${a.category}</b></div><div class="eyebrow">${a.category} · Crônica do shard</div><h1 class="section-title">${a.title}</h1><p class="article-intro">${a.intro}</p><img class="article-hero-image" src="assets/img/${a.image}.webp" alt="Arte medieval representando ${a.title}"><div class="hairline"></div>${a.paragraphs.map((t,i)=>`<p>${t}</p>`).join('')}<div class="back-link"><a href="noticias.html" class="btn btn-secondary">${icon('arrow')} Voltar às crônicas</a></div>`;
}
function setup(){nav();externalLinks();reveals();fire();tilt();pacts();news();article();$$('[data-year]').forEach(el=>el.textContent=String(new Date().getFullYear()));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();


// RANKING MYSTERIOUS AGE - link unico para todas as paginas.
(function () {
  function montarAcessoRanking() {
    var nav = document.getElementById('main-nav');
    if (nav && !nav.querySelector('[data-page="ranking"]')) {
      var link = document.createElement('a');
      link.href = 'ranking.html';
      link.textContent = 'Ranking';
      link.setAttribute('data-page', 'ranking');
      if (/\/ranking\.html(?:$|[?#])/i.test(location.pathname + location.search + location.hash)) {
        link.className = 'active';
        link.setAttribute('aria-current', 'page');
      }
      var best = nav.querySelector('[data-page="bestiario"]');
      nav.insertBefore(link, best || null);
    }
    var footer = document.querySelector('.footer-grid .footer-col');
    if (footer && !footer.querySelector('[href="ranking.html"]')) {
      var a = document.createElement('a');
      a.href = 'ranking.html';
      a.textContent = 'Ranking PvM e Fama';
      footer.appendChild(a);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montarAcessoRanking, {once:true});
  else montarAcessoRanking();
}());
