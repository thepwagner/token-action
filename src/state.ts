import * as core from '@actions/core'

export const IsPost = !!core.getState('isPost')

const actionID = process.env['GITHUB_ACTION'] as string

export const ExistingToken = core.getState(`${actionID}-token`)

export function saveToken(token: string): void {
  core.saveState(`${actionID}-token`, token)
}

// Publish a variable, so we can detect the re-invocation by `post:`.
if (!IsPost) {
  core.saveState('isPost', 'true')
}
