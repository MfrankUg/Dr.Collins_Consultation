(() => {
  const form = document.getElementById('patientForm');
  const sendBtn = document.getElementById('sendBtn');
  const moreBtn = document.getElementById('moreBtn');

  function setError(inputId, message) {
    const el = document.querySelector(`[data-error-for="${inputId}"]`);
    if (el) el.textContent = message || '';
  }

  function validate() {
    let valid = true;
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const age = document.getElementById('age');
    const sex = document.getElementById('sex');
    const location = document.getElementById('location');
    const reason = document.getElementById('reason');

    // Name
    if (!name.value.trim()) { setError('name', 'Required'); valid = false; } else setError('name');

    // Phone
    const phoneVal = phone.value.trim();
    const phoneRe = /^\+?[0-9]{9,15}$/;
    if (!phoneVal) { setError('phone', 'Required'); valid = false; }
    else if (!phoneRe.test(phoneVal)) { setError('phone', 'Invalid phone number'); valid = false; }
    else setError('phone');

    // Age
    const ageNum = Number(age.value);
    if (!age.value) { setError('age', 'Required'); valid = false; }
    else if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) { setError('age', 'Enter a valid age'); valid = false; }
    else setError('age');

    // Sex
    if (!sex.value) { setError('sex', 'Required'); valid = false; } else setError('sex');

    // Location
    if (!location.value.trim()) { setError('location', 'Required'); valid = false; } else setError('location');

    // Reason
    if (!reason.value.trim()) { setError('reason', 'Required'); valid = false; } else setError('reason');

    return valid;
  }

  // Basic validation for navigating to more.html
  function validateBasic() {
    let valid = true;
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const age = document.getElementById('age');
    const sex = document.getElementById('sex');

    if (!name.value.trim()) { setError('name', 'Required'); valid = false; } else setError('name');

    const phoneVal = phone.value.trim();
    const phoneRe = /^\+?[0-9]{9,15}$/;
    if (!phoneVal) { setError('phone', 'Required'); valid = false; }
    else if (!phoneRe.test(phoneVal)) { setError('phone', 'Invalid phone number'); valid = false; }
    else setError('phone');

    const ageNum = Number(age.value);
    if (!age.value) { setError('age', 'Required'); valid = false; }
    else if (isNaN(ageNum) || ageNum < 0 || ageNum > 120) { setError('age', 'Enter a valid age'); valid = false; }
    else setError('age');

    if (!sex.value) { setError('sex', 'Required'); valid = false; } else setError('sex');

    return valid;
  }

  function buildWhatsappUrl(values) {
    const base = 'https://wa.me/256783079038';
    const text = `Hello Doctor Collins, Here are my details:%0A` +
      `Name: ${encodeURIComponent(values.name)}%0A` +
      `Phone: ${encodeURIComponent(values.phone)}%0A` +
      `Age: ${encodeURIComponent(values.age)}%0A` +
      `Sex: ${encodeURIComponent(values.sex)}%0A` +
      `Location: ${encodeURIComponent(values.location)}%0A` +
      `Reason: ${encodeURIComponent(values.reason)}`;
    return `${base}?text=${text}`;
  }

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    sendBtn.disabled = true;
    sendBtn.classList.add('loading');

    const values = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      age: document.getElementById('age').value.trim(),
      sex: document.getElementById('sex').value,
      location: document.getElementById('location').value.trim(),
      reason: document.getElementById('reason').value.trim(),
    };

    const url = buildWhatsappUrl(values);

    // small delay for UX
    setTimeout(() => {
      window.open(url, '_blank');
      sendBtn.disabled = false;
      sendBtn.classList.remove('loading');
    }, 400);
  });

  // Gate navigation to more.html
  moreBtn?.addEventListener('click', (e) => {
    if (!validateBasic()) {
      e.preventDefault();
      return;
    }
    // Pass basic details to more.html
    e.preventDefault();
    const params = new URLSearchParams({
      name: document.getElementById('name').value.trim(),
      age: document.getElementById('age').value.trim(),
      sex: document.getElementById('sex').value,
    });
    window.location.href = `more.html?${params.toString()}`;
  });
})();


