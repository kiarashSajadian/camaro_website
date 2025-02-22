const fontWeightItems = $("[data-animate=font-weight]");
const maxDistance = 300;
const maxFontWeight = 800;
const minFontWeight = 200;
const baseColor = "#FFFFFF";
const colorSteps = ["#ffca2c", "#fdc419", "#dd9300"];

fontWeightItems.each((index, item) => {
  $(item).attr("data-cursor", "-lg");
  let splitChars =
    $(item).find(".char").length === 0
      ? new SplitType(item, { types: "chars,words" }).chars
      : $(item).find(".char");

  $(splitChars).each((index, char) => {
    $(char).data("initialWeight", parseInt($(char).css("font-weight")));
    $(char).css("color", baseColor);
  });
});

$(document).mousemove(function (event) {
  const mouseX = event.pageX;
  const mouseY = event.pageY;

  fontWeightItems.find(".char").each((index, item) => {
    const itemPosition = $(item).offset();
    const itemCenterX = itemPosition.left + $(item).outerWidth() / 2;
    const itemCenterY = itemPosition.top + $(item).outerHeight() / 2;

    const distance = Math.sqrt(
      Math.pow(mouseX - itemCenterX, 2) + Math.pow(mouseY - itemCenterY, 2)
    );

    let fontWeight = minFontWeight;
    let color = baseColor;

    if (distance < maxDistance) {
      const distanceRatio = (maxDistance - distance) / maxDistance;
      fontWeight =
        minFontWeight + (maxFontWeight - minFontWeight) * distanceRatio;
      color = getColorAtRatio(distanceRatio);
    }

    gsap.to(item, { fontWeight: fontWeight, color: color, duration: 0.3 });
  });
});

function getColorAtRatio(ratio) {
  if (ratio <= 0) return baseColor;
  if (ratio >= 1) return colorSteps[colorSteps.length - 1];

  const segmentSize = 1 / colorSteps.length;
  const segmentIndex = Math.min(
    Math.floor(ratio / segmentSize),
    colorSteps.length - 2
  );
  const segmentRatio = (ratio - segmentIndex * segmentSize) / segmentSize;

  const startColor = hexToRgb(
    segmentIndex === 0 ? baseColor : colorSteps[segmentIndex - 1]
  );
  const endColor = hexToRgb(colorSteps[segmentIndex]);

  return interpolateColor(startColor, endColor, segmentRatio);
}

function interpolateColor(color1, color2, factor) {
  const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
  return `rgb(${result.join(",")})`;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null;
}
