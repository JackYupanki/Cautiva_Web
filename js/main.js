const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold:0.12 });
revealEls.forEach(el=>io.observe(el));

// ----- Formulario de pedido -> WhatsApp -----
const WHATSAPP_NUMBER = "51944440455"; // 51 = Perú + número de la empresa

const pedidoForm = document.getElementById('pedido-form');
if (pedidoForm) {
  pedidoForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // limpiar errores previos
    pedidoForm.querySelectorAll('.pf-field').forEach(f => f.classList.remove('pf-error'));

    const data = new FormData(pedidoForm);
    const get = (k) => (data.get(k) || '').toString().trim();

    const nombre = get('nombre');
    const telefono = get('telefono');
    const empresa = get('empresa');
    const direccion = get('direccion');
    const fecha = get('fecha');
    const hora = get('hora');
    const comentarios = get('comentarios');

    // validación simple de campos obligatorios
    const requeridos = ['nombre', 'telefono', 'direccion'];
    let valido = true;
    requeridos.forEach((campo) => {
      const val = get(campo);
      const field = document.getElementById('pf-' + campo);
      if (!val) {
        valido = false;
        if (field) field.closest('.pf-field').classList.add('pf-error');
      }
    });

    if (!valido) {
      pedidoForm.querySelector('.pf-error input, .pf-error select')?.focus();
      return;
    }

    const fechaFmt = fecha ? new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
      day: '2-digit', month: 'long', year: 'numeric'
    }) : '';

    const lineas = [
      '¡Hola Cautiva! 👋 Quisiera solicitar una cotización de concreto premezclado:',
      '',
      `*Nombre:* ${nombre}`,
      `*Teléfono:* ${telefono}`,
      empresa ? `*Empresa / obra:* ${empresa}` : null,
      `*Dirección o referencia:* ${direccion}`,
      fechaFmt ? `*Fecha estimada de vaciado:* ${fechaFmt}` : null,
      hora ? `*Hora aproximada:* ${hora}` : null,
      comentarios ? `*Comentarios / detalles:* ${comentarios}` : null,
    ].filter(Boolean);

    const mensaje = encodeURIComponent(lineas.join('\n'));
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`;
    window.open(url, '_blank', 'noopener');
  });

  // quitar marca de error al corregir el campo
  pedidoForm.querySelectorAll('input, select, textarea').forEach((el) => {
    el.addEventListener('input', () => el.closest('.pf-field')?.classList.remove('pf-error'));
  });
}

// ----- Filtro de proyectos legacy (solo actúa si existen .g-item) -----
const filterChips = document.querySelectorAll('.filter-chip');
const galleryItems = document.querySelectorAll('.g-item');
if (filterChips.length && galleryItems.length) {
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      const categoria = chip.dataset.filter;
      galleryItems.forEach((item) => {
        const mostrar = categoria === 'todos' || item.dataset.category === categoria;
        item.style.display = mostrar ? '' : 'none';
      });
    });
  });
}