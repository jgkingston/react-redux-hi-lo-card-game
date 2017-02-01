import React from 'react'
import { shallow } from 'enzyme'
import Card from './Card'

function setup() {
  const props = {
    image: 'foo',
    value: 'Ace',
    suit: 'Spades'
  }

  const enzymeWrapper = shallow(<Card {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('Card', () => {
    it('should render self', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find('img').prop('src')).toBe('foo')
      expect(enzymeWrapper.find('img').prop('alt')).toBe('Ace of Spades')
    })
  })
})
