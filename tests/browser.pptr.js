import { test } from '@ianwalter/bff-puppeteer'
import { go, router, HistoryRouter } from '..'

test('browser go call', async ({ expect, testServerUrl }) => {
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
    go('/about')
  })
})

test('browser notFound', ({ fail, pass }) => {
  return new Promise(resolve => {
    router.add('/about', () => fail())
    router.notFound(() => {
      pass()
      resolve()
    })
    go('/aboot')
  })
})

test('browser before', async ({ expect }) => {
  let name
  const router = new HistoryRouter({
    before () {
      return new Promise(resolve => {
        setTimeout(
          () => {
            name = 'Do You Love Her Now'
            resolve()
          },
          1000
        )
      })
    }
  })
  router.add('/about', () => {
    expect(name).toBe('Do You Love Her Now')
  })
  await router.go('/about')
})
