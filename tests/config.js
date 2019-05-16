const createTestServer = require('@ianwalter/test-server')
const { source } = require('common-tags')

let testServer

module.exports = {
  async before (context) {
    testServer = await createTestServer()
    testServer.use(ctx => {
      ctx.body = source`
        <html>
          <head>
            <title>Test</title>
          </head>
          <body>

            <h1>Home</h1>

            <ul>
              <li>
                <a id="aboutLink" href="/about">
                  About
                </a>
              </li>
              <li>
                <a id="contactLink" href="/contact">
                  Contact
                </a>
              </li>
            </ul>

          </body>
        </html>
      `
    })
    context.testContext.testServerUrl = testServer.url
  },
  async beforeEach ({ page, testContext }) {
    await page.goto(testContext.testServerUrl)
  },
  async after () {
    await testServer.close()
  }
}
