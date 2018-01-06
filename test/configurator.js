import { Configurator } from '../src/configurator';
import { CONFIG } from '../src/utils/index';
import { should } from 'should';

var configuratorTests = function () {
  return describe('Configurator', function () {
    describe('configure', function () {
      describe('Without config', function () {
        var configurator = new Configurator(null);
        it('shoudl default to pyramid config', function(){
          configurator.config.should.equal(CONFIG.pyramid);
        });
        var views = configurator.generateViews({ W: 1024, H: 800 });
        it('should return 4 views', function () {
          views.should.be.an.Array();
          views.should.have.length(4);
        });
      })
    })
  })
}

export { configuratorTests }