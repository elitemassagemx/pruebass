document.addEventListener('DOMContentLoaded', () => {
  const galleryImages = [
    { src: 'QUESOSAHM.webp', title: 'Tabla Gourmet', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'choco2.webp', title: 'Chocolate', description: 'Deliciosos chocolates para disfrutar después del masaje' },
    { src: 'chococ.webp', title: 'Chocolate Cubierto', description: 'Fresas cubiertas de chocolate, un placer para los sentidos' },
    { src: 'chococc.webp', title: 'Variedad de Chocolates', description: 'Una selección de chocolates gourmet para todos los gustos' },
    { src: 'FRESASC.webp', title: 'Fresas Frescas', description: 'Fresas frescas y jugosas, perfectas para acompañar tu experiencia' },
    { src: 'QUESOS.webp', title: 'Selección de Quesos', description: 'Una variedad de quesos finos para degustar' },
    { src: 'QUESOSH.webp', title: 'Quesos y Embutidos', description: 'Combinación de quesos y embutidos selectos' },
    { src: 'QUESOSHM.webp', title: 'Tabla de Quesos y Más', description: 'Una presentación elegante de quesos y acompañamientos' },
    { src: 'QUESOSM.webp', title: 'Quesos Variados', description: 'Diferentes tipos de quesos para todos los paladares' },
    { src: 'QUESOSIG.webp', title: 'Quesos Gourmet', description: 'Quesos de alta calidad para una experiencia gastronómica única' },
    { src: 'SILLAS.webp', title: 'Área de Relajación', description: 'Espacio cómodo para relajarse antes o después del masaje' },
    { src: 'SILLASH.webp', title: 'Sillas de Masaje', description: 'Sillas ergonómicas para un masaje confortable' },
    { src: 'chen.webp', title: 'Ambiente Zen', description: 'Decoración que evoca tranquilidad y paz' },
    { src: 'copas.webp', title: 'Brindis Especial', description: 'Copas listas para celebrar momentos especiales' },
    { src: 'dif.webp', title: 'Difusor de Aromas', description: 'Aromaterapia para mejorar la experiencia de relajación' },
    { src: 'jamc.webp', title: 'Jamón Curado', description: 'Jamón de alta calidad para degustar' },
    { src: 'jam.webp', title: 'Selección de Jamones', description: 'Variedad de jamones para los amantes del buen comer' },
    { src: 'lujo.webp', title: 'Ambiente de Lujo', description: 'Detalles que hacen la diferencia en tu experiencia' },
    { src: 'lujo2.webp', title: 'Lujo y Confort', description: 'Espacios diseñados para tu máxima comodidad' },
    { src: 'noche.webp', title: 'Ambiente Nocturno', description: 'Iluminación perfecta para una noche relajante' },
    { src: 'noche1.webp', title: 'Noche Especial', description: 'Configuración romántica para parejas' },
    { src: 'paq1.webp', title: 'Paquete Especial 1', description: 'Combinación de servicios para una experiencia completa' },
    { src: 'paq2.webp', title: 'Paquete Especial 2', description: 'Otra opción de paquete para satisfacer tus necesidades' },
    { src: 'paq41.webp', title: 'Paquete Premium', description: 'Nuestra oferta más completa para clientes exigentes' },
    { src: 'rosa.webp', title: 'Toque Floral', description: 'Detalles florales para un ambiente acogedor' },
    { src: 'rosal.webp', title: 'Rosas y Luz', description: 'Combinación de flores y velas para un ambiente romántico' },
    { src: 'rosao.webp', title: 'Pétalos de Rosa', description: 'Decoración con pétalos para ocasiones especiales' },
    { src: 'semillas.webp', title: 'Aromaterapia Natural', description: 'Semillas y hierbas para aromaterapia' },
    { src: 'sub.webp', title: 'Sutileza y Elegancia', description: 'Detalles sutiles que marcan la diferencia' },
    { src: 'spa.webp', title: 'Experiencia Spa', description: 'Ambiente de spa para una relajación total' },
    { src: 'buda2.webp', title: 'Estatua de Buda', description: 'Elemento decorativo que aporta serenidad' },
    { src: 'mesap2.webp', title: 'Mesa de Tratamiento', description: 'Área preparada para tu sesión de masaje' },
    { src: 'papas.webp', title: 'Piedras Calientes', description: 'Piedras para masaje termal' },
    { src: 'mesa.webp', title: 'Mesa de Masaje', description: 'Equipamiento profesional para tu comodidad' },
    { src: 'buda.webp', title: 'Rincón Zen', description: 'Espacio inspirador para la meditación y relajación' },
  ];

  const gallery = document.getElementById('gallery');
  const body = document.body;

  galleryImages.forEach((image, index) => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const a = document.createElement('a');
    
    img.src = image.src;
    img.alt = image.title;
    img.loading = 'lazy';
    
    a.href = `#lightbox-${index}`;
    a.textContent = image.title;
    
    div.appendChild(img);
    div.appendChild(a);
    gallery.appendChild(div);

    // Create lightbox
    const lightbox = document.createElement('div');
    lightbox.id = `lightbox-${index}`;
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="content">
        <img src="${image.src}" alt="${image.title}">
        <p class="title">${image.title} - ${image.description}</p>
        <a href="#gallery" class="close"></a>
      </div>
    `;
    body.appendChild(lightbox);
  });

  // Close lightbox when clicking outside the image
  document.querySelectorAll('.lightbox').forEach(lightbox => {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        window.location.hash = 'gallery';
      }
    });
  });
});
