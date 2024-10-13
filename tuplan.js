document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('plan-form');
    const progressBar = document.querySelector('.progress-bar');
    const saveProgressBtn = document.querySelector('.save-progress-btn');
    const submitBtn = document.getElementById('submit-btn');

    // Función para actualizar la barra de progreso
    function updateProgressBar() {
        const formFields = form.querySelectorAll('input, select, textarea');
        const filledFields = Array.from(formFields).filter(field => field.value.trim() !== '').length;
        const progress = (filledFields / formFields.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Añadir evento de input a todos los campos del formulario
    form.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', updateProgressBar);
    });

    // Función para validar campos
    function validateField(field) {
        if (field.hasAttribute('required') && !field.value.trim()) {
            showErrorMessage(field, 'Este campo es requerido');
            return false;
        } else if (field.type === 'email' && !validateEmail(field.value)) {
            showErrorMessage(field, 'Por favor, ingrese un correo electrónico válido');
            return false;
        } else if (field.type === 'tel' && !validatePhone(field.value)) {
            showErrorMessage(field, 'Por favor, ingrese un número de teléfono válido');
            return false;
        } else {
            hideErrorMessage(field);
            return true;
        }
    }

    // Funciones auxiliares para mostrar/ocultar mensajes de error
    function showErrorMessage(field, message) {
        let errorMessage = field.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            field.parentNode.insertBefore(errorMessage, field.nextSibling);
        }
        errorMessage.textContent = message;
        field.classList.add('error');
    }

    function hideErrorMessage(field) {
        const errorMessage = field.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
        field.classList.remove('error');
    }

    // Validación de correo electrónico
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Validación de número de teléfono (formato mexicano)
    function validatePhone(phone) {
        const re = /^(\+?52|0)?\s?1?\s?[2-9]\d{2}\s?\d{3}\s?\d{4}$/;
        return re.test(phone);
    }

    // Evento submit del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        let isValid = true;
        form.querySelectorAll('input, select, textarea').forEach(field => {
            if (!validateField(field)) {
                isValid = false;
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        if (isValid) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log('Datos del formulario:', data);
            showThankYouMessage();
        }
    });

    // Función para mostrar mensaje de agradecimiento
    function showThankYouMessage() {
        const thankYouMessage = document.createElement('div');
        thankYouMessage.className = 'thank-you-message';
        thankYouMessage.innerHTML = `
            <h3>¡Gracias por preconfigurar tu experiencia!</h3>
            <p>Nuestro equipo de expertos en bienestar revisará tu solicitud y te contactará pronto para finalizar los detalles de tu experiencia en Elite Massage.</p>
            <button class="close-message-btn">Cerrar</button>
        `;
        document.body.appendChild(thankYouMessage);

        const closeBtn = thankYouMessage.querySelector('.close-message-btn');
        closeBtn.addEventListener('click', () => {
            thankYouMessage.remove();
            form.reset();
            updateProgressBar();
        });
    }

    // Funciones para guardar y cargar progreso
    saveProgressBtn.addEventListener('click', confirmSaveProgress);

    function confirmSaveProgress() {
        const confirmed = confirm('¿Estás seguro de que quieres guardar tu progreso? Podrás continuar más tarde desde donde lo dejaste.');
        if (confirmed) {
            saveProgress();
        }
    }

    function saveProgress() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        localStorage.setItem('tuPlanProgress', JSON.stringify(data));
        alert('Tu progreso ha sido guardado. Puedes continuar más tarde.');
    }

    function loadProgress() {
        const savedProgress = localStorage.getItem('tuPlanProgress');
        if (savedProgress) {
            const data = JSON.parse(savedProgress);
            Object.keys(data).forEach(key => {
                const input = form.querySelector(`[name="${key}"]`);
                if (input) {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = input.value === data[key];
                    } else {
                        input.value = data[key];
                    }
                }
            });
            updateProgressBar();
            alert('Tu progreso ha sido cargado. Puedes continuar desde donde lo dejaste.');
        }
    }

    // Cargar progreso al iniciar
    loadProgress();

    // Inicializar tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseover', showTooltip);
        tooltip.addEventListener('mouseout', hideTooltip);
    });

    function showTooltip(e) {
        const tooltipText = e.target.getAttribute('data-tooltip');
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'tooltip';
        tooltipEl.textContent = tooltipText;
        document.body.appendChild(tooltipEl);

        const rect = e.target.getBoundingClientRect();
        tooltipEl.style.top = `${rect.bottom + window.scrollY + 5}px`;
        tooltipEl.style.left = `${rect.left + window.scrollX}px`;
    }

    function hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Mostrar/ocultar campo de texto para "Otro" en Tipo de Experiencia
    const otroExperienciaCheckbox = form.querySelector('input[name="experiencia"][value="otro"]');
    const otroExperienciaInput = document.getElementById('otro-experiencia');

    otroExperienciaCheckbox.addEventListener('change', function() {
        otroExperienciaInput.classList.toggle('hidden', !this.checked);
    });

    // Inicializar
    updateProgressBar();
});
