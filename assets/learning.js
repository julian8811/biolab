(() => {
  'use strict';
  const concepts = [
    'Levaduras y bacterias contienen enzimas. Cada comunidad puede realizar distintas transformaciones: no todos los microorganismos producen lo mismo.',
    'Un sustrato es una molécula que participa en una reacción. La glucosa de una fruta y la lactosa de la leche son azúcares diferentes; no todos los microorganismos los aprovechan igual.',
    'La glucólisis permite obtener ATP. La fermentación regenera NAD⁺ para que esa ruta continúe. A diferencia de la respiración, no utiliza una cadena de transporte de electrones.',
    'Gas, acidificación y cambios de composición son pistas. Una burbuja no identifica por sí sola un microorganismo y una lectura de pH no demuestra que un alimento sea seguro.'
  ];
  document.querySelectorAll('[data-concept]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-concept]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('conceptDetail').textContent = concepts[button.dataset.concept];
  }));

  const modules = {
    alcohol: {
      eyebrow: 'MORA / EL RASTRO DE LAS LEVADURAS', title: '¿Adónde va el azúcar?',
      intro: 'En la fermentación alcohólica, levaduras como Saccharomyces cerevisiae transforman azúcares y forman etanol y CO₂. La materia cambia de forma: no desaparece.',
      hotspots: ['Levadura', 'Azúcares', 'Productos'],
      notes: ['Una levadura es una célula, no una burbuja. Sus enzimas participan en las reacciones. La gemación dibujada representa una forma de reproducción.', 'La mora contiene distintos azúcares y otros sólidos. °Brix expresa una equivalencia de sacarosa; no identifica cada azúcar presente.', 'El esquema resume productos principales. Parte del sustrato se destina a biomasa y otros compuestos; el modelo usa rendimientos simplificados.'],
      question: 'Si pasas de 20 a 25 °C y mantienes todo lo demás, ¿qué predices en este modelo?',
      answers: ['El etanol aumentará más rápido durante parte del proceso', 'La velocidad aumentará sin límite con la temperatura', 'El azúcar aparecerá de nuevo'], correct: 0,
      feedback: 'El modelo tiene mayor actividad cerca de 25 °C. Fuera de ese entorno disminuye: más calor no significa siempre más velocidad. Compara las curvas antes de que se agote el sustrato.',
      task: 'Fija 20 °C, guarda la referencia y cambia solo a 25 °C. Reproduce el tiempo y compara a las 96 h.',
      explain: 'Si a las 96 h hay más etanol en un escenario, su transformación fue más rápida hasta ese momento. Eso no significa que ambos escenarios terminarán con cantidades distintas. Busca cuándo las curvas se acercan.',
      limit: 'El pH se mantiene fijo en este modelo de mora. El azúcar equivalente calculado no es una lectura de refractómetro después de fermentar.'
    },
    lactic: {
      eyebrow: 'KÉFIR / UN PEQUEÑO ECOSISTEMA', title: 'Una comunidad, muchas funciones.',
      intro: 'Los gránulos de kéfir albergan bacterias y levaduras en una matriz. Sus interacciones importan: reducir el kéfir a una única especie o a una sola reacción oculta parte de la historia.',
      hotspots: ['Bacterias', 'Levaduras', 'Matriz'],
      notes: ['Las bacterias lácticas pueden transformar azúcares y contribuir a la acidificación. Las especies y sus proporciones varían entre cultivos.', 'Las levaduras forman parte de la comunidad. Según la especie y las condiciones pueden producir etanol, CO₂ y otros compuestos; aquí no se calcula su concentración.', 'La matriz mantiene asociados a los microorganismos. Este corte conceptual no representa una micrografía ni la distribución exacta de un gránulo.'],
      question: 'Si el pH baja durante la simulación, ¿qué puedes concluir?',
      answers: ['El alimento ya es seguro', 'El medio se ha acidificado', 'Toda la lactosa desapareció'], correct: 1,
      feedback: 'Un pH menor indica mayor acidez en este contexto. No demuestra inocuidad ni ausencia de lactosa: observa por separado la concentración restante.',
      task: 'Guarda la referencia a 22 °C. Cambia solo la temperatura a 25 °C y compara pH y lactosa a las 12 h.',
      explain: 'El pH y la lactosa no son la misma variable. El simulador los relaciona con el tiempo, pero no convierte directamente una unidad de pH en gramos de ácido o de azúcar.',
      limit: 'El modelo agrega la actividad de la comunidad. No identifica especies, no calcula beneficios de salud y no predice un cultivo concreto.'
    },
    cheese: {
      eyebrow: 'LECHE / DE PARTÍCULAS A UNA RED', title: 'No todo cambio es fermentación.',
      intro: 'La quimosina actúa sobre la κ-caseína que ayuda a estabilizar las micelas. Después pueden agregarse y formar una red. La coagulación enzimática no es, por sí misma, fermentación.',
      hotspots: ['Micelas', 'Acción enzimática', 'Red'],
      notes: ['Las micelas son conjuntos de proteínas y minerales dispersos en la leche. Se muestran ampliadas y sin escala real.', 'La acción de la quimosina modifica la estabilización de las micelas. Es una transformación enzimática, no una célula consumiendo azúcar.', 'Las partículas se asocian y aparece una red. En el simulador la firmeza es un índice relativo de 0 a 100, no una medición mecánica.'],
      question: '¿Qué distingue este fenómeno de la fermentación alcohólica?',
      answers: ['Toda coagulación produce etanol', 'La leche no contiene proteínas', 'Aquí se modela una enzima actuando sobre proteínas'], correct: 2,
      feedback: 'La quimosina modifica una proteína y favorece la agregación. Una fermentación implica metabolismo; ambos fenómenos pueden coexistir en algunos procesos, pero no son sinónimos.',
      task: 'Guarda la dosis relativa 1. Cambia solo a 2 y compara el inicio de la agregación, manteniendo temperatura y pH.',
      explain: 'Una menor espera antes de la floculación significa un comienzo más temprano en el modelo. La firmeza y el tiempo son variables diferentes: observa ambas.',
      limit: 'La secuencia de 0 a 240 min es una interpolación didáctica. Puede no alcanzar la floculación dentro de esa ventana; no es una guía de elaboración o corte.'
    },
    instruments: {
      eyebrow: 'INSTRUMENTOS / APRENDER A INTERPRETAR', title: 'Una cifra necesita contexto.',
      intro: 'Cada instrumento responde a una propiedad. El pH-metro se relaciona con la actividad de iones hidrógeno; el refractómetro mide refracción y la expresa en una escala equivalente.',
      hotspots: ['pH-metro', 'Refractómetro', 'Límites'],
      notes: ['El electrodo requiere calibración para interpretar su señal. En esta actividad, una lectura de pH queda bloqueada hasta marcar la calibración simulada.', '°Brix se refiere a una escala de sacarosa. Otros componentes cambian la refracción, así que no siempre representa el porcentaje de azúcar de una mezcla.', 'El etanol modifica la refracción. Calibrar no elimina esa interferencia; una lectura aparente no equivale directamente al azúcar residual.'],
      question: '¿Qué instrumento elegirías para explorar la acidificación?',
      answers: ['pH-metro', 'Refractómetro como medida directa de pH', 'Cualquiera: miden lo mismo'], correct: 0,
      feedback: 'El pH-metro permite explorar cambios de pH. El refractómetro responde a otra propiedad. Ninguno, por sí solo, demuestra que una muestra sea segura.',
      task: 'Selecciona pH-metro y activa la calibración. Después cambia a refractómetro y marca la presencia de etanol: compara cómo cambia la interpretación.',
      explain: 'Distingue el valor mostrado de lo que puedes concluir. Una lectura refractométrica idéntica puede necesitar interpretaciones diferentes si cambia la composición de la muestra.',
      limit: 'Son lecturas sintéticas sin ruido ni incertidumbre instrumental. La actividad explica límites del método; no reproduce una calibración física.'
    }
  };
  const panel = document.getElementById('modulePanel');
  const saved = {};
  let current = 'alcohol';
  const svgStart = '<svg viewBox="0 0 500 300" role="img" aria-label="';
  function diagram(kind, selected) {
    const defs = '<defs><radialGradient id="cell"><stop stop-color="#fbbb28"/><stop offset="1" stop-color="#e9901e"/></radialGradient><radialGradient id="grain"><stop stop-color="#fff"/><stop offset="1" stop-color="#c9d7cf"/></radialGradient></defs>';
    const dots = (n, radius, fill) => Array.from({length:n}, (_,i) => `<circle cx="${250+Math.cos(i*2.4)*radius*(.4+i/n*.6)}" cy="${135+Math.sin(i*2.4)*radius*.7}" r="${12+i%4*3}" fill="${fill}" stroke="#195855" stroke-width="1"/>`).join('');
    let content;
    if (kind === 'alcohol') {
      content = `<g opacity="${selected===1?1:.9}"><path d="M40 116l24-14 24 14v28l-24 14-24-14zM85 65l18-10 18 10v21l-18 10-18-10z" fill="#fbbb28" stroke="#195855"/><text x="30" y="205" font-size="14">Azúcares</text></g><path d="M106 135h43m-10-8 10 8-10 8M330 135h43m-10-8 10 8-10 8" fill="none" stroke="#195855" stroke-width="3"/><g opacity="${selected===0?1:.9}"><ellipse cx="246" cy="135" rx="66" ry="81" fill="url(#cell)" stroke="#195855" stroke-width="2"/><ellipse cx="293" cy="65" rx="28" ry="33" fill="url(#cell)" stroke="#195855"/><ellipse cx="246" cy="140" rx="21" ry="28" fill="#fff" opacity=".6"/><circle cx="244" cy="134" r="11" fill="#195855"/><text x="200" y="248" font-size="14">Levadura</text></g><g opacity="${selected===2?1:.9}"><circle cx="404" cy="100" r="19" fill="#108181"/><circle cx="435" cy="66" r="10" fill="#108181"/><text x="386" y="151" font-size="14">CO₂</text><path d="M401 172h27v35h-27z" fill="#e9901e"/><text x="382" y="248" font-size="14">Etanol</text></g>`;
    } else if (kind === 'lactic') {
      content = `<ellipse cx="250" cy="137" rx="145" ry="111" fill="url(#grain)" stroke="#195855" stroke-width="2" stroke-dasharray="${selected===2?'0':'5 4'}"/>${dots(15,105,'#f6f7ec')}<g fill="#195855" opacity="${selected===0?1:.35}">${[0,1,2,3,4,5,6].map(i=>`<rect x="${150+i*25}" y="${100+i%3*30}" width="28" height="10" rx="5" transform="rotate(${i*21} ${164+i*25} ${105+i%3*30})"/>`).join('')}</g><g fill="#e9901e" stroke="#195855" opacity="${selected===1?1:.45}"><ellipse cx="191" cy="82" rx="13" ry="18"/><ellipse cx="288" cy="104" rx="13" ry="18"/><ellipse cx="300" cy="86" rx="7" ry="9"/><ellipse cx="247" cy="195" rx="12" ry="17"/></g><text x="250" y="281" text-anchor="middle" font-size="15">${['Bacterias: formas alargadas','Levaduras: células ovaladas','Matriz: soporte de la comunidad'][selected]}</text>`;
    } else if (kind === 'cheese') {
      const positions = selected===2 ? [[170,90],[250,100],[330,90],[190,168],[275,180],[340,164]] : [[115,70],[245,90],[370,67],[135,201],[280,205],[400,183]];
      content = positions.map(([x,y],i)=>`${selected===2&&i<5?`<path d="M${x} ${y}L${positions[i+1][0]} ${positions[i+1][1]}" stroke="#195855" stroke-width="7"/>`:''}<circle cx="${x}" cy="${y}" r="31" fill="url(#grain)" stroke="#195855" stroke-width="2" ${selected===0?'stroke-dasharray="2 4"':''}/><circle cx="${x-8}" cy="${y-7}" r="6" fill="#fbbb28"/><circle cx="${x+10}" cy="${y+9}" r="7" fill="#108181"/>`).join('') + (selected===1?'<path d="M190 100l20 15-20 15M320 140l20 15-20 15" fill="none" stroke="#e9901e" stroke-width="8"/>':'')+`<text x="250" y="282" text-anchor="middle" font-size="15">${['Dispersión de micelas','Modificación por la enzima','Agregación: una red conecta partículas'][selected]}</text>`;
    } else {
      content = `<g opacity="${selected===1?.4:1}"><rect x="65" y="53" width="120" height="143" rx="15" fill="#195855"/><rect x="79" y="73" width="92" height="53" rx="5" fill="#eef4ef"/><text x="125" y="106" text-anchor="middle" font-size="20">pH</text><circle cx="125" cy="155" r="10" fill="#fbbb28"/><path d="M185 85q55-65 55 25v91" fill="none" stroke="#195855" stroke-width="5"/><path d="M212 158v68h59v-68" fill="#00aeac" fill-opacity=".2" stroke="#195855" stroke-width="2"/><rect x="233" y="161" width="13" height="45" rx="5" fill="#108181"/></g><g transform="translate(317 58) rotate(20 50 85)" opacity="${selected===0?.4:1}"><rect x="25" y="0" width="55" height="30" rx="8" fill="#195855"/><path d="M25 30h55l-7 113H32z" fill="#c9d7cf" stroke="#195855" stroke-width="2"/><rect x="32" y="132" width="41" height="62" rx="8" fill="#195855"/><path d="M35 45h35l-5 50H40z" fill="#108181"/></g><text x="250" y="275" text-anchor="middle" font-size="14">${['Actividad de iones hidrógeno','Refracción → °Brix aparente','Distintas propiedades, distintas conclusiones'][selected]}</text>`;
    }
    return svgStart + modules[kind].hotspots[selected] + '">' + defs + content + '</svg>';
  }
  const hotspotImages = {alcohol:[0,1,3],lactic:[1,0,2],cheese:[0,2,3],instruments:[0,1,4]};
  function topicImage(kind,selected) {
    return `<img src="assets/subtopic-${kind}-${hotspotImages[kind][selected]}.webp" alt="Ilustración científica generada: ${modules[kind].hotspots[selected]}" width="1200" height="800"><p class="visual-title">${modules[kind].hotspots[selected]}</p>`;
  }
  function render() {
    const item = modules[current];
    const state = saved[current] ||= {hotspot:0, answer:null};
    panel.setAttribute('aria-labelledby', 'tab-'+current);
    panel.innerHTML = `<div class="module-top"><figure class="diagram"><div id="diagramArt">${topicImage(current,state.hotspot)}</div><figcaption>Imagen realista generada con IA · No documenta un experimento</figcaption></figure><div class="module-copy"><p class="eyebrow">${item.eyebrow}</p><h3>${item.title}</h3><p>${item.intro}</p><div class="hotspots" aria-label="Explora la ilustración">${item.hotspots.map((label,i)=>`<button data-hotspot="${i}" aria-pressed="${i===state.hotspot}">${i+1}. ${label}</button>`).join('')}</div><div id="hotspotNote" class="hotspot-note" role="status">${item.notes[state.hotspot]}</div></div></div><div class="activity-grid"><div><p class="step-label">03 / PREDICE</p><h4>${item.question}</h4><div class="answers">${item.answers.map((answer,i)=>`<button data-answer="${i}" aria-pressed="${i===state.answer}">${answer}</button>`).join('')}</div><p id="answerFeedback" class="feedback" role="status">${state.answer===null?'Elige una respuesta. Tu explicación importa más que acertar al primer intento.':feedback(item,state.answer)}</p></div><div class="experiment"><p class="step-label">04 / EXPERIMENTA</p><h4>Cambia una sola variable.</h4><p>${item.task}</p><button class="button primary" data-sim="${current}">Abrir simulador <span aria-hidden="true">↗</span></button><details class="explain"><summary>05 / Explica lo que observaste</summary><p>${item.explain}</p><p><strong>Límite del modelo:</strong> ${item.limit}</p></details></div></div>`;
  }
  function feedback(item, answer) { return (answer===item.correct?'Bien razonado. ':'Revisa tu idea. ')+item.feedback; }
  panel.addEventListener('click', event => {
    const spot = event.target.closest('[data-hotspot]');
    if (spot) {
      saved[current].hotspot = +spot.dataset.hotspot;
      panel.querySelectorAll('[data-hotspot]').forEach(b=>b.setAttribute('aria-pressed',String(b===spot)));
      document.getElementById('diagramArt').innerHTML = topicImage(current,+spot.dataset.hotspot);
      document.getElementById('hotspotNote').textContent = modules[current].notes[+spot.dataset.hotspot];
    }
    const answer = event.target.closest('[data-answer]');
    if (answer) {
      saved[current].answer = +answer.dataset.answer;
      panel.querySelectorAll('[data-answer]').forEach(b=>b.setAttribute('aria-pressed',String(b===answer)));
      document.getElementById('answerFeedback').textContent = feedback(modules[current],+answer.dataset.answer);
    }
  });
  const tabs = [...document.querySelectorAll('[data-module]')];
  function select(button) {
    current = button.dataset.module;
    tabs.forEach(tab=>{tab.setAttribute('aria-selected',String(tab===button));tab.tabIndex=tab===button?0:-1;});
    render();
  }
  tabs.forEach((button,i)=>{
    button.addEventListener('click',()=>select(button));
    button.addEventListener('keydown',event=>{
      const index = event.key==='ArrowRight'?(i+1)%4:event.key==='ArrowLeft'?(i+3)%4:event.key==='Home'?0:event.key==='End'?3:-1;
      if(index>=0){event.preventDefault();select(tabs[index]);tabs[index].focus();}
    });
  });
  document.querySelectorAll('[data-audit]').forEach(button=>button.addEventListener('click',()=>{
    document.getElementById('auditFeedback').textContent=button.dataset.audit==='right'?'Exacto. Primero verifica que describen la misma fruta, muestra, momento y método. No hay base para combinarlas sin ese contexto.':'Promediar ocultaría la diferencia entre muestras. Antes de calcular, verifica fruta, momento, método y unidades.';
  }));
  const menu = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('mobileNav');
  function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
  nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
  const theory = {
    alcohol: [
      ['Una célula que transforma', 'La membrana regula intercambios; el citoplasma contiene enzimas. La gemación produce una célula hija. Tamaño y forma dibujados son esquemáticos.'],
      ['Azúcares y sólidos solubles', 'Glucosa y fructosa son sustratos de la fruta. Otros sólidos también contribuyen a la refracción: °Brix no identifica cada molécula.'],
      ['Energía y reciclaje molecular', 'La glucólisis transforma glucosa en piruvato y obtiene ATP. La fermentación regenera NAD⁺ a partir de NADH, permitiendo que continúe la glucólisis.'],
      ['Productos y balance', 'El piruvato puede dar lugar a etanol y CO₂. Parte del sustrato también contribuye a biomasa y otros productos. Compara consumo y formación, no solo burbujas.'],
      ['Velocidad y límites', 'Temperatura, disponibilidad de sustrato y acumulación de etanol influyen en la actividad. Una curva que se aplana puede indicar limitación; no demuestra muerte celular.']],
    lactic: [
      ['Un gránulo es una comunidad', 'Bacterias y levaduras viven asociadas a una matriz. Su composición depende del origen y las condiciones del cultivo.'],
      ['Funciones diferentes', 'Bacterias lácticas contribuyen a la acidificación. Las levaduras pueden formar gas y etanol. Este modelo agrega la comunidad y no cuantifica cada población.'],
      ['Lactosa como sustrato', 'La lactosa es un disacárido. Su aprovechamiento depende de las capacidades metabólicas presentes. Una disminución no significa ausencia total.'],
      ['Una escala logarítmica', 'El pH expresa actividad de iones hidrógeno: una unidad representa un factor diez en esa actividad. No equivale directamente a gramos de ácido; la leche tiene capacidad amortiguadora.'],
      ['Interpretar sin extrapolar', 'Compara temperatura y tiempo manteniendo otras condiciones. Un pH menor no demuestra seguridad ni beneficios clínicos.']],
    cheese: [
      ['Proteínas organizadas', 'Las micelas reúnen caseínas y minerales en una dispersión. No son células ni gotas de grasa.'],
      ['La superficie importa', 'La κ-caseína participa en la estabilización de las micelas. Modificarla cambia su tendencia a agregarse.'],
      ['Acción de una enzima', 'La quimosina hidroliza un enlace específico de la κ-caseína. La enzima no consume azúcar para obtener energía.'],
      ['De agregados a red', 'Después de la etapa enzimática puede formarse una red proteica. Temperatura, pH y calcio afectan el proceso. El índice de firmeza mostrado es relativo.'],
      ['Fenómenos distintos', 'Floculación, firmeza y sinéresis describen aspectos diferentes. La coagulación enzimática por sí misma no es fermentación.']],
    instruments: [
      ['Elegir la propiedad', 'El pH-metro responde a una señal electroquímica relacionada con actividad de hidrógeno. El refractómetro responde a refracción.'],
      ['Referencias conocidas', 'Calibrar relaciona la señal del equipo con patrones conocidos. No elimina toda fuente de error o interferencia.'],
      ['Esperar estabilización', 'Una señal instrumental necesita estabilizarse. Una lectura cambiante debe interpretarse antes de anotarse.'],
      ['Repetibilidad e incertidumbre', 'Repetir lecturas permite explorar dispersión. Resultados próximos entre sí no garantizan exactitud frente al valor de referencia.'],
      ['La mezcla cambia la interpretación', 'El etanol afecta la refracción. °Brix aparente después de fermentar no equivale directamente al azúcar residual.']]
  };
  const originalRender = render;
  render = function() {
    originalRender();
    const navigation = document.createElement('div');
    navigation.className='stage-navigation';
    navigation.innerHTML=['Observar','Comprender','Predecir','Experimentar','Explicar'].map((name,i)=>`<button data-stage="${i}">${i+1}. ${name}</button>`).join('');
    panel.prepend(navigation);
    const section=document.createElement('section');
    section.className='theory-capsules';
    section.innerHTML='<h4>Comprender: cinco conexiones esenciales</h4>'+theory[current].map(([name,text],i)=>`<details><summary>${i+1}. ${name}</summary><div class="capsule-image"><img src="assets/subtopic-${current}-${i}.webp" loading="lazy" alt="Ilustración específica: ${name}" width="1200" height="800"></div><p>${text}</p><button data-capsule="${i%3}">Explorar esta parte en la ilustración ↑</button></details>`).join('')+`<details><summary>Glosario en contexto</summary><p><strong>Sustrato:</strong> molécula que participa en una reacción. <strong>Enzima:</strong> catalizador biológico. <strong>Biomasa:</strong> materia de los organismos. <strong>pH:</strong> escala relacionada con actividad de hidrógeno. <strong>Micela:</strong> conjunto organizado de caseínas y minerales. <strong>Repetibilidad:</strong> proximidad de lecturas bajo condiciones similares.</p></details>`;
    panel.querySelector('.module-top').after(section);
    if(current==='alcohol'||current==='lactic') {
      const procedure=document.createElement('section');procedure.className='procedure';
      const mora=current==='alcohol';
      const steps=mora?[
        ['Preparar y registrar','Con supervisión docente, revisar el protocolo de higiene, identificar la fruta y registrar la masa del lote. Usar utensilios y materias primas adecuados para la práctica.'],
        ['Obtener y caracterizar la pulpa','Seleccionar, lavar y extraer la pulpa según el protocolo. Registrar su masa y medir °Brix antes de formular. El valor de la tabla no sustituye una medición.'],
        ['Calcular la formulación','Elegir la masa final y el °Brix objetivo del ejercicio. Calcular azúcar y agua por balance de masa. Pesar por separado y registrar las cantidades.'],
        ['Preparar el mosto','Mezclar los componentes calculados. El tratamiento térmico y su enfriamiento deben seguir un protocolo docente validado antes de incorporar el cultivo.'],
        ['Incorporar el cultivo y observar','Registrar el cultivo y las condiciones iniciales. En el recorrido digital, comparar temperatura, tiempo y consumo de sustrato; en práctica física, seguir el montaje y control de gases del laboratorio.'],
        ['Separar, analizar y documentar','La presentación describe trasiego para separar sedimentos. Registrar resultados y controles del laboratorio. Ni burbujeo ni apariencia permiten declarar inocuidad; no se propone degustación escolar de un producto alcohólico.']
      ]:[
        ['Preparar materiales','Con supervisión docente, organizar recipiente, leche pasteurizada y gránulos identificados; aplicar el protocolo institucional de higiene.'],
        ['Definir el volumen','Elegir un volumen de leche y una proporción de gránulos. La presentación muestra 2 y 5 g por cada 100 mL como escenarios distintos.'],
        ['Calcular y pesar','Aplicar una regla de tres. Registrar volumen y masa con sus unidades; una cucharada no reemplaza una balanza.'],
        ['Incorporar y registrar','Agregar los gránulos a la leche según el protocolo docente. Registrar hora inicial, temperatura y pH.'],
        ['Seguir la transformación','FermentArt presenta 18–25 °C y 12–24 h como contexto educativo. Comparar muestras en distintos momentos; estas cifras no validan por sí mismas la seguridad de un lote.'],
        ['Separar y evaluar','Separar los gránulos según el protocolo y documentar pH, aspecto y resultados analíticos. Conservación, reutilización y consumo requieren instrucciones validadas del responsable de la práctica.']
      ];
      procedure.innerHTML=`<h4>Elaboración: paso a paso y cálculos</h4><p>Recorrido didáctico basado en FermentArt. Las actividades físicas requieren supervisión y protocolo de laboratorio.</p>${steps.map(([name,text],i)=>`<details><summary>${i+1}. ${name}</summary><p>${text}</p></details>`).join('')}<div class="calculation"><h4>${mora?'Balance de masa del mosto':'Regla de tres para los gránulos'}</h4>${mora?'<label>Masa final del mosto (g)<input id="calcMass" type="number" min="1" value="500"></label><label>Masa de pulpa (g)<input id="calcPulp" type="number" min="0" value="175"></label><label>°Brix de la pulpa<input id="calcBrix" type="number" min="0" max="100" value="9"></label><label>°Brix objetivo<input id="calcTarget" type="number" min="0" max="100" value="25"></label>':'<label>Volumen de leche (mL)<input id="calcVolume" type="number" min="1" value="200"></label><label>Gránulos por 100 mL (g)<input id="calcRatio" type="number" min="0.1" step="0.1" value="2"></label>'}<output id="calculationResult" role="status"></output></div><details><summary>Cómo interpretar el cálculo y la fuente</summary><p>${mora?'Azúcar añadida = (masa final × °Brix objetivo − masa de pulpa × °Brix de pulpa) / 100. Agua = masa final − pulpa − azúcar. Se supone azúcar pura, agua sin sólidos y °Brix como aproximación de sólidos solubles. Con 14 °Brix, el ejemplo da 100,5 g de azúcar y 224,5 g de agua; 100 y 225 son redondeos. Con 9 °Brix da 109,25 y 215,75 g. No se convierten 500 g en 500 mL sin conocer la densidad. El °Brix inicial tampoco determina por sí solo que el producto final sea seco.':'Gránulos = volumen × proporción / 100. Para 200 mL y 2 g/100 mL: 200 × 2 / 100 = 4 g. Con 5 g/100 mL serían 10 g. La diapositiva que dice «200 litro» tiene una unidad inconsistente; este ejercicio declara explícitamente 200 mL.'}</p><p>Fuente: FermentArt, páginas ${mora?'18–20 y 43–44':'23–27 y 45'}. Los aditivos y tratamientos de desinfección requieren un protocolo validado; aquí no se calcula su dosificación.</p></details>`;
      section.after(procedure);
      const updateCalculation=()=>{
        const inputs=[...procedure.querySelectorAll('input')];const values=inputs.map(e=>e.valueAsNumber);const out=procedure.querySelector('output');
        if(inputs.some(e=>e.value===''||!e.checkValidity())||values.some(v=>!Number.isFinite(v))){out.textContent='Revisa las cantidades y unidades.';return;}
        const f=n=>n.toLocaleString('es-CO',{maximumFractionDigits:2});
        if(mora){const [mass,pulp,brix,target]=values;const sugar=(mass*target-pulp*brix)/100,water=mass-pulp-sugar;if(sugar<0||water<0){out.textContent='La formulación no es viable con esas cantidades: produciría una masa negativa. Revisa el objetivo y la proporción de pulpa.';return;}out.textContent=`Azúcar = (${f(mass)} × ${f(target)} − ${f(pulp)} × ${f(brix)}) / 100 = ${f(sugar)} g. Agua = ${f(mass)} − ${f(pulp)} − ${f(sugar)} = ${f(water)} g. Comprobación: pulpa + azúcar + agua = ${f(mass)} g.`;}
        else{const [volume,ratio]=values;out.textContent=`Gránulos = ${f(volume)} mL × ${f(ratio)} g / 100 mL = ${f(volume*ratio/100)} g.`;}
      };
      procedure.addEventListener('input',updateCalculation);updateCalculation();
      const stepDetails=[...procedure.children].filter(e=>e.tagName==='DETAILS').slice(0,6);
      stepDetails.forEach(e=>e.hidden=true);
      const explorer=document.createElement('div');explorer.className='process-explorer';
      const checkpoints=mora?['¿Qué datos registrarás antes de comenzar?','¿Por qué medir °Brix en lugar de asumirlo?','¿La suma de ingredientes coincide con la masa final?','¿Por qué revisar las condiciones antes de añadir el cultivo?','¿Qué variable mantendrás constante al comparar?','¿Qué puede y qué no puede demostrar el aspecto?']:['¿Qué materias primas identifica el protocolo?','¿Qué volumen y proporción elegiste?','¿Por qué una cucharada no sustituye una balanza?','¿Qué registrarás en el momento inicial?','¿Un pH menor significa ausencia de lactosa?','¿Qué controles faltan antes de decidir el destino del lote?'];
      let active=0;const visited=new Set();
      explorer.innerHTML=`<div class="process-track" aria-label="Etapas de elaboración">${steps.map(([name],i)=>`<button data-process="${i}" aria-pressed="${i===0}"><span>${i+1}</span>${name}</button>`).join('')}</div><div class="process-stage"></div>`;
      procedure.querySelector('.calculation').before(explorer);
      const paintStep=()=>{
        explorer.querySelectorAll('[data-process]').forEach(b=>{b.setAttribute('aria-pressed',String(+b.dataset.process===active));b.classList.toggle('visited',visited.has(+b.dataset.process));});
        const imageIndex=(mora?[4,1,1,4,3,3]:[0,0,2,1,3,4])[active];
        explorer.querySelector('.process-stage').innerHTML=`<figure><img src="assets/subtopic-${current}-${imageIndex}.webp" alt="Ilustración de la etapa: ${steps[active][0]}" width="1200" height="800"><figcaption>Ilustración educativa · Etapa ${active+1} de ${steps.length}</figcaption></figure><div><p class="eyebrow">OBSERVA Y RAZONA / ${active+1} DE ${steps.length}</p><h4>${steps[active][0]}</h4><p>${steps[active][1]}</p><div class="step-check"><strong>Antes de avanzar</strong><p>${checkpoints[active]}</p><button data-review>He revisado esta etapa</button><p class="review-status" role="status">${visited.has(active)?'Etapa revisada. Puedes regresar cuando quieras.':''}</p></div><div class="step-controls"><button data-back ${active===0?'disabled':''}>← Anterior</button><button data-next ${active===steps.length-1?'disabled':''}>Siguiente →</button><span>${visited.size}/${steps.length} etapas revisadas</span></div></div>`;
      };
      explorer.onclick=e=>{const jump=e.target.closest('[data-process]');if(jump){active=+jump.dataset.process;paintStep();return;}if(e.target.closest('[data-review]')){visited.add(active);explorer.querySelector('.review-status').textContent='Etapa revisada. Puedes regresar cuando quieras.';explorer.querySelector('.step-controls span').textContent=visited.size+'/'+steps.length+' etapas revisadas';}if(e.target.closest('[data-next]')&&active<steps.length-1){active++;paintStep();}if(e.target.closest('[data-back]')&&active>0){active--;paintStep();}};
      paintStep();
      const calculation=procedure.querySelector('.calculation');
      calculation.classList.add('calculation-redesign');
      const header=document.createElement('p');header.className='calc-intro';header.textContent='1. Ajusta los datos · 2. Observa el cálculo · 3. Comprueba el resultado';calculation.querySelector('h4').after(header);
      const resultCards=document.createElement('div');resultCards.className='calc-cards';calculation.querySelector('output').before(resultCards);
      const renderCards=()=>{
        const inputs=[...calculation.querySelectorAll('input')];
        if(inputs.some(e=>e.value===''||!e.checkValidity())){resultCards.replaceChildren();return;}
        const v=inputs.map(e=>e.valueAsNumber),f=n=>n.toLocaleString('es-CO',{maximumFractionDigits:2});
        let cards;
        if(mora){const[mass,pulp,brix,target]=v;const sugar=(mass*target-pulp*brix)/100,water=mass-pulp-sugar;if(sugar<0||water<0){resultCards.replaceChildren();return;}cards=[['Pulpa',pulp,'g'],['Azúcar añadida',sugar,'g'],['Agua',water,'g']];}
        else cards=[['Leche',v[0],'mL'],['Proporción',v[1],'g/100 mL'],['Gránulos calculados',v[0]*v[1]/100,'g']];
        resultCards.innerHTML=cards.map(([label,value,unit])=>`<div><small>${label}</small><strong>${f(value)} <span>${unit}</span></strong></div>`).join('');
      };
      procedure.addEventListener('input',renderCards);renderCards();

    }

    navigation.onclick=e=>{const b=e.target.closest('[data-stage]');if(!b)return;const targets=[panel.querySelector('.module-top'),section,panel.querySelector('.activity-grid'),panel.querySelector('.experiment'),panel.querySelector('.explain')];const target=targets[+b.dataset.stage];if(target.tagName==='DETAILS')target.open=true;target.scrollIntoView({block:'start',behavior:'smooth'});};
    section.onclick=e=>{const b=e.target.closest('[data-capsule]');if(b){panel.querySelector(`[data-hotspot="${b.dataset.capsule}"]`).click();panel.querySelector('.module-top').scrollIntoView({block:'start'});}};
  };
  document.querySelectorAll('[data-module]').forEach(button=>{
    const image=document.createElement('img');
    image.src='assets/module-'+button.dataset.module+'.webp';image.alt='';image.width=300;image.height=200;image.loading='lazy';button.prepend(image);
  });
  render();
})();
