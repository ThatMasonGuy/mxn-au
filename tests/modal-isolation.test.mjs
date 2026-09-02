import test from 'node:test';
import assert from 'node:assert/strict';

import { isolateModalBackground } from '../src/features/daily/utils/modalIsolation.js';

function element({ contains = false, ariaHidden = null, inert = false } = {}) {
  const attributes = new Map();
  if (ariaHidden !== null) attributes.set('aria-hidden', ariaHidden);
  return {
    inert,
    contains: () => contains,
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
  };
}

test('modal isolation hides every body sibling and restores its previous state', () => {
  const app = element({ ariaHidden: 'false' });
  const modalRoot = element({ contains: true });
  const existingInertElement = element({ inert: true });
  const dialog = {};
  const restore = isolateModalBackground({ children: [app, modalRoot, existingInertElement] }, dialog);

  assert.equal(app.inert, true);
  assert.equal(app.getAttribute('aria-hidden'), 'true');
  assert.equal(modalRoot.inert, false);
  assert.equal(existingInertElement.inert, true);

  restore();
  assert.equal(app.inert, false);
  assert.equal(app.getAttribute('aria-hidden'), 'false');
  assert.equal(existingInertElement.inert, true);
  assert.equal(existingInertElement.getAttribute('aria-hidden'), null);
});
