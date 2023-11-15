$(document).ready(function(){
    $(".carousel").owlCarousel({
      items: 1,
      loop: true,
      margin: 10,
      autoplay: true,
      autoplayTimeout: 5000,  // Cambia el tiempo de transición según tus preferencias
      responsive: {
        0: {
          nav: false,
          dots: true
        },
        768: {
          nav: true,
          dots: false
        }
      }
    });
  });