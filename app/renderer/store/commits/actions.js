export const COMMITS_UPDATE = 'commits/update'
export const commitsUpdated = (commits, digest) => ({
  type: COMMITS_UPDATE,
  commits,
  digest,
})

export const LOAD_MORE_COMMITS = 'commits/load_more'
export const loadMore = () => ({
  type: LOAD_MORE_COMMITS,
})

export const CHECKOUT_COMMIT = 'commits/checkout'
export const checkoutCommit = (sha) => ({
  type: CHECKOUT_COMMIT,
  sha,
})