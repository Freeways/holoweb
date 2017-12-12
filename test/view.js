import { View } from '../src/view';
import { should } from 'should';

var viewTests = function () {
  return describe('View Prototype', function () {
    describe('Instantiation', function () {
      describe('Without args', function () {
        var view = new View();
        it('should create an instance', function () {
          view.should.be.a.Object();
        });
        it('should have x, y, width and height set to 0', function () {
          view.should.have.property('x', 0);
          view.should.have.property('y', 0);
          view.should.have.property('width', 0);
          view.should.have.property('height', 0);
        });
        it('should have fov set to 60, camera position to 0, 300, 1800 and without rotation', function () {
          view.should.have.property('fov', 60);
          view.should.have.property('eye', [0, 300, 1800]);
          view.should.have.property('up', [1, 0, 0]);
        });
        it('should have empty parts', function () {
          view.should.have.property('parts', []);
        });
      });

      describe('With args', function () {
        var view = new View(2, 4, 100, 100, [1, 0, 0], [0, 300, 1800], 50, [[2,3,50,50]]);
        it('should create an instance', function () {
          view.should.be.a.Object();
        });
        it('should have x equal 2, y equal 4, width and height set to 100', function () {
          view.should.have.property('x', 2);
          view.should.have.property('y', 4);
          view.should.have.property('width', 100);
          view.should.have.property('height', 100);
        });
        it('should have fov set to 50, camera position to 0, 300, 1800 and without rotation', function () {
          view.should.have.property('fov', 50);
          view.should.have.property('eye', [0, 300, 1800]);
          view.should.have.property('up', [1, 0, 0]);
        });
      });

      
    })
  })
}

export { viewTests }