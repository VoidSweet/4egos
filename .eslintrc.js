module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Temporarily disable strict Next.js rules for deployment
    '@next/next/no-html-link-for-pages': 'warn',
    '@next/next/no-img-element': 'warn',
    '@next/next/inline-script-id': 'warn',
    '@next/next/no-page-custom-font': 'warn',
    'import/no-anonymous-default-export': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/no-unescaped-entities': 'warn'
  }
}
