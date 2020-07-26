import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { clipboard } from 'electron'

import { Section, Label, Row, TreeItem } from './primitives'
import { BranchUpstreamState } from './BranchUpstreamState'
import { pathsToTree } from 'app/lib/pathsToTree'

/*  A branch
    {
      name: '12-infinite-loading',
      isRemote: false,
      isHead: false,
      id: 'refs/heads/12-infinite-loading',
      headSHA: '6d6e137f1630e64ad5668232cc4d9ea497cd0e6a'
    },
*/

export function Branches() {
  const _branches = useSelector((state) => state.branches.list) || []
  const nodes = useMemo(() => {
    const foundRemotes = {}
    const branches = []

    for (const branch of _branches) {
      if (branch.isRemote) {
        continue
      }

      if (branch.upstream) {
        foundRemotes[branch.upstream.name] = true
      }

      if (!foundRemotes[branch.name]) {
        branches.push({
          id: branch.id,
          name: branch.name,
          upstream: branch.upstream,
          isHead: branch.isHead,
          menuItems: [
            {
              label: `Copy "${branch.name}"`,
              click: () => clipboard.writeText(branch.name),
            },
          ],
        })
      }
    }

    return pathsToTree(branches, (branch) => branch.name, { maxDepth: 2 })
      .children
  }, [_branches])

  return (
    <Section title="BRANCHES">{nodes.map((node) => TreeNode(node))}</Section>
  )
}

function TreeNode(node) {
  if (node.leaf) {
    const branch = node.object

    return (
      <Row key={branch.id} menuItems={branch.menuItems} active={branch.isHead}>
        <Label>{node.name}</Label>

        {branch.upstream && (
          <BranchUpstreamState
            ahead={branch.upstream.ahead}
            behind={branch.upstream.behind}
            selected={branch.isHead}
          />
        )}
      </Row>
    )
  } else {
    return (
      <Row key={node.name} depth={node.depth} selectable={false}>
        <TreeItem initialOpenState={true} title={node.name}>
          {node.children.map(TreeNode)}
        </TreeItem>
      </Row>
    )
  }
}
