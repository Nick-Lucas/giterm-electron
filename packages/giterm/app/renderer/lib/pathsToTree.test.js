import {
  pathsToTree,
  __splitPathToDepth,
  __root,
  __node,
  __leaf,
} from './pathsToTree'

describe('pathsToTree', () => {
  it('should not split a non-foldered path', () => {
    expect(
      //
      pathsToTree(['hello']),
    ).toEqual(
      //
      __root([__leaf(0, 'hello', 'hello')]),
    )
  })

  it('should not split a foldered path', () => {
    expect(
      //
      pathsToTree(['hello/world', 'hello/london', 'goodbye/ny']),
    ).toEqual(
      //
      __root([
        __node(0, 'hello', [
          __leaf(1, 'world', 'hello/world'),
          __leaf(1, 'london', 'hello/london'),
        ]),
        __node(0, 'goodbye', [
          //
          __leaf(1, 'ny', 'goodbye/ny'),
        ]),
      ]),
    )
  })

  it('should gracefully handle paths ending with folders', () => {
    expect(
      //
      pathsToTree(['hello', 'hello/london']),
    ).toEqual(
      //
      __root([
        __leaf(0, 'hello', 'hello'),
        __node(0, 'hello', [
          //
          __leaf(1, 'london', 'hello/london'),
        ]),
      ]),
    )
  })
})

describe('__splitPathToDepth', () => {
  it('should behave on non-foldered path', () => {
    expect(__splitPathToDepth('hello', 2, '/')).toEqual(['hello'])
  })

  it('should behave on non-foldered path with end folder', () => {
    expect(__splitPathToDepth('hello/', 2, '/')).toEqual(['hello'])
  })

  it('should behave on foldered path', () => {
    expect(__splitPathToDepth('hello/world', 2, '/')).toEqual([
      'hello',
      'world',
    ])
  })

  it('should fold any remaining depth into one', () => {
    expect(__splitPathToDepth('hello/world/hello/london', 2, '/')).toEqual([
      'hello',
      'world',
      'hello/london',
    ])
  })
})
