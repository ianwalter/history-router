const { test } = require('@ianwalter/bff')
const { go, router, HistoryRouter } = require('..')

test('node go call', ({ expect }) => {
  const url = 'http://example.com/about'
  router.add('/about', ctx => expect(ctx.url).toBe(url))
  go(url)
})

test('node invalid URL', ({ expect }) => {
  const router = new HistoryRouter()
  router.notFound(err => expect(err).toBeInstanceOf(Error))
  router.go('//')
})
