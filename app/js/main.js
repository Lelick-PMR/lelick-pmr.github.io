$(function () {

  var $doc = $(document);
  var $win = $(window);

  $('.user-menu__style--search').on('click', function () {
    $('.search').toggleClass('search--active');
  });

  $('.user-menu__style--cart, .cart-modal__close-btn').on('click', function () {
    $('.modal--cart').toggleClass('modal--active');
    $('body').toggleClass('scroll-lock');
  });

  $('.catalog__btn').on('click', function () {
    $('.catalog__btn').toggleClass('catalog__btn--active');
    $('.catalog__list').toggleClass('catalog__list--active');
  });

  $(document).click(function (e) {
    if (!$('.catalog__btn').is(e.target) && !$('.catalog__list').is(e.target) && $('.catalog__list').has(e.target).length === 0) {
      $('.catalog__btn').removeClass('catalog__btn--active');
      $('.catalog__list').removeClass('catalog__list--active');
    };
    if (!$('.user-menu__style--search').is(e.target) && !$('.search').is(e.target) && $('.search').has(e.target).length === 0) {
      $('.search').removeClass('search--active');
    };
    if (!$('.modal__close-btn').is(e.target) && !$('.user-menu__style--cart').is(e.target) && !$('.modal__cart').is(e.target) && $('.modal__cart').has(e.target).length === 0) {
      $('.modal--cart').removeClass('modal--active');
      $('body').removeClass('scroll-lock');
    };
  });

  $(document).keyup(function (e) {
    if (e.key === "Escape" && $('.modal--active')) { 
      $('.modal--cart').removeClass('modal--active');
    }
  });

  $('body').on('click', '.quantity__btn--minus, .quantity__btn--plus', function () {
    var $row = $(this).closest('.quantity');
    var $input = $row.find('.quantity__text');
    var step = $row.data('step');
    var val = parseFloat($input.val());
    if ($(this).hasClass('quantity__btn--minus')) {
      val -= step;
    } else {
      val += step;
    }
    $input.val(val);
    $input.change();
    return false;
  });

  $('body').on('change', '.quantity__text', function () {
    var $input = $(this);
    var $row = $input.closest('.quantity');
    var step = $row.data('step');
    var min = parseInt($row.data('min'));
    var max = parseInt($row.data('max'));
    var val = parseFloat($input.val());
    if (isNaN(val)) {
      val = step;
    } else if (min && val < min) {
      val = min;
    } else if (max && val > max) {
      val = max;
    }
    $input.val(val);
  });



  // Slick слайдер
  $('.discounts__list').slick({

    autoplay: false,
    arrows: true,
    infinite: false,
    swipeToSlide: true,
    dots: false,
    prevArrow: '<button class="slick-btn slick-btn--prev" type="button"><svg class="icon icon--user"><use xlink: href="images/icons/icons.svg#arrow-left"></use></svg ><span class="sr-only">Переключить на предыдущий слайд</span></button>',
    nextArrow: '<button class="slick-btn slick-btn--next" type="button"><svg class="icon icon--user"><use xlink: href="images/icons/icons.svg#arrow-right"></use></svg ><span class="sr-only">Переключить на следующий слайд</span></button>',

        // the magic
    responsive: [{

      breakpoint: 1500,
      settings: {
        swipeToSlide: true,
        infinite: true,
        arrows: false,
        dots: true,
        infinite: true
      }

    }]

/*
    // normal options...
    infinite: false,

    // the magic
    responsive: [{

      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        infinite: true
      }

    }, {

      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        dots: true
      }

    }, {

      breakpoint: 300,
      settings: "unslick" // destroys slick

    }]
*/
  });

  var mixer = mixitup('.bestsellers__list');
});