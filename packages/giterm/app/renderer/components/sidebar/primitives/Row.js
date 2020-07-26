import React from 'react'
import styled, { css } from 'styled-components'
import { colours } from 'app/lib/theme'
import PropTypes from 'prop-types'
import ContextMenuArea from 'react-electron-contextmenu'

export function Row({
  children,
  active = false,
  menuItems = [],
  depth = 0,
  selectable = true,
}) {
  return (
    <ContextMenuArea menuItems={menuItems} style={{ flex: 1 }}>
      <RowArea active={active} depth={depth} selectable={selectable}>
        {children}
      </RowArea>
    </ContextMenuArea>
  )
}

Row.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      click: PropTypes.func.isRequired,
    }),
  ),
  depth: PropTypes.number,
  selectable: PropTypes.bool,
}

const RowArea = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  padding: 0.25rem 0.5rem;
  padding-left: ${({ depth }) => depth / 2 + 0.5}rem;

  ${({ selectable }) =>
    selectable &&
    css`
      :hover {
        background-color: ${colours.OVERLAY.HINT};
      }
    `}

  max-width: 100%;

  font-weight: ${({ active }) => (active ? 'bold' : 'inherit')};
  color: ${({ active }) => (active ? colours.TEXT.FOCUS : 'inherit')};
`
