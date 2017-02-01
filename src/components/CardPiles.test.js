import React from 'react'
import { shallow } from 'enzyme'
import CardPiles from './CardPiles'

function setup(passedProps) {
  const props = {
    cards: [{ image: 'foo', value: '6', suit: 'Clubs' }],
    cardsInPile: ['AS'],
    lastCard: { image: 'bar', value: '5', suit: 'Hearts' },
    remaining: 42,
    ...passedProps
  }

  const enzymeWrapper = shallow(<CardPiles {...props} />)

  return {
    props,
    enzymeWrapper
  }
}

describe('components', () => {
  describe('CardPiles', () => {
    it('should render self and subcomponents', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.children().length).toEqual(2)

      const subcomponents = enzymeWrapper.find('Card')
      const firstCardProps = subcomponents.first().props()
      expect(firstCardProps.image).toEqual('bar')
      const lastCardProps = subcomponents.last().props()
      expect(lastCardProps.image).toEqual('foo')
    })
    it('should render card back image if no card has been drawn', () => {
      const { enzymeWrapper } = setup({cards: null})

      expect(enzymeWrapper.find('img').last().prop('src')).toBe('card-back.png')

    })
  })
})
