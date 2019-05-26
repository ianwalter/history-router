import Router from '@ianwalter/router'

const $window = typeof window !== 'undefined' ? window : undefined

export class HistoryRouter extends Router {
  constructor (options = {}) {
    // Set the router instance's base URL.
    super(options.baseUrl)

    // Set the before and after hooks.
    this.before = options.before
    this.after = options.after

    // TODO:
    this.listener = async (evt, url = $window.location.href) => {
      // Execute the before hook before navigation if it's defined.
      if (this.before) {
        await this.before(evt, url)
      }

      // Attempt to match and execute any route handler assocaited with the URL
      // that's being navigated to.
      this.match({ request: { url } })

      // Execute the after hook after navigation if it's defined.
      if (this.after) {
        await this.after(evt, url)
      }
    }

    // TODO:
    if ($window) {
      $window.addEventListener('popstate', this.listener)
    }
  }

  async go (url, title, data) {
    if ($window) {
      // Update the browser's history with the URL that's being navigated to.
      $window.history.pushState(data, title, url)
      url = $window.location.href
    }

    // TODO:
    this.listener({ state: data }, url)
  }

  stopListening () {
    if ($window) {
      $window.removeEventListener('popstate', this.listener)
    }
  }
}

export const router = new HistoryRouter()

export const go = (url, title, data) => {
  if (typeof url !== 'string') {
    // If url is not a string, it's most likely a click event on an anchor
    // element and calling preventDefault is necessary to tell the browser not
    // to load the target page as it would normally.
    url.preventDefault()

    // Get the event target's href value and use it as the URL.
    url = url.target.getAttribute('href')
  }

  // Perform routing through the local router instance.
  router.go(url, title, data)
}
