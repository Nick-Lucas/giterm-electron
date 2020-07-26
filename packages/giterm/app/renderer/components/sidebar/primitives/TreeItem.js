import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ChevronDown, Minus } from 'react-feather'
import styled from 'styled-components'
import { Label } from './Label'

export function TreeItem({
  title,
  children,
  hasContent = true,
  initialOpenState = true,
}) {
  const [open, setOpen] = useState(initialOpenState)
  const toggleOpen = useCallback(() => {
    setOpen((open) => !open)
  }, [])

  return (
    <Container>
      <Button onClick={toggleOpen} disabled={!hasContent}>
        {hasContent ? (
          <Chevron open={open} width="1rem" />
        ) : (
          <Minus width="1rem" />
        )}

        <Spacer />

        <Label>{title}</Label>
      </Button>

      <Content open={open && hasContent}>
        {open && hasContent && children}
      </Content>
    </Container>
  )
}

TreeItem.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  hasContent: PropTypes.bool,
  initialOpenState: PropTypes.bool,
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Content = styled.div`
  margin-bottom: ${({ open }) => (open ? '0.5rem' : '0')};
`

const Button = styled.button`
  display: flex;
  flex-direction: row;
  flex: 1;
  height: 1.5rem;

  align-items: center;
  justify-content: flex-start;

  background-color: transparent;
  color: inherit;
  border: none;
  outline: none;

  cursor: pointer;
  :disabled {
    cursor: default;
  }

  margin-top: 0rem;
  padding: 0;
`

const Chevron = styled(ChevronDown)`
  transition: transform ease-in-out 0.3s;
  transform: ${({ open }) => (open ? 'rotate(0deg)' : 'rotate(-180deg)')};
`

const Spacer = styled.div`
  width: 0.25rem;
`
