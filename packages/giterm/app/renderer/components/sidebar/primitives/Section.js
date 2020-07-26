import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { ChevronDown, Minus } from 'react-feather'
import styled from 'styled-components'

export function Section({
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
    <Container open={open && hasContent}>
      <Button onClick={toggleOpen} disabled={!hasContent}>
        {hasContent ? (
          <Chevron open={open} width="2rem" />
        ) : (
          <Minus width="2rem" />
        )}

        <h2>{title}</h2>
      </Button>

      {/* TODO: make transition on this pretty */}
      {open && hasContent && children}
    </Container>
  )
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  hasContent: PropTypes.bool,
  initialOpenState: PropTypes.bool,
}

const Container = styled.div`
  margin-bottom: ${({ open }) => (open ? '1rem' : '0')};
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

  margin-top: 0.5rem;
  padding: 0;

  h2 {
    font-size: 14px;
    font-weight: normal;
    margin: 0;
    padding: 0;
  }
`

const Chevron = styled(ChevronDown)`
  transition: transform ease-in-out 0.3s;
  transform: ${({ open }) => (open ? 'rotate(0deg)' : 'rotate(-180deg)')};
`
