const test = require('node:test');
const assert = require('node:assert/strict');
const models = require('../assets/simulation-models.js');

test('alcoholic fermentation stays monotonic and spans the multi-day process', () => {
  const points = models.simulateAlcoholic(25, 25, 3.8, false);
  assert.equal(points.length, 337);
  assert.equal(points.at(-1).t, 336);
  assert(points[0].sugarGPerL > points.at(-1).sugarGPerL);
  assert(points.at(-1).abv > 0);
  assert(points.at(-1).abv <= 15);
  for (let i = 1; i < points.length; i += 1) {
    assert(points[i].sugarGPerL <= points[i - 1].sugarGPerL);
    assert(points[i].abv >= points[i - 1].abv);
    assert(points[i].co2GPerL >= points[i - 1].co2GPerL);
  }
});

test('oxygen availability does not switch alcoholic fermentation off at high sugar', () => {
  const aerobic = models.simulateAlcoholic(25, 25, 3.8, true);
  assert(aerobic.at(-1).abv > 0);
  assert(aerobic.at(-1).biomassGPerL > 0);
});

test('alcoholic activity falls outside the operating range', () => {
  const optimal = models.simulateAlcoholic(25, 25, 3.8, false).at(-1);
  const cold = models.simulateAlcoholic(10, 25, 3.8, false).at(-1);
  const hot = models.simulateAlcoholic(45, 25, 3.8, false).at(-1);
  assert(optimal.abv > cold.abv);
  assert(optimal.abv > hot.abv);
});

test('kefir reference endpoints approximate the 20 and 25 °C study results', () => {
  const at20 = models.simulateKefir(20, 52, 5).at(-1);
  const at25 = models.simulateKefir(25, 52, 5).at(-1);
  assert(at20.ph >= 4.8 && at20.ph <= 5.1);
  assert(at25.ph >= 4.5 && at25.ph <= 4.9);
  assert(at20.lactoseRemainingGPerL > at25.lactoseRemainingGPerL);
  assert.equal(at25.t, 24);
});

test('chymosin response follows dose, temperature, calcium and cutting state', () => {
  const lowDose = models.simulateChymosin(36, 0.5, 6.6, false, false);
  const highDose = models.simulateChymosin(36, 2, 6.6, false, false);
  const defaultDose = models.simulateChymosin(36, 1, 6.6, false, false);
  const cold = models.simulateChymosin(25, 1, 6.6, false, false);
  const cut = models.simulateChymosin(36, 1, 6.6, false, true);
  assert(highDose.flocculationMin < lowDose.flocculationMin);
  assert(cold.flocculationMin > defaultDose.flocculationMin);
  assert.equal(lowDose.syneresisIndex, 0);
  assert(cut.syneresisIndex > 0);
});

test('instrument readings distinguish calibration and apparent fermented Brix', () => {
  const sample = { ph: 4.7, apparentBrix: 8, alcoholPresent: true };
  const uncalibrated = models.instrumentReading(sample, 'ph', false);
  const refractometer = models.instrumentReading(sample, 'brix');
  assert.equal(uncalibrated.value, null);
  assert.equal(uncalibrated.needsCalibration, true);
  assert.equal(refractometer.value, 8);
  assert.match(refractometer.note, /no equivale directamente al azúcar residual/);
});

test('coagulation starts at zero and evolves after estimated flocculation', () => {
  const curve = models.simulateCoagulationTimeline(36,1,6.6,false,false);
  assert.equal(curve.length,241);
  assert.equal(curve[0].firmnessIndex,0);
  assert.equal(curve.at(-1).t,240);
  for(let i=1;i<curve.length;i++) {
    assert(curve[i].firmnessIndex>=curve[i-1].firmnessIndex);
    assert(curve[i].firmnessIndex<=100);
    if(curve[i].t<curve[i].flocculationMin) assert.equal(curve[i].firmnessIndex,0);
  }
  assert(curve.at(-1).firmnessIndex>0);
  assert(models.simulateCoagulationTimeline(10,1,6.6).every(p=>p.firmnessIndex===0));
});

test('calcium does not delay flocculation and delayed curves do not force a gel', () => {
  const normal=models.simulateChymosin(36,1,6.6,false);
  const calcium=models.simulateChymosin(36,1,6.6,true);
  assert(calcium.flocculationMin<normal.flocculationMin);
  const slow=models.simulateCoagulationTimeline(25,.1,7.2);
  assert(slow.at(-1).flocculationMin>240);
  assert.equal(slow.at(-1).firmnessIndex,0);
});

test('all supported extreme inputs yield finite bounded series', () => {
  for(const t of [5,42]) for(const b of [5,35]) for(const ph of [2.5,6.5]) {
    for(const p of models.simulateAlcoholic(t,b,ph,true)) {
      assert(Number.isFinite(p.abv));assert(p.abv>=0&&p.abv<=15);
      assert(p.sugarGPerL>=0);assert(p.co2GPerL>=0);
    }
  }
  for(const t of [15,30]) for(const s of [20,80]) for(const g of [1,7]) for(const ph of [5.5,7.5]) {
    for(const p of models.simulateKefir(t,s,g,ph)) {
      assert(Number.isFinite(p.ph));assert(p.ph>=0&&p.ph<=14);
      assert(p.lactoseRemainingGPerL>=0);assert(p.lactoseConsumedGPerL<=s);
    }
  }
  for(const t of [10,55]) for(const dose of [.1,3]) for(const ph of [5.5,7.2]) {
    for(const p of models.simulateCoagulationTimeline(t,dose,ph,true,true)) {
      assert(Number.isFinite(p.firmnessIndex));assert(p.firmnessIndex>=0&&p.firmnessIndex<=100);
    }
  }
});
