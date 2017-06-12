'use strict';

const html = require('../');
const assert = require('assert');

{ // Attribute escaping
  assert.equal(html`
    <div id=${ 'foo-bar' } a=${ "'" }></div>
  `, '<div id="foo-bar" a="&#x27;"></div>');
}

{ // Text escaping
  assert.equal(html`
    <div>${ 'a < b' }</div>
  `, '<div>a &lt; b</div>');

  assert.equal(html`
    <div>${ '<i>a</i>' }</div>
  `, '<div>&lt;i&gt;a&lt;/i&gt;</div>');
}

{ // DOM names are converted to attribute names
  assert.equal(html`
    <div className='foobar'></div>
  `, '<div class="foobar"></div>');
}

{ // Array children
  assert.equal(html`
    <div>
      ${ [html`<p></p>`, html`<p></p>`] }
    </div>
  `, '<div>\n      <p></p><p></p>\n    </div>');
}