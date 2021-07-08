import { TestGitBuilder } from './TestGitBuilder'

export const scenarios = {
  experiments: function() {
    // const git = new TestGitBuilder()

    // git.addCommit({ id: 'a1', parentId: 'root' })
    // git.addCommit({ id: 'b1', parentId: 'root' })
    // git.addMerge({ id: 'm1', parentId1: 'root', parentId2: 'b1' })
    // git.addCommit({ id: 'a2', parentId: 'a1' })
    // git.addCommit({ id: 'c1', parentId: 'm1' })
    // git.addMerge({ id: 'm2', parentId1: 'm1', parentId2: 'a2' })
    // git.addMerge({ id: 'm3', parentId1: 'm2', parentId2: 'c1' })
    // commits: git.getCommits(),

    return [
      {
        sha: 'e945d9ef4a4111f2a238fcdafa5351e6ad6bc5aa',
        sha7: 'e945d9',
        parents: [
          '0a9958d128674738606501ce74c931f08a18425d',
          '615aa3860dc3d703587035353dcb48a369deac6d',
        ],
      },
      {
        sha: '290134b09a8a3eb4ef0fac33293dbe53d7b19faf',
        parents: [
          '7acacd60a409e4349e84ad113a3f879cebc6a944',
          '615aa3860dc3d703587035353dcb48a369deac6d',
        ],
      },
      {
        sha: '615aa3860dc3d703587035353dcb48a369deac6d',
        parents: [],
      },
    ]
  },

  'standard.a': (function() {
    const git = new TestGitBuilder()
    git.addCommit()
    git.addCommit()
    return git.getCommits()
  })(),
  'standard.b': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'branch_a', parentId: 'root' })
    git.addCommit({ id: 'branch_b', parentId: 'root' })
    return git.getCommits()
  })(),
  'standard.c': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'branch_a', parentId: 'root' })
    git.addMerge({ parentId1: 'root', parentId2: 'branch_a' })
    return git.getCommits()
  })(),
  'standard.d': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'branch_b', orphan: true })
    git.addCommit({ id: 'branch_a', parentId: 'root' })
    return git.getCommits()
  })(),
  'standard.e': (function() {
    const git = new TestGitBuilder()
    git.addMerge({
      id: 'branch_a',
      parentId1: 'root',
      parentId2: 'unseen',
      explicitParent2IsMissing: true,
    })
    return git.getCommits()
  })(),
  'standard.f': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'a1', parentId: 'root' })
    git.addMerge({ id: 'root1', parentId1: 'root', parentId2: 'a1' })
    git.addCommit({ id: 'b1', parentId: 'root1' })
    git.addMerge({ id: 'root2', parentId1: 'root1', parentId2: 'b1' })
    return git.getCommits()
  })(),

  'repeated-merging.a': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'branch_b_1', parentId: 'root' })
    git.addCommit({ id: 'root_2', parentId: 'root' })
    git.addMerge({ parentId1: 'branch_b_1', parentId2: 'root_2' })
    git.addCommit({ id: 'root_3', parentId: 'root_2' })
    return git.getCommits()
  })(),
  'repeated-merging.b': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'branch_b_1', parentId: 'root' })
    git.addMerge({ id: 'root_2', parentId1: 'root', parentId2: 'branch_b_1' })
    git.addCommit({ id: 'branch_b_2', parentId: 'branch_b_1' })
    git.addMerge({ parentId1: 'root_2', parentId2: 'branch_b_2' })
    return git.getCommits()
  })(),

  'multi-branch.a': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'a1', parentId: 'root' })
    git.addCommit({ id: 'b1', parentId: 'root' })
    git.addMerge({ id: 'm1', parentId1: 'root', parentId2: 'a1' })
    git.addMerge({ id: 'm2', parentId1: 'm1', parentId2: 'b1' })
    return git.getCommits()
  })(),
  'multi-branch.b': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'a1', parentId: 'root' })
    git.addCommit({ id: 'b1', parentId: 'root' })
    git.addMerge({ id: 'm1', parentId1: 'root', parentId2: 'b1' })
    git.addCommit({ id: 'a2', parentId: 'a1' })
    git.addCommit({ id: 'c1', parentId: 'm1' })
    git.addMerge({ id: 'm2', parentId1: 'm1', parentId2: 'a2' })
    git.addMerge({ id: 'm3', parentId1: 'm2', parentId2: 'c1' })
    return git.getCommits()
  })(),

  'data-driven.a': [
    {
      sha: 'root2',
      parents: ['root1', 'a2'],
    },
    {
      sha: 'a2',
      parents: ['a1'],
    },
    {
      sha: 'root1',
      parents: ['root', 'a1'],
    },
    {
      sha: 'b1',
      parents: ['root'],
    },
    {
      sha: 'a1',
      parents: ['root'],
    },
    {
      sha: 'root',
      parents: [],
    },
  ],
  'data-driven.b': [
    {
      sha: 'a2',
      sha7: 'a2',
      parents: ['a1', 'root1'],
    },
    {
      sha: 'root1',
      sha7: 'root1',
      parents: ['root'],
    },
    {
      sha: 'a1',
      sha7: 'a1',
      parents: ['root'],
    },
    {
      sha: 'root',
      sha7: 'root',
      parents: [],
    },
  ],
  'data-driven.c': [
    {
      sha: 'root1',
      parents: ['root', 'a2'],
      isHead: false,
    },
    {
      sha: 'a2',
      parents: ['a1', 'root'],
      isHead: false,
    },
    {
      sha: 'a1',
      parents: ['root'],
      isHead: false,
    },
    {
      sha: 'root',
      parents: [],
      isHead: false,
    },
  ],
  'data-driven.d': [
    {
      sha: 'root2',
      parents: ['root1'],
      isHead: false,
    },
    {
      sha: 'a2',
      parents: ['root', 'a1_root'],
      isHead: false,
    },
    {
      sha: 'root1',
      parents: ['root'],
      isHead: false,
    },
    {
      sha: 'root',
      parents: [],
      isHead: false,
    },
    {
      sha: 'a1_root',
      parents: [],
      isHead: false,
    },
  ],
  'data-driven.e': [
    {
      sha: 'a1',
      parents: ['unseen1', 'root'],
    },
    {
      sha: 'b1',
      parents: ['unseen2', 'root'],
    },
    {
      sha: 'root',
      parents: [],
    },
  ],
  'data-driven.f': [
    {
      sha: 'a1',
      parents: ['a2'],
    },
    {
      sha: 'c1',
      parents: ['c2'],
    },
    {
      sha: 'b0',
      parents: ['b1'],
    },
    {
      sha: 'a2',
      parents: [],
    },
    {
      sha: 'b1',
      parents: ['b2', 'c3'],
    },
    {
      sha: 'c2',
      parents: ['c3'],
    },
    {
      sha: 'c3',
      parents: ['c4'],
    },
  ],
  'data-driven.f2': [
    {
      sha: 'a1',
      parents: ['a2'],
    },
    {
      sha: 'c1',
      parents: ['c2'],
    },
    {
      sha: 'b0',
      parents: ['b1'],
    },
    {
      sha: 'a2',
      parents: [],
    },
    {
      sha: 'b1',
      parents: ['b2', 'c3'],
    },
    {
      sha: 'c2',
      parents: ['c3'],
    },
    {
      sha: 'b2',
      parents: ['b3'],
    },
    {
      sha: 'c3',
      parents: ['c4'],
    },
  ],

  'rehydration.a': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'a1', parentId: 'root' })
    git.addCommit({ id: 'root2', parentId: 'root' })
    git.addMerge({ parentId1: 'root2', parentId2: 'a1' })
    return git.getCommits()
  })(),
  'rehydration.b': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'a1', parentId: 'root' })
    git.addCommit({ id: 'b1', parentId: 'root' })
    git.addMerge({ id: 'm1', parentId1: 'root', parentId2: 'a1' })
    git.addMerge({ id: 'm2', parentId1: 'm1', parentId2: 'b1' })
    return git.getCommits()
  })(),
  'rehydration.c': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'a1', parentId: 'root' })
    git.addCommit({ id: 'b1', parentId: 'root' })
    git.addMerge({ id: 'm1', parentId1: 'root', parentId2: 'b1' })
    git.addCommit({ id: 'a2', parentId: 'a1' })
    git.addCommit({ id: 'c1', parentId: 'm1' })
    git.addMerge({ id: 'm2', parentId1: 'm1', parentId2: 'a2' })
    git.addMerge({ id: 'm3', parentId1: 'm2', parentId2: 'c1' })
    return git.getCommits()
  })(),
  'rehydration.d': (function() {
    const git = new TestGitBuilder()
    git.addCommit({ id: 'a1', parentId: 'root' })
    git.addCommit({ id: 'a2', parentId: 'a1' })
    git.addCommit({ id: 'a3', parentId: 'a2' })
    git.addMerge({ parentId1: 'root', parentId2: 'a3' })
    return git.getCommits()
  })(),
  'rehydration.e': [
    {
      sha: 'a1',
      parents: ['unseen1', 'root'],
    },
    {
      sha: 'b1',
      parents: ['unseen2', 'root'],
    },
    {
      sha: 'root',
      parents: [],
    },
  ],
}
