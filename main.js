// swiper
const swiper = new Swiper('.lr-carousel', {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: false,
    grabCursor: false,
    watchSlidesProgress: true,
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
        1024: {
            slidesPerView: 2,
            spaceBetween: 20,
        },
    },
})

const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
})

// Modal & Quiz Logic
const totalSteps = 5
let currentStep = 1

function lrOpenModal() {
    const modal = document.getElementById('lr-quiz-modal')
    modal.classList.add('lr-active')
    document.body.style.overflow = 'hidden'
    lrGoToStep(1)
}

function lrCloseModal() {
    const modal = document.getElementById('lr-quiz-modal')
    modal.classList.remove('lr-active')
    document.body.style.overflow = ''
    // Reset quiz state when closing
    setTimeout(() => {
        lrResetQuiz()
    }, 300)
}

function lrNextStep(stepNum) {
    if (lrValidateStep(stepNum - 1)) {
        lrGoToStep(stepNum)
    }
}

function lrPrevStep(stepNum) {
    lrGoToStep(stepNum)
}

function lrGoToStep(stepNum) {
    currentStep = stepNum
    document
        .querySelectorAll('.lr-step')
        .forEach(step => step.classList.add('hidden'))
    const targetStep = document.getElementById('lr-step-' + stepNum)
    if (targetStep) {
        targetStep.classList.remove('hidden')
        lrUpdateProgressBar(stepNum)
        // Scroll modal to top
        const modalContent = document.querySelector('.lr-modal-content')
        if (modalContent) modalContent.scrollTop = 0
    }
}

function lrUpdateProgressBar(step) {
    const progressFill = document.getElementById('lr-progress-fill')
    if (progressFill) {
        const percentage = (step / totalSteps) * 100
        progressFill.style.width = percentage + '%'
    }
}

function lrHandleSelection(input) {
    const name = input.getAttribute('name')
    const container = input.closest('.grid') || input.closest('.space-y-2')

    if (input.type === 'radio') {
        container
            .querySelectorAll('.lr-choice-label')
            .forEach(label => label.classList.remove('active'))
        input.closest('.lr-choice-label').classList.add('active')
    } else if (input.type === 'checkbox') {
        input.closest('.lr-choice-label').classList.toggle('active', input.checked)
    }

    lrValidateStep(currentStep)
}

function lrValidateStep(step) {
    let isValid = false
    if (step === 1) {
        isValid = !!document.querySelector('input[name="furniture"]:checked')
        const nextBtn = document.getElementById('lr-next-1')
        lrToggleBtnState(nextBtn, isValid)
    } else if (step === 2) {
        isValid = !!document.querySelector('input[name="problem"]:checked')
        const nextBtn = document.getElementById('lr-next-2')
        lrToggleBtnState(nextBtn, isValid)
    } else if (step === 4) {
        isValid = !!document.querySelector('input[name="contact_method"]:checked')
        const nextBtn = document.getElementById('lr-next-4')
        lrToggleBtnState(nextBtn, isValid)
    } else {
        isValid = true
    }
    return isValid
}

function lrToggleBtnState(btn, isValid) {
    if (!btn) return
    if (isValid) {
        btn.disabled = false
        btn.classList.remove('opacity-50', 'cursor-not-allowed')
    } else {
        btn.disabled = true
        btn.classList.add('opacity-50', 'cursor-not-allowed')
    }
}

function lrHandleFileSelect(input) {
    const fileInfo = document.getElementById('lr-file-info')
    const fileName = document.getElementById('lr-file-name')

    if (input.files && input.files[0]) {
        fileName.textContent = input.files[0].name
        fileInfo.classList.add('active')
    } else {
        lrResetFile()
    }
}

function lrResetFile() {
    const fileInput = document.getElementById('lr-quiz-file')
    const fileInfo = document.getElementById('lr-file-info')
    if (fileInput) fileInput.value = ''
    if (fileInfo) fileInfo.classList.remove('active')
}

function lrSubmitQuiz() {
    // Show step 6 (Success)
    lrGoToStep(6)
    // Hide progress bar on success
    const progressContainer = document.querySelector('.lr-progress-container')
    if (progressContainer) progressContainer.style.display = 'none'
}

function lrResetQuiz() {
    // Reset all inputs
    document.querySelectorAll('#lr-quiz-modal input').forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false
        } else {
            input.value = ''
        }
    })
    // Reset labels
    document
        .querySelectorAll('#lr-quiz-modal .lr-choice-label')
        .forEach(label => label.classList.remove('active'))
    // Reset progress and file
    lrResetFile()
    // Reset phone dialpad
    lrPhoneDigits = ''
    const phoneDisplay = document.getElementById('lr-phone-display')
    if (phoneDisplay) phoneDisplay.textContent = '+7'
    const progressContainer = document.querySelector('#lr-quiz-modal .lr-progress-container')
    if (progressContainer) progressContainer.style.display = 'block'
    lrUpdateProgressBar(1)
    // Reset buttons
    lrToggleBtnState(document.getElementById('lr-next-1'), false)
    lrToggleBtnState(document.getElementById('lr-next-2'), false)
    lrToggleBtnState(document.getElementById('lr-next-4'), false)
}

// Dialpad Logic (shared by both quiz and photo modals)
let lrPhoneDigits = ''       // digits for quiz modal
let lrPhotoPhoneDigits = ''  // digits for photo modal

