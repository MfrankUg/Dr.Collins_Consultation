(() => {
  const form = document.getElementById('vitalsForm');
  const bmiInput = document.getElementById('bmi');
  const bmiDisplay = document.getElementById('bmiDisplay');
  const weightEl = document.getElementById('weight');
  const heightEl = document.getElementById('height');
  const sendBtn = document.getElementById('sendVitals');
  const urlParams = new URLSearchParams(window.location.search);
  const patientInfo = {
    name: urlParams.get('name') || '',
    age: urlParams.get('age') || '',
    sex: urlParams.get('sex') || ''
  };

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
    // Only weight required; clear other errors
    ['bp','pulse','spo2','temp','rbs','height','bmi'].forEach(id => setError(id, ''));
    const weightVal = document.getElementById('weight').value.trim();
    if (!weightVal || Number(weightVal) <= 0) {
      setError('weight', 'Weight is required');
      return false;
    }
    setError('weight', '');
    return true;
  }

  function buildWhatsappUrl(values) {
    const base = 'https://wa.me/256783079038';
    const lines = [
      'Hello Doctor Collins, Further medical details:',
      patientInfo.name ? `Name: ${patientInfo.name}` : null,
      patientInfo.age ? `Age: ${patientInfo.age}` : null,
      patientInfo.sex ? `Sex: ${patientInfo.sex}` : null,
      values.bp ? `Blood Pressure: ${values.bp}` : null,
      values.pulse ? `Pulse: ${values.pulse} bpm` : null,
      values.spo2 ? `SPO2: ${values.spo2}%` : null,
      values.temp ? `Temperature: ${values.temp} °C` : null,
      values.rbs ? `RBS: ${values.rbs} mmol/L` : null,
      values.weight ? `Weight: ${values.weight} kg` : null,
      values.height ? `Height: ${values.height} m` : null,
      values.bmi ? `BMI: ${values.bmi}` : null
    ].filter(Boolean);
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


