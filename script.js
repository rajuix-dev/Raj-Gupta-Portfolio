(function(){
  // mobile menu
  var burger=document.getElementById('burger'), links=document.getElementById('links');
  burger.addEventListener('click',function(){
    var s=links.classList.toggle('show'); burger.setAttribute('aria-expanded',s);
  });
  links.addEventListener('click',function(e){ if(e.target.tagName==='A'){links.classList.remove('show');burger.setAttribute('aria-expanded','false');} });

  // skill meters (4 segments)
  document.querySelectorAll('.meter').forEach(function(m){
    var l=+m.dataset.l;
    for(var i=0;i<4;i++){var b=document.createElement('i'); if(i<l) b.className='f'; m.appendChild(b);}
  });
  var cards=document.querySelectorAll('.skill-card');
  var cio=new IntersectionObserver(function(es){es.forEach(function(e){ if(e.isIntersecting){e.target.classList.add('in');cio.unobserve(e.target);} });},{threshold:.35});
  cards.forEach(function(c){cio.observe(c);});

  // counters
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting) return; sio.unobserve(e.target);
    var el=e.target, to=+el.dataset.n; if(reduce){el.textContent=to;return;}
    var t0=performance.now();
    (function step(t){var p=Math.min((t-t0)/900,1); el.textContent=Math.round(to*(1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(step);})(t0);
  });},{threshold:.6});
  document.querySelectorAll('.stat b').forEach(function(b){sio.observe(b);});

  // active nav link
  var map={};
  links.querySelectorAll('a').forEach(function(a){map[a.getAttribute('href').slice(1)]=a;});
  var nio=new IntersectionObserver(function(es){es.forEach(function(e){
    if(e.isIntersecting && map[e.target.id]){
      Object.keys(map).forEach(function(k){map[k].classList.remove('on');});
      map[e.target.id].classList.add('on');
    }
  });},{rootMargin:'-45% 0px -50% 0px'});
  Object.keys(map).forEach(function(k){var s=document.getElementById(k); if(s) nio.observe(s);});

  // contact form: sends straight to your inbox with EmailJS (no mail app opens)
  // Fill these three in from your EmailJS dashboard
  var EMAILJS_PUBLIC_KEY='astmiG8XvJkl1qjH3';
  var EMAILJS_SERVICE_ID='service_yy024al';
  var EMAILJS_TEMPLATE_ID='template_p6dohh8';

  var form=document.getElementById('form'), send=document.getElementById('send'), note=document.getElementById('form-status');
  if(window.emailjs){ emailjs.init({publicKey:EMAILJS_PUBLIC_KEY}); }
  function say(msg,ok){ note.textContent=msg; note.className=ok?'ok':'err'; }

  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!window.emailjs || EMAILJS_PUBLIC_KEY==='YOUR_PUBLIC_KEY'){
      say('The form is not set up yet. Please email raj.uixwebdev@gmail.com directly.',false); return;
    }
    var d=new FormData(form);
    send.disabled=true; send.textContent='Sending…'; say('',true);
    emailjs.send(EMAILJS_SERVICE_ID,EMAILJS_TEMPLATE_ID,{
      name:d.get('name'), email:d.get('email'), from_name:d.get('name'), from_email:d.get('email'),
      subject:d.get('subject'), title:d.get('subject'), message:d.get('message')
    }).then(function(){
      form.reset(); say('Message sent. Thank you, I will reply soon.',true);
    },function(err){
      console.error(err);
      say('Could not send: ' + ((err && err.text) || 'unknown error'),false);
    }).finally(function(){
      send.disabled=false; send.textContent='Send message';
    });
  });
})();