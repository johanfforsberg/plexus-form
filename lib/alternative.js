'use strict';

var ou = require('plexus-objective');


exports.schema = function(value, schema, context) {
  var selector, options, selected;

  selector = ou.getIn(schema, ['x-hints', 'form', 'selector']);
  if (!selector) {
    return;
  }

  var dereferenced = schema.oneOf.map(function(alt) {
    var reference = alt["$ref"];        
    if (reference) {
      return ou.getIn(context, reference.split('/').slice(1));
    }
    return alt;
  });
    
  options = dereferenced.map(function(alt) {
    return ou.getIn(alt, [ 'properties', selector, 'enum', 0 ]) || "";
  });

  selected = (value || {})[selector] || options[0];

  return ou.merge(ou.setIn(dereferenced[options.indexOf(selected)],
                           [ 'properties', selector ],
                           ou.merge(ou.getIn(schema, [ 'properties', selector]),
                                    { enum: options })),
                  { type: 'object' });
};
