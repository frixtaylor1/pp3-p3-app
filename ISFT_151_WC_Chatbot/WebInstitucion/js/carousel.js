$(document).ready(function () {
    var cardsToShow = 3;
    var currentIndex = 0;

    // Muestra las tarjetas iniciales
    showCards(currentIndex);

    // Maneja el evento de hacer clic en el botón "Siguiente"
    $("#next-button").click(function () {
        currentIndex++;
        if (currentIndex >= $(".carousel-inner .card").length) {
            currentIndex = 0; // Vuelve a la primera tarjeta cuando se llega al final
        }
        showCards(currentIndex);
    });

    // Maneja el evento de hacer clic en el botón "Anterior"
    $("#prev-button").click(function () {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = $(".carousel-inner .card").length - 1; // Vuelve a la última tarjeta cuando se está en la primera
        }
        showCards(currentIndex);
    });

    function showCards(startIndex) {
        var $cards = $(".carousel-inner .card");
        $cards.hide();
        $cards.slice(startIndex, startIndex + cardsToShow).show();
    }
});

