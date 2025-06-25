document.addEventListener("DOMContentLoaded", function () {
  // Generar código único estilo N58-20240522-XYZ123
  function generarCodigoUnico() {
    const fecha = new Date();
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `N58-${yyyy}${mm}${dd}-${random}`;
  }

  // Buscar el input con atributo data-reclamo="codigo"
  const campoCodigo = document.querySelector('[data-reclamo="codigo"]');
  
  if (campoCodigo) {
    const codigoGenerado = generarCodigoUnico();
    campoCodigo.value = codigoGenerado;
    console.log("Código generado:", codigoGenerado);
  } else {
    console.warn('No se encontró el campo con data-reclamo="codigo"');
  }

  const selector = document.querySelector('[data-reclamo-selector]');
  const grupos = document.querySelectorAll('[data-reclamo-group]');

  function actualizarVisibilidad(valorSeleccionado) {
    grupos.forEach(grupo => {
      const valorGrupo = grupo.getAttribute('data-reclamo-group');
      grupo.style.display = (valorGrupo === valorSeleccionado) ? 'grid' : 'none';
    });
  }

  // Inicializa con el valor actual (por si hay valor por defecto)
  if (selector) actualizarVisibilidad(selector.value);

  // Escucha los cambios del dropdown
  selector?.addEventListener('change', function () {
    actualizarVisibilidad(this.value);
  });
});
