const modal = document.querySelector(".work-modal");
const modalImage = document.querySelector(".work-modal__image");
const modalTitle = document.querySelector("#modal-title");
const modalYear = document.querySelector(".work-modal__year");
const modalDescription = document.querySelector(".work-modal__description");
const closeButtons = document.querySelectorAll("[data-modal-close]");
const prevButton = document.querySelector(".work-modal__nav--prev");
const nextButton = document.querySelector(".work-modal__nav--next");
const projects = Array.from(document.querySelectorAll(".project"));
let currentProjectIndex = 0;

document.addEventListener("dragstart", (event) => {
  if (event.target.closest("img, video")) {
    event.preventDefault();
  }
});

function setModalProject(index) {
  currentProjectIndex = (index + projects.length) % projects.length;
  const project = projects[currentProjectIndex];
  const image = project.querySelector(".project__image");
  const title = project.querySelector(".project__meta h3");
  const year = project.querySelector(".project__meta p");
  const description = project.querySelector(".project__overlay p");

  if (!image || !title || !year) return;

  modalImage.style.backgroundImage = `url("${image.dataset.src}")`;
  modalImage.setAttribute("aria-label", image.getAttribute("aria-label") || title.textContent.trim());
  modalTitle.textContent = title.textContent.trim();
  modalYear.textContent = year.textContent.trim();
  modalDescription.textContent = description
    ? description.textContent.trim()
    : image.getAttribute("aria-label") || title.textContent.trim();
}

function openProjectModal(project) {
  const projectIndex = projects.indexOf(project);
  setModalProject(projectIndex);

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeProjectModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function showPreviousProject() {
  setModalProject(currentProjectIndex - 1);
}

function showNextProject() {
  setModalProject(currentProjectIndex + 1);
}

projects.forEach((project) => {
  const media = project.querySelector(".project__media");
  if (!media) return;

  media.setAttribute("tabindex", "0");
  media.setAttribute("role", "button");
  media.setAttribute("aria-label", "Open project preview");

  media.addEventListener("click", () => openProjectModal(project));
  media.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(project);
    }
  });
});

closeButtons.forEach((button) => {
  button.addEventListener("click", closeProjectModal);
});

prevButton.addEventListener("click", showPreviousProject);
nextButton.addEventListener("click", showNextProject);

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("is-open")) return;

  if (event.key === "Escape") {
    closeProjectModal();
  }

  if (event.key === "ArrowLeft") {
    showPreviousProject();
  }

  if (event.key === "ArrowRight") {
    showNextProject();
  }
});

const quoteVideo = document.querySelector(".quote__video");

if (quoteVideo) {
  quoteVideo.muted = true;
  quoteVideo.controls = false;
  quoteVideo.disablePictureInPicture = true;
  quoteVideo.controlsList?.add("nodownload", "noplaybackrate", "noremoteplayback");

  quoteVideo.addEventListener("loadeddata", () => {
    quoteVideo.classList.add("is-loaded");
  });

  const playQuoteVideo = () => {
    quoteVideo.play().catch(() => {});
  };

  const pauseQuoteVideo = () => {
    quoteVideo.pause();
  };

  if ("IntersectionObserver" in window) {
    const quoteObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playQuoteVideo();
          } else {
            pauseQuoteVideo();
          }
        });
      },
      { threshold: 0.2 }
    );

    quoteObserver.observe(quoteVideo);
  } else {
    playQuoteVideo();
  }
}

const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (contactForm && formStatus) {
  const nameInput = contactForm.querySelector('input[name="name"]');
  const emailInput = contactForm.querySelector('input[name="email"]');
  const messageInput = contactForm.querySelector('textarea[name="message"]');

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    formStatus.classList.add("is-error");

    if (!name) {
      formStatus.textContent = "Because you have not filled in your name, the message cannot be sent.";
      return;
    }

    if (!email) {
      formStatus.textContent = "Because you have not filled in your email address, the message cannot be sent.";
      return;
    }

    if (!emailPattern.test(email)) {
      formStatus.textContent = "Please enter a valid email address, otherwise I will not be able to reach you.";
      return;
    }

    if (!message) {
      formStatus.textContent = "Because you have not written a message, the message cannot be sent.";
      return;
    }

    contactForm.reset();
    formStatus.classList.remove("is-error");
    formStatus.textContent = "Message sent successfully.";
  });
}
