import React from 'react';
import {shallow, mount, render} from 'enzyme';
import App from '../App';

it("renders without crashing", () => {
    shallow(<App />);
});

it("renders Account header", () => {
    const wrapper = shallow(<App />);
    const welcome = <p>API is alive.</p>;
    expect(wrapper.contains(welcome)).toEqual(true);
});

it('should render correctly with no props', () => {
    const component = shallow(<App/>);
    
    expect(component).toMatchSnapshot();
});