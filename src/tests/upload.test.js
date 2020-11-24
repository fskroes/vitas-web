import React from 'react';
import {shallow, mount, render} from 'enzyme';
import toJson from 'enzyme-to-json';
import Upload from '../component/upload';
import Dropzone from '../component/dropzone';

it('should be possible to activate button with Spacebar', () => {
    const component = mount(<Upload />);  
    component
      .find('button')
      .simulate('keydown', { keyCode: 32 });  
    
      expect(component).toMatchSnapshot();
    component.unmount();
});

describe("check UI of component matches snapshot", () => {
  const component = shallow(<Upload />);
  
  expect(toJson(component)).toMatchSnapshot();
  
  component.unmount();
})

// create mock for receiving tensorflow and custom vision data.
const tf_predictions = {
  "status": true,
  "message": "File is uploaded",
  "dataTF": {
    "top5": [
      {
        "prob": 0.9782631993293762,
        "class": "black-and-tan_coonhound"
      },
      {
        "prob": 0.01848631352186203,
        "class": "bloodhound"
      },
      {
        "prob": 0.002423734636977315,
        "class": "doberman"
      },
      {
        "prob": 0.00024925897014327347,
        "class": "gordon_setter"
      },
      {
        "prob": 0.00017747418314684182,
        "class": "rottweiler"
      }
    ]
  },
}

function MockFile() { };

MockFile.prototype.create = function (name, size, mimeType) {
    name = name || "mock.txt";
    size = size || 1024;
    mimeType = mimeType || 'plain/txt';

    function range(count) {
        var output = "";
        for (var i = 0; i < count; i++) {
            output += "a";
        }
        return output;
    }

    var blob = new Blob([range(size)], { type: mimeType });
    blob.lastModifiedDate = new Date();
    blob.name = name;

    return blob;
};

describe("Mock file for file upload testing", function () {
  it("should be defined", function() {
      var file = new MockFile();
      expect(file).not.toBeNull();
  });

  it("should have default values", function() {
      var mock = new MockFile();
      var file = mock.create();
      expect(file.name).toBe('mock.txt');
      expect(file.size).toBe(1024);
  });

  it("should have specific values", function () {
      var size = 1024 * 1024 * 3;
      var mock = new MockFile();
      var file = mock.create("pic.jpg", size, "image/jpeg");
      expect(file.name).toBe('pic.jpg');
      expect(file.size).toBe(size);
      expect(file.type).toBe('image/jpeg');
  });
});