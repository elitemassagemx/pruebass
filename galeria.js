document.addEventListener('DOMContentLoaded', () => {
  const BASE_URL = "https://raw.githubusercontent.com/elitemassagemx/Home/main/IMG/";

  const galleryImages = [
    { src: 'QUESOSAHM.webp', title: 'Tabla Gourmet', description: 'LLENARa' }, 'LLENARa' },
    { src: 'choco2.webp', title: 'Chocolate', description: 'LLENARa' }, 
    { src: 'chococ.webp', title: 'Chocolate Cubierto', description: 'LLENARa' },
    { src: 'chococc.webp', title: 'Variedad de Chocolates', description: 'LLENARa' },
    { src: 'FRESASC.webp', title: 'Fresas Frescas', description: 'LLENARa' },
    { src: 'QUESOS.webp', title: 'Selección de Quesos', description: 'LLENARa' },
    { src: 'QUESOSH.webp', title: 'Quesos y Embutidos', description: 'LLENARa' },
    { src: 'QUESOSHM.webp', title: 'Tabla de Quesos y Más', description: 'LLENARa' }, 
    { src: 'QUESOSM.webp', title: 'Quesos Variados', description: 'LLENARa' }, 
    { src: 'QUESOSIG.webp', title: 'Quesos Gourmet', description: 'LLENARa' }, 'Quesos de alta calidad para una experiencia gastronómica única' },
    { src: 'SILLAS.webp', title: 'Área de Relajación', description: 'LLENARa' }, 'Espacio cómodo para relajarse antes o después del masaje' },
    { src: 'SILLASH.webp', title: 'Sillas de Masaje', description: 'LLENARa' }, 'Sillas ergonómicas para un masaje confortable' },
    { src: 'chen.webp', title: 'Ambiente Zen', description: 'LLENARa' }, 'Decoración que evoca tranquilidad y paz' },
    { src: 'copas.webp', title: 'Brindis Especial', description: 'LLENARa' }, 'Copas listas para celebrar momentos especiales' },
    { src: 'dif.webp', title: 'Difusor de Aromas', description: 'LLENARa' }, 'Aromaterapia para mejorar la experiencia de relajación' },
    { src: 'jamc.webp', title: 'Jamón Curado', description: 'LLENARa' }, '
    { src: 'jam.webp', title: 'Selección de Jamones', description: 'LLENARa' },
    { src: 'lujo.webp', title: 'Ambiente de Lujo', description: 'LLENARa' }, 
    { src: 'lujo2.webp', title: 'Lujo y Confort', description: 'LLENARa' }, 'Espacios diseñados para tu máxima comodidad' },
    { src: 'noche.webp', title: 'Ambiente Nocturno', description: 'LLENARa' }, 
    { src: 'noche1.webp', title: 'Noche Especial', description: 'LLENARa' }, 'Configuración romántica para parejas' },
    { src: 'paq1.webp', title: 'Paquete Especial 1', description: 'LLENARa' }, 'Combinación de servicios para una experiencia completa' },
    { src: 'paq2.webp', title: 'Paquete Especial 2', description: 'LLENARa' }, 'Otra opción de paquete para satisfacer tus necesidades' },
    { src: 'paq41.webp', title: 'Paquete Premium', description: 'LLENARa' }, 
    { src: 'rosa.webp', title: 'Toque Floral', description: 'LLENARa' }, 
    { src: 'rosal.webp', title: 'Rosas y Luz', description: 'LLENARa' },
    { src: 'rosao.webp', title: 'Pétalos de Rosa', description: 'LLENARa' }, 
    { src: 'semillas.webp', title: 'Aromaterapia Natural', description: 'LLENARa' }, 
    { src: 'sub.webp', title: 'Sutileza y Elegancia', description: 'LLENARa' }, 
    { src: 'spa.webp', title: 'Experiencia Spa', description: 'LLENARa' }, 
    { src: 'buda2.webp', title: 'Estatua de Buda', description: 'LLENARa' }, 
    { src: 'mesap2.webp', title: 'Mesa de Tratamiento', description: 'LLENARa' }, 
    { src: 'papas.webp', title: 'Piedras Calientes', description: 'LLENARa' },
    { src: 'mesa.webp', title: 'Mesa de Masaje', description: 'LLENARa' }, 
    { src: 'buda.webp', title: 'Rincón Zen', description: 'LLENARa' },
  ];

  const gallery = document.getElementById('gallery');

  galleryImages.forEach((image, index) => {
    const div = document.createElement('div');
    const img = document.createElement('img');
    const a = document.createElement('a');
    
    img.src = BASE_URL + image.src;
    img.alt = image.title;
    img.loading = 'lazy';
    
    a.href = `#lightbox-${index}`;
    a.textContent = image.title;
    
    div.appendChild(img);
    div.appendChild(a);
    gallery.appendChild(div);

    // Create or update lightbox
    let lightbox = document.getElementById(`lightbox-${index}`);
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = `lightbox-${index}`;
      lightbox.className = 'lightbox';
      document.body.appendChild(lightbox);
    }

    lightbox.innerHTML = `
      <div class="content">
        <img src="${BASE_URL + image.src}" alt="${image.title}">
        <p class="title">${image.title} - ${image.description}</p>
        <a href="#gallery" class="close"></a>
      </div>
    `;
  });

  // Close lightbox when clicking outside the image
  document.querySelectorAll('.lightbox').forEach(lightbox => {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        window.location.hash = 'gallery';
      }
    });
  });

  // Ajustar diseño en cambios de tamaño de ventana
  window.addEventListener('resize', adjustGalleryLayout);
  adjustGalleryLayout(); // Ajustar al cargar la página

  function adjustGalleryLayout() {
    const isMobile = window.innerWidth <= 768;
    gallery.style.display = isMobile ? 'flex' : 'grid';
    if (isMobile) {
      gallery.style.flexDirection = 'column';
      gallery.style.alignItems = 'center';
    } else {
      gallery.style.gridTemplateColumns = 'repeat(auto-fill, minmax(200px, 1fr))';
    }
  }
});
