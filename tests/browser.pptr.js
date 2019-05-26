import { test } from '@ianwalter/bff'
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
    go('/about')
  })
})
