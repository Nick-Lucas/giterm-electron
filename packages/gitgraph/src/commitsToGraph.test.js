/* eslint-disable prettier/prettier */
import _ from 'lodash'

import { commitsToGraph, _link } from './commitsToGraph'
import { scenarios } from "./commitsToGraph.testscenarios";

// Very useful site for finding appropriate characters: http://shapecatcher.com/

describe('commitsToGraph', () => {
  let scenarioPath = ''
  
  function makeColours(primaryColour, secondaryColour = null) {
    return {
      primaryColour,
      secondaryColour,
    }
  }

  /**
   * @param  {...[columnStart: number, columnEnd: number, colour: number, type: string]} pairs 
   */
  function makeLinks(...pairs) {
    return pairs.map(([from, to, colour, connections = 'both']) => {
      return _link(from, to, colour, null, null, {
        nodeAtStart: ['both', 'start'].includes(connections),
        nodeAtEnd: ['both', 'end'].includes(connections),
      })
    })
  }

  describe('Standard Scenarios', () => {
    it('should never mutate the input commits', () => {
      scenarioPath = 'standard.a'
      const commits = scenarios[scenarioPath]
      const expected = JSON.parse(JSON.stringify(commits))

      commitsToGraph(commits)

      expect(commits).toEqual(expected)
    })

    it(`should work on a simple commit chain
        --------------------------------------------
          .
          | 
          |
        --------------------------------------------
    `, () => {
      scenarioPath = 'standard.a'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [['.'], ['.'], ['.']])
      expectNodeColours(nodes, [makeColours(0), makeColours(0), makeColours(0)])
      expectLinks(links, [[], makeLinks([0, 0, 0]), makeLinks([0, 0, 0])])
    })

    it(`should work on an open branch
        --------------------------------------------
          . 
          | .
          |/
        --------------------------------------------
    `, () => {
      scenarioPath = 'standard.b'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'], 
        [' ', '.'], 
        ['.', ' ']
      ])
      expectNodeColours(nodes, [
        makeColours(0), 
        makeColours(1), 
        makeColours(0)
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start']),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1]),
      ])
    })

    it(`should work on a merged branch
        --------------------------------------------
          . 
          |৲
          |/
        --------------------------------------------
    `, () => {
      scenarioPath = 'standard.c'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'], 
        [' ', '.'], 
        ['.', ' ']
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(1),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1]),
      ])
    })

    it(`should work on a second root
        --------------------------------------------
          . 
          |.
          |
        --------------------------------------------
    `, () => {
      scenarioPath = 'standard.d'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [['.'], [' ', '.'], ['.']])
      expectNodeColours(nodes, [makeColours(0), makeColours(1), makeColours(0)])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start']),
        makeLinks([0, 0, 0, 'end']),
      ])
    })

    it(`should prepare links for a merge commit even though the merged parent isn't visible yet
        --------------------------------------------
          .৲
          .|
        --------------------------------------------
    `, () => {
      scenarioPath = 'standard.e'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'], 
        ['.', ' ']
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1), 
        makeColours(0)
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0], [0, 1, 1, 'start']),
      ])
    })

    it(`should render consecutive branches in the same column, because it can!
        --------------------------------------------
          .৲
          |.
          ./৲
          | .
          . /
        --------------------------------------------
    `, () => {
      scenarioPath = 'standard.f'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'], 
        [' ', '.'],
        ['.'], 
        [' ', '.'],
        ['.']
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1), 
        makeColours(1),
        makeColours(0, 2), 
        makeColours(2),
        makeColours(0)
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1]),
        makeLinks([0, 0, 0, 'start'], [0, 1, 2]),
        makeLinks([0, 0, 0, 'end'], [1, 0, 2]),
      ])
    })
  })

  describe('Repeated merging with active branch', () => {
    it(`Merge from master to branch
        --------------------------------------------
          .
          |.
          .⩘
          |.
          ./
        --------------------------------------------
    `, () => {
      scenarioPath = 'repeated-merging.a'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'],
        [' ', '.'],
        ['.', ' '],
        [' ', '.'],
        ['.', ' '],
      ])
      expectNodeColours(nodes, [
        makeColours(0),
        makeColours(1, 0),
        makeColours(0),
        makeColours(1),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start']),
        makeLinks([0, 0, 0, 'end'], [1, 1, 1, 'start'], [1, 0, 0]),
        makeLinks([0, 0, 0, 'start'], [1, 1, 1, 'end']),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1]),
      ])
    })

    it(`Merge into master from branch
        --------------------------------------------
          .৲
          |.
          .|
          |ч 
          ./
        --------------------------------------------
    `, () => {
      scenarioPath = 'repeated-merging.b'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'],
        [' ', '.'],
        ['.', ' '],
        [' ', '.'],
        ['.', ' '],
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(1),
        makeColours(0, 1),
        makeColours(1),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
        makeLinks([0, 0, 0, 'end'], [1, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'start'], [1, 1, 1, 'end'], [0, 1, 1]),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1]),
      ])
    })
  })

  describe('Multi-branch', () => {
    it(`should work on two branches merged in proximity
        --------------------------------------------
          .৲ 
          .|৲
          |.|
          ||.
          .//
        --------------------------------------------
    `, () => {
      scenarioPath = 'multi-branch.a'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)
      
      expectNodePositions(nodes, [
        ['.'],
        ['.'],
        [' ', '.'],
        [' ', ' ', '.'],
        ['.', ' ', ' '],
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(0, 2),
        makeColours(1),
        makeColours(2),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0], [0, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'start'], [1, 1, 1, 'end'], [0, 2, 2, 'start']),
        makeLinks([0, 0, 0, 'none'], [1, 1, 1, 'start'], [2, 2, 2, 'end']),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1, 'end'], [2, 0, 2]),
      ])
    })
  })

  describe('Data driven scenarios', () => {
    it(`should merge in at correct point
        --------------------------------------------
          .৲
          |.
          .|
          |ч.
          |.|
          .//
        --------------------------------------------
    `, () => {
      scenarioPath = 'data-driven.a'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'],
        [' ', '.'],
        ['.', ' '],
        [' ', ' ', '.'],
        [' ', '.', ' '],
        ['.', ' ', ' '],
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(1),
        makeColours(0, 1),
        makeColours(2),
        makeColours(1),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
        makeLinks([0, 0, 0, 'end'], [1, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'start'], [1, 1, 1, 'none'], [0, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'none'], [1, 1, 1, 'end'], [2, 2, 2, 'start']),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1], [2, 0, 2, 'end']),
      ])
    })

    it(`should draw a graph where consecutive nodes are merged
          (was observed to cause a condition where 'root' was in second column)
        --------------------------------------------
          .৲
          |.
          .|
          ./
        --------------------------------------------
    `, () => {
      scenarioPath = 'data-driven.b'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [['.'], [' ', '.'], ['.', ' '], ['.', ' ']])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(1),
        makeColours(0),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
        makeLinks([0, 0, 0, 'end'], [1, 1, 1, 'start']),
        makeLinks([0, 0, 0], [1, 0, 1, 'end']),
      ])
    })

    it(`should draw a graph where a parent has 3 children, 2 of which are part of the same branch
          (was observed to cause a condition where the second node's merge line overlapped its own branch's lines)
        --------------------------------------------
          .৲
          ⊢.
          |.
          ./
        --------------------------------------------
    `, () => {
      scenarioPath = 'data-driven.c'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'], 
        [' ', '.'], 
        [' ', '.'], 
        ['.', ' ']
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(1, 0),
        makeColours(1),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
        makeLinks([0, 0, 0, 'none'], [1, 0, 0, 'start'], [1, 1, 1]),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1]),
      ])
    })

    it(`should draw a graph where a merge has taken place with an old commit on a branch as the first parent
        --------------------------------------------
          .
          |.৲
          .||
          ./|
            .
        --------------------------------------------
    `, () => {
      scenarioPath = 'data-driven.d'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)

      expectNodePositions(nodes, [
        ['.'], 
        [' ', '.'], 
        ['.', ' '], 
        ['.', ' '],
        [' ', ' ', '.']
      ])
      expectNodeColours(nodes, [
        makeColours(0),
        makeColours(1, 2),
        makeColours(0),
        makeColours(0),
        makeColours(2),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start']),
        makeLinks([0, 0, 0, 'end'], [1, 1, 1, 'start'], [1, 2, 2, 'start']),
        makeLinks([0, 0, 0], [1, 0, 1, 'end'], [2, 2, 2, 'none']),
        makeLinks([2, 2, 2, 'end']),
      ])
    })

    it(`should draw a graph where two commits merge from the same commit
        --------------------------------------------
          .৲
          ||.
          |.⩘
        --------------------------------------------
    `, () => {
      scenarioPath = 'data-driven.e'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)
      
      expectNodePositions(nodes, [
        ['.'], 
        [' ', ' ', '.'], 
        [' ', '.'],
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(2, 1),
        makeColours(1),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start'], [0, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'none'], [1, 1, 1, 'end'], [2, 1, 1], [2, 2, 2, 'start']),
      ])
    })

    it(`should draw a graph where a commit pulls from a branch left of it, but there is another commit blocking the merge line
        --------------------------------------------
          .
          |.
          ||.
          .||
           |.
           .|
           .⩘
        --------------------------------------------
    `, () => {
      scenarioPath = 'data-driven.f'
      const commits = scenarios[scenarioPath]

      const { nodes, links } = commitsToGraph(commits)
      
      expectNodePositions(nodes, [
        ['.'], 
        [' ', '.'],
        [' ', ' ', '.'], 
        ['.', ' ', ' '], 
        [' ', ' ', '.'], 
        [' ', '.', ' '], 
        [' ', '.', ' '], 
      ])
      expectNodeColours(nodes, [
        makeColours(0),
        makeColours(1),
        makeColours(2),
        makeColours(0),
        makeColours(2, 1),
        makeColours(1),
        makeColours(1),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start']),
        makeLinks([0, 0, 0, 'none'], [1, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'end'], [1, 1, 1, 'none'], [2, 2, 2, 'start']),
        makeLinks(                  [1, 1, 1, 'none'], [2, 2, 2, 'end']),
        makeLinks(                  [1, 1, 1, 'end'],  /*[2, 2, 3, 'start'],*/ [2, 2, 2, 'start']),
        makeLinks(                  [1, 1, 1, 'both'], [2, 1, 3, 'end'], [2, 2, 2, 'none']),
      ])
    })
  })

  describe('Rehydration', () => {
    it('should assign and rehydrate a column to a known parent which hasn\'t been found yet', () => {
      scenarioPath = 'rehydration.a'
      const commits = scenarios[scenarioPath]

      const commits1 = commits.slice(0, 2)
      const commits2 = commits.slice(2)
      expect(commits1.length + commits2.length).toBe(commits.length)

      function test1() {
        const { nodes, links, rehydrationPackage } = commitsToGraph(commits1)

        expectNodePositions(nodes, [
          ['.'], 
          ['.', ' ']
        ])
        expectNodeColours(nodes, [
          makeColours(0, 1), 
          makeColours(0)
        ])
        expectLinks(links, [
          [],
          makeLinks([0, 0, 0], [0, 1, 1, 'start']),
        ])

        return rehydrationPackage
      }

      function test2(rehydrationPackage) {
        const { nodes, links } = commitsToGraph(commits2, rehydrationPackage)

        expectNodePositions(nodes, [
          ['.'], 
          ['.', ' '],
          [' ', '.'],
          ['.', ' '],
        ])
        expectNodeColours(nodes, [
          makeColours(0, 1), 
          makeColours(0),
          makeColours(1),
          makeColours(0),
        ])
        expectLinks(links, [
          [],
          makeLinks([0, 0, 0], [0, 1, 1, 'start']),
          makeLinks([0, 0, 0, 'start'], [1, 1, 1, 'end']),
          makeLinks([0, 0, 0, 'end'], [1, 0, 1]),
        ])
      }

      const rehydrationPackage = test1()
      test2(rehydrationPackage)
    })

    it(`should rehydrate and continue where it left off on test case:
          'should work on two branches merged in proximity'
        --------------------------------------------
          .৲ 
          .|৲
          |.|
          ||.
          .//
        --------------------------------------------
    `, () => {
      scenarioPath = 'rehydration.b'
      const commits = scenarios[scenarioPath]

      const commits1 = commits.slice(0, 2)
      const commits2 = commits.slice(2)
      expect(commits1.length + commits2.length).toBe(commits.length)

      const { rehydrationPackage } = commitsToGraph(commits1)
      const { nodes, links } = commitsToGraph(
        commits2,
        JSON.parse(JSON.stringify(rehydrationPackage)),
      )

      expectNodePositions(nodes, [
        ['.'],
        ['.'],
        [' ', '.'],
        [' ', ' ', '.'],
        ['.', ' ', ' '],
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(0, 2),
        makeColours(1),
        makeColours(2),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0], [0, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'start'], [1, 1, 1, 'end'], [0, 2, 2, 'start']),
        makeLinks([0, 0, 0, 'none'], [1, 1, 1, 'start'], [2, 2, 2, 'end']),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1, 'end'], [2, 0, 2]),
      ])
    })

    it(`should rehydrate and continue where it left off on test case:
          'should adjust node columns when an inner column is removed'
        --------------------------------------------
          .৲ 
          .|৲
          |.|
          ||.
          ./˩৲
          ||.
          |.|
          .//
        --------------------------------------------
    `, () => {
      scenarioPath = 'rehydration.c'
      const commits = scenarios[scenarioPath]

      const commits1 = commits.slice(0, 4)
      const commits2 = commits.slice(4)
      expect(commits1.length + commits2.length).toBe(commits.length)

      const { rehydrationPackage } = commitsToGraph(commits1)
      const { nodes, links } = commitsToGraph(
        commits2,
        JSON.parse(JSON.stringify(rehydrationPackage)),
      )

      expectNodePositions(nodes, [
        ['.'],
        ['.'],
        [' ', '.'],
        [' ', ' ', '.'],
        ['.', ' ', ' '],
        [' ', '.', ' '],
        [' ', ' ', '.'],
        ['.', ' ', ' '],
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(0, 2),
        makeColours(1),
        makeColours(2),
        makeColours(0, 3),
        makeColours(3),
        makeColours(2),
        makeColours(0),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0], [0, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'start'], [1, 1, 1, 'end'], [0, 2, 2, 'start']),
        makeLinks([0, 0, 0, 'none'], [1, 1, 1, 'start'], [2, 2, 2, 'end']),
        makeLinks([0, 0, 0, 'end'], [1, 0, 1, 'end'], [2, 2, 2, 'start']),
        makeLinks([0, 0, 0, 'start'], [2, 2, 2, 'none'], [0, 1, 3, 'both']),
        makeLinks([0, 0, 0, 'none'], [2, 2, 2, 'end'], [1, 1, 3, 'start']),
        makeLinks([0, 0, 0, 'end'], [2, 0, 2, 'both'], [1, 0, 3, 'end']),
      ])
    })

    it('should remain stable over multipler rehydration rounds', () => {
      scenarioPath = 'rehydration.d'
      const commits = scenarios[scenarioPath]

      const commits1 = commits.slice(0, 2)
      const commits2 = commits.slice(2, 4)
      const commits3 = commits.slice(4)
      expect(commits1.length + commits2.length + commits3.length).toBe(commits.length)

      function test1() {
        const { nodes, links, rehydrationPackage } = commitsToGraph(commits1)

        expectNodePositions(nodes, [
          ['.'], 
          [' ', '.']
        ])
        expectNodeColours(nodes, [
          makeColours(0, 1), 
          makeColours(1)
        ])
        expectLinks(links, [
          [],
          makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
        ])

        return rehydrationPackage
      }

      function test2(rehydrationPackage) {
        const { nodes, links } = commitsToGraph(commits2, rehydrationPackage)

        expectNodePositions(nodes, [
          ['.'], 
          [' ', '.'],
          [' ', '.'],
          [' ', '.'],
        ])
        expectNodeColours(nodes, [
          makeColours(0, 1), 
          makeColours(1),
          makeColours(1),
          makeColours(1),
        ])
        expectLinks(links, [
          [],
          makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
          makeLinks([0, 0, 0, 'none'], [1, 1, 1]),
          makeLinks([0, 0, 0, 'none'], [1, 1, 1]),
        ])

        return rehydrationPackage
      }

      function test3(rehydrationPackage) {
        const { nodes, links } = commitsToGraph(commits3, rehydrationPackage)

        expectNodePositions(nodes, [
          ['.'], 
          [' ', '.'],
          [' ', '.'],
          [' ', '.'],
          ['.', ' '],
        ])
        expectNodeColours(nodes, [
          makeColours(0, 1), 
          makeColours(1),
          makeColours(1),
          makeColours(1),
          makeColours(0),
        ])
        expectLinks(links, [
          [],
          makeLinks([0, 0, 0, 'start'], [0, 1, 1]),
          makeLinks([0, 0, 0, 'none'], [1, 1, 1]),
          makeLinks([0, 0, 0, 'none'], [1, 1, 1]),
          makeLinks([0, 0, 0, 'end'], [1, 0, 1]),
        ])
      }

      let rehydrationPackage = test1()
      rehydrationPackage = test2(rehydrationPackage)
      test3(rehydrationPackage)
    })

    it(`should draw a graph where two commits merge from the same commit
        Ensure b1-root link is retained
        --------------------------------------------
          .৲
          ||.
          |.⩘
        --------------------------------------------
    `, () => {
      scenarioPath = 'rehydration.e'
      const commits = scenarios[scenarioPath]

      const commits1 = commits.slice(0, 2)
      const commits2 = commits.slice(2)
      expect(commits1.length + commits2.length).toBe(commits.length)

      const { rehydrationPackage } = commitsToGraph(commits1)
      const { nodes, links } = commitsToGraph(
        commits2,
        JSON.parse(JSON.stringify(rehydrationPackage)),
      )

      expectNodePositions(nodes, [
        ['.'], 
        [' ', ' ', '.'], 
        [' ', '.'],
      ])
      expectNodeColours(nodes, [
        makeColours(0, 1),
        makeColours(2, 1),
        makeColours(1),
      ])
      expectLinks(links, [
        [],
        makeLinks([0, 0, 0, 'start'], [0, 1, 1, 'start']),
        makeLinks([0, 0, 0, 'none'], [1, 1, 1, 'end'], [2, 1, 1], [2, 2, 2, 'start']),
      ])
    })

  })

  // Test helpers!
  // **************
  function failTest(error) {
    throw new Error("Test failed: http://localhost:3000/" + scenarioPath + '\n\n' + error)
  }

  function format(obj) {
    return JSON.stringify(obj, null, 2)
  }
  
  /**
   * Checks that the layout of nodes/links in their columns are correct
   * The shape is an array of rows, where each column is either: 0 -> node, 1 -> link
   */
  function expectNodePositions(nodes, expectedShape) {
    function toName(char) {
      switch (char) {
        case '.':
          return 'node'
        default:
          return 'blank'
      }
    }

    function nodeToPretty(node) {
      return _.range(node.column)
              .map((column) => 
                node.column === column 
                  ? 'node' 
                  : 'blank'
              )
    }

    try {
      expect(nodes.length).toBe(expectedShape.length)
    } catch (e) {
      let error = 'Shape not equal. Different length: \n\n'
      error +=
        'Graph: ' +
        JSON.stringify(nodes.map(nodeToPretty), null, 2) +
        '\n'
      error +=
        'Expected shape: ' +
        JSON.stringify(expectedShape.map((row) => row.map(toName)), null, 2) +
        '\n\n'
      
      failTest(error)
    }
  
    for (let i = 0; i < nodes.length; i++) {
      const nodePosition = nodes[i].column
      const expectedNodePosition = expectedShape[i].findIndex(node => node === '.')
  
      try {
        expect(nodePosition).toBe(expectedNodePosition)
      } catch (e) {
        let error =
          'Node position not equal. Row ' + i + ' should have a node in position' + expectedNodePosition + ': \n\n'
        error +=
          'Graph Row: ' + JSON.stringify(nodes.map(nodeToPretty)) + '\n'
        error +=
          'Expected shape: ' + JSON.stringify(expectedShape[i].map(toName)) + '\n\n'
        error +=
          'Graph: ' +
          JSON.stringify(
            nodeToPretty(nodes[i]),
            null,
            2,
          ) +
          '\n'
        error +=
          'Expected shape: ' +
          JSON.stringify(expectedShape.map((row) => row.map(toName)), null, 2) +
          '\n\n'
        
        failTest(error)
      }
    }
  }
  
  function expectNodeColours(nodes, expectedColours) {
    const nodeColours = nodes
      .map((node) => ({
        primaryColour: node.primaryColour,
        secondaryColour: node.secondaryColour,
      }))
  
    for (const i in expectedColours) {
      const node = nodeColours[i]
      const expected = expectedColours[i]
  
      try {
        expect(node).toEqual(expected)
      } catch (e) {
        let error = `Node colours at row index ${i} node colours are wrong\n\n`
        error += `Received: ${JSON.stringify(node, null, 2)}\n`
        error += `Expected: ${JSON.stringify(expected, null, 2)}\n\n`
        error += `Full: ${JSON.stringify(nodeColours, null, 2)}\n`
        error += `Expected: ${JSON.stringify(expectedColours, null, 2)}`
        
        failTest(error)
      }
    }
  }
  
  function expectLinks(links, expected, {ignoreColours=false}={}) {
    function prettyLink({ x1, x2, colour, nodeAtStart, nodeAtEnd }) {
      return {
        from_x: x1,
        to_x__: x2,
        colour: ignoreColours || colour,
        nodeAtStart,
        nodeAtEnd,
      }
    }
  
    try {
      expect(links.length).toBe(expected.length)
    } catch (e) {
      let error = `Expected ${expected.length} rows of links but got ${
        links.length
      }: \n\n`
      error +=
        'Received: ' + format(links.map((row) => row.map(prettyLink))) + '\n'
      error +=
        'Expected: ' + format(expected.map((row) => row.map(prettyLink))) + '\n\n'
      
      failTest(error)
    }
  
    for (const i in links) {
      const linksRow = links[i]
      const expectedRow = expected[i]
  
      try {
        expect(new Set(linksRow.map(prettyLink))).toEqual(new Set(expectedRow.map(prettyLink)))
      } catch (e) {
        let error = `Links at Row index ${i} did not match: \n\n`
        error += 'Received: ' + format(linksRow.map(prettyLink)) + '\n'
        error += 'Expected: ' + format(expectedRow.map(prettyLink)) + '\n\n'
        error += 'Full: ' + format(links.map((row) => row.map(prettyLink))) + '\n'
        error +=
          'Full Expected: ' +
          format(expected.map((row) => row.map(prettyLink))) +
          '\n\n'
        
        failTest(error)
      }
    }
  }
})

