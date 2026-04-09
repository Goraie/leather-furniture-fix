// swiper
const swiper = new Swiper('.lr-carousel', {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    breakpoints: {
        640: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        1200: {
            slidesPerView: 3,
            spaceBetween: 20,
        },
    },
})

const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,

});

// Modal & Quiz Logic
const totalSteps = 4;
let currentStep = 1;

function lrOpenModal() {
    const modal = document.getElementById('lr-quiz-modal');
    modal.classList.add('lr-active');
    lrGoToStep(1);
}

function lrCloseModal() {
    const modal = document.getElementById('lr-quiz-modal');
    modal.classList.remove('lr-active');
    // Reset quiz state when closing
    setTimeout(() => {
        lrResetQuiz();
    }, 300);
}

function lrNextStep(stepNum) {
    if (lrValidateStep(stepNum - 1)) {
        lrGoToStep(stepNum);
    }
}

function lrPrevStep(stepNum) {
    lrGoToStep(stepNum);
}

function lrGoToStep(stepNum) {
    currentStep = stepNum;
    document.querySelectorAll('.lr-step').forEach(step => step.classList.add('hidden'));
    const targetStep = document.getElementById('lr-step-' + stepNum);
    if (targetStep) {
        targetStep.classList.remove('hidden');
        lrUpdateProgressBar(stepNum);
        // Scroll modal to top
        const modalContent = document.querySelector('.lr-modal-content');
        if (modalContent) modalContent.scrollTop = 0;
    }
}

function lrUpdateProgressBar(step) {
    const progressFill = document.getElementById('lr-progress-fill');
    if (progressFill) {
        const percentage = (step / totalSteps) * 100;
        progressFill.style.width = percentage + '%';
    }
}

function lrHandleSelection(input) {
    const name = input.getAttribute('name');
    const container = input.closest('.grid') || input.closest('.space-y-2');

    if (input.type === 'radio') {
        container.querySelectorAll('.lr-choice-label').forEach(label => label.classList.remove('active'));
        input.closest('.lr-choice-label').classList.add('active');
    } else if (input.type === 'checkbox') {
        input.closest('.lr-choice-label').classList.toggle('active', input.checked);
    }

    lrValidateStep(currentStep);
}

function lrValidateStep(step) {
    let isValid = false;
    if (step === 1) {
        isValid = !!document.querySelector('input[name="furniture"]:checked');
        const nextBtn = document.getElementById('lr-next-1');
        lrToggleBtnState(nextBtn, isValid);
    } else if (step === 2) {
        isValid = !!document.querySelector('input[name="problem"]:checked');
        const nextBtn = document.getElementById('lr-next-2');
        lrToggleBtnState(nextBtn, isValid);
    } else {
        isValid = true;
    }
    return isValid;
}

function lrToggleBtnState(btn, isValid) {
    if (!btn) return;
    if (isValid) {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    }
}

function lrHandleFileSelect(input) {
    const fileInfo = document.getElementById('lr-file-info');
    const fileName = document.getElementById('lr-file-name');

    if (input.files && input.files[0]) {
        fileName.textContent = input.files[0].name;
        fileInfo.classList.add('active');
    } else {
        lrResetFile();
    }
}

function lrResetFile() {
    const fileInput = document.getElementById('lr-quiz-file');
    const fileInfo = document.getElementById('lr-file-info');
    if (fileInput) fileInput.value = '';
    if (fileInfo) fileInfo.classList.remove('active');
}

function lrSubmitQuiz() {
    // Show step 5 (Success)
    lrGoToStep(5);
    // Hide progress bar on success
    const progressContainer = document.querySelector('.lr-progress-container');
    if (progressContainer) progressContainer.style.display = 'none';
}

function lrResetQuiz() {
    // Reset all inputs
    document.querySelectorAll('#lr-quiz-modal input').forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });
    // Reset labels
    document.querySelectorAll('.lr-choice-label').forEach(label => label.classList.remove('active'));
    // Reset progress and file
    lrResetFile();
    const progressContainer = document.querySelector('.lr-progress-container');
    if (progressContainer) progressContainer.style.display = 'block';
    lrUpdateProgressBar(1);
    // Reset buttons
    lrToggleBtnState(document.getElementById('lr-next-1'), false);
    lrToggleBtnState(document.getElementById('lr-next-2'), false);
}
