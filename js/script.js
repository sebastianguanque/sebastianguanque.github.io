document.addEventListener("DOMContentLoaded", () => {
  // Navegación y menú móvil
  setupNavigation();

  // Validación de formulario
  setupFormValidation();

  // Animaciones de habilidades
  setupSkillsAnimation();
});

// Navegación y menú móvil
function setupNavigation() {
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      navLinks.classList.toggle("active");
    });
  }

  // Cerrar menú al hacer clic en un enlace
  const links = document.querySelectorAll(".nav-links a");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Actualizar enlace activo al hacer scroll
  window.addEventListener("scroll", updateActiveNavLink);
}

// Actualizar enlace activo en la navegación
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  let currentSection = "";
  const scrollPosition = window.scrollY + 150; // Offset para mejor detección

  // Encontrar la sección que está más visible en el viewport
  let maxVisibleSection = "";
  let maxVisibleArea = 0;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const sectionBottom = sectionTop + sectionHeight;

    // Calcular qué tanto de la sección está visible
    const viewportTop = scrollPosition - 150;
    const viewportBottom = scrollPosition + window.innerHeight - 150;

    const visibleTop = Math.max(sectionTop, viewportTop);
    const visibleBottom = Math.min(sectionBottom, viewportBottom);
    const visibleArea = Math.max(0, visibleBottom - visibleTop);

    // Si esta sección tiene más área visible, es la sección activa
    if (visibleArea > maxVisibleArea) {
      maxVisibleArea = visibleArea;
      maxVisibleSection = section.getAttribute("id");
    }

    // También verificar si estamos claramente dentro de una sección
    if (
      scrollPosition >= sectionTop - 100 &&
      scrollPosition < sectionBottom - 100
    ) {
      currentSection = section.getAttribute("id");
    }
  });

  // Usar la sección con más área visible si no hay una sección claramente activa
  if (!currentSection && maxVisibleSection) {
    currentSection = maxVisibleSection;
  }

  // Si aún no hay sección detectada, usar la primera por defecto
  if (!currentSection && sections.length > 0) {
    currentSection = sections[0].getAttribute("id");
  }

  // Actualizar clases active
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").substring(1) === currentSection) {
      link.classList.add("active");
    }
  });
}

// Animaciones de habilidades
function setupSkillsAnimation() {
  const skillItems = document.querySelectorAll(".skill-item");

  skillItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      // Agregar efecto de brillo
      this.style.boxShadow = "0 10px 30px rgba(255, 255, 255, 0.1)";
    });

    item.addEventListener("mouseleave", function () {
      // Remover efecto de brillo
      this.style.boxShadow = "";
    });
  });
}

// Agregar estilos CSS para animaciones dinámicas
const style = document.createElement("style");
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .skill-item:hover {
    transform: scale(1.02) !important;
  }
  
  .proyecto-card:hover .proyecto-image img {
    transform: scale(1.1);
  }
  
  .btn:hover i {
    transform: translateX(3px);
  }
  
  .interest-item:hover .interest-icon {
    transform: scale(1.2);
  }
  
  .contact-item:hover .contact-icon {
    transform: scale(1.2);
  }
`;
document.head.appendChild(style);

// Smooth scroll para navegación
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Validación de formulario
function setupFormValidation() {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const formSuccess = document.getElementById("form-success");
  const formError = document.getElementById("form-error");

  function validarFormulario() {
    let valido = true;

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const asunto = document.getElementById("asunto");
    const mensaje = document.getElementById("mensaje");

    // Limpiar errores
    document
      .querySelectorAll(".error-text")
      .forEach((e) => (e.textContent = ""));
    [nombre, correo, asunto, mensaje].forEach((campo) =>
      campo.classList.remove("error")
    );

    if (nombre.value.trim() === "") {
      document.getElementById("nombre-error").textContent =
        "El nombre es obligatorio";
      nombre.classList.add("error");
      valido = false;
    }

    if (correo.value.trim() === "") {
      document.getElementById("correo-error").textContent =
        "El correo es obligatorio";
      correo.classList.add("error");
      valido = false;
    } else if (!/\S+@\S+\.\S+/.test(correo.value)) {
      document.getElementById("correo-error").textContent = "Correo inválido";
      correo.classList.add("error");
      valido = false;
    }

    if (asunto.value.trim() === "") {
      document.getElementById("asunto-error").textContent =
        "El asunto es obligatorio";
      asunto.classList.add("error");
      valido = false;
    }

    if (mensaje.value.trim() === "") {
      document.getElementById("mensaje-error").textContent =
        "El mensaje es obligatorio";
      mensaje.classList.add("error");
      valido = false;
    }

    return valido;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarMensaje("error");
      return;
    }

    mostrarMensaje("sending");

    const formData = new FormData(form);

    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          mostrarMensaje("success");
          form.reset();
        } else {
          throw new Error("Error al enviar");
        }
      })
      .catch((error) => {
        mostrarMensaje("error");
        console.error(error);
      });
  });

  function mostrarMensaje(tipo) {
    formSuccess.style.display = "none";
    formError.style.display = "none";

    if (tipo === "sending") {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Enviando...`;
    }

    if (tipo === "success") {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Enviar`;
      formSuccess.style.display = "flex";

      // Ocultar automáticamente luego de 4 segundos
      setTimeout(() => {
        formSuccess.style.display = "none";
      }, 4000);
    }

    if (tipo === "error") {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Enviar`;
      formError.style.display = "flex";

      // Ocultar automáticamente luego de 4 segundos
      setTimeout(() => {
        formError.style.display = "none";
      }, 4000);
    }
  }
}

// Copiar correo electrónico al hacer clic
document.getElementById("gmail-card").addEventListener("click", () => {
  const displayText = document.getElementById("gmail-text");
  const realEmail = "guanquesebastian@gmail.com";
  const originalText = displayText.textContent;

  navigator.clipboard.writeText(realEmail).then(() => {
    displayText.textContent = "¡Copiado!";
    setTimeout(() => {
      displayText.textContent = originalText;
    }, 2000);
  });
});
