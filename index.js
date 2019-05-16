import Router from '@ianwalter/router'

export class HistoryRouter extends Router {
  constructor (options = {}) {
    // Set the router instance's base URL.
    super(options.baseUrl)

    // Set the before and after hooks.
    this.before = options.before
    this.after = options.after
  }

  async go (url, title, data) {
    // Execute the before hook before navigation if it's defined.
    if (this.before) {
      await this.before(url, title, data)
    }

    // Update the browser's history with the URL that's being navigated to.
    if (url) {
      window.history.pushState(data, title, url)
    }

    // Attempt to match and execute any route handler assocaited with the URL
    // that's being navigated to.
    this.match({ request: { url: window.location.href } })

    // Execute the after hook after navigation if it's defined.
    if (this.after) {
      await this.after(url, title, data)
    }
  }
}

export const router = new HistoryRouter()

export const go = (url, title, data) => {
  if (typeof url === 'string') {
    //
    router.go(url, title, data)
  } else {
    //
    const evt = url
    evt.preventDefault()

    //
    router.go(evt.target.getAttribute('href'))
  }
}
