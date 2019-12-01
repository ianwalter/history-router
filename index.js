import Router from '@ianwalter/router'

const $window = typeof window !== 'undefined' ? window : undefined

export class HistoryRouter extends Router {
  constructor (options = { baseUrl: 'http://localhost' }) {
    // Set the router instance's base URL.
    super($window ? $window.location.origin : options.baseUrl)

    // Add isClient property for end-user convenience.
    this.isClient = $window !== undefined

    this.listener = async ctx => {
      // Attempt to match and call any route handler associated with the URL
      // that's being navigated to.
      return this.match(ctx, this.fallback)
    }

    // Add a popstate listener to call hooks and route handlers on back and
    // forward browser actions.
    if ($window) {
      $window.addEventListener('popstate', this.listener)
    }
  }

  notFound (fallback) {
    this.fallback = fallback
  }

  async go (url, ctx = {}) {
    if ($window) {
      // Update the browser's history with the URL that's being navigated to.
      const evt = ctx instanceof $window.Event ? ctx : undefined
      $window.history.pushState(evt, ctx.title, url)
      ctx.url = $window.location.href
    } else {
      ctx.url = url
    }

    // Call the popstate listener manually to call hooks and matching route
    // handlers.
    return this.listener(ctx)
  }

  stopListening () {
    if ($window) {
      $window.removeEventListener('popstate', this.listener)
    }
  }
}

export const router = new HistoryRouter()

export const go = async (url, ctx) => {
  if (url && typeof url !== 'string') {
    // If URL is not a string, it's most likely a click event on an anchor
    // element and calling preventDefault is necessary to tell the browser not
    // to load the target page as it would normally.
    url.preventDefault()

    // Get the event target's href value and use it as the URL.
    url = url.target.getAttribute('href')
  }

  // Perform routing through the local router instance.
  return router.go(url, ctx)
}
