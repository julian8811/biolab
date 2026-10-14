(() => {
  'use strict';
  const models = window.BioLabSimulationModels;
  const dialog = document.getElementById('drawer');
  const body = document.getElementById('drawerBody');
  const title = document.getElementById('drawerTitle');
  const config = {
    alcohol: {
      name:'Fermentación alcohólica de mora', duration:336, step:1, unit:'h',
      note:'14 días modelados. Los 9 °Brix iniciales son una referencia de la tabla de FermentArt, no una medición de tu muestra. El pH permanece fijo.',
      fields:[['Temperatura (°C)','temp',25,5,42,1],['Sólidos iniciales (°Brix)','brix',9,5,35,.1],['pH inicial','ph',3.8,2.5,6.5,.1]],
      toggles:[['oxygen','Oxígeno disponible',false]],
      metrics:[['abv','Etanol (% v/v)',0,15],['sugarEquivalentBrix','Azúcar equivalente (°Brix)',0,35],['co2GPerL','CO₂ (g/L)',0,120]],
      run:p=>models.simulateAlcoholic(p.temp,p.brix,p.ph,p.oxygen)
    },
    lactic: {
      name:'Fermentación de kéfir', duration:24, step:.5, unit:'h',
      note:'Comunidad agregada en 24 h. Tendencias simplificadas; fuera de 20–25 °C la extrapolación es especialmente incierta. No calcula microorganismos ni inocuidad.',
      fields:[['Temperatura (°C)','temp',22,15,30,1],['Lactosa inicial (g/L)','sugar',52,20,80,1],['Gránulos (g/100 mL)','culture',5,1,7,.5],['pH inicial','ph',6.7,5.5,7.5,.1]],
      toggles:[], metrics:[['ph','pH (sin unidad)',3,8],['lactoseRemainingGPerL','Lactosa restante (g/L)',0,80],['lactoseConsumedGPerL','Lactosa consumida (g/L)',0,80]],
      run:p=>models.simulateKefir(p.temp,p.sugar,p.culture,p.ph)
    },
    cheese: {
      name:'Coagulación enzimática', duration:240, step:1, unit:'min',
      note:'Secuencia didáctica de 0 a 240 min. La firmeza relativa interpola una red, no mide un gel real. Algunas condiciones no alcanzan la floculación en esta ventana.',
      fields:[['Temperatura (°C)','temp',36,10,55,1],['Dosis relativa (×)','dose',1,.1,3,.1],['pH de la leche','ph',6.6,5.5,7.2,.1]],
      toggles:[['calcium','Mayor disponibilidad de calcio',false],['cut','Representar corte en el modelo',false]],
      metrics:[['firmnessIndex','Firmeza relativa (0–100)',0,100],['syneresisIndex','Sinéresis relativa (0–100)',0,100]],
      run:p=>models.simulateCoagulationTimeline(p.temp,p.dose,p.ph,p.calcium,p.cut)
    },
    instruments: {
      name:'pH-metro y refractómetro', duration:0,
      note:'Lecturas sintéticas sin ruido instrumental. La calibración simulada habilita el pH; no corrige las interferencias de composición del refractómetro.',
      fields:[['pH de la muestra','ph',4.7,0,14,.1],['°Brix aparente','brix',9,0,60,.1]],
      toggles:[['calibration','pH-metro calibrado (simulado)',false],['alcohol','Muestra con etanol',false]],
      run:p=>models.instrumentReading({ph:p.ph,apparentBrix:p.brix,alcoholPresent:p.alcohol},p.instrument,p.calibration)
    }
  };
  let state, timer, returnFocus;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = id => document.getElementById(id);
  const fmt = number => number === null ? '—' : Number(number).toLocaleString('es-CO',{maximumFractionDigits:2});
  const at = (series,time) => series.reduce((a,b)=>Math.abs(b.t-time)<Math.abs(a.t-time)?b:a,series[0]);
  function announce(message) { $('simStatus').textContent=message; }
  function stop() {
    clearInterval(timer); timer=null;
    if($('play')) $('play').textContent='Reproducir';
  }
  function open(kind,trigger) {
    if(!config[kind])return;
    stop(); returnFocus=trigger;
    const c=config[kind];
    const params=Object.fromEntries(c.fields.map(([,key,value])=>[key,value]));
    c.toggles.forEach(([key,,value])=>params[key]=value);
    if(kind==='instruments')params.instrument='ph';
    state={kind,c,params,time:0,reference:null,metric:0,valid:true,speed:1};
    title.textContent=c.name;
    body.innerHTML=`<p class="sim-note">${c.note}</p><div class="sim-layout"><div class="sim-controls">${c.fields.map(([label,key,value,min,max,step])=>`<div class="field"><label for="input-${key}">${label}</label><input id="input-${key}" data-param="${key}" type="number" value="${value}" min="${min}" max="${max}" step="${step}" aria-describedby="error-${key}"><span id="error-${key}" class="error"></span></div>`).join('')}${c.toggles.map(([key,label,value])=>`<label class="toggle"><input type="checkbox" data-param="${key}" ${value?'checked':''}>${label}</label>`).join('')}${kind==='instruments'?'<div class="field"><label for="instrument">Instrumento</label><select id="instrument" data-param="instrument"><option value="ph">pH-metro</option><option value="brix">Refractómetro</option></select></div>':''}<button id="reference">Guardar como referencia</button><button id="clearReference" hidden>Quitar referencia</button><p class="sim-note">Guarda un escenario y cambia una sola variable. La referencia conserva sus parámetros.</p></div><div class="sim-results">${c.duration?`<div class="field"><label for="metric">Variable de la gráfica</label><select id="metric">${c.metrics.map((m,i)=>`<option value="${i}">${m[1]}</option>`).join('')}</select></div><div id="kpis" class="kpis"></div><label class="time-slider" for="simTime">Tiempo simulado: <output id="timeValue">0 ${c.unit}</output><input id="simTime" type="range" min="0" max="${c.duration}" step="${c.step}" value="0"></label><div class="time-controls"><button id="play">Reproducir</button><button id="reset">Reiniciar tiempo</button><label for="speed">Velocidad</label><select id="speed"><option value="1">1×</option><option value="2">2×</option><option value="4">4×</option></select></div><div id="visual" class="sim-visual"></div><p id="chartLabel" class="chart-label"></p><div id="chart" class="chart"></div><div id="legend" class="legend"><span>Escenario actual</span></div><p class="sim-note">1× recorre la ventana en unos 34 s. El tiempo está acelerado.</p>`:'<div id="instrumentResult"></div>'}<div id="comparison" class="comparison" hidden></div><div class="sim-actions"><button id="export">Descargar CSV</button></div><p id="simStatus" role="status" class="sim-note">Datos simulados. No son mediciones ni instrucciones de elaboración.</p></div></div>`;
    body.querySelectorAll('[data-param]').forEach(input=>input.addEventListener('input',updateParams));
    $('reference').onclick=()=>{state.reference={params:{...state.params},data:state.data};$('clearReference').hidden=false;draw();announce('Referencia guardada. Cambia una sola variable para comparar.');};
    $('clearReference').onclick=()=>{state.reference=null;$('clearReference').hidden=true;draw();announce('Referencia eliminada.');};
    $('export').onclick=download;
    if(c.duration) {
      $('simTime').oninput=()=>{stop();state.time=+$('simTime').value;draw();};
      $('simTime').onchange=()=>announce(`Tiempo seleccionado: ${fmt(state.time)} ${c.unit}.`);
      $('metric').onchange=()=>{state.metric=+$('metric').value;draw();};
      $('speed').onchange=()=>state.speed=+$('speed').value;
      $('reset').onclick=()=>{stop();state.time=0;draw();announce('Tiempo reiniciado en cero. Los parámetros se conservan.');};
      $('play').onclick=()=>{
        if(timer){stop();announce('Reproducción pausada.');return;}
        if(state.time>=c.duration)state.time=0;
        let playhead=state.time;
        $('play').textContent='Pausar';
        announce('Reproduciendo el tiempo simulado.');
        timer=setInterval(()=>{
          playhead=Math.min(c.duration,playhead+c.duration/100*state.speed);
          state.time=Math.min(c.duration,Math.round(playhead/c.step)*c.step);
          draw();
          if(state.time>=c.duration){stop();announce('Fin de la ventana simulada. Puedes cambiar variables o reiniciar.');}
        },340);
      };
    }
    state.data=c.run(params);
    dialog.showModal(); document.body.style.overflow='hidden'; draw();
    $('closeDrawer').focus();
  }
  function updateParams() {
    stop();
    let valid=true;
    const next={...state.params};
    body.querySelectorAll('[data-param]').forEach(input=>{
      const key=input.dataset.param;
      if(input.type==='number') {
        const value=input.valueAsNumber;
        const ok=input.value!==''&&Number.isFinite(value)&&input.checkValidity();
        input.setAttribute('aria-invalid',String(!ok));
        $('error-'+key).textContent=ok?'':`Introduce un número de ${input.min} a ${input.max}, en pasos de ${input.step}.`;
        valid=valid&&ok;if(ok)next[key]=value;
      } else next[key]=input.type==='checkbox'?input.checked:input.value;
    });
    state.valid=valid;
    ['play','simTime','export','reference'].forEach(id=>{if($(id))$(id).disabled=!valid;});
    if(!valid){announce('Corrige los campos indicados. La vista conserva el último escenario válido.');return;}
    state.params=next;state.data=state.c.run(next);draw();
    announce('Escenario actualizado. Los resultados son simulados.');
  }
  function draw() {
    const {c,kind}=state;
    if(!c.duration){drawInstrument();drawComparison();return;}
    const point=at(state.data,state.time);
    state.time=point.t;
    $('simTime').value=state.time;$('timeValue').textContent=fmt(state.time)+' '+c.unit;
    const values=kind==='alcohol'?[['Etanol (% v/v)',point.abv],['Azúcar eq. (°Brix)',point.sugarEquivalentBrix],['CO₂ (g/L)',point.co2GPerL]]:kind==='lactic'?[['pH',point.ph],['Lactosa restante (g/L)',point.lactoseRemainingGPerL],['Lactosa consumida (g/L)',point.lactoseConsumedGPerL]]:[['Firmeza (0–100)',point.firmnessIndex],['Floculación (min)',point.flocculationMin],['Sinéresis (0–100)',point.syneresisIndex]];
    $('kpis').innerHTML=values.map(([label,value])=>`<div><small>${label}</small><strong>${fmt(value)}</strong></div>`).join('');
    $('visual').innerHTML=visual(point);
    const metric=c.metrics[state.metric];$('chartLabel').textContent=metric[1];
    $('chart').innerHTML=chart(metric);
    $('legend').innerHTML='<span>Escenario actual</span>'+(state.reference?'<span>Referencia guardada</span>':'');
    drawComparison();
  }
  function visual(point) {
    const {kind,time,c}=state;
    let art,description;
    if(kind==='cheese') {
      const count=Math.floor(point.firmnessIndex/10);
      const lines=Array.from({length:count},(_,i)=>`<path d="M${20+i*10} 30L${100-i*9} 90" stroke="#195855" stroke-width="2"/>`).join('');
      art=`<rect x="15" y="15" width="100" height="85" rx="12" fill="#fff" stroke="#195855"/>${lines}<circle cx="40" cy="40" r="8" fill="#fbbb28"/><circle cx="85" cy="70" r="8" fill="#fbbb28"/>`;
      description=point.stage+'. '+(point.flocculationMin===null?'Estas condiciones quedan fuera del intervalo de respuesta del modelo.':'La red dibujada aumenta con la firmeza calculada.');
    } else {
      const progress=kind==='alcohol'?Math.min(1,point.abv/15):point.acidificationIndex;
      const bubbles=kind==='alcohol'?Math.min(8,Math.floor(point.co2RateGPerLHour*12)):0;
      art=`<path d="M25 12h80M33 12v82q32 20 64 0V12" fill="#fff" stroke="#195855" stroke-width="3"/><path d="M35 48h60v45q-30 18-60 0z" fill="${kind==='alcohol'?'#e9901e':'#fbbb28'}" opacity="${.25+progress*.6}"/>${Array.from({length:bubbles},(_,i)=>`<circle cx="${43+i%4*13}" cy="${reducedMotion.matches?68:88-((time*3+i*11)%42)}" r="3" fill="#195855"/>`).join('')}`;
      description=kind==='alcohol'?'Las burbujas representan la tasa de CO₂ calculada, no una observación real. '+(bubbles?'Hay actividad modelada.':'La tasa es baja o nula en este instante.'):'La intensidad de color representa el índice de acidificación; no es el color real del kéfir.';
    }
    return `<svg viewBox="0 0 130 115" role="img" aria-label="Estado esquemático a ${time} ${c.unit}">${art}</svg><p>${description}</p>`;
  }
  function chart([key,label,low,high]) {
    const {c,time}=state;
    const x=t=>55+t/c.duration*515;
    const y=v=>185-(v-low)/(high-low)*150;
    const path=series=>series.filter(p=>p.t<=time).map(p=>`${x(p.t).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ');
    const ticks=Array.from({length:5},(_,i)=>{const value=low+(high-low)*i/4;return `<path d="M55 ${y(value)}h515" stroke="#dde5df"/><text x="47" y="${y(value)+4}" text-anchor="end">${fmt(value)}</text>`;}).join('');
    const times=Array.from({length:5},(_,i)=>`<text x="${x(c.duration*i/4)}" y="211" text-anchor="middle">${fmt(c.duration*i/4)}</text>`).join('');
    const point=at(state.data,time);
    return `<svg viewBox="0 0 600 245" role="img" aria-label="${label}. Tiempo en ${c.unit}. Actual: ${fmt(point[key])} a ${fmt(time)} ${c.unit}.">${ticks}${times}<text x="310" y="235" text-anchor="middle">Tiempo (${c.unit})</text>${state.reference?`<polyline points="${path(state.reference.data)}" fill="none" stroke="#172139" stroke-width="3" stroke-dasharray="7 5"/>`:''}<polyline points="${path(state.data)}" fill="none" stroke="#195855" stroke-width="3"/><circle cx="${x(time)}" cy="${y(point[key])}" r="4" fill="#195855"/></svg>`;
  }
  function drawInstrument() {
    const r=state.data;
    $('instrumentResult').innerHTML=`<div class="sim-visual"><svg viewBox="0 0 150 135" role="img" aria-label="Pantalla del instrumento simulado"><rect x="10" y="10" width="130" height="115" rx="15" fill="#195855"/><rect x="23" y="29" width="104" height="55" rx="5" fill="#eef4ef"/><text x="75" y="65" font-size="25" text-anchor="middle" fill="#195855">${fmt(r.value)}</text><text x="75" y="106" font-size="13" text-anchor="middle" fill="white">${r.unit}</text></svg><div><h4>Lectura simulada</h4><p>${r.note}</p></div></div><p class="sim-note">No demuestra calidad ni inocuidad. La muestra y la lectura se definen aquí para aprender a interpretar.</p>`;
  }
  function drawComparison() {
    const element=$('comparison');
    element.hidden=!state.reference;
    if(!state.reference)return;
    const {params:base,data}=state.reference;
    const changes=Object.keys(base).filter(key=>base[key]!==state.params[key]);
    const labels=Object.fromEntries([...state.c.fields.map(([label,key])=>[key,label]),...state.c.toggles.map(([key,label])=>[key,label]),['instrument','Instrumento']]);
    const caption=changes.length===0?'Los parámetros son idénticos.':changes.length===1?'Cambiaste una variable: '+labels[changes[0]]+'.':'Cambiaste '+changes.length+' variables. Para atribuir un efecto, compara una por vez.';
    let result;
    if(state.c.duration) {
      const [key,label]=state.c.metrics[state.metric];
      const reference=at(data,state.time)[key],current=at(state.data,state.time)[key];
      result=`${label}: referencia ${fmt(reference)} · actual ${fmt(current)} · diferencia ${fmt(current-reference)}.`;
    } else {
      result=data.unit===state.data.unit?`Referencia: ${fmt(data.value)} ${data.unit} · actual: ${fmt(state.data.value)} ${state.data.unit}.`:'Los instrumentos usan escalas diferentes; sus valores no son directamente comparables.';
    }
    element.innerHTML=`<p><strong>${caption}</strong></p><p>${result}</p>`;
  }
  function csvCell(value) {return '"'+String(value??'').replaceAll('"','""')+'"';}
  function download() {
    if(!state.valid)return;
    const {c,kind,params,reference}=state;
    const rows=[['Clasificación','Simulación educativa, no medición real'],['Versión del modelo','FermentArt 2'],['Modelo',c.name],['Tiempo seleccionado ('+(c.unit||'no aplica')+')',state.time],['Supuestos',c.note]];
    const paramRows=(name,p)=>{
      rows.push(['Escenario',name]);
      c.fields.forEach(([label,key])=>rows.push([label,p[key]]));
      c.toggles.forEach(([key,label])=>rows.push([label,p[key]?'Sí':'No']));
      if(p.instrument)rows.push(['Instrumento',p.instrument]);
    };
    const dataRows=(name,data)=>{
      if(c.duration) {
        const metrics=c.metrics;
        rows.push(['Serie',name],['Tiempo ('+c.unit+')',...metrics.map(m=>m[1]),...(kind==='cheese'?['Floculación (min)','Etapa']:[])]);
        data.forEach(point=>rows.push([point.t,...metrics.map(m=>point[m[0]]),...(kind==='cheese'?[point.flocculationMin,point.stage]:[])]));
      } else rows.push(['Lectura simulada ('+data.unit+')',data.value],['Interpretación',data.note]);
    };
    paramRows('Actual',params);dataRows('Actual',state.data);
    if(reference){paramRows('Referencia',reference.params);dataRows('Referencia',reference.data);}
    rows.push(['Límite','No usar para fabricar, consumir ni declarar inocuidad de alimentos.']);
    const blob=new Blob(['\uFEFF'+rows.map(row=>row.map(csvCell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download=`fermentart-${kind}-simulado.csv`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    announce('CSV descargado con parámetros, unidades y series completas'+(reference?' de ambos escenarios.':'.'));
  }
  function close(){stop();dialog.close();}
  $('closeDrawer').onclick=close;
  dialog.addEventListener('close',()=>{stop();document.body.style.overflow='';returnFocus?.focus();});
  dialog.addEventListener('cancel',stop);
  dialog.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const focusable=[...dialog.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href]')].filter(element=>!element.hidden&&element.getClientRects().length);
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close();}});
  document.addEventListener('click',event=>{const trigger=event.target.closest('[data-sim]');if(trigger)open(trigger.dataset.sim,trigger);});
  reducedMotion.addEventListener('change',()=>{if(dialog.open)draw();});
})();
