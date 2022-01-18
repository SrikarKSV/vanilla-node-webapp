exports.dump = (obj) => JSON.stringify(obj, null, 2);

exports.isDark = (bgColor) => {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16); // hexToR
  const g = parseInt(color.substring(2, 4), 16); // hexToG
  const b = parseInt(color.substring(4, 6), 16); // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186;
};

const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

exports.relativeTime = (d1) => {
  const elapsed = d1 - new Date();

  // "Math.abs" accounts for both "past" & "future" scenarios
  const unit = Object.keys(units).find(
    (u) => Math.abs(elapsed) > units[u] || u === 'second'
  );

  return rtf.format(Math.round(elapsed / units[unit]), unit);
};
