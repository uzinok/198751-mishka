var navMain = document.querySelector('.main-nav');
var navToggle = document.querySelector('.main-nav__toggle');
var main_nav_list = $('.main-nav__list');

navMain.classList.remove('main-nav--nojs');

navToggle.addEventListener('click', function() {
  if (navMain.classList.contains('main-nav--closed')) {
    navMain.classList.remove('main-nav--closed');
    navMain.classList.add('main-nav--opened');
    main_nav_list.fadeIn("slow");
  } else {
    navMain.classList.add('main-nav--closed');
    navMain.classList.remove('main-nav--opened');
    main_nav_list.fadeOut("slow");
  }
});

var popup = $('.popup');

$('.button-popup').on("click touchend", function() {
  popup.fadeIn("slow");

  $(document).mouseup(function(e) {
    var popup__container = $('.popup__container');
    if (!popup__container.is(e.target) && popup__container.has(e.target).length === 0) {
      popup.fadeOut("slow");
    }
  });
});
