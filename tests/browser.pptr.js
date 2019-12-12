import { test } from '@ianwalter/bff-puppeteer'
import { go, router, HistoryRouter } from '..'

test('browser go call', ({ expect, testServerUrl }) => {
  router.add('/about', () => {
    expect(window.location.href).toBe(`${testServerUrl}/about`)
  })
  go('/about')
})

test('browser go event', ({ expect, testServerUrl }) => {
  const aboutLink = document.querySelector('#aboutLink')
  aboutLink.addEventListener('click', go)
  aboutLink.click()
  expect(window.location.href).toBe(`${testServerUrl}/about`)
})

test('browser back', ({ pass }) => {
  let count = 0
  return new Promise(resolve => {
    router.add('/', () => {
      if (count > 0) {
        pass()
        resolve()
      }
      count++
    })
    router.add('/about', () => window.history.back())
    go('/')
    go('/about')
  })
})

test('browser multiple middleware', ({ expect }) => {
  let name
  const first = (ctx, next) => (name = 'Baby Yoda') && next()
  const second = () => expect(name).toBe('Baby Yoda')
  router.add('/about', first, second)
  router.go('/about')
})

test('browser notFound', ({ fail, pass }) => {
  const router = new HistoryRouter()
  router.add('/about', () => fail())
  router.notFound(() => pass())
  router.go('/aboot')
})

test.skip('browser invalid URL', ({ fail, expect }) => {
  const router = new HistoryRouter()
  router.add('/about', () => fail())
  router.notFound(err => expect(err).toBeInstanceOf(Error))
  router.go('//')
})
