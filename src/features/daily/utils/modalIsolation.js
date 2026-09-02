export function isolateModalBackground(body, dialog) {
  if (!body || !dialog) return () => {};
  const children = [...body.children];
  const modalRoot = children.find((element) => element === dialog || element.contains(dialog));
  if (!modalRoot) return () => {};

  const snapshots = children
    .filter((element) => element !== modalRoot)
    .map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute('aria-hidden'),
    }));

  snapshots.forEach(({ element }) => {
    element.inert = true;
    element.setAttribute('aria-hidden', 'true');
  });

  return () => {
    snapshots.forEach(({ element, inert, ariaHidden }) => {
      element.inert = inert;
      if (ariaHidden === null) element.removeAttribute('aria-hidden');
      else element.setAttribute('aria-hidden', ariaHidden);
    });
  };
}
