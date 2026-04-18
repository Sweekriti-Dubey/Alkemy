/* Created by Tivotal */

let menu = document.querySelector("#menu-bars");
let navbar = document.querySelector(".navbar");

menu.onclick = () => {
  menu.classList.toggle("fa-times");
  navbar.classList.toggle("active");
};

let themeToggler = document.querySelector(".theme-toggler");
let toggleBtn = document.querySelector(".toggle-btn");

toggleBtn.onclick = () => {
  themeToggler.classList.toggle("active");
};

window.onscroll = () => {
  menu.classList.remove("fa-times");
  navbar.classList.remove("active");
  themeToggler.classList.remove("active");
};

document.querySelectorAll(".theme-toggler .theme-btn").forEach((btn) => {
  btn.onclick = () => {
    let color = btn.style.background;
    let primaryColor = color;
    let primaryDarkColor = shadeColor(color, -20);
    let accentColor = shadeColor(color, 20);
    let secondaryGradient = `linear-gradient(135deg, ${accentColor} 0%, ${color} 100%)`;
    let primaryGradient = `linear-gradient(135deg, ${primaryDarkColor} 0%, ${color} 100%)`;
    
    // Update all CSS variables
    document.documentElement.style.setProperty("--theme-color", color);
    document.documentElement.style.setProperty("--accent-color", accentColor);
    document.documentElement.style.setProperty("--primary-color", primaryColor);
    document.documentElement.style.setProperty("--primary-dark", primaryDarkColor);
    document.documentElement.style.setProperty("--secondary-gradient", secondaryGradient);
    document.documentElement.style.setProperty("--primary-gradient", primaryGradient);
    
    // Store in localStorage for persistence
    localStorage.setItem('themeColor', color);
  };
});

// Load saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
  let savedColor = localStorage.getItem('themeColor');
  if (savedColor) {
    let primaryDarkColor = shadeColor(savedColor, -20);
    let accentColor = shadeColor(savedColor, 20);
    let secondaryGradient = `linear-gradient(135deg, ${accentColor} 0%, ${savedColor} 100%)`;
    let primaryGradient = `linear-gradient(135deg, ${primaryDarkColor} 0%, ${savedColor} 100%)`;
    
    document.documentElement.style.setProperty("--theme-color", savedColor);
    document.documentElement.style.setProperty("--accent-color", accentColor);
    document.documentElement.style.setProperty("--primary-color", savedColor);
    document.documentElement.style.setProperty("--primary-dark", primaryDarkColor);
    document.documentElement.style.setProperty("--secondary-gradient", secondaryGradient);
    document.documentElement.style.setProperty("--primary-gradient", primaryGradient);
  }
});

function shadeColor(color, percent) {
  let R = parseInt(color.substring(1,3),16);
  let G = parseInt(color.substring(3,5),16);
  let B = parseInt(color.substring(5,7),16);
  
  R = parseInt(R * (100 + percent) / 100);
  G = parseInt(G * (100 + percent) / 100);
  B = parseInt(B * (100 + percent) / 100);
  
  R = (R<255)?R:255;
  G = (G<255)?G:255;
  B = (B<255)?B:255;
  
  let RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
  let GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
  let BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));
  
  return "#"+RR+GG+BB;
}

var swiper = new Swiper(".home-slider", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2,
    slideShadows: true,
  },
  loop: true,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

var swiper = new Swiper(".review-slider", {
  slidesPerView: 1,
  grabCursor: true,
  loop: true,
  spaceBetween: 10,
  breakpoints: {
    0: {
      slidesPerView: 1,
    },
    700: {
      slidesPerView: 2,
    },
    1050: {
      slidesPerView: 3,
    },
  },
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
});

document.addEventListener("DOMContentLoaded", async function () {
  const downloadExcelButton = document.getElementById("downloadExcel");
  const adminControls = document.getElementById("admin-controls");

  firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
          // Not logged in — redirect to login page
          window.location.href = "../index.html";
          return;
      }

      const db = firebase.firestore();
      const userDoc = await db.collection("users").doc(user.uid).get();
      if (userDoc.exists && userDoc.data().role === "admin") {
          if (adminControls) {
              adminControls.style.display = "flex";
          }
          if (downloadExcelButton) {
              downloadExcelButton.style.display = "block";
          }
      }
  });
});