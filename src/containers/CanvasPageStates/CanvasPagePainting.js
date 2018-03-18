import React from 'react'

import { Picker } from '../../components/Picker/Picker'
import CanvasStage from '../../components/Canvas/CanvasStage'
import { Row } from 'antd'

import CanvasSidebar from '../../components/CanvasSidebar/CanvasSidebar'

class CanvasPagePainting extends React.Component {
  constructor (props) {
    super(props)

    this.canvasId = this.props.canvasId

    this.state = {
      pixels: [],
      isLoading: true,
      currentColorHex: null,
      currentColorIndex: null,
      hovering: null,
    }
  }

  componentDidMount () {
    this.watchForChanges()

    // Temporary store canvas in local storage
    const tempCanvas = window.localStorage.getItem('tempCanvas')

    if (tempCanvas) {
      this.setState({
        pixels: JSON.parse(tempCanvas),
        isLoading: false,
      })
      return
    }

    this.props.Contract.getArtwork(0, { gas: 3000000 }, (error, result) => {
      if (!error) {
        const pixels = result.map(color => parseInt(color))
        this.setState({
          pixels,
          isLoading: false,
        })

        window.localStorage.setItem('tempCanvas', JSON.stringify(pixels))
      }
      else {
        console.error(error)
        this.setState({
          isLoading: false,
        })
      }
    })
  }

  changeColor = ({ color, index }) => {
    console.log(`Change current color to (${color}, ${index})`)
    this.setState({
      currentColorHex: color,
      currentColorIndex: index,
    })
  }

  handlePixelClick = ({ index, x, y }) => {
    const color = this.state.currentColorIndex
    console.log(`User set pixel color at (${x}, ${y}) to ${color}`)

    this.updatePixel({ index, color })
    this.props.Contract.setPixel(this.canvasId, index, color)
  }

  updatePixel = ({ index, color }) => {
    const updatedPixels = [
      ...this.state.pixels.slice(0, index),
      color,
      ...this.state.pixels.slice(index + 1, this.state.pixels.length)
    ]

    this.setState({ pixels: updatedPixels })
  }

  watchForChanges = () => {
    const { blockNumber } = this.props.web3.eth
    const pixelPaintedEvent = this.props.Contract.PixelPainted({}, { fromBlock: blockNumber, toBlock: 'latest' })

    // watch for changes
    pixelPaintedEvent.watch((error, result) => {
      const index = parseInt(result.args.index, 10)
      const color = parseInt(result.args.color, 10)

      console.log(`[EVENT] Updated pixel color at (${index}) to ${color}`)
      this.updatePixel({ index, color })
      if (!error)
        console.log(result)
    })
  }

  render () {

    return (
      <Row className="CanvasPage" type="flex" justify="space-around" align="top">

        {this.state.isLoading && <p>Canvas loading...</p>}

        <CanvasStage
          pixelSize={this.props.pixelSize}
          pixels={this.state.pixels}
          currentColorHex={this.state.currentColorHex}
          changePixelColor={this.handlePixelClick}
        />

        <div>
          <CanvasSidebar canvasId={this.canvasId} />
          <Picker
            changeColor={this.changeColor}
            currentColor={this.state.currentColorIndex}
          />
          <br />
          <p>How can I place a pixel?</p>
        </div>
      </Row>
    )
  }
}

export default CanvasPagePainting