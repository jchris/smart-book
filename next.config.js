/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')(['@fireproof/core', 'use-fireproof']);

module.exports = withTM();
