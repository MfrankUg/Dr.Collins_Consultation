(() => {
  const form = document.getElementById('vitalsForm');
  const bmiInput = document.getElementById('bmi');
  const bmiDisplay = document.getElementById('bmiDisplay');
  const weightEl = document.getElementById('weight');
  const heightEl = document.getElementById('height');
  const sendBtn = document.getElementById('sendVitals');

  function setError(inputId, message) {
    const el = document.querySelector(`[data-error-for="${inputId}"]`);
    if (el) el.textContent = message || '';
  }

  function calculateBmi(weight, height) {
    if (!weight || !height || height <= 0) return null;
    return weight / (height * height);
  }

  function updateBmi() {
    const weight = parseFloat(weightEl.value);
    const height = parseFloat(heightEl.value);
    const bmi = calculateBmi(weight, height);
    if (bmi) {
      const val = bmi.toFixed(1);
      bmiInput.value = String(val);
      bmiDisplay.textContent = `BMI: ${val}`;
      bmiDisplay.style.opacity = '0.2';
      requestAnimationFrame(() => {
        bmiDisplay.style.transition = 'opacity 300ms ease';
        bmiDisplay.style.opacity = '1';
      });
    } else {
      bmiInput.value = '';
      bmiDisplay.textContent = 'Enter weight and height to calculate BMI';
    }
  }

  weightEl?.addEventListener('input', updateBmi);
  heightEl?.addEventListener('input', updateBmi);

  function validate() {
    let valid = true;
    const fields = [
      ['bp', v => !!v.trim(), 'Required'],
      ['pulse', v => v !== '' && Number(v) >= 0, 'Enter a valid number'],
      ['spo2', v => v !== '' && Number(v) >= 0 && Number(v) <= 100, '0-100'],
      ['temp', v => v !== '' && !isNaN(Number(v)), 'Enter a valid number'],
      ['rbs', v => v !== '' && !isNaN(Number(v)), 'Enter a valid number'],
      ['weight', v => v !== '' && Number(v) > 0, 'Required'],
      ['height', v => v !== '' && Number(v) > 0, 'Required'],
    ];

    for (const [id, check, msg] of fields) {
      const el = document.getElementById(id);
      const ok = check(el.value);
      if (!ok) { setError(id, msg); valid = false; } else setError(id);
    }
    return valid;
  }

  function buildWhatsappUrl(values) {
    const base = 'https://wa.me/256783079038';
    const lines = [
      'Hello Doctor Collins, Further medical details:',
      `Blood Pressure: ${values.bp}`,
      `Pulse: ${values.pulse} bpm`,
      `SPO2: ${values.spo2}%`,
      `Temperature: ${values.temp} °C`,
      `RBS: ${values.rbs} mmol/L`,
      `Weight: ${values.weight} kg`,
      `Height: ${values.height} m`,
      `BMI: ${values.bmi || 'N/A'}`
    ];
    const encoded = encodeURIComponent(lines.join('\n'))
      .replace(/%0A/g, '%0A');
    return `${base}?text=${encoded}`;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    sendBtn.disabled = true;

    const values = {
      bp: document.getElementById('bp').value.trim(),
      pulse: document.getElementById('pulse').value.trim(),
      spo2: document.getElementById('spo2').value.trim(),
      temp: document.getElementById('temp').value.trim(),
      rbs: document.getElementById('rbs').value.trim(),
      weight: document.getElementById('weight').value.trim(),
      height: document.getElementById('height').value.trim(),
      bmi: document.getElementById('bmi').value.trim(),
    };

    const url = buildWhatsappUrl(values);

    setTimeout(() => {
      window.open(url, '_blank');
      sendBtn.disabled = false;
    }, 300);
  });
})();


