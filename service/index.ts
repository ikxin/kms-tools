import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
  // .use(
  //   staticPlugin({
  //     assets: 'dist/assets',
  //     prefix: '/assets',
  //   }),
  // )
  // .get('/*', () => Bun.file('dist/index.html'))
  .onError(ctx => {
    if (ctx.code === 'NOT_FOUND') {
      ctx.set.redirect = '/'
      return ''
    }
  })
  .use(staticPlugin({ assets: 'dist', prefix: '/' }))
  .get('/', () => Bun.file('dist/index.html'))
  .listen(3000)
