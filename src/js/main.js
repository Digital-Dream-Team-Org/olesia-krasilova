(function ($) {
  // Document ready
  $(function () {
    var gallerySwipers = new Swiper(".gallery-swiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      centeredSlides: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
        },
      },
      autoplay: {
        delay: 4000,
      },
      on: {
        init: function () {
          const slider = this.slides;
          slider.forEach((slide) => {
            const number = Number(slide.dataset.swiperSlideIndex) + 1;
            $(slide)
              .find(".gallery-swiper__caption-number")
              .html(String(number).padStart(2, "0"));
          });
        },
      },
    });

    var reviewSwipers = new Swiper(".review-swiper", {
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 4000,
      },
    });

    // Popups
    // Contacts form
    $(".open-contact-popup").on("click", function (e) {
      e.preventDefault();
      $("body").addClass("overflow-hidden");
      $("#contactFormPopup")
        .addClass("active")
        .css({
          opacity: 0,
        })
        .animate(
          {
            opacity: 1,
          },
          400,
        );

      $(".overlay-cdk__content-wrap").css({
        transition: "",
        transform: "translateY(40px)",
      });
      setTimeout(() => {
        $(".overlay-cdk__content-wrap").css({
          transition: "400ms",
          transform: "translateY(0)",
        });
      }, 50);
    });

    // Video
    $(".open-video-popup").on("click", function (e) {
      e.preventDefault();

      $("body").addClass("overflow-hidden");

      $("#videoPopup")
        .addClass("active")
        .css({
          opacity: 0,
        })
        .animate(
          {
            opacity: 1,
          },
          400,
        );

      $(".overlay-cdk__content-wrap").css({
        transition: "",
        transform: "translateY(40px)",
      });
      setTimeout(() => {
        $(".overlay-cdk__content-wrap").css({
          transition: "400ms",
          transform: "translateY(0)",
        });
      }, 50);

      const videoUrl = $(this).attr("href");

      if (!videoUrl || videoUrl === "#") {
        return;
      }

      $(".youtube-video-place").html(
        '<iframe allowfullscreen allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="embed-responsive-item" src="' +
          videoUrl +
          '" ></iframe>',
      );
    });

    // Success

    function openSuccessPopup() {
      $("body").addClass("overflow-hidden");
      $("#contactSuccessPopup")
        .addClass("active")
        .css({
          opacity: 0,
        })
        .animate(
          {
            opacity: 1,
          },
          400,
        );

      $(".overlay-cdk__content-wrap").css({
        transition: "",
        transform: "translateY(40px)",
      });
      setTimeout(() => {
        $(".overlay-cdk__content-wrap").css({
          transition: "400ms",
          transform: "translateY(0)",
        });
      }, 50);
    }

    // Close overlay on outside click
    $(".overlay-cdk").on("click", function (e) {
      if (e.target !== e.currentTarget) return;
      closeOverlay();
    });

    // Close overlay on button click
    $(".overlay-cdk__close-btn").on("click", function (e) {
      closeOverlay();
    });

    function closeOverlay() {
      $(".overlay-cdk__content-wrap").css({
        transition: "200ms",
        transform: "translateY(40px)",
      });

      $(".overlay-cdk")
        .css({
          opacity: 1,
        })
        .animate(
          {
            opacity: 0,
          },
          200,
        );

      setTimeout(() => {
        $(".overlay-cdk").removeClass("active");
        $("body").removeClass("overflow-hidden");
      }, 200);
    }

    // Ajax form submit / Аякс форма настраивается тут
    $(".ajax-contact-form").on("submit", function (e) {
      e.preventDefault();
      const url = $(this).attr("action");
      const method = $(this).attr("method");
      const dataType = $(this).data("type") || null;
      const serializedArray = $(this).serializeArray();
      const self = $(this);

      let requestObj = {};
      serializedArray.forEach((item) => {
        requestObj[item.name] = item.value;
      });

      $.ajax({
        url,
        type: method,
        dataType: dataType,
        data: {
          action: "contactForm",
          ...requestObj,
        },
        success: function (data) {
          // Clear inputs
          self.find("input, textarea").val("");

          // Open thanks popup
          closeOverlay();
          setTimeout(() => {
            openSuccessPopup();
          }, 300);
        },
        error: function (data) {
          // Basic error handling
          alert("Ошибка, повторите позднее");
          console.error(data);
        },
      });
    });

    // Accordion
    $(".accordion-list__item-btn").on("click", function (e) {
      e.preventDefault();
      const parent = $(this).closest(".accordion-list__item");

      if (!parent.hasClass("active")) {
        const $accordion = $(this).closest(".accordion-list");
        const $items = $accordion.find(".accordion-list__item");
        $items.each(function () {
          if ($(this).get(0) !== parent.get(0)) {
            closeAccordion($(this), false);
          }
        });

        openAccordion(parent);

        $(".accordion-list__item-title")
          .find("i")
          .removeClass("icon-close")
          .addClass("icon-plus");

        parent
          .find(".accordion-list__item-title")
          .find("i")
          .removeClass("icon-plus")
          .addClass("icon-close");
      } else {
        closeAccordion(parent);

        $(".accordion-list__item-title")
          .find("i")
          .removeClass("icon-close")
          .addClass("icon-plus");
      }
    });
    $(".accordion-list__close-btn").on("click", function () {
      const parent = $(this).closest(".accordion-list__item");
      closeAccordion(parent);
      $(".accordion-list__item-title")
        .find("i")
        .removeClass("icon-close")
        .addClass("icon-plus");
    });

    function openAccordion($item) {
      $item.find(".accordion-list__item-content-wrap").css({
        display: "block",
        opacity: 0,
      });
      $(".emotions-image").css("opacity", "0.25");
      setTimeout(() => {
        const height = $item
          .find(".accordion-list__item-content-wrap")
          .outerHeight(true);

        $item.find(".accordion-list__item-content-wrap").css({
          height: 0,
          overflow: "hidden",
          opacity: 1,
        });
        setTimeout(() => {
          $item.find(".accordion-list__item-content-wrap").css({
            height: height,
            overflow: "unset",
          });

          $item.addClass("active");
        }, 10);
      }, 10);
    }

    var isAccordionClosing = false;
    function closeAccordion($item, strict = true) {
      if (isAccordionClosing && strict) {
        return;
      }
      isAccordionClosing = true;
      $item.find(".accordion-list__item-content-wrap").css({
        height: 0,
        // overflow: "hidden",
        opacity: 0,
      });
      $(".emotions-image").css("opacity", "1");

      setTimeout(() => {
        $item.find(".accordion-list__item-content-wrap").css({
          display: "none",
          height: "",
        });
        isAccordionClosing = false;

        $item.removeClass("active");
      }, 400);
    }

    $(document).on("scroll", function () {
      // if ($(".main-header").length) {
      //   floatingHeaderUpdate();
      // }
      // $(".h-parallax-object").each(function () {
      //   if ($(this).isInViewport()) {
      //     hParallaxObjectUpdate($(this));
      //   }
      // });
      // $(".h-parallax-object-m").each(function () {
      //   if ($(this).isInViewport() && $(window).outerWidth(true) <= 576) {
      //     hParallaxObjectUpdate($(this));
      //   }
      // });
    });

    function hParallaxObjectUpdate($el) {
      let eposition = $el.offset().top;
      let sposition = $(document).scrollTop();
      let wheight = $(window).height();

      let slowMultiplier = 8;
      let offset = 5;
      let p =
        Math.floor(((eposition - sposition) / wheight) * 100) / slowMultiplier -
        offset;
      $el.css("transform", `translateX(${p}%)`);
    }

    $(".floating-spacer-wrap").each(function () {
      let $item = $(this).find(".floating-spacer");
      let $clone = $item.clone();
      $(this).append($clone);

      let array = [$item, $clone];

      let tick1 = 0;
      let tick2 = 0;
      setInterval(() => {
        if (tick1 >= -100) {
          tick1 = tick1 - 0.01;
          array[0].css("transform", `translateX(${tick1}%)`);
        } else {
          tick1 = 0;
        }

        if (tick2 >= -100) {
          tick2 = tick2 - 0.01;
          array[1].css("transform", `translateX(${tick2}%)`);
        } else {
          tick2 = 0;
        }
      }, 10);
    });

    let collageAnimated = false;
    let collageIntervals = [];

    let collageMargin = null;
    function animateCollage() {
      collageAnimated = true;
      $(".section-about__collage-wrap").each(function () {
        let $item = $(this).find(".section-about__collage-image");
        collageMargin = $item.css("margin-left");
        $item.css("margin-left", 0);
        $item.css("margin-right", "20px");

        let $clone = $item.clone();
        $(this).append($clone);

        let array = [$item, $clone];

        let tick1 = 0;
        let tick2 = 0;

        let newCollageInterval = setInterval(() => {
          if (tick1 >= -100) {
            tick1 = tick1 - 0.025;
            array[0].css("transform", `translateX(${tick1}%)`);
          } else {
            tick1 = 0;
          }

          if (tick2 >= -100) {
            tick2 = tick2 - 0.025;
            array[1].css("transform", `translateX(${tick2}%)`);
          } else {
            tick2 = 0;
          }
        }, 10);
        collageIntervals.push(newCollageInterval);
      });
    }
    function destroyCollageAnimation() {
      collageAnimated = false;

      collageIntervals.forEach((item) => {
        clearInterval(item);
      });
      collageIntervals = [];

      $(".section-about__collage-wrap").each(function () {
        let array = $(this).find(".section-about__collage-image");
        if (array.length > 1) {
          array[1].remove();
          $(array[0]).css("transform", "");
          $(array[0]).css("margin-left", collageMargin);
          $(array[0]).css("margin-right", "");
        }
      });
    }

    let windowWidth = $(window).outerWidth();
    if (windowWidth <= 578) {
      if (!collageAnimated) {
        animateCollage();
      }
    }
    $(window).on("resize", function () {
      windowWidth = $(window).outerWidth();
      if (windowWidth <= 578) {
        if (!collageAnimated) {
          animateCollage();
        }
      } else {
        if (collageAnimated) {
          destroyCollageAnimation();
        }
      }
    });
  });

  $.fn.isInViewport = function (sFix = false) {
    let elementTop = $(this).offset().top;
    let elementBottom = elementTop + $(this).outerHeight();

    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    // don't remember what was the problem, but this one fixed it, sFix implemented only for this reason
    if (elementTop === 0 && sFix) {
      return false;
    }

    return elementBottom > viewportTop && elementTop < viewportBottom;
  };
})(jQuery);
