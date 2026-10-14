const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const axePath = process.env.BIOLAB_AXE || require.resolve('axe-core/axe.min.js');
const artifacts = process.env.BIOLAB_ARTIFACTS || path.resolve(__dirname,'../../audit');
fs.mkdirSync(artifacts,{recursive:true});
const results=[];

(async()=>{
  const browser=await chromium.launch();
  try {
    for(const width of [1365,390,360]) {
      const context=await browser.newContext({viewport:{width,height:900},acceptDownloads:true,reducedMotion:'reduce'});
      const page=await context.newPage();
      const errors=[];
      page.on('pageerror',error=>errors.push(error.message));
      page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
      await page.goto(process.env.BIOLAB_URL||'http://127.0.0.1:4173/');
      await page.waitForFunction(()=>document.fonts.status==='loaded');
      await page.addScriptTag({path:axePath});
      const audit=async label=>{
        const report=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
        assert.deepEqual(report.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],label);
      };
      await audit('landing '+width);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.equal(await page.locator('.footer').evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(25, 88, 85)');
      assert.equal(await page.locator('.footer').evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');
      await page.locator('img').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode();})));
      await page.locator('img').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode();})));
    assert.equal(await page.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)),true);
      await page.screenshot({path:path.join(artifacts,`desktop-${width}.png`),fullPage:true});
      if(width<760) {
        await page.locator('#mobileMenuBtn').click();
        assert.equal(await page.locator('#mobileMenuBtn').getAttribute('aria-expanded'),'true');
        await page.locator('#mobileNav a[href="#experiencias"]').click();
        assert.equal(await page.locator('#mobileMenuBtn').getAttribute('aria-expanded'),'false');
      }
      await page.locator('[data-concept="2"]').click();
      assert.match(await page.locator('#conceptDetail').innerText(),/NAD/);
      for(const kind of ['alcohol','lactic','cheese','instruments']) {
        await page.locator(`[data-module="${kind}"]`).click();
        for(let i=0;i<3;i++) {
          await page.locator(`[data-hotspot="${i}"]`).click();
          assert.equal(await page.locator(`[data-hotspot="${i}"]`).getAttribute('aria-pressed'),'true');
          assert((await page.locator('#hotspotNote').innerText()).length>30);
          await page.locator(`[data-answer="${i}"]`).click();
          assert.match(await page.locator('#answerFeedback').innerText(),/Bien razonado|Revisa tu idea/);
        }
        await audit('module '+kind+' '+width);
        const trigger=page.locator(`#modulePanel [data-sim="${kind}"]`);
        await trigger.click();
        assert.equal(await page.locator('dialog').evaluate(e=>e.open),true);
        assert.equal(await page.evaluate(()=>document.activeElement.id),'closeDrawer');
        // Native dialog keeps keyboard focus inside and makes the page inert.
        await page.keyboard.press('Shift+Tab');
        assert.equal(await page.evaluate(()=>!!document.activeElement.closest('dialog')),true);
        if(kind!=='instruments') {
          assert.equal(await page.locator('#simTime').inputValue(),'0');
          await page.locator('#speed').selectOption('4');
          await page.locator('#play').click();
          await page.waitForTimeout(750);
          await page.locator('#play').click();
          const time=await page.locator('#simTime').inputValue();
          assert(+time>0,kind+' playback must advance');
          await page.waitForTimeout(400);
          assert.equal(await page.locator('#simTime').inputValue(),time);
          await page.locator('#reset').click();
          assert.equal(await page.locator('#simTime').inputValue(),'0');
          await page.locator('#reference').click();
          const temp=page.locator('#input-temp');
          await temp.fill(String(+await temp.inputValue()+1));
          assert.match(await page.locator('#comparison').innerText(),/Cambiaste una variable/);
          await page.locator('#simTime').fill(kind==='alcohol'?'96':kind==='lactic'?'12':'180');
          assert.equal(await page.locator('#chart polyline').count(),2);
          const metricCount=await page.locator('#metric option').count();
          for(let i=0;i<metricCount;i++){await page.locator('#metric').selectOption(String(i));assert((await page.locator('#chart svg').getAttribute('aria-label')).length>20);}
        } else {
          assert.match(await page.locator('#instrumentResult').innerText(),/Calibra/);
          await page.locator('[data-param="calibration"]').check();
          assert.match(await page.locator('#instrumentResult').innerText(),/4[,.]7/);
          await page.locator('#reference').click();
          await page.locator('#instrument').selectOption('brix');
          await page.locator('[data-param="alcohol"]').check();
          assert.match(await page.locator('#instrumentResult').innerText(),/no equivale directamente/);
          assert.match(await page.locator('#comparison').innerText(),/no son directamente comparables/);
        }
        const first=page.locator('[data-param][type=number]').first();
        const value=await first.inputValue();
        for(const bad of ['', '-999','9999']) {
          await first.fill(bad);
          assert.equal(await first.getAttribute('aria-invalid'),'true');
          assert.equal(await page.locator('#export').isDisabled(),true);
        }
        await first.fill(value);
        assert.equal(await page.locator('#export').isEnabled(),true);
        // Each numeric boundary is accepted and the results remain finite.
        const numbers=page.locator('[data-param][type=number]');
        for(let i=0;i<await numbers.count();i++) {
          const input=numbers.nth(i),original=await input.inputValue();
          for(const bound of ['min','max']) {
            await input.fill(await input.getAttribute(bound));
            assert.equal(await input.getAttribute('aria-invalid'),'false');
            assert.doesNotMatch(await page.locator('.sim-results').innerText(),/NaN|Infinity|undefined/);
          }
          await input.fill(original);
        }
        await audit('dialog '+kind+' '+width);
        assert.equal(await page.locator('dialog').evaluate(e=>e.scrollWidth>e.clientWidth),false);
        const downloading=page.waitForEvent('download');await page.locator('#export').click();
        const download=await downloading;
        const file=path.join(artifacts,`${width}-${kind}.csv`);await download.saveAs(file);
        const csv=fs.readFileSync(file,'utf8');
        assert.match(csv,/Simulación educativa/);assert.match(csv,/Referencia/);
        assert.match(csv,kind==='alcohol'?/Oxígeno disponible/:kind==='lactic'?/Gránulos/:kind==='cheese'?/Dosis relativa/:/Instrumento/);
        assert.doesNotMatch(csv,/NaN|undefined|Infinity/);
        await page.locator('dialog').evaluate(e=>e.scrollTop=0);
        if(width===1365||kind==='lactic')await page.screenshot({path:path.join(artifacts,`sim-${kind}-${width}.png`)});
        await page.keyboard.press('Escape');
        assert.equal(await page.locator('dialog').evaluate(e=>e.open),false);
        assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
      }
      await page.locator('[data-module="alcohol"]').focus();
      await page.keyboard.press('ArrowRight');
      assert.equal(await page.locator('[data-module="lactic"]').getAttribute('aria-selected'),'true');
      await page.locator('.data-challenge summary').click();
      await page.locator('[data-audit="wrong"]').click();assert.match(await page.locator('#auditFeedback').innerText(),/Promediar ocultaría/);
      await page.locator('[data-audit="right"]').click();assert.match(await page.locator('#auditFeedback').innerText(),/Exacto/);
      assert.deepEqual(errors,[]);
      results.push({viewport:width,modules:4,simulators:4,downloads:4,axeViolations:0,errors});
      await context.close();
    }
    const context=await browser.newContext();
    const page=await context.newPage();
    await page.goto(process.env.BIOLAB_URL||'http://127.0.0.1:4173/');
    await page.evaluate(()=>navigator.serviceWorker.ready);
    await page.reload();
    await page.locator('[data-sim="alcohol"]').first().click();
    assert.equal(await page.locator('#visual circle').count(),0);
    await page.locator('#simTime').fill('96');
    const before=await page.locator('#visual circle').first().getAttribute('cy');
    await page.locator('#simTime').fill('97');
    assert.notEqual(await page.locator('#visual circle').first().getAttribute('cy'),before);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(()=>document.querySelector('#visual circle').getAttribute('cy')==='68');
    await page.keyboard.press('Escape');
    await context.setOffline(true);
    await page.reload();
    await page.locator('img').evaluateAll(es=>Promise.all(es.map(e=>{e.loading='eager';return e.decode();})));
    assert.equal(await page.locator('img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)),true);
    await page.locator('[data-sim="lactic"]').first().click();
    await page.locator('#speed').selectOption('4');
    await page.locator('#play').click();
    await page.waitForFunction(()=>document.querySelector('#simTime').value==='24',null,{timeout:12000});
    assert.equal(await page.locator('#play').innerText(),'Reproducir');
    results.push({offline:true,reducedMotion:true,stateDrivenBubbles:true,playbackToEnd:true});
    await context.close();
    fs.writeFileSync(path.join(artifacts,'browser-results.json'),JSON.stringify(results,null,2));
    console.log(JSON.stringify(results,null,2));
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
