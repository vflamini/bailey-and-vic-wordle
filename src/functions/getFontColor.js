const getFontColor = (backgroundColor) => {
  // Convert the hex color to RGB
  const hexColor = backgroundColor.substring(1); // Remove the #
  const r = parseInt(hexColor.slice(0, 2), 16);
  const g = parseInt(hexColor.slice(2, 4), 16);
  const b = parseInt(hexColor.slice(4, 6), 16);

  // Calculate the perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Use white font color for dark backgrounds and black for light backgrounds
  return brightness > 128 ? '#000' : '#fff';
};

export default getFontColor;