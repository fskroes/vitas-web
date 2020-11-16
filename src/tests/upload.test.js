import React from 'react';
import {shallow, mount, render} from 'enzyme';
import Upload from '../component/upload';

it('should be possible to activate button with Spacebar', () => {
    const component = mount(<Upload />);  component
      .find('button')
      .simulate('keydown', { keyCode: 32 });  expect(component).toMatchSnapshot();
    component.unmount();
});

// Mock functions
const clickFn = jest.fn();

describe('MyComponent', () => {
    it('button click should hide component', () => {
        const component = shallow(<Upload onClick={clickFn} />);
        component
            .find('button')
            .simulate('click');
        
        expect(clickFn).toHaveBeenCalled();
    });
  });