
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
    const observerOptions = {
        threshold: 0.1
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.fade-in').forEach(element => {
        observer.observe(element);
    });
});
document.querySelectorAll('.border.rounded-lg button').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        const icon = button.querySelector('i');
        content.classList.toggle('hidden');
        icon.classList.toggle('rotate-180');
        document.querySelectorAll('.border.rounded-lg button').forEach(otherButton => {
            if (otherButton !== button) {
                const otherContent = otherButton.nextElementSibling;
                const otherIcon = otherButton.querySelector('i');
                otherContent.classList.add('hidden');
                otherIcon.classList.remove('rotate-180');
            }
        });
    });
});
function cerrarPromo() {
    const promo = document.getElementById('promo-flotante');
    promo.style.display = 'none';
}
import { db, collection, addDoc } from './firebase-config.js';
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitButton = e.target.querySelector('button[type="submit"]');
    const spinner = document.getElementById('submitSpinner');
    const messageDiv = document.getElementById('formMessage');
    submitButton.disabled = true;
    submitButton.classList.add('opacity-50');
    spinner.classList.remove('hidden');
    messageDiv.classList.add('hidden');
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        email: document.getElementById('email').value.trim(),
        servicio: document.getElementById('servicio').value,
        mensaje: document.getElementById('mensaje').value.trim(),
        fecha: new Date().toISOString()
    };
    if (!formData.nombre || !formData.telefono || !formData.email || !formData.servicio || !formData.mensaje) {
        messageDiv.textContent = "Por favor, completa todos los campos.";
        messageDiv.className = "mt-4 p-4 rounded-lg bg-red-100 text-red-700";
        messageDiv.classList.remove('hidden');
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50');
        spinner.classList.add('hidden');
        return;
    }
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    function isValidPhone(phone) {
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneRegex.test(phone);
    }
    if (!isValidEmail(formData.email)) {
        messageDiv.textContent = "Por favor, ingresa un email válido.";
        messageDiv.className = "mt-4 p-4 rounded-lg bg-red-100 text-red-700";
        messageDiv.classList.remove('hidden');
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50');
        spinner.classList.add('hidden');
        return;
    }
    if (!isValidPhone(formData.telefono)) {
        messageDiv.textContent = "Por favor, ingresa un número de teléfono válido.";
        messageDiv.className = "mt-4 p-4 rounded-lg bg-red-100 text-red-700";
        messageDiv.classList.remove('hidden');
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50');
        spinner.classList.add('hidden');
        return;
    }
    const confirmSend = confirm("¿Estás seguro de enviar el mensaje?");
    if (!confirmSend) {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50');
        spinner.classList.add('hidden');
        return;
    }
    try {
        await addDoc(collection(db, "contactos"), formData);
        messageDiv.textContent = "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.";
        messageDiv.className = "mt-4 p-4 rounded-lg bg-green-100 text-green-700";
        messageDiv.classList.remove('hidden');
        e.target.reset();
    } catch (error) {
        let errorMessage = "Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.";
        if (error.code === 'permission-denied') {
            errorMessage = "No tienes permisos para enviar mensajes.";
        } else if (error.code === 'unavailable') {
            errorMessage = "El servicio no está disponible en este momento. Por favor, intenta más tarde.";
        }
        messageDiv.textContent = errorMessage;
        messageDiv.className = "mt-4 p-4 rounded-lg bg-red-100 text-red-700";
        messageDiv.classList.remove('hidden');
        console.error("Error al enviar el formulario:", error);
    } finally {
        submitButton.disabled = false;
        submitButton.classList.remove('opacity-50');
        spinner.classList.add('hidden');
    }
}); 