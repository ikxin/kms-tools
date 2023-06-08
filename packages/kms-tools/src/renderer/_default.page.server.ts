import { renderToString } from '@vue/server-renderer'
import { escapeInject, dangerouslySkipEscape } from 'vite-plugin-ssr/server'
import { createApp } from '@/main'

export { render }
export { passToClient }

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps']

async function render(pageContext) {
  const app = createApp(pageContext)
  const appHtml = await renderToString(app)

  return escapeInject`<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" href="./favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
        <title>KMS Tools - 生成kms激活脚本的小工具</title>
        <meta name="keywords" content="kms,kmstools,kms激活,kms服务器,windows激活,office激活" />
        <meta name="description" content="KMS Tools是一个用于生成kms激活脚本的小工具" />
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
      </body>
    </html>`
}
