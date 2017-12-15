import Body from 'ephox/sugar/api/node/Body';
import Css from 'ephox/sugar/api/properties/Css';
import Height from 'ephox/sugar/api/view/Height';
import Insert from 'ephox/sugar/api/dom/Insert';
import Remove from 'ephox/sugar/api/dom/Remove';
import Width from 'ephox/sugar/api/view/Width';
import Div from 'ephox/sugar/test/Div';
import { UnitTest, assert } from '@ephox/bedrock';

UnitTest.test('SizeTest', function() {
  var c = Div();

  var checker = function (cssProp, api) {
    var checkExc = function (expected, f) {
      try {
        f();
        assert.fail('Expected exception not thrown.');
      } catch (e) {
        assert.eq(expected, e);
      }
    };

    var exact = function () {
      return Css.getRaw(c, cssProp).getOrDie('value was not set');
    };

    api.set(c, 100);
    assert.eq(100, api.get(c));
    checkExc(cssProp + '.set accepts only positive integer values. Value was 100%', function () {
      api.set(c, '100%');
    });
    checkExc(cssProp + '.set accepts only positive integer values. Value was 100px', function () {
      api.set(c, '100px');
    });
    assert.eq('100px', exact());

    Css.set(c, cssProp, '85%');
    assert.eq('85%', exact());

    if (Body.inBody(c)) {
      // percentage height is calcualted as zero, but percentage width works just fine
      if (cssProp === 'height') {
        assert.eq(0, api.get(c));
      } else {
        assert.eq(true, api.get(c) > 0);
      }
    }

    Css.set(c, cssProp, '30px');
    assert.eq(30, api.get(c));
    assert.eq('30px', exact());
  };

  checker('height', Height);
  checker('width', Width);
  Insert.append(Body.body(), c);
  checker('height', Height);
  checker('width', Width);

  Remove.remove(c);
});

