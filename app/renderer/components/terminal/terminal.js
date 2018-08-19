import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { refreshApplication } from '../../store/coreapp'

import * as XTerm from 'xterm'
import * as fit from 'xterm/lib/addons/fit/fit'
import * as webLinks from 'xterm/lib/addons/webLinks/webLinks'
import os from 'os'
import { spawn } from 'node-pty'

import debounce from 'debounce'
import { bindServices } from '../../lib/di'

import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { updateCwd } from '../../store/config'

const BASHRC_PATH = path.resolve('./dist-assets/.bashrc')
if (!fs.existsSync(BASHRC_PATH)) {
  // TODO: ensure that packaging process includes this properly
  throw `.bashrc not found: ${BASHRC_PATH}`
}

const TerminalContainer = styled.div`
  flex: 1;
  margin: 5px;
`

const terminalOpts = {
  allowTransparency: true,
  fontFamily: 'Inconsolata, monospace',
  fontSize: 16,
  theme: {
    background: 'rgba(255, 255, 255, 0)',
  },
  cursorStyle: 'bar',
}

export class Terminal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.container = React.createRef()
  }

  componentDidMount() {
    this.setupTerminal()
  }

  componentDidUpdate(prevProps) {
    if (this.terminal) {
      const { terminalFullscreen: wasFS } = prevProps
      const { terminalFullscreen: isFS } = this.props
      if (wasFS !== isFS) {
        this.resizeTerminal()
      }
    }
  }

  resizeTerminal = () => {
    if (this.terminal) {
      this.terminal.resize(10, 10)
      this.terminal.fit()
    }
  }

  setupTerminal = () => {
    this.ptyProcess = this.setupPTY()
    this.terminal = this.setupXTerm()
    setTimeout(() => {
      // Ensures that the terminal initialises with the correct style
      this.resizeTerminal()
    }, 5)
    this.setupTerminalEvents(this.ptyProcess, this.terminal)
    this.terminal.focus()
  }

  setupPTY = () => {
    // TODO: integrate user preferences into this. Allow for (or bundle?) git-bash on windows
    const shell = '/bin/bash' //process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL']
    const ptyProcess = spawn(shell, ['--noprofile', '--rcfile', BASHRC_PATH], {
      name: 'xterm-color',
      cwd: this.props.cwd,
      env: {
        ...process.env,
        PS1: '\\W> ',
        GITERM_RC: BASHRC_PATH,
      },
    })

    return ptyProcess
  }

  setupXTerm = () => {
    XTerm.Terminal.applyAddon(fit)
    XTerm.Terminal.applyAddon(webLinks)
    const terminal = new XTerm.Terminal(terminalOpts)
    terminal.open(this.container.current)
    terminal.webLinksInit()
    return terminal
  }

  setupTerminalEvents = () => {
    const that = this
    const { onAlternateBufferChange } = this.props

    that.terminal.on('data', (data) => {
      // console.log('IN data: `' + data + '`')
      // console.log('IN linefeed?:', data === '\r')
      that.ptyProcess.write(data)
    })
    that.ptyProcess.on('data', function(data) {
      if (data.match(/\[\?47h/)) {
        console.log('GONE FULLSCREEN')
        onAlternateBufferChange(true)
      }
      if (data.match(/\[\?47l/)) {
        console.log('LEFT FULLSCREEN')
        onAlternateBufferChange(false)
      }
      // console.log('OUT data: `' + data + '`')
      // console.log('OUT linefeed?:', data === '\r')
      that.terminal.write(data)
    })

    that.terminal.on(
      'linefeed',
      debounce(() => {
        // console.log('TRIGGER LINEFEED')
        that.getCWD(that.ptyProcess.pid).then((cwd) => {
          const { updateCwd, refreshApplication, gitService } = that.props
          updateCwd(cwd)
          refreshApplication(gitService)
        })
      }, 20),
    )

    window.addEventListener('resize', debounce(this.resizeTerminal, 5), false)
    that.terminal.on(
      'resize',
      debounce(({ cols, rows }) => {
        that.ptyProcess.resize(cols, rows)
      }, 5),
    )

    // // TODO: ensure the process can't be exited and restart if need be
    // that.ptyProcess.on('exit', () => {
    //   console.log('recreating')
    //   that.setupXTerm()
    //   that.setupTerminalEvents()
    // })
  }

  // TODO: check if lsof is on system and have alternatives in mind per platform
  getCWD = async (pid) =>
    new Promise((resolve) => {
      exec(`lsof -p ${pid} | grep cwd | awk '{print $NF}'`, (e, stdout) => {
        if (e) {
          throw e
        }
        resolve(stdout)
      })
    })

  render() {
    return <TerminalContainer innerRef={this.container} />
  }
}

Terminal.propTypes = {
  onAlternateBufferChange: PropTypes.func.isRequired,
}

const ConnectedTerminal = connect(
  ({ status: { branchName }, config: { cwd, terminalFullscreen } }) => ({
    branchName,
    cwd,
    terminalFullscreen,
  }),
  {
    refreshApplication,
    updateCwd,
  },
)(Terminal)

export default bindServices(({ git }) => ({ gitService: git }))(
  ConnectedTerminal,
)
