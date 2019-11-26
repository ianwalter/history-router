import { test } from '@ianwalter/bff-puppeteer'
import { go, router } from '..'

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
  return new Promise(resolve => {
    router.add('/', () => {
      pass()
      resolve()
    })
    router.add('/about', () => window.history.back())
    go('/')
    go('/about')
  })
})

test('browser notFound', ({ fail, pass }) => {
  router.add('/about', () => fail())
  router.notFound(() => pass())
  go('/aboot')
})

test('browser multiple middleware', ({ expect }) => {
  let name
  const first = (ctx, next) => (name = 'Baby Yoda') && next()
  const second = () => expect(name).toBe('Baby Yoda')
  router.add('/about', first, second)
  router.go('/about')
})
