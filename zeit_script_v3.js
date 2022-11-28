function svResize() {
  /*
    var nav_container_width_rounded = "";

    var new_content_container_width = "";

    if (window.svIsDesktop) {
      //Fix city banner from 42% to rounded px size, so GSAP pinning works.
      var parent_size = $(".page-main").outerWidth();

      var nav_container_width = parent_size * 0.42;
      nav_container_width_rounded = Math.round(nav_container_width) + "px";

      new_content_container_width =
        parent_size - nav_container_width_rounded + "px";
    }
    $(
      ".city-container .city-banner, .map-container, .nav-container, .site-id"
    ).css("width", nav_container_width_rounded);
    $(".city-container .content-wrapper").css(
      "width",
      new_content_container_width
    );
    */
  /*
    console.log(
      "Resized. nav rounded width " +
        nav_container_width_rounded +
        "px / new content width: " +
        new_content_container_width +
        "px"
    );*/
}

function getScrolltriggerStart() {
  //Find bunden af navigationen
  var $el_previousbutton = $(".previous-button"); //record the elem so you don't crawl the DOM everytime
  var navigation_bottom_px_from_top =
    $el_previousbutton.position().top + $el_previousbutton.outerHeight(true); // passing "true" will also include the top and bottom margin
  console.log(
    "Calculate scrolltrigger start: " + navigation_bottom_px_from_top + "px"
  );
  //navigation_bottom_px_from_top = navigation_bottom_px_from_top + 100;
  return "top " + navigation_bottom_px_from_top + "px";
}

function getScrolltriggerEnd() {
  var $el = $(".previous-button");
  var bottom = $el.position().top + $el.outerHeight(true);
  bottom += $(".city-sticky .city-wrapper").height();
  //console.log("Calculate scrolltrigger end: " + bottom + "px");
  return "bottom " + bottom + "px";
}
function EnterAndEnterBack(city_el, city_no, isDesktop) {
  if (isDesktop) {
    $(".svgmapcircles").each(function () {
      $(this)[0].setAttribute("fill", "#0f0");
    });
    $("#city-" + city_no)[0].setAttribute("fill", "black");
  }

  $(".activecity").removeClass("activecity");
  $(city_el).addClass("activecity");

  $(".city-container > div .circle-black").css("background", "#0F0");
  $(".city-container > div.activecity .circle-black").css("background", "#000");

  if ($(city_el).next().hasClass("footer-section")) {
    $(".next-button h6").text("FØRSTE STOP");
    $(".next-button .arrow_up").css("visibility", "hidden");
    $(".next-button .arrow-round").show();
  } else {
    $(".next-button h6").text($(".next-button h6").attr("textbackup"));
    $(".next-button .arrow-round").hide();
    $(".next-button .arrow_up").css("visibility", "");
  }
}

//Make array with km travelled
var objCityKm = {
  "city-0": {
    travelToNextCity: 126,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-1": {
    travelToNextCity: 336,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-2": {
    travelToNextCity: 190,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-3": {
    travelToNextCity: 119,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-4": {
    travelToNextCity: 319,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-5": {
    travelToNextCity: 520,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-6": {
    travelToNextCity: 162,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-7": {
    travelToNextCity: 140,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-8": {
    travelToNextCity: 223,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-9": {
    travelToNextCity: 183,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  },
  "city-10": {
    travelToNextCity: 0,
    travelUntilCity: 0,
    travelToNextCityHalf: 0
  }
};
var totalDistance = 0;
var lastCityDistance = 0;
for (var objCity in objCityKm) {
  //console.log(arrKm[city]);
  objCityKm[objCity].travelToNextCityHalf =
    objCityKm[objCity].travelToNextCity / 2 + lastCityDistance;
  lastCityDistance = objCityKm[objCity].travelToNextCity / 2;

  objCityKm[objCity].travelUntilCity = totalDistance;

  totalDistance += objCityKm[objCity].travelToNextCityHalf;
}

var co2 = {
  train: 0.036, //km ratio
  car: 0.099, //km ratio
  airplane: 0.211, //km ratio

  streaming: 6, //Co2 ratio
  beer: 1, //Co2 ratio
  cucumber: 3 //Co2 ratio
};

window.numberOfUpdates = 0;
function calculateScroll(progress, city_no) {
  //console.log("Update " + window.numberOfUpdates + ": " + progress);
  window.numberOfUpdates++;
  if (window.numberOfUpdates % 7 == 0) {
    //km traveled
    var kmFrom = objCityKm["city-" + city_no].travelUntilCity;
    var kmDistance = objCityKm["city-" + city_no].travelToNextCityHalf;
    //var kmTo = kmFrom + kmDistance;

    var kmCurrent = kmDistance * progress + kmFrom;

    var train = Math.round(co2.train * kmCurrent);
    var airplane = Math.round(co2.airplane * kmCurrent);
    var train_airplane_diff = Math.round(airplane - train);

    var car = Math.round(co2.car * kmCurrent);

    var streaming = Math.round(co2.streaming * train_airplane_diff);
    var beer = Math.round(co2.beer * train_airplane_diff);
    var cucumber = Math.round(co2.cucumber * train_airplane_diff);

    kmCurrent = Math.round(kmCurrent); //for display

    $("#co2-tal").text(train_airplane_diff);
    $("#distance-tal").text(kmCurrent);
    $("#tog-tal").text(train);
    $("#bil-tal").text(car);
    $("#fly-tal").text(airplane);
    $("#agurk-tal").text(cucumber);
    $("#streaming-tal").text(streaming);
    $("#oel-tal").text(beer);
  }
}