function lrFormatPhone(digits) {
    if (digits.length === 0) return '+7'
    let d = digits.slice(0, 10)
    let result = '+7 ('
    result += d.substring(0, 3)
    if (d.length >= 3) result += ') '
    result += d.substring(3, 6)
    if (d.length >= 6) result += '-'
    result += d.substring(6, 8)
    if (d.length >= 8) result += '-'
    result += d.substring(8, 10)
    return result
}

function lrDialpadInput(digit, context) {
    if (context === 'photo') {
        if (lrPhotoPhoneDigits.length >= 10) return
        lrPhotoPhoneDigits += digit
        document.getElementById('lr-photo-phone-display').textContent = lrFormatPhone(lrPhotoPhoneDigits)
        document.getElementById('lr-photo-phone-value').value = '+7' + lrPhotoPhoneDigits
    } else {
        if (lrPhoneDigits.length >= 10) return
        lrPhoneDigits += digit
        document.getElementById('lr-phone-display').textContent = lrFormatPhone(lrPhoneDigits)
        document.getElementById('lr-phone-value').value = '+7' + lrPhoneDigits
    }
}

function lrDialpadBackspace(context) {
    if (context === 'photo') {
        lrPhotoPhoneDigits = lrPhotoPhoneDigits.slice(0, -1)
        document.getElementById('lr-photo-phone-display').textContent = lrFormatPhone(lrPhotoPhoneDigits)
        document.getElementById('lr-photo-phone-value').value = '+7' + lrPhotoPhoneDigits
    } else {
        lrPhoneDigits = lrPhoneDigits.slice(0, -1)
        document.getElementById('lr-phone-display').textContent = lrFormatPhone(lrPhoneDigits)
        document.getElementById('lr-phone-value').value = '+7' + lrPhoneDigits
    }
}

// Photo Modal Logic
const totalPhotoSteps = 3
let currentPhotoStep = 1

function lrOpenPhotoModal() {
    const modal = document.getElementById('lr-photo-modal')
    if (modal) {
        modal.classList.add('lr-active')
        document.body.style.overflow = 'hidden'
        lrPhotoGoToStep(1)
    }
}

function lrClosePhotoModal() {
    const modal = document.getElementById('lr-photo-modal')
    if (modal) {
        modal.classList.remove('lr-active')
        document.body.style.overflow = ''
        setTimeout(() => {
            lrResetPhotoModal()
        }, 300)
    }
}

function lrPhotoGoToStep(stepNum) {
    currentPhotoStep = stepNum
    const modal = document.getElementById('lr-photo-modal')
    if (!modal) return

    modal.querySelectorAll('.lr-step').forEach(step => step.classList.add('hidden'))
    const targetStep = document.getElementById('lr-photo-step-' + stepNum)
    if (targetStep) {
        targetStep.classList.remove('hidden')
        lrUpdatePhotoProgressBar(stepNum)
        const modalContent = modal.querySelector('.lr-modal-content')
        if (modalContent) modalContent.scrollTop = 0
    }
}

function lrUpdatePhotoProgressBar(step) {
    const progressFill = document.getElementById('lr-photo-progress-fill')
    if (progressFill) {
        const percentage = (step / totalPhotoSteps) * 100
        progressFill.style.width = percentage + '%'
    }
}

function lrHandlePhotoSelection(input) {
    const container = input.closest('.grid') || input.closest('.space-y-2')
    if (input.type === 'radio') {
        container
            .querySelectorAll('.lr-choice-label')
            .forEach(label => label.classList.remove('active'))
        input.closest('.lr-choice-label').classList.add('active')
    }
    // Enable next button
    const nextBtn = document.getElementById('lr-photo-next-2')
    if (nextBtn) lrToggleBtnState(nextBtn, true)
}

function lrHandlePhotoFileSelect(input) {
    const fileInfo = document.getElementById('lr-photo-file-info')
    const fileName = document.getElementById('lr-photo-file-name')

    if (input.files && input.files[0]) {
        fileName.textContent = input.files[0].name
        fileInfo.classList.add('active')
    } else {
        lrResetPhotoFile()
    }
}

function lrResetPhotoFile() {
    const fileInput = document.getElementById('lr-photo-file-input')
    const fileInfo = document.getElementById('lr-photo-file-info')
    if (fileInput) fileInput.value = ''
    if (fileInfo) fileInfo.classList.remove('active')
}

function lrSubmitPhotoForm() {
    // Show success step (step 4)
    lrPhotoGoToStep(4)
    // Hide progress bar on success
    const progressContainer = document.querySelector('#lr-photo-modal .lr-progress-container')
    if (progressContainer) progressContainer.style.display = 'none'
}

function lrResetPhotoModal() {
    // Reset inputs
    document.querySelectorAll('#lr-photo-modal input').forEach(input => {
        if (input.type === 'radio' || input.type === 'checkbox') {
            input.checked = false
        } else {
            input.value = ''
        }
    })
    // Reset labels
    document.querySelectorAll('#lr-photo-modal .lr-choice-label')
        .forEach(label => label.classList.remove('active'))
    // Reset progress, file, and phone
    lrResetPhotoFile()
    lrPhotoPhoneDigits = ''
    const phoneDisplay = document.getElementById('lr-photo-phone-display')
    if (phoneDisplay) phoneDisplay.textContent = '+7'
    const progressContainer = document.querySelector('#lr-photo-modal .lr-progress-container')
    if (progressContainer) progressContainer.style.display = 'block'
    lrUpdatePhotoProgressBar(1)
    // Reset next button
    const nextBtn = document.getElementById('lr-photo-next-2')
    if (nextBtn) lrToggleBtnState(nextBtn, false)
}
