import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { clipboard } from 'electron'

import { Section, Label, Row } from './primitives'

export function Tags() {
  const _tags = useSelector((state) => state.tags.list) || []

  const tags = useMemo(() => {
    const tags = []

    for (const tag of _tags) {
      tags.push({
        id: tag.id,
        name: tag.name,
        menuItems: [
          {
            label: 'Copy ID',
            click: () => clipboard.writeText(tag.id),
          },
        ],
      })
    }

    return tags
  }, [_tags])

  return (
    <Section title="TAGS" initialOpenState={false}>
      {tags.map((tag) => {
        return (
          <Row key={tag.id} menuItems={tag.menuItems}>
            <Label>{tag.name}</Label>
          </Row>
        )
      })}
    </Section>
  )
}