function svScrollTo(el) {
  gsap.to(window, {
    duration: 1.5,
    scrollTo: el,
    ease: "expo.out"
  });
}

$(document).ready(function () {
  //Fjern sticky css
  //$(".city-wrapper").css({ position: "relative", top: "unset" });

  $(".logo-wrapper").parent().addClass("logo-wrapper-parent");
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
    $("#city-" + i)[0].setAttribute("cityno", i);
    $("#city-" + i)[0].setAttribute("style", "cursor:pointer;");
  }

  $(".next-button h6").attr("textbackup", $(".next-button h6").text());

  gsap.registerPlugin(ScrollTrigger);

  window.svIsDesktop = false;
  let mm = gsap.matchMedia();
  let breakPoint = 990; //webflow 991px

  mm.add(
    {
      // set up any number of arbitrarily-named conditions. The function below will be called when ANY of them match.
      isDesktop: "(min-width: " + breakPoint + "px)",
      isMobile: "(max-width: " + (breakPoint - 1) + "px)"
    },
    (context) => {
      // context.conditions has a boolean property for each condition defined above indicating if it's matched or not.
      let { isDesktop, isMobile } = context.conditions;
      let target = isDesktop ? ".desktop" : ".mobile";
      window.svIsDesktop = isDesktop;

      //console.log("TEST: " + target);
      gsap.utils
        .toArray(".city-container > div")
        .forEach(function (city_el, city_no) {
          var city_el_q = gsap.utils.selector(city_el);

          //Lav sticky via gsap
          gsap.timeline(
            //ScrollTrigger.create({
            {
              scrollTrigger: {
                trigger: city_el,
                //trigger: ".hamborg-section",
                //pin: ".hamborg-section .city-sticky",
                //pin: city_el_q(".city-sticky"),
                //pin: true,
                //pinSpacing: false,
                //scrub: true,
                start: getScrolltriggerStart(),
                //start: "top top",
                //endTrigger:
                //end: "bottom " + $(".city-sticky .city-wrapper").height() + "px",
                end: getScrolltriggerEnd(),
                //end: "100%",
                onUpdate: function ({ progress }) {
                  calculateScroll(progress, city_no);
                },
                onEnter: function ({ progress, direction, isActive }) {
                  /*console.log(
                    target + " onEnter " + $(city_el).attr("class"),
                    progress,
                    direction,
                    isActive
                  );*/

                  EnterAndEnterBack(city_el, city_no, isDesktop);
                },
                onEnterBack: function ({ progress, direction, isActive }) {
                  /*console.log(
                    target + " onEnterBack " + $(city_el).attr("class"),
                    progress,
                    direction,
                    isActive
                  );*/

                  EnterAndEnterBack(city_el, city_no, isDesktop);
                }
                //onLeave: function ({ progress, direction, isActive }) {console.log("onLeave " + $(city_el).attr("class"),progress,direction,isActive);},
                //onLeaveBack: function ({ progress, direction, isActive }) {console.log("onLeaveBack " + $(city_el).attr("class"),progress,direction,isActive);},
                //markers: true
              } //ScrollTrigger
            } //Timeline object
          );
        }); //foreach

      //Make event listernes
      var refreshEventFunction = function () {
        //console.log("MyrefreshEventFunction " + Math.random());
        //resizeDesktop();
      };
      /*
      if (isDesktop) {
        gsap
          .timeline(
            //ScrollTrigger.create({
            {
              scrollTrigger: {
                trigger: ".logo-wrapper",
                //end: "100%",
                start: "top top",
                scrub: 1
              }
            }
          )
          //.set(".logo-wrapper", { margin: "0 auto" })
          .to(".logo-wrapper", { width: "27%" });
      }*/

      return () => {
        // optionally return a cleanup function that will be called when the media query no longer matches
      };
    }
  );

  ScrollTrigger.addEventListener("refreshInit", function () {
    // this code will run BEFORE the refresh
    svResize();
  });

  $(".next-button").click(function () {
    if ($(".activecity").next().length > 0) {
      var scrollToEl = $(".activecity").next();
      if ($(".activecity").next().hasClass("footer-section")) {
        scrollToEl = $(".activecity").parent().children().first();
      }

      svScrollTo(scrollToEl[0]);
      /*
      gsap.to(window, {
        duration: 1.5,
        scrollTo: scrollToEl[0],
        ease: "expo.out"
      });*/
    }
  });

  $(".previous-button").click(function () {
    var scrollToEl = $(".activecity").prev();
    if ($(".activecity").prev().length == 0) {
      scrollToEl = $(".activecity").parent().children().first();
    }
    svScrollTo(scrollToEl[0]);
    /*gsap.to(window, {
      duration: 1.5,
      scrollTo: scrollToEl[0],
      ease: "expo.out"
    });*/
  });

  $(".svgmapcircles").click(function () {
    svScrollTo($(".city-container > div")[$(this)[0].getAttribute("cityno")]);
  });
}); //document ready

//Smooth scrolling
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: "vertical", // vertical, horizontal
  gestureDirection: "vertical", // vertical, horizontal, both
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false
});

//get scroll value
lenis.on("scroll", ({ scroll, limit, velocity, direction, progress }) => {
  //console.log({ scroll, limit, velocity, direction, progress });
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
