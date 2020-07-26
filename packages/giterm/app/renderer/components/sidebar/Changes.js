import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { clipboard } from 'electron'

import { Section, Label, Row } from './primitives'
import { colours } from 'app/lib/theme'

export function Changes() {
  const _files = useSelector((state) => state.status.files) || []
  const { staged, unstaged } = useMemo(() => {
    const staged = []
    const unstaged = []

    for (const file of _files) {
      let colour = null
      if (file.isNew) {
        colour = colours.TEXT.POSITIVE
      } else if (file.isDeleted) {
        colour = colours.TEXT.NEGATIVE
      } else if (file.isModified) {
        colour = colours.TEXT.ACTION
      }

      const item = {
        path: file.path,
        colour,
        menuItems: [
          {
            label: 'Copy Path',
            click: () => clipboard.writeText(file.path),
          },
        ],
      }

      if (file.staged) {
        staged.push(item)
      } else {
        unstaged.push(item)
      }
    }

    return { staged, unstaged }
  }, [_files])

  return (
    <Section
      title={`CHANGES (${staged.length}/${_files.length})`}
      hasContent={_files.length > 0}>
      {staged.map((file) => {
        return (
          <Row key={file.path} menuItems={file.menuItems}>
            <Label colour={file.colour} trimStart>
              {file.path}
            </Label>
          </Row>
        )
      })}

      {unstaged.length > 0 && <UnstagedLabel>(unstaged)</UnstagedLabel>}

      {unstaged.map((file) => {
        return (
          <Row key={file.path} menuItems={file.menuItems}>
            <Label colour={file.colour} trimStart>
              {file.path}
            </Label>
          </Row>
        )
      })}
    </Section>
  )
}

const UnstagedLabel = styled.div`
  text-align: center;

  color: #c9ced0;
  opacity: 0.5;

  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
`
