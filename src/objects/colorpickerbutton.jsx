import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import '../css/wordle.css';

const ColorPickerButton = ({text, defaultColor, setColor}) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(defaultColor); // Default color
  const colorPickerRef = useRef(null);
  const buttonRef = useRef(null);

  const handleButtonClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setColor(color);
  };

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

  const fontColor = getFontColor(selectedColor);

  const handleClickOutside = (event) => {
    try {
      if (!colorPickerRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        console.log("running");
        setShowColorPicker(false);
      }
    } catch {
      return;
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div ref={buttonRef} className="tile" onClick={handleButtonClick} style={{ backgroundColor: selectedColor, color: fontColor }}>
        {text}
      </div>
      {showColorPicker && (
        <div ref={colorPickerRef} style={{ position: 'absolute', zIndex: 2 }}>
          <HexColorPicker color={selectedColor} onChange={handleColorChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPickerButton;
