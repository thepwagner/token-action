import {describe, expect, test} from '@jest/globals'
import {getPermissions, getRepositories} from '../src/main'

describe('getPermissions', () => {
  test('empty', () => {
    process.env.INPUT_PERMISSIONS = ''
    expect(getPermissions()).toEqual({})
  })

  test('single-value map', () => {
    process.env.INPUT_PERMISSIONS = 'contents: read'
    expect(getPermissions()).toEqual({contents: 'read'})
  })

  test('single-line map', () => {
    process.env.INPUT_PERMISSIONS = '{"contents":"read", "issues":"write"}'
    expect(getPermissions()).toEqual({contents: 'read', issues: 'write'})
  })

  test('multi-line map', () => {
    process.env.INPUT_PERMISSIONS = ['contents: read', 'issues: write'].join(
      '\n'
    )
    expect(getPermissions()).toEqual({contents: 'read', issues: 'write'})
  })
})

describe('getRepositories', () => {
  test('empty', () => {
    process.env.INPUT_REPOSITORIES = ''
    expect(getRepositories()).toEqual([])
  })

  test('single-line array', () => {
    process.env.INPUT_REPOSITORIES = '["foo", "bar"]'
    expect(getRepositories()).toEqual(['foo', 'bar'])
  })

  test('multi-line array', () => {
    process.env.INPUT_REPOSITORIES = ['- foo', '- bar'].join('\n')
    expect(getRepositories()).toEqual(['foo', 'bar'])
  })
})
