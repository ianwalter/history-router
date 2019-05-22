const { test } = require('@ianwalter/bff')
const { go, router } = require('..')

test('node go call', ({ expect }) => {
  const url = 'http://example.com/about'
  router.add('/about', ctx => expect(ctx.request.url).toBe(url))
  go(url)
})
