# node-vlmcs

Node.js implementation of the `vlmcs` KMS client, with both a CLI and a programmatic API.

## Install

```bash
npm install node-vlmcs
```

Install globally if you want the `vlmcs` command:

```bash
npm install -g node-vlmcs
```

## CLI

Show help:

```bash
vlmcs -h
```

Examples:

```bash
vlmcs 192.168.1.5
vlmcs -l "Office 2013 Professional" -4 192.168.1.5
vlmcs -x
```

## API

```ts
import { runVlmcs } from 'node-vlmcs'

const result = await runVlmcs({
  host: '127.0.0.1',
  port: 1688,
  protocol: 6,
  timeout: 5000,
  verbose: false
})

console.log(result)
```

## Publish

From the package directory:

```bash
npm login
npm publish
```

The package runs `npm run build` automatically before publish via `prepublishOnly`.

## License

MIT
