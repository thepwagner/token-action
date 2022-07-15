import * as core from '@actions/core'
import {HttpClient} from '@actions/http-client'
import {BearerCredentialHandler} from '@actions/http-client/lib/auth'
import YAML from 'yaml'

async function run(): Promise<void> {
  try {
    const repositories = getRepositories()
    const permissions = getPermissions()

    const server = core.getInput('server', {required: true})
    const idToken = await core.getIDToken(server)
    const auth = new BearerCredentialHandler(idToken)
    const http = new HttpClient('github-token-action', [auth])

    const tokenReq = JSON.stringify({
      repositories,
      permissions
    })
    core.info(`Sending request: ${tokenReq}`)
    const res = await http.post(server, tokenReq)

    const body = await res.readBody()
    const token = JSON.parse(body)['token'] as string
    if (!token) {
      throw new Error('no token')
    }
    core.setSecret(token)
    core.setOutput('token', token)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

export function getRepositories(): string[] {
  let repos = YAML.parse(core.getInput('repositories')) as string[]
  if (!repos) {
    return []
  }

  if (typeof repos === 'string') {
    repos = [repos]
  }
  repos = repos.map(repo => repo.trim())

  for (const repo of repos) {
    if (repo.includes(' ')) {
      throw new Error(`Repository ${repo} contains a space.`)
    }
  }
  return repos
}

export function getPermissions(): Record<string, string> {
  const permissions = YAML.parse(core.getInput('permissions'))
  if (!permissions) {
    return {}
  }
  return permissions as Record<string, string>
}

run()
