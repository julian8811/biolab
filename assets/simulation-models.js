/*
 * Small, transparent teaching models for BioLab.
 * Outputs are estimates for classroom exploration, not process predictions.
 */
(function attachBioLabModels(root) {
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const round = (value, digits = 2) => Number(value.toFixed(digits));

  // Approximate soluble solids as sucrose-equivalent density. Fruit must is not
  // a pure sucrose solution, so this conversion is intentionally labelled as an estimate.
  function brixToSolubleSolidsGPerL(brix) {
    const safeBrix = clamp(Number(brix) || 0, 0, 40);
    const specificGravity = 1 + safeBrix / (258.6 - ((safeBrix / 258.2) * 227.1));
    return safeBrix * 10 * specificGravity;
  }

  function simulateAlcoholic(tempC, startBrix, initialPh = 3.8, oxygenAvailable = false) {
    const hours = 14 * 24;
    const startSugar = brixToSolubleSolidsGPerL(startBrix);
    const temp = Number(tempC);
    const ph = clamp(Number(initialPh), 2.5, 6.5);
    const tempFactor = temp < 8 || temp > 42
      ? 0.02
      : Math.exp(-0.5 * Math.pow((temp - 25) / 7.5, 2));
    const phFactor = clamp(1 - Math.abs(ph - 3.9) * 0.22, 0.45, 1);
    const biomassYield = 0.12;
    const ethanolYield = oxygenAvailable ? 0.43 : 0.47;
    const points = [];
    let sugar = startSugar;
    let biomass = 0.25;
    let ethanol = 0;
    let co2 = 0;
    let previousCo2 = 0;

    for (let hour = 0; hour <= hours; hour += 1) {
      const abv = ethanol / 7.89;
      points.push({
        t: hour,
        sugarGPerL: round(sugar, 1),
        sugarEquivalentBrix: round(startBrix * (startSugar ? sugar / startSugar : 0), 1),
        biomassGPerL: round(biomass, 2),
        ethanolGPerL: round(ethanol, 1),
        abv: round(abv, 2),
        ph,
        co2GPerL: round(co2, 1),
        co2RateGPerLHour: round(Math.max(0, co2 - previousCo2), 3),
        active: tempFactor > 0.05 && sugar > 0.5 && abv < 16
      });
      if (hour === hours) break;

      const lag = clamp((hour - 8) / 16, 0, 1);
      const ethanolInhibition = abv >= 15
        ? 0
        : clamp(1 - Math.pow(abv / 15, 2), 0, 1);
      const growthRate = 0.035 * tempFactor * phFactor * lag * ethanolInhibition;
      const newBiomass = biomass * growthRate;
      const maintenanceSugar = biomass * 0.006;
      const requestedSugar = Math.min(sugar, (newBiomass / biomassYield) + maintenanceSugar);
      const maxEthanol = 15 * 7.89;
      const ethanolMade = Math.min(requestedSugar * ethanolYield, Math.max(0, maxEthanol - ethanol));
      const sugarUsed = ethanolMade / ethanolYield;
      const co2Made = ethanolMade * (44.01 / 46.07);

      sugar = Math.max(0, sugar - sugarUsed);
      biomass = Math.max(0.01, Math.min(12, biomass + newBiomass));
      ethanol += ethanolMade;
      previousCo2 = co2;
      co2 += co2Made;
    }
    return points;
  }

  // Endpoint behaviour is anchored to a controlled milk-kefir study at 20 and
  // 25 °C with 5 g grains / 100 mL and approximately 24 h cycles. Interpolation
  // between and outside those conditions is an educational approximation.
  // Reference: https://doi.org/10.3390/fermentation8030135
  function simulateKefir(tempC, lactoseGPerL = 52, grainsGPer100mL = 5, initialPh = 6.7) {
    const hours = 24;
    const temp = Number(tempC);
    const lactose = Math.max(0, Number(lactoseGPerL) || 0);
    const inoculumRatio = clamp((Number(grainsGPer100mL) || 0) / 5, 0.2, 1.4);
    const initial = clamp(Number(initialPh), 5.5, 7.5);
    const referenceTemp = clamp(temp, 18, 30);
    const referenceConsumption = clamp(0.56 + (referenceTemp - 20) * 0.016, 0.45, 0.72);
    const consumptionFraction = clamp(referenceConsumption * inoculumRatio, 0.05, 0.85);
    const referenceEndPh = clamp(4.94 - (referenceTemp - 20) * 0.054, 4.35, 5.2);
    const endPh = initial - (initial - referenceEndPh) * clamp(inoculumRatio, 0.2, 1.2);
    const curveAtEnd = 1 - Math.exp(-hours / 7);
    const points = [];

    for (let halfHour = 0; halfHour <= hours * 2; halfHour += 1) {
      const t = halfHour / 2;
      const progress = (1 - Math.exp(-t / 7)) / curveAtEnd;
      const consumed = lactose * consumptionFraction * clamp(progress, 0, 1);
      const ph = initial + (endPh - initial) * clamp(progress, 0, 1);
      points.push({
        t,
        lactoseRemainingGPerL: round(Math.max(0, lactose - consumed), 1),
        lactoseConsumedGPerL: round(consumed, 1),
        ph: round(ph, 2),
        acidificationIndex: round(clamp((initial - ph) / Math.max(0.1, initial - 4.5), 0, 1), 2),
        withinReferenceRange: temp >= 20 && temp <= 25
      });
    }
    return points;
  }

  function simulateChymosin(tempC, relativeDose = 1, milkPh = 6.6, addedCalcium = false, cutApplied = false) {
    const temp = Number(tempC);
    const dose = clamp(Number(relativeDose) || 0.1, 0.1, 3);
    const ph = clamp(Number(milkPh), 5.5, 7.2);
    const tempFactor = temp < 18 || temp > 52
      ? 0.08
      : Math.exp(-0.5 * Math.pow((temp - 36) / 8, 2));
    const phFactor = clamp(1 + (6.5 - ph) * 0.55, 0.65, 1.35);
    const calciumFactor = addedCalcium ? 1.06 : 1;
    const flocculationMin = tempFactor < 0.12
      ? null
      : round(35 / (dose * tempFactor * phFactor * calciumFactor), 1);
    const firmnessIndex = round(clamp(
      82 * tempFactor * phFactor * (0.82 + 0.18 * Math.sqrt(dose)) * (addedCalcium ? 1.04 : 0.96),
      0,
      100
    ), 0);
    const cutGuideMin = flocculationMin === null ? null : round(flocculationMin * 2.3, 1);
    const syneresisIndex = cutApplied && cutGuideMin !== null
      ? round(clamp(firmnessIndex * 0.68, 0, 100), 0)
      : 0;

    return { flocculationMin, cutGuideMin, firmnessIndex, syneresisIndex, cutApplied };
  }

  // Didactic interpolation, not a measured coagulation kinetic law.
  // Fixed 240-minute observation window; no forced endpoint when flocculation is late.
  function simulateCoagulationTimeline(tempC, relativeDose = 1, milkPh = 6.6, addedCalcium = false, cutApplied = false) {
    const endpoint = simulateChymosin(tempC, relativeDose, milkPh, addedCalcium, cutApplied);
    return Array.from({length:241}, (_,t) => {
      const elapsed = endpoint.flocculationMin === null ? 0 : Math.max(0,t-endpoint.flocculationMin);
      const fraction = endpoint.flocculationMin === null ? 0 : 1-Math.exp(-elapsed/Math.max(10,endpoint.flocculationMin));
      return {
        t,
        firmnessIndex: round(endpoint.firmnessIndex*fraction,1),
        flocculationMin: endpoint.flocculationMin,
        syneresisIndex: cutApplied && endpoint.cutGuideMin !== null && t>=endpoint.cutGuideMin ? round(endpoint.syneresisIndex*fraction,1) : 0,
        stage: endpoint.flocculationMin === null ? 'Fuera del intervalo de respuesta' : t<endpoint.flocculationMin ? 'Antes de la floculación' : fraction<.65 ? 'Agregación' : 'Red en formación'
      };
    });
  }

  function instrumentReading(sample, instrument, calibrated = true) {
    if (instrument === 'ph') {
      return {
        value: calibrated ? sample.ph : null,
        unit: 'pH',
        needsCalibration: !calibrated,
        note: calibrated ? 'Lectura simulada con electrodo calibrado.' : 'Calibra con buffers pH 7.00 y 4.01 antes de medir.'
      };
    }
    if (sample.apparentBrix === null || sample.apparentBrix === undefined) {
      return {
        value: null,
        unit: '°Brix',
        needsCalibration: false,
        note: 'Esta muestra no tiene una lectura refractométrica de referencia.'
      };
    }
    return {
      value: Number(sample.apparentBrix),
      unit: '°Brix',
      needsCalibration: false,
      note: sample.alcoholPresent
        ? 'Lectura aparente: el etanol altera la refracción; no equivale directamente al azúcar residual.'
        : 'Lectura simulada de sólidos solubles antes de fermentar.'
    };
  }

  const models = Object.freeze({
    brixToSolubleSolidsGPerL,
    simulateAlcoholic,
    simulateKefir,
    simulateChymosin,
    simulateCoagulationTimeline,
    instrumentReading
  });

  root.BioLabSimulationModels = models;
  if (typeof module !== 'undefined' && module.exports) module.exports = models;
})(typeof window !== 'undefined' ? window : globalThis);
