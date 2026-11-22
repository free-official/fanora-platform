const menuToggle = document.querySelector('#menuToggle');
const nav = document.querySelector('#mainNav');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));
document.querySelector('#year').textContent = new Date().getFullYear();
document.querySelector('#waitlistForm')?.addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  const note = document.querySelector('#formNote');
  if (!email.checkValidity()) { email.reportValidity(); return; }
  note.textContent = 'Thanks for your interest. The waitlist is a visual demo and your email has not been sent or stored.';
  email.value = '';
});