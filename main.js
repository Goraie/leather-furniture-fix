// swiper
const swiper = new Swiper('.lr-carousel', {
    slidesPerView: 1,
    spaceBetween: 10,
    centeredSlides: false,
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
            slidesPerView: 2,
            spaceBetween: 20,
        },
    },
})

// lightbox
const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true
});

// modal
function lrOpenModal() {
    const modal = document.getElementById('lr-quiz-modal')
    modal.classList.add('lr-active')
    lrNextStep(1) 
}

function lrCloseModal() {
    const modal = document.getElementById('lr-quiz-modal')
    modal.classList.remove('lr-active')
}

function lrNextStep(stepNum) {
    document.querySelectorAll('.lr-step')
            .forEach(step => step.classList.add('hidden'))

    document.getElementById('lr-step-' + stepNum).classList.remove('hidden')
}
