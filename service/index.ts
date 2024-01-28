import { PrismaClient } from '@prisma/client'
import { execFile, ExecFileException } from 'child_process'

const prisma = new PrismaClient()

const servers = await prisma.server.findMany()

const getData = domain => {
  return new Promise<{
    error: ExecFileException | null
    stdout: string
    stderr: string
  }>(resolve => {
    execFile(
      './service/vlmcs/vlmcs-darwin',
      [`${domain}:${1688}`, `-${6}`, `-l ${1}`],
      { timeout: 5 * 1000 },
      (error, stdout, stderr) => resolve({ error, stdout, stderr }),
    )
  })
}

servers.map(async item => {
  const result = await getData(item.address)
  console.log(result)
})
