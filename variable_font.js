// Selects all elements with the attribute [data-animate=font-weight]
const fontWeightItems = $("[data-animate=font-weight]");

// Defines the maximum distance at which the effect is applied
const maxDistance = 300;

// Defines the range of font weights
const maxFontWeight = 800;
const minFontWeight = 200;

// Base color for text
const baseColor = "#FFFFFF";

// Colors used in the gradient effect
const colorSteps = ["#ffca2c", "#fdc419", "#dd9300"];

// Iterate over each element that should have the font weight effect
fontWeightItems.each((index, item) => {
  // Add a data attribute for cursor effects
  $(item).attr("data-cursor", "-lg");

  // Split text into characters if they haven't been split already
  let splitChars =
    $(item).find(".char").length === 0
      ? new SplitType(item, { types: "chars,words" }).chars // Use SplitType to split text into characters and words
      : $(item).find(".char"); // If already split, just get the characters

  // Initialize each character with default font weight and color
  $(splitChars).each((index, char) => {
    $(char).data("initialWeight", parseInt($(char).css("font-weight"))); // Store initial font weight
    $(char).css("color", baseColor); // Set initial color
  });
});

// Detects mouse movement
$(document).mousemove(function (event) {
  // Get current mouse coordinates
  const mouseX = event.pageX;
  const mouseY = event.pageY;

  // Iterate over each character inside the animated elements
  fontWeightItems.find(".char").each((index, item) => {
    // Get the position of the character on the page
    const itemPosition = $(item).offset();
    const itemCenterX = itemPosition.left + $(item).outerWidth() / 2;
    const itemCenterY = itemPosition.top + $(item).outerHeight() / 2;

    // Calculate the distance between the mouse and the character
    const distance = Math.sqrt(
      Math.pow(mouseX - itemCenterX, 2) + Math.pow(mouseY - itemCenterY, 2)
    );

    // Set default values for font weight and color
    let fontWeight = minFontWeight;
    let color = baseColor;

    // If the mouse is within the maxDistance, apply the effect
    if (distance < maxDistance) {
      // Normalize the distance to a ratio (closer = stronger effect)
      const distanceRatio = (maxDistance - distance) / maxDistance;

      // Interpolate the font weight between min and max
      fontWeight =
        minFontWeight + (maxFontWeight - minFontWeight) * distanceRatio;

      // Get the interpolated color
      color = getColorAtRatio(distanceRatio);
    }

    // Animate the font weight and color transition using GSAP
    gsap.to(item, { fontWeight: fontWeight, color: color, duration: 0.3 });
  });
});

// Function to get color based on the distance ratio
function getColorAtRatio(ratio) {
  if (ratio <= 0) return baseColor; // If the ratio is 0 or less, return the base color
  if (ratio >= 1) return colorSteps[colorSteps.length - 1]; // If the ratio is max, return the last color in the gradient

  // Calculate which segment of the gradient we are in
  const segmentSize = 1 / colorSteps.length;
  const segmentIndex = Math.min(
    Math.floor(ratio / segmentSize),
    colorSteps.length - 2
  );
  const segmentRatio = (ratio - segmentIndex * segmentSize) / segmentSize;

  // Get the start and end colors for the current segment
  const startColor = hexToRgb(
    segmentIndex === 0 ? baseColor : colorSteps[segmentIndex - 1]
  );
  const endColor = hexToRgb(colorSteps[segmentIndex]);

  // Interpolate between the two colors
  return interpolateColor(startColor, endColor, segmentRatio);
}

// Function to interpolate (blend) between two colors
function interpolateColor(color1, color2, factor) {
  // Compute the interpolated RGB values
  const result = color1.map((c, i) => Math.round(c + factor * (color2[i] - c)));
  return `rgb(${result.join(",")})`; // Return the new color as an RGB string
}

// Function to convert a hex color to an RGB array
function hexToRgb(hex) {
  // Extract the red, green, and blue components from the hex code
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16), // Convert red component to decimal
        parseInt(result[2], 16), // Convert green component to decimal
        parseInt(result[3], 16), // Convert blue component to decimal
      ]
    : null;
}
