const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#site-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigation?.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
});

document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const button = form.querySelector('button[type="submit"]');
    const label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');

      button.textContent = 'Thank you — we will contact you';
      form.querySelectorAll('input, select, textarea').forEach((field) => field.disabled = true);
    } catch (error) {
      button.disabled = false;
      button.textContent = label;
      let note = form.querySelector('.form-error');
      if (!note) {
        note = document.createElement('p');
        note.className = 'form-error';
        form.append(note);
      }
      note.textContent = 'Sorry, that did not go through. Please try again, or WhatsApp us.';
    }
  });
});
