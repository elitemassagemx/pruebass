document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('plan-form');
    const steps = Array.from(form.querySelectorAll('.form-step'));
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.querySelector('.progress-bar');
    const saveProgressBtn = document.querySelector('.save-progress-btn');
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-flex';
        nextBtn.style.display = stepIndex === steps.length - 1 ? 'none' : 'inline-flex';
        submitBtn.style.display = stepIndex === steps.length - 1 ? 'inline-flex' : 'none';
        updateProgressBar();
    }

    function updateProgressBar() {
        const progress = ((currentStep + 1) / steps.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                showErrorMessage(input, 'Este campo es requerido');
            } else {
                input.classList.remove('error');
                hideErrorMessage(input);
            }
        });
        return isValid;
    }

    function showErrorMessage(input, message) {
        let errorMessage = input.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            input.parentNode.insertBefore(errorMessage, input.nextSibling);
        }
        errorMessage.textContent = message;
    }

    function hideErrorMessage(input) {
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
    }

    nextBtn.addEventListener('click', () => {
        if (validateStep(steps[currentStep])) {
            currentStep++;
            showStep(currentStep);
        }
    });

    prevBtn.addEventListener('click', () => {
        currentStep--;
        showStep(currentStep);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateStep(steps[currentStep])) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            console.log('Datos del formulario:', data);
            // Aquí puedes agregar la lógica para enviar los datos al servidor
            showThankYouMessage();
        }
    });

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
            currentStep = 0;
            showStep(currentStep);
        });
    }

    saveProgressBtn.addEventListener('click', saveProgress);

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

    // Animación suave al cambiar de paso
    function smoothTransition(step) {
        step.style.opacity = 0;
        step.style.transform = 'translateX(20px)';
        setTimeout(() => {
            step.style.opacity = 1;
            step.style.transform = 'translateX(0)';
        }, 50);
    }

    // Modificar la función showStep para incluir la animación
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            if (index === stepIndex) {
                step.classList.add('active');
                smoothTransition(step);
            } else {
                step.classList.remove('active');
            }
        });
        prevBtn.style.display = stepIndex === 0 ? 'none' : 'inline-flex';
        nextBtn.style.display = stepIndex === steps.length - 1 ? 'none' : 'inline-flex';
        submitBtn.style.display = stepIndex === steps.length - 1 ? 'inline-flex' : 'none';
        updateProgressBar();
    }

    // Función para validar el correo electrónico
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Función para validar el número de teléfono (formato mexicano)
    function validatePhone(phone) {
        const re = /^(\+?52|0)?\s?1?\s?[2-9]\d{2}\s?\d{3}\s?\d{4}$/;
        return re.test(phone);
    }

    // Modificar la función validateStep para incluir validaciones específicas
    function validateStep(step) {
        const inputs = step.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showErrorMessage(input, 'Este campo es requerido');
            } else if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                showErrorMessage(input, 'Por favor, ingrese un correo electrónico válido');
            } else if (input.type === 'tel' && !validatePhone(input.value)) {
                isValid = false;
                showErrorMessage(input, 'Por favor, ingrese un número de teléfono válido');
            } else {
                hideErrorMessage(input);
            }
        });
        return isValid;
    }

    // Función para mostrar un mensaje de confirmación antes de guardar el progreso
    function confirmSaveProgress() {
        const confirmed = confirm('¿Estás seguro de que quieres guardar tu progreso? Podrás continuar más tarde desde donde lo dejaste.');
        if (confirmed) {
            saveProgress();
        }
    }

    // Reemplazar el evento click del botón de guardar progreso
    saveProgressBtn.removeEventListener('click', saveProgress);
    saveProgressBtn.addEventListener('click', confirmSaveProgress);

    // Inicializar
    showStep(currentStep);
});
