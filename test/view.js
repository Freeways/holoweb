import { View } from '../src/view';
import { should } from 'should';

var viewTests = function () {
  return describe('Create an instance', function () {
    var view = new View();
    it('should create an instance', function () {
      view.should.be.a.Object();
    });
    it('should have x set to 0', function(){
      view.should.have.property('x', 0);
    })
  })
}

export { viewTests }