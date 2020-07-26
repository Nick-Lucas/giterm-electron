export function __splitPathToDepth(path, maxDepth, delimiter) {
  const splitPath = path.split(delimiter).filter(Boolean)
  const elements = splitPath.splice(0, maxDepth)
  if (splitPath.length > 0) {
    elements.push(splitPath.join(delimiter))
  }
  return elements
}

/**
 * @param {string[]} paths
 * @param {int} depth
 */
export function pathsToTree(
  objects = [],
  pathGetter = (obj) => obj,
  { maxDepth = 2, delimiter = '/' } = {},
) {
  const paths = objects.map((obj) => {
    const names = __splitPathToDepth(pathGetter(obj), maxDepth, delimiter)
    return [names, obj]
  })

  const root = __root()
  for (let y = 0; y < paths.length; y++) {
    const [path, terminatorObject] = paths[y]

    let depthLevel = 0
    const depthMaxLevel = Math.min(maxDepth, path.length - 1)

    let cursor = root
    while (true) {
      const layersRemaining = depthMaxLevel - depthLevel
      const name = path[depthLevel]

      let matchIndex = cursor.children.findIndex(
        (child) => child.name === name && child.node,
      )
      if (matchIndex === -1) {
        cursor.children.push(__node(depthLevel, name))

        matchIndex = cursor.children.length - 1
      }

      if (layersRemaining === 0) {
        cursor.children[matchIndex] = __leaf(depthLevel, name, terminatorObject)
        break
      }

      cursor = cursor.children[matchIndex]
      depthLevel++
    }
  }

  return root
}

export const __root = (children = []) => ({ depth: 0, root: true, children })
export const __node = (depth, name, children = []) => ({
  depth,
  node: true,
  name,
  children,
})
export const __leaf = (depth, name, object = null) => ({
  depth,
  leaf: true,
  name,
  object,
})
