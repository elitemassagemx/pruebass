const BASE_URL = "https://raw.githubusercontent.com/elitemassagemx/Home/main/ICONOS/";
let services = {};
let currentPopupIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');

    // Elementos del DOM
    const verMasBtn = document.getElementById('ver-mas-galeria');
    const galleryGrid = document.querySelector('.gallery-grid');
    const body = document.body;
    const header = document.getElementById('main-header');
    let isExpanded = false;

    // Inicializaciones
    init();

    function init() {
        loadJSONData();
        setupPopup();
        setupGalleryAnimations();
        setupGalleryModal();
        setupGallery();
    }

    function handleImageError(img) {
        console.warn(`Failed to load image: ${img.src}`);
        img.style.display = 'none';
    }

    function buildImageUrl(iconPath) {
        if (!iconPath) return '';
        return iconPath.startsWith('http') ? iconPath : `${BASE_URL}${iconPath}`;
    }

    function getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with id "${id}" not found`);
        }
        return element;
    }

    function loadJSONData() {
        fetch('data.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                try {
                    text = text.replace(/\$\{BASE_URL\}/g, BASE_URL);
                    const cleanedText = text.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
                    const data = JSON.parse(cleanedText);
                    console.log('JSON data loaded successfully:', data);
                    services = data.services;
                    renderServices('masajes');
                    renderPackages();
                    setupFilters();
                    setupServiceCategories();
                    setupGallery();
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    console.error('Problematic JSON:', text);
                    throw error;
                }
            })
            .catch(error => {
                console.error('Error loading or parsing the JSON file:', error);
                const servicesList = getElement('services-list');
                const packageList = getElement('package-list');
                if (servicesList) servicesList.innerHTML = '<p>Error al cargar los servicios. Por favor, intente más tarde.</p>';
                if (packageList) packageList.innerHTML = '<p>Error al cargar los paquetes. Por favor, intente más tarde.</p>';
            });
    }

    function renderServices(category) {
        console.log(`Rendering services for category: ${category}`);
        const servicesList = document.getElementById('services-list');
        const template = document.getElementById('service-template');
        if (!servicesList || !template) {
            console.error('services-list or service-template not found');
            return;
        }

        servicesList.innerHTML = '';

        if (!Array.isArray(services[category])) {
            console.error(`services[${category}] is not an array:`, services[category]);
            servicesList.innerHTML = '<p>Error al cargar los servicios. Por favor, intente más tarde.</p>';
            return;
        }

        services[category].forEach((service, index) => {
            console.log(`Rendering service ${index + 1}:`, service);
            const serviceElement = template.content.cloneNode(true);
            
            const titleElement = serviceElement.querySelector('.service-title');
            if (titleElement) titleElement.textContent = service.title || 'Sin título';
            
            const serviceIcon = serviceElement.querySelector('.service-icon');
            if (serviceIcon && service.icon) {
                serviceIcon.src = buildImageUrl(service.icon);
                serviceIcon.onerror = () => handleImageError(serviceIcon);
            }
            
            const descriptionElement = serviceElement.querySelector('.service-description');
            if (descriptionElement) descriptionElement.textContent = service.description || 'Sin descripción';
            
            const benefitsContainer = serviceElement.querySelector('.benefits-container');
            if (benefitsContainer && Array.isArray(service.benefitsIcons)) {
                service.benefitsIcons.forEach((iconUrl, index) => {
                    const benefitItem = document.createElement('div');
                    benefitItem.classList.add('benefit-item');
                    const img = document.createElement('img');
                    img.src = buildImageUrl(iconUrl);
                    img.alt = 'Benefit icon';
                    img.classList.add('benefit-icon');
                    img.style.width = '48px';
                    img.style.height = '48px';
                    img.onerror = () => handleImageError(img);
                    const span = document.createElement('span');
                    span.textContent = service.benefits[index] || '';
                    benefitItem.appendChild(img);
                    benefitItem.appendChild(span);
                    benefitsContainer.appendChild(benefitItem);
                });
            }
            
            const durationIcon = serviceElement.querySelector('.duration-icon');
            if (durationIcon && service.durationIcon) {
                durationIcon.src = buildImageUrl(service.durationIcon);
                durationIcon.onerror = () => handleImageError(durationIcon);
            }
            
            const durationElement = serviceElement.querySelector('.service-duration');
            if (durationElement) durationElement.textContent = service.duration || 'Duración no especificada';

            const saberMasButton = serviceElement.querySelector('.saber-mas-button');
            if (saberMasButton) {
                saberMasButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showPopup(service, index);
                });
            }

            const serviceItem = serviceElement.querySelector('.service-item');
            if (serviceItem) {
                if (Array.isArray(service.benefits)) {
                    service.benefits.forEach(benefit => {
                        serviceItem.classList.add(benefit.toLowerCase().replace(/\s+/g, '-'));
                    });
                }
            }

            const serviceBackground = serviceElement.querySelector('.service-background');
            if (serviceBackground && service.backgroundImage) {
                serviceBackground.style.backgroundImage = `url(${buildImageUrl(service.backgroundImage)})`;
            }

            servicesList.appendChild(serviceElement);
        });
        console.log(`Rendered ${services[category].length} services`);
    }

    function renderPackages() {
        console.log('Rendering packages');
        const packageList = getElement('package-list');
        const template = getElement('package-template');
        if (!packageList || !template) {
            console.error('Package list or template not found');
            return;
        }

        packageList.innerHTML = '';
        if (!Array.isArray(services.paquetes)) {
            console.error('services.paquetes is not an array:', services.paquetes);
            packageList.innerHTML = '<p>Error al cargar los paquetes. Por favor, intente más tarde.</p>';
            return;
        }
        
        services.paquetes.forEach((pkg, index) => {
            console.log(`Rendering package ${index + 1}:`, pkg);
            const packageElement = template.content.cloneNode(true);
            
            packageElement.querySelector('.package-title').textContent = pkg.title || 'Sin título';
            packageElement.querySelector('.package-description').textContent = pkg.description || 'Sin descripción';
            
            const includesList = packageElement.querySelector('.package-includes-list');
            if (includesList && Array.isArray(pkg.includes)) {
                pkg.includes.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    includesList.appendChild(li);
                });
            }
            
            packageElement.querySelector('.package-duration-text').textContent = pkg.duration || 'Duración no especificada';
            
            const benefitsContainer = packageElement.querySelector('.package-benefits');
            if (benefitsContainer && Array.isArray(pkg.benefitsIcons)) {
                pkg.benefitsIcons.forEach((iconUrl, index) => {
                    const benefitItem = document.createElement('div');
                    benefitItem.classList.add('benefit-item');
                    const img = document.createElement('img');
                    img.src = buildImageUrl(iconUrl);
                    img.alt = 'Benefit icon';
                    img.classList.add('benefit-icon');
                    img.style.width = '48px';
                    img.style.height = '48px';
                    img.onerror = () => handleImageError(img);
                    const span = document.createElement('span');
                    span.textContent = pkg.benefits[index] || '';
                    benefitItem.appendChild(img);
                    benefitItem.appendChild(span);
                    benefitsContainer.appendChild(benefitItem);
                });
            }

            const saberMasButton = packageElement.querySelector('.saber-mas-button');
            if (saberMasButton) {
                saberMasButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showPopup(pkg, index, true);
                });
            }

            const packageItem = packageElement.querySelector('.package-item');
            if (packageItem && pkg.type) {
                packageItem.classList.add(pkg.type.toLowerCase().replace(/\s+/g, '-'));
            }

            const packageBackground = packageElement.querySelector('.package-background');
            if (packageBackground && pkg.backgroundImage) {
                packageBackground.style.backgroundImage = `url(${buildImageUrl(pkg.backgroundImage)})`;
            }

            packageList.appendChild(packageElement);
        });
        console.log(`Rendered ${services.paquetes.length} packages`);
    }

    function showPopup(data, index, isPackage = false) {
        console.log('Showing popup for:', data.title);
        const popup = getElement('popup');
        const popupContent = popup.querySelector('.popup-content');
        const popupTitle = getElement('popup-title');
        const popupImage = getElement('popup-image');
        const popupDescription = getElement('popup-description');
        const popupBenefits = getElement('popup-benefits');
        const popupIncludes = getElement('popup-includes');
        const popupDuration = getElement('popup-duration');
        const whatsappButton = getElement('whatsapp-button');
        if (!popup || !popupContent || !popupTitle || !popupImage || !popupDescription || !popupBenefits || !popupIncludes || !popupDuration || !whatsappButton) {
            console.error('One or more popup elements not found');
            return;
        }

        currentPopupIndex = index;

        popupTitle.textContent = data.title || '';
        popupImage.src = buildImageUrl(data.popupImage || data.image);
        popupImage.alt = data.title || '';
        popupImage.onerror = () => handleImageError(popupImage);
        popupDescription.textContent = data.popupDescription || data.description || '';
        
        // Limpiar contenedores existentes
        popupBenefits.innerHTML = '';
        popupIncludes.innerHTML = '';

        // Añadir beneficios
        if (Array.isArray(data.benefits) && Array.isArray(data.benefitsIcons)) {
            data.benefits.forEach((benefit, index) => {
                const benefitItem = document.createElement('div');
                benefitItem.classList.add('popup-benefits-item');
                const img = document.createElement('img');
                img.src = buildImageUrl(data.benefitsIcons[index]);
                img.alt = benefit;
                const span = document.createElement('span');
                span.textContent = benefit;
                benefitItem.appendChild(img);
                benefitItem.appendChild(span);
                popupBenefits.appendChild(benefitItem);
            });
        }

        // Añadir incluye (solo para paquetes)
        if (isPackage && Array.isArray(data.includes)) {
            data.includes.forEach(item => {
                const includeItem = document.createElement('div');
                includeItem.classList.add('popup-includes-item');
                const img = document.createElement('img');
                img.src = buildImageUrl('check-icon.png');
                img.alt = 'Incluido';
                const span = document.createElement('span');
                span.textContent = item;
                includeItem.appendChild(img);
                includeItem.appendChild(span);
                popupIncludes.appendChild(includeItem);
            });
        }

        popupDuration.textContent = data.duration || '';

        whatsappButton.onclick = () => sendWhatsAppMessage('Reservar', data.title);

        setupPopupCarousel(isPackage);

        popup.style.display = 'block';
    }

    function setupPopupCarousel(isPackage) {
        const popupContent = document.querySelector('.popup-content');
        let startX, currentX;

        popupContent.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        popupContent.addEventListener('touchmove', (e) => {
            if (!startX) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                navigatePopup(diff > 0 ? 1 : -1, isPackage);
                startX = null;
            }
        });

        popupContent.addEventListener('touchend', () => {
            startX = null;
        });
    }

    function navigatePopup(direction, isPackage) {
        const items = isPackage ? services.paquetes : services[getCurrentCategory()];
        currentPopupIndex = (currentPopupIndex + direction + items.length) % items.length;
        showPopup(items[currentPopupIndex], currentPopupIndex, isPackage);
    }

    function getCurrentCategory() {
        const checkedRadio = document.querySelector('.service-category-toggle input[type="radio"]:checked');
        return checkedRadio ? checkedRadio.value : 'masajes';
    }

    function sendWhatsAppMessage(action, serviceTitle) {
        console.log(`Sending WhatsApp message for: ${action} - ${serviceTitle}`);
        const message = encodeURIComponent(`Hola! Quiero ${action} un ${serviceTitle}`);
        const url = `https://wa.me/5215640020305?text=${message}`;
        window.open(url, '_blank');
    }

    function setupServiceCategories() {
        const categoryInputs = document.querySelectorAll('.service-category-toggle input[type="radio"]');
        categoryInputs.forEach(input => {
            input.addEventListener('change', () => {
                const category = input.value;
                renderServices(category);
                setupBenefitsNav(category);
                setupPackageNav();
            });
        });
        setupBenefitsNav('masajes');
        setupPackageNav();
    }

    function setupBenefitsNav(category) {
        const benefitsNav = document.querySelector('.benefits-nav');
        if (!benefitsNav) return;

        benefitsNav.innerHTML = '';
        const allBenefits = new Set();
        const benefitIcons = new Map();

    if (services[category]) {
            services[category].forEach(service => {
                if (Array.isArray(service.benefits) && Array.isArray(service.benefitsIcons)) {
                    service.benefits.forEach((benefit, index) => {
                        if (!allBenefits.has(benefit)) {
                            allBenefits.add(benefit);
                            benefitIcons.set(benefit, service.benefitsIcons[index]);
                        }
                    });
                }
            });
        }

        const allButton = document.createElement('button');
        allButton.classList.add('benefit-btn', 'active');
        allButton.dataset.filter = 'all';
        allButton.innerHTML = `
            <img src="${BASE_URL}todos.png" alt="Todos" style="width: 48px; height: 48px;">
            <span>Todos</span>
        `;
        benefitsNav.appendChild(allButton);

        allBenefits.forEach(benefit => {
            const button = document.createElement('button');
            button.classList.add('benefit-btn');
            button.dataset.filter = benefit.toLowerCase().replace(/\s+/g, '-');
            
            const iconUrl = benefitIcons.get(benefit) || `${BASE_URL}${benefit.toLowerCase().replace(/\s+/g, '-')}.png`;
            
            button.innerHTML = `
                <img src="${buildImageUrl(iconUrl)}" alt="${benefit}" style="width: 48px; height: 48px;">
                <span>${benefit}</span>
            `;
            benefitsNav.appendChild(button);
        });

        setupFilterButtons('.benefits-nav', '#services-list', '.service-item');
    }

    function setupPackageNav() {
        const packageNav = document.querySelector('.package-nav');
        if (!packageNav) return;

        packageNav.innerHTML = '';
        const allPackages = new Set();

        if (services.paquetes) {
            services.paquetes.forEach(pkg => {
                allPackages.add(pkg.title);
            });
        }

        const allButton = document.createElement('button');
        allButton.classList.add('package-btn', 'active');
        allButton.dataset.filter = 'all';
        allButton.innerHTML = `
            <img src="${BASE_URL}todos.png" alt="Todos" style="width: 48px; height: 48px;">
            <span>Todos</span>
        `;
        packageNav.appendChild(allButton);

        allPackages.forEach(packageTitle => {
            const button = document.createElement('button');
            button.classList.add('package-btn');
            button.dataset.filter = packageTitle.toLowerCase().replace(/\s+/g, '-');
            button.innerHTML = `
                <img src="${BASE_URL}${packageTitle.toLowerCase().replace(/\s+/g, '-')}-icon.png" alt="${packageTitle}" style="width: 48px; height: 48px;">
                <span>${packageTitle}</span>
            `;
            packageNav.appendChild(button);
        });

        setupFilterButtons('.package-nav', '#package-list', '.package-item');
    }

    function setupPopup() {
        const popup = getElement('popup');
        const closeButton = popup.querySelector('.close');
        if (!popup || !closeButton) return;

        closeButton.addEventListener('click', () => {
            console.log('Closing popup');
            popup.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === popup) {
                console.log('Closing popup (clicked outside)');
                popup.style.display = 'none';
            }
        });
    }

    function setupGallery() {
        const galleryCarousel = document.querySelector('.carousel-inner');
        const galleryGrid = document.querySelector('.gallery-grid');
        const verMasButton = getElement('ver-mas-galeria');

        if (!galleryCarousel || !galleryGrid || !verMasButton) {
            console.error('Gallery elements not found');
            return;
        }

        // Aquí deberías cargar las imágenes de la galería desde tu fuente de datos
        const galleryImages = [
    { src: 'QUESOSAHM.jpg', title: 'Tabla Gourmet', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'choco2.JPG', title: 'choco2', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'chococ.JPG', title: 'chococ', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'chococc.JPG', title: 'chococc', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'FRESASC.jpg', title: 'fresasc', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'QUESOS.jpg', title: 'quesos', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'QUESOSH.jpg', title: 'quesosh', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'QUESOSHM.jpg', title: 'quesoshm', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'QUESOSM.jpg', title: 'quesosm', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'QUESOSIG.jpg', title: 'quesosig', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'SILLAS.jpg', title: 'sillas', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'SILLASH.jpg', title: 'sillash', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'chen.JPG', title: 'chen', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'copas.JPG', title: 'copas', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'dif.JPG', title: 'dif', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'QUESOSAHM.jpg', title: 'quesosahm', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'jamc.JPG', title: 'jamc', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'jam.JPG', title: 'jam', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'lujo.JPG', title: 'lujo', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'lujo2.JPG', title: 'lujo2', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'noche.JPG', title: 'noche', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'noche1.JPG', title: 'noche1', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'paq1.JPG', title: 'paq1', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'paq2.JPG', title: 'paq2', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'paq41.JPG', title: 'paq41', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'rosa.JPG', title: 'rosa', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'rosal.JPG', title: 'rosal', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'rosao.JPG', title: 'rosao', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'semillas.JPG', title: 'semillas', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'sub.JPG', title: 'sub', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'spa.png', title: 'spa', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'buda2.png', title: 'buda2', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'mesap2.png', title: 'mesap2', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'papas.png', title: 'papas', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'mesa.png', title: 'mesa', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
    { src: 'buda.png', title: 'Buda', description: 'Después de tu masaje en pareja saborea una exquisita selección de jamón curado, quesos gourmet, fresas cubiertas de chocolate y copas de vino. Un toque de lujo y placer compartido para complementar tu visita' },
];


        // Configurar el carrusel
        galleryImages.forEach((image, index) => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            if (index === 0) carouselItem.classList.add('active');
            
            carouselItem.innerHTML = `
                <img src="${buildImageUrl(image.src)}" class="d-block w-100" alt="${image.title}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${image.title}</h5>
                    <p>${image.description}</p>
                </div>
            `;
            carouselItem.addEventListener('click', () => {
                showImageDetails(image);
            });
            galleryCarousel.appendChild(carouselItem);
        });

        // Configurar la cuadrícula
        const gridImages = galleryImages.slice(0, 12); // Mostrar solo las primeras 12 imágenes en la cuadrícula
        gridImages.forEach(image => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');
            galleryItem.innerHTML = `
                <img src="${buildImageUrl(image.src)}" alt="${image.title}">
                <div class="image-overlay">
                    <h3 class="image-title">${image.title}</h3>
                    <p class="image-description">${image.description}</p>
                </div>
            `;
            galleryItem.addEventListener('click', () => {
                showImageDetails(image);
            });
            galleryGrid.appendChild(galleryItem);
        });

        verMasButton.addEventListener('click', () => {
            galleryGrid.style.display = galleryGrid.style.display === 'none' ? 'grid' : 'none';
            verMasButton.textContent = galleryGrid.style.display === 'none' ? 'Ver más' : 'Ver menos';
        });
    }

    function showImageDetails(image) {
        const modal = getElement('imageModal');
        const modalImg = getElement('modalImage');
        const modalDescription = getElement('modalDescription');

        if (!modal || !modalImg || !modalDescription) {
            console.error('Modal elements not found');
            return;
        }

        modalImg.src = buildImageUrl(image.src);
        modalImg.alt = image.title;
        modalDescription.innerHTML = `<h3>${image.title}</h3><p>${image.description}</p>`;
        modal.style.display = 'block';
    }

    function setupGalleryAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.warn('GSAP or ScrollTrigger not loaded. Gallery animations will not work.');
            return;
        }

        console.log('GSAP and ScrollTrigger are loaded');
        gsap.registerPlugin(ScrollTrigger);

        const gallery = document.querySelector('.gallery-container');
        if (!gallery) {
            console.error('Gallery container not found');
            return;
        }

        console.log('Gallery container found');
        const images = gsap.utils.toArray('.gallery-container img');
        
        ScrollTrigger.create({
            trigger: gallery,
            start: "top 80%",
            end: "bottom 20%",
            onEnter: () => {
                console.log('Gallery entered viewport');
                gallery.classList.add('is-visible');
                animateImages();
            },
            onLeave: () => {
                console.log('Gallery left viewport');
                gallery.classList.remove('is-visible');
            },
            onEnterBack: () => {
                console.log('Gallery entered viewport (scrolling up)');
                gallery.classList.add('is-visible');
                animateImages();
            },
            onLeaveBack: () => {
                console.log('Gallery left viewport (scrolling up)');
                gallery.classList.remove('is-visible');
            }
        });

        function animateImages() {
            images.forEach((img, index) => {
                gsap.fromTo(img, 
                    { scale: 0.8, opacity: 0 },
                    { 
                        scale: 1, 
                        opacity: 1, 
                        duration: 0.5, 
                        ease: "power2.out",
                        delay: index * 0.1,
                        onStart: () => console.log(`Image ${index + 1} animation started`)
                    }
                );
            });
        }

        console.log(`Found ${images.length} images in the gallery`);
    }

    function setupGalleryModal() {
        const modal = getElement('imageModal');
        const closeBtn = modal.querySelector('.close');

        closeBtn.onclick = function() {
            modal.style.display = "none";
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    function setupFilters() {
        setupFilterButtons('.benefits-nav', '#services-list', '.service-item');
        setupFilterButtons('.package-nav', '#package-list', '.package-item');
    }

    function setupFilterButtons(navSelector, listSelector, itemSelector) {
        const filterButtons = document.querySelectorAll(`${navSelector} button`);
        const items = document.querySelectorAll(itemSelector);

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                
                // Actualizar botones activos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                // Filtrar elementos
                items.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Manejo de errores de carga de imágenes
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'https://raw.githubusercontent.com/elitemassagemx/Home/main/ICONOS/error.webp';
        });
    });
});
