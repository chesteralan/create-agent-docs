import Handlebars from 'handlebars';

/**
 * Handles helper logic for both block ({{#eq}}) and subexpression/inline ({{eq}}) forms.
 */
function evaluateCondition(context: any, isTrue: boolean, options: any) {
  if (options && typeof options.fn === 'function') {
    // Block helper usage: {{#eq a b}}...{{else}}...{{/eq}}
    return isTrue ? options.fn(context) : options.inverse(context);
  }
  // Subexpression or inline usage: (eq a b) or {{eq a b}}
  return isTrue;
}

// Register comparison helpers that support both block and subexpression patterns
Handlebars.registerHelper('eq', function (this: any, a: any, b: any, options: any) {
  return evaluateCondition(this, a === b, options);
});

Handlebars.registerHelper('ne', function (this: any, a: any, b: any, options: any) {
  return evaluateCondition(this, a !== b, options);
});

Handlebars.registerHelper('or', function (this: any, a: any, b: any, options: any) {
  return evaluateCondition(this, !!(a || b), options);
});

Handlebars.registerHelper('and', function (this: any, a: any, b: any, options: any) {
  return evaluateCondition(this, !!(a && b), options);
});

Handlebars.registerHelper('not', function (this: any, a: any, options: any) {
  return evaluateCondition(this, !a, options);
});

/**
 * Renders a Handlebars template with the provided context variables.
 * @param templateContent The raw template string
 * @param context The variables to inject into the template
 * @returns The rendered document string
 */
export function renderTemplate(templateContent: string, context: Record<string, any>): string {
  const compile = Handlebars.compile(templateContent);
  return compile(context);
}
