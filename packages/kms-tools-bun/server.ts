import { type Serve } from 'bun'

export default {
  fetch(req) {
    return new Response(`Bun!`)
  }
} satisfies Serve
