$(document).ready(function () {
  $('[svg="animated"]').css({
    opacity: 0,
    transition: "opacity 400ms ease",
  });

  $(window).on("load resize scroll", function () {
    $('[svg="animated"] path').each(function () {
      var pathLength = this.getTotalLength();
      $(this).attr({
        "stroke-dasharray": pathLength,
        "stroke-dashoffset": pathLength,
      });
      var svgAnimated = $(this).closest('[svg="animated"]');
      var svgAnimatedTop = svgAnimated.offset().top;
      var svgAnimatedHeight = svgAnimated.outerHeight();
      var windowHeight = $(window).height();
      var windowScrollTop = $(window).scrollTop();
      var animationDuration = svgAnimated.attr("svg-animation-time") || 5000;

      if (
        windowScrollTop + windowHeight > svgAnimatedTop &&
        windowScrollTop < svgAnimatedTop + svgAnimatedHeight
      ) {
        $(svgAnimated).css("opacity", 1);
        $(this).css({
          transition: "stroke-dashoffset " + animationDuration + "ms ease-out",
          "stroke-dashoffset": 0,
        });
      }
    });
  });
});
