const colorPicker = document.querySelector('input[type="color"]');
const generateColorBtn = document.querySelector('.btn-generate');
const profileIcon = document.querySelector('.icon');
const allPath = document.querySelectorAll('path');

function hslToHex(h, s, l) {
  const lightness = l / 100;
  const a = (s * Math.min(lightness, 1 - lightness)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = lightness - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0'); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function generateRandomColor() {
  const randomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const h = randomInt(0, 360);
  const s = randomInt(42, 98);
  const l = randomInt(40, 90);
  return hslToHex(h, s, l);
}

function isDark(bgColor) {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
}

function fillColor(color) {
  colorPicker.value = color;
  profileIcon.style.background = color;
  allPath.forEach((path) => {
    path.setAttribute('fill', `${isDark(color) ? '#000' : '#fff'}`);
  });
}

function handleColorChange(e) {
  const color = e.target.value;
  fillColor(color);
}

export function handleGenerateColorBtn() {
  const color = generateRandomColor();
  fillColor(color);
}

colorPicker.addEventListener('input', handleColorChange);
generateColorBtn.addEventListener('click', handleGenerateColorBtn);
