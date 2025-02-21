/**
 * @file Parser for Jarl syntax
 * @author Nick <nicc.gemm@gmail.com>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const descriptor = $ => seq(field("name", $.identifier), optional(seq(':', $.expression)));
const block_body = $ => seq(
  field("statements", repeat($.statement)),
  field("expression", optional($.expression)),
);

module.exports = grammar({
  name: "jarl",

  conflicts: $ => [
    [$.binary_expression, $.prefix_expression, $.postfix_expression],
    [$.expression, $.statement],
    [$.expression, $.template],
    [$.call, $.template],
  ],

  word: $ => $._word,

  rules: {
    file: $ => block_body($),

    block: $ => choice(
      $.simple_block,
      $.template,
    ),

    simple_block: $ => seq(
      '{',
      block_body($),
      '}',
    ),

    template: $ => seq(
      field("name", $.identifier),
      optional(field("descriptors", seq(
        '[',
        descriptor($),
        repeat(seq(',',
          descriptor($),
          ']'
        ))))),
      optional(seq('(', field("expression", optional($.expression)), ')')),
      field("block", $.block),
    ),

    statement: $ => choice(
      $.block,
      $.expression_statement,
      $.variable_declaration,
    ),

    variable_declaration: $ => seq(
      'let',
      field("name", $.identifier),
      optional(seq(':', field("type", $.expression))),
      '=',
      field("expression", $.expression),
      ';'
    ),

    expression_statement: $ => seq(optional($.expression), ';'),

    expression: $ => choice(
      field("num_lit", $.number),
      field("str_lit", $.string),
      field("ident", $.identifier),
      seq('(', $.expression, ')'),
      $.prefix_expression,
      $.postfix_expression,
      $.binary_expression,
      $.block,
    ),

    postfix_expression: $ => choice(
      prec.left(14, seq($.expression, '*')),
      prec.left(14, seq($.expression, seq('.', $.identifier))),
      prec.left(14, $.call),
      field("array_access", prec.left(14, seq($.expression, seq('[', $.expression, ']')))),
    ),

    call: $ => seq(field("name", $.expression), seq('(', optional(field("arguments", $.expression)), ')')),

    prefix_expression: $ => choice(
      prec.right(13, seq('&', $.expression)),
      prec.right(13, seq('-', $.expression)),
      prec.right(13, seq('+', $.expression)),
      prec.right(13, seq('!', $.expression)),
    ),

    binary_expression: $ => choice(
      prec.left(12, seq($.expression, '*', $.expression)),
      prec.left(12, seq($.expression, '/', $.expression)),
      prec.left(12, seq($.expression, '%', $.expression)),
      prec.left(11, seq($.expression, '+', $.expression)),
      prec.left(11, seq($.expression, '-', $.expression)),
      prec.left(9, seq($.expression, '<', $.expression)),
      prec.left(9, seq($.expression, '>', $.expression)),
      prec.left(9, seq($.expression, '<=', $.expression)),
      prec.left(9, seq($.expression, '>=', $.expression)),
      prec.left(8, seq($.expression, '==', $.expression)),
      prec.left(8, seq($.expression, '!=', $.expression)),
      prec.left(4, seq($.expression, '&&', $.expression)),
      prec.left(3, seq($.expression, '||', $.expression)),
      prec.right(2, seq($.expression, '=', $.expression)),
      prec.right(2, seq($.expression, '+=', $.expression)),
      prec.right(2, seq($.expression, '-=', $.expression)),
      prec.right(2, seq($.expression, '*=', $.expression)),
      prec.right(2, seq($.expression, '/=', $.expression)),
      prec.right(2, seq($.expression, '%=', $.expression)),
      prec.left(1, seq($.expression, ',', $.expression)),
    ),

    string: _ => seq('"', /[^"]*/, '"'),

    number: _ => /\d+/,

    identifier: $ => $._word,
    _word: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,
  }
});
