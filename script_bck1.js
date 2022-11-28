console.log("Hej Kalle, din superman!");

//Fjern sticky css
$(".city-wrapper").css({ position: "relative", top: "unset" });

/*
var $city_containers = $(".city-container > div");

for (var i = 0; i < $city_containers.length; i++) {
  $($city_containers[i]).addClass("city" + i);
  $($city_containers[i])
    .find(".city-sticky")
    .addClass("city" + i);
}
*/

//Tilføj classname til svg circler

for (var i = 0; i <= 10; i++) {
  $("#city-" + i)[0].setAttribute("class", "svgmapcircles");
}

function resizeDesktop() {
  //Fix city banner from 42% to rounded px size, so GSAP pinning works.
  var parent_size = $(".page-main").outerWidth();

  var nav_container_width = parent_size * 0.42;
  var nav_container_width_rounded = Math.round(nav_container_width);

  var new_content_container_width = parent_size - nav_container_width_rounded;

  $(
    ".city-container .city-banner, .map-container, .nav-container, .site-id"
  ).css("width", nav_container_width_rounded + "px");
  $(".city-container .content-wrapper").css(
    "width",
    new_content_container_width + "px"
  );

  console.log(
    "Resized. nav rounded width " +
      nav_container_width_rounded +
      "px / new content width: " +
      new_content_container_width +
      "px"
  );
}

ScrollTrigger.addEventListener("refreshInit", function () {
  // this code will run BEFORE the refresh
  resizeDesktop();
});

ScrollTrigger.addEventListener("refresh", function () {
  // this code will run AFTER all ScrollTriggers refreshed.
  resizeDesktop();
});

function getScrolltriggerStart() {
  //Find bunden af navigationen
  var $el_previousbutton = $(".previous-button"); //record the elem so you don't crawl the DOM everytime
  var navigation_bottom_px_from_top =
    $el_previousbutton.position().top + $el_previousbutton.outerHeight(true); // passing "true" will also include the top and bottom margin
  console.log(
    "Calculate scrolltrigger start: " + navigation_bottom_px_from_top + "px"
  );
  return "top " + navigation_bottom_px_from_top + "px";
}

function getScrolltriggerEnd() {
  var $el = $(".previous-button");
  var bottom = $el.position().top + $el.outerHeight(true);
  bottom += $(".city-sticky .city-wrapper").height();
  console.log("Calculate scrolltrigger end: " + bottom + "px");
  return "bottom " + bottom + "px";
}

function EnterAndEnterBack(city_el, city_no) {
  $(".svgmapcircles").each(function () {
    $(this)[0].setAttribute("fill", "");
  });
  $("#city-" + city_no)[0].setAttribute("fill", "black");
  $(".activecity").removeClass("activecity");
  $(city_el).addClass("activecity");
}

gsap.utils
  .toArray(".city-container > div")
  .forEach(function (city_el, city_no) {
    var city_el_q = gsap.utils.selector(city_el);

    //Lav sticky via gsap
    ScrollTrigger.create({
      trigger: city_el,
      //trigger: ".hamborg-section",
      //pin: ".hamborg-section .city-sticky",
      pin: city_el_q(".city-sticky"),
      //pin: true,
      //pinSpacing: false,
      scrub: true,
      start: getScrolltriggerStart(),
      //start: "top top",
      //endTrigger:
      //end: "bottom " + $(".city-sticky .city-wrapper").height() + "px",
      end: getScrolltriggerEnd(),
      //end: "100%",
      onEnter: function ({ progress, direction, isActive }) {
        console.log(
          "onEnter " + $(city_el).attr("class"),
          progress,
          direction,
          isActive
        );

        EnterAndEnterBack(city_el, city_no);
      },
      onEnterBack: function ({ progress, direction, isActive }) {
        console.log(
          "onEnterBack " + $(city_el).attr("class"),
          progress,
          direction,
          isActive
        );

        EnterAndEnterBack(city_el, city_no);
      },
      onLeave: function ({ progress, direction, isActive }) {
        console.log(
          "onLeave " + $(city_el).attr("class"),
          progress,
          direction,
          isActive
        );
      },
      onLeaveBack: function ({ progress, direction, isActive }) {
        console.log(
          "onLeaveBack " + $(city_el).attr("class"),
          progress,
          direction,
          isActive
        );
      },
      markers: true
    });
  }); //foreach

$(".next-button").click(function () {
  if ($(".activecity").next().length > 0) {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: $(".activecity").next()[0],
      ease: "expo.out"
    });
  }
});

$(".previous-button").click(function () {
  if ($(".activecity").prev().length > 0) {
    gsap.to(window, {
      duration: 1.5,
      scrollTo: $(".activecity").prev()[0],
      ease: "expo.out"
    });
  }
});
