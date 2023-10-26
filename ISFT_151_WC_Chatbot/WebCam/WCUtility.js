function createElement(name, attributes = {}) {
  let element = undefined;

  if (name != null || name != undefined) {
    element = document.createElement(name);
  }

  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }

  return element;
}

export { createElement };
