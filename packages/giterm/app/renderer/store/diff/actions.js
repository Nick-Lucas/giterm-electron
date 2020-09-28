export const DIFF_INDEX = 'diff/index'
export const diffIndex = () => ({
  type: DIFF_INDEX,
})

export const DIFF_SHAS = 'diff/shas'
export const diffShas = (shaNew, shaOld = null) => ({
  type: DIFF_SHAS,
  shas: [shaNew, shaOld],
})

export const DIFF_COMPLETE = 'diff/complete'
export const diffComplete = () => ({
  type: DIFF_COMPLETE,
})