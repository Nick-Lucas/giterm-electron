import React, { useState, useCallback, useMemo } from 'react'
import './App.css'
import styled from 'styled-components'
import { data } from './data'
import { commitsToGraph, _scenarios } from '@giterm/gitgraph'

const colours = [
  '#058ED9',
  '#880044',
  '#E5A823',
  // '#129490',
  '#875053',
  '#0055A2',
  '#96C5F7',
]

export default function App() {
  const path = window.location.pathname
  const [rehydrateFrom, setRehydrateFrom] = useState(null)
  const updateRehydration = useCallback((e) => {
    setRehydrateFrom(e.target.value)
  }, [])

  const commits = useMemo(() => {
    let commits = data.commits
    if (path !== '/') {
      const dataPath = path.slice(1)
      commits = _scenarios[dataPath]
      if (!commits) {
        return (
          <div>
            Invalid scenario: `{dataPath}`. Must be in
            ./GitGraphRenderLib/commitsToGraph.testscenarios
          </div>
        )
      }
      if (typeof commits === 'function') {
        commits = commits()
      }
    }
    return commits
  }, [path])

  const { nodes, links, ...rest } = useMemo(() => {
    return !rehydrateFrom
      ? commitsToGraph(commits)
      : (function() {
          // return commitsToGraph(commits.slice(0, rehydrateFrom))
          const { rehydrationPackage } = commitsToGraph(
            commits.slice(0, rehydrateFrom),
          )
          return commitsToGraph(
            commits.slice(rehydrateFrom),
            rehydrationPackage,
          )
        })()
  }, [commits, rehydrateFrom])

  console.log({ nodes, links, ...rest })

  return (
    <div className="App">
      <div className="sidebar">
        <div>Scenarios:</div>
        {Object.keys(_scenarios).map((scenarioName) => (
          <div key={scenarioName}>
            <a href={'/' + scenarioName}>{scenarioName}</a>
          </div>
        ))}
      </div>
      <br />

      <div
        style={{
          width: '100%',
          height: 20 * nodes.length,
        }}>
        <select onChange={updateRehydration}>
          <option value={null} />
          {commits.map((_, i) => (
            <option key={i} value={i}>
              Rehydrate from: {i}
            </option>
          ))}
        </select>
        <br />

        <div style={{ position: 'relative', marginTop: '20px' }}>
          {nodes.map((_, i) => {
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 20 * i,
                  left: 0,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Label>
                  {commits[i].sha7 || commits[i].sha}{' '}
                  {commits[i].bug ? 'BUG' : ''}
                </Label>

                <GraphContainer>
                  {links[i].map((link, i) => {
                    return (
                      <Line
                        key={i}
                        x1={10 + link.x1 * 20}
                        y1={-10}
                        x2={10 + link.x2 * 20}
                        y2={10}
                        link={link}
                      />
                    )
                  })}
                  {links[i + 1] &&
                    links[i + 1].map((link, i) => {
                      return (
                        <Line
                          key={i}
                          x1={10 + link.x1 * 20}
                          y1={-10 + 20}
                          x2={10 + link.x2 * 20}
                          y2={10 + 20}
                          link={link}
                        />
                      )
                    })}
                  <Circle
                    key="node"
                    cy={10}
                    cx={10 + nodes[i].column * 20}
                    r={5}
                    node={nodes[i]}
                  />
                </GraphContainer>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const Line = styled.line`
  stroke-width: 2px;
  stroke: ${({ link: { colour } }) => colours[colour % colours.length]};
`

const Circle = styled.circle`
  stroke: ${({ node: { primaryColour } }) =>
    colours[primaryColour % colours.length]};
  stroke-width: 3px;
  fill: ${({ node: { primaryColour, secondaryColour } }) =>
    colours[
      (secondaryColour != null ? secondaryColour : primaryColour || 0) %
        colours.length
    ]};
`

const Label = styled.div`
  flex: 0 0 auto;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 20px;

  width: 100px;
`

const GraphContainer = styled.svg`
  height: 20px;
  margin-left: 10px;

  display: flex;
  flex: 1 1 auto;
`
