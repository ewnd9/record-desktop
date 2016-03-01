// https://github.com/joshwnj/react-visibility-sensor/blob/v3.0.0/visibility-sensor.js#L73-L127
export default function(className) {
  const fullHeight = document.body.scrollHeight;
  const top = document.body.scrollTop;
  const bottom = top + document.body.clientHeight;

  const parentRect = { top, bottom };

  const elements = [].slice.call(document.querySelectorAll(className));

  return elements.map(el => checkElement(el, parentRect));
};

function checkElement(el, parentRect) {
  const rect = el.getBoundingClientRect();

  const top = rect.top + parentRect.top;
  const bottom = top + rect.height;

  return (
    (top >= parentRect.top && bottom <= parentRect.bottom) ||
    (top <= parentRect.top && bottom >= parentRect.top) ||
    (bottom >= parentRect.bottom && top <= parentRect.bottom)
  );
};
