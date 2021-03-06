import React, { useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import * as propTypes from './props'
import { GitRef } from './GitRef'
import { PathLine } from 'app/components/graph/pathline'
import { GraphColumnWidth, GraphIndent, RowHeight } from './constants'
import { colours } from 'app/lib/theme'
import _ from 'lodash'

const Colours = colours.GRAPH_NODES

const SelectedRowCSS = css`
  background-color: ${colours.OVERLAY.FOCUS};
`
const HeadRowCSS = css`
  font-weight: 'bold';
  color: ${colours.TEXT.FOCUS};
`
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;

  height: ${RowHeight}px;
  padding-right: 3px;
  padding-left: 3px;

  align-items: center;

  :hover {
    background-color: ${colours.OVERLAY.HINT};
  }

  color: ${colours.TEXT.DEFAULT};

  ${({ isSelected }) => isSelected && SelectedRowCSS}
  ${({ isHead }) => isHead && HeadRowCSS}
`

const RowColumn = styled.div`
  display: flex;
  flex-direction: row;

  margin-right: 10px;
  max-height: 100%;

  overflow: hidden;

  width: ${({ width }) => width};
`

const ColumnText = styled.div`
  display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

function getPathLinePoints(link, indexOffset = 0) {
  const x1 = link.x1 * GraphColumnWidth + GraphIndent
  const y1 = -RowHeight / 2 + indexOffset * RowHeight
  const x2 = link.x2 * GraphColumnWidth + GraphIndent
  const y2 = RowHeight / 2 + indexOffset * RowHeight

  return [
    ...(link.nodeAtStart
      ? [{ x: x1, y: y1 }]
      : [
          { x: x1, y: y1 },
          { x: x1, y: y1 + 3 },
        ]),
    x1 < x2
      ? { x: x2, y: y1 + RowHeight / 2 }
      : { x: x1, y: y2 - RowHeight / 2 },
    ...(link.nodeAtEnd
      ? [{ x: x2, y: y2 }]
      : [
          { x: x2, y: y2 - 3 },
          { x: x2, y: y2 },
        ]),
  ]
}

export const _Row = ({
  columns,
  commit,
  refs,
  isHead,
  node,
  linksBefore,
  linksAfter,
  selected,
}) => {
  const pairedRefs = useMemo(() => {
    const [tags, branches] = _.partition(
      refs,
      (ref) => ref.type === propTypes.REF_TYPE_TAG,
    )
    const [upstreamBranches, localBranches] = _.partition(
      branches,
      (branch) => branch.isRemote,
    )

    // If both local and remote heads are on this commit, just display one
    const pairedRefs = []
    for (const localBranch of localBranches) {
      const upstreamBranchIndex = upstreamBranches.findIndex(
        (other) => other.id === localBranch.upstream?.name,
      )

      if (upstreamBranchIndex >= 0) {
        upstreamBranches.splice(upstreamBranchIndex, 1)
      }
      pairedRefs.push({
        ref: localBranch,
        remoteInSync: upstreamBranchIndex >= 0,
      })
    }
    pairedRefs.push(
      ...upstreamBranches.map((ref) => ({
        ref,
      })),
    )
    pairedRefs.push(
      ...tags.map((tag) => ({
        ref: tag,
      })),
    )

    return pairedRefs
  }, [refs])

  return (
    <RowWrapper isSelected={selected} isHead={isHead}>
      {columns.map((column) => (
        <RowColumn key={column.key} width={column.width}>
          {column.showTags &&
            pairedRefs.map(({ ref, remoteInSync = false }) => (
              <GitRef
                key={ref.id}
                label={ref.name}
                current={ref.isHead}
                remoteInSync={remoteInSync}
                type={ref.type}
                ahead={ref.upstream?.ahead}
                behind={ref.upstream?.behind}
              />
            ))}

          {column.key === 'graph' ? (
            !!node && (
              <svg>
                {linksBefore.map((link) => (
                  <PathLine
                    key={JSON.stringify(link)}
                    points={getPathLinePoints(link, 0)}
                    stroke={Colours[link.colour % Colours.length]}
                    strokeWidth={3}
                    fill="none"
                    r={2}
                  />
                ))}
                {linksAfter.map((link) => (
                  <PathLine
                    key={JSON.stringify(link)}
                    points={getPathLinePoints(link, 1)}
                    stroke={Colours[link.colour % Colours.length]}
                    strokeWidth={3}
                    fill="none"
                    r={2}
                  />
                ))}
                <circle
                  key={node.sha}
                  cx={GraphIndent + node.column * GraphColumnWidth}
                  cy={RowHeight / 2}
                  r={5}
                  fill={
                    Colours[
                      (node.secondaryColour
                        ? node.secondaryColour
                        : node.primaryColour) % Colours.length
                    ]
                  }
                  strokeWidth={3}
                  stroke={Colours[node.primaryColour % Colours.length]}
                />
              </svg>
            )
          ) : (
            <ColumnText>
              {column.format
                ? column.format(commit[column.key])
                : commit[column.key]}
            </ColumnText>
          )}
        </RowColumn>
      ))}
    </RowWrapper>
  )
}

export const Row = memo(_Row)

Row.displayName = 'Row'

Row.propTypes = {
  selected: PropTypes.bool,
  columns: propTypes.columns,
  refs: propTypes.refs,
  commit: propTypes.commit,
  node: PropTypes.object.isRequired,
  linksBefore: PropTypes.array.isRequired,
  linksAfter: PropTypes.array.isRequired,
}
