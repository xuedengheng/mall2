import React, { Component } from 'react'
import { ViewPager, Frame, Track, View } from 'react-view-pager'
import { pushPage } from '../../utils/redirect'

export default class ChoiceTemplate extends Component {
  constructor(props) {
    super(props)
  }

  handleClick(item, e) {
    e.preventDefault()
    pushPage(item)
  }

  render() {
    const { list } = this.props

    const settings = {
      className: 'center',
      centerMode: true,
      infinite: true,
      slidesToShow: 3,
      speed: 500
    }

    const animations = [{
      prop: 'scale',
      stops: [
        [-200, 0.65],
        [0, 0.85],
        [200, 0.65]
      ]
    }, {
      prop: 'opacity',
      stops: [
        [-200, 0.15],
        [0, 1],
        [200, 0.15]
      ]
    }]

    return (
      <ViewPager style={{ height: '45.33vw', maxHeight: '3.4rem' }}>
        <Frame style={{ margin: '0 auto', outline: 0, height: '100%' }}>
          <Track viewsToShow={1} align={0.5} animations={animations} style={{ height: '100%' }} >
            { list.map((item, index) => {
              return (
                <View key={index} tag="img" style={{ height: '100%' }} src={item.url} onClick={this.handleClick.bind(this, item)} />
              )
            }) }
          </Track>
        </Frame>
      </ViewPager>
    )
  }
}
