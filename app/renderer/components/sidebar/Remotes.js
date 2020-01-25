import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import RightClickArea from 'react-electron-contextmenu'
import { clipboard } from 'electron'

import { Section } from './Section'
import { Row, Label } from './Row'

export function Remotes() {
  const _remotes = useSelector((state) => state.remotes) || []
  const remotes = useMemo(
    () => {
      const remotes = []

      for (const remote of _remotes) {
        remotes.push({
          id: remote.name,
          name: remote.name,
          menuItems: [
            {
              label: 'Copy ID',
              click: () => clipboard.writeText(remote.name),
            },
          ],
        })
      }

      return remotes
    },
    [_remotes],
  )

  return (
    <Section title="REMOTES">
      {remotes.map((remote) => {
        return (
          <RightClickArea key={remote.id} menuItems={remote.menuItems}>
            <Row>
              <Label>{remote.name}</Label>
            </Row>
          </RightClickArea>
        )
      })}
    </Section>
  )
}