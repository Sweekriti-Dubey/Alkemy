let slideIndex = 0;
showSlides();

function showSlides() {
    const slides = document.getElementsByClassName("event-slide");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex]
}