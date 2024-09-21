let menuIcon = document.getElementById('menuIcon');
let navMenu = document.getElementById('navMenu');

function toggleMenu() {
  navMenu.classList.toggle('active');
  if (navMenu.classList.contains('active')) {
    navMenu.style.display = 'block';
  } else {
    navMenu.style.display = 'none';
  }
  if (menuIcon.classList.contains('fa-bars')) {
    menuIcon.classList.remove('fa-bars');
    menuIcon.classList.add('fa-times');
  } else {
    menuIcon.classList.remove('fa-times');
    menuIcon.classList.add('fa-bars');
  }
}