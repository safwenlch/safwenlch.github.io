// Menu mobile
const burger = document.querySelector('.burger'), menu = document.getElementById('menu');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});

// Formulaire de contact : validation + envoi (Web3Forms)
const form = document.getElementById('contact');
if (form) {
  const lettre = 'A-Za-zÀ-ÖØ-öø-ÿ';
  const regles = {
    prenom: { re: new RegExp(`^[${lettre}]+(?:[ '’-][${lettre}]+)*$`), min: 2, vide: 'Indique ton prénom.', faux: 'Prénom invalide : lettres uniquement (2 caractères minimum).' },
    email: { re: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/, vide: 'Indique ton adresse e-mail.', faux: 'Adresse e-mail invalide. Exemple : nom@domaine.fr' },
    tel: { re: /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, optionnel: true, faux: 'Numéro invalide. Exemple : 06 12 34 56 78 ou +33 6 12 34 56 78' },
    msg: { re: /^[\s\S]{10,}$/, vide: 'Écris un message.', faux: 'Message trop court (10 caractères minimum).' }
  };
  const verifie = id => {
    const champ = document.getElementById(id), r = regles[id], v = champ.value.trim();
    let msg = '';
    if (!v) msg = r.optionnel ? '' : r.vide;
    else if (!r.re.test(v) || (r.min && v.length < r.min)) msg = r.faux;
    document.getElementById('e-' + (id === 'msg' ? 'msg' : id)).textContent = msg;
    champ.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };
  Object.keys(regles).forEach(id => {
    const c = document.getElementById(id);
    c.addEventListener('blur', () => verifie(id));
    c.addEventListener('input', () => { if (c.getAttribute('aria-invalid') === 'true') verifie(id); });
  });
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const statut = document.getElementById('statut');
    const ok = Object.keys(regles).map(verifie).every(Boolean);
    if (!ok) { statut.className = 'ko'; statut.textContent = 'Corrige les champs en rouge avant d’envoyer.'; return; }
    statut.className = ''; statut.textContent = 'Envoi en cours…';
    try {
      const rep = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: new FormData(form) });
      const data = await rep.json();
      if (!data.success) throw new Error(data.message);
      statut.className = 'ok'; statut.textContent = 'Message envoyé. Merci, je te réponds vite.';
      form.reset();
    } catch (err) {
      statut.className = 'ko'; statut.textContent = 'L’envoi a échoué. Réessaie, ou écris à slachhabpro@gmail.com.';
    }
  });
}
