import { createLocalVue, mount } from '@vue/test-utils';

import VueCallStore from '../src';
import VueCallDone from '../src/components/VueCallDone';
import VueCallFailed from '../src/components/VueCallFailed';
import VueCallPending from '../src/components/VueCallPending';

const identifier = 'identifier';
let localVue;
let wrapper;

const component = {
  components: {
    VueCallDone,
    VueCallFailed,
    VueCallPending
  },

  template: `
    <div>
      <vue-call-done identifier="${identifier}"><div class="done">Hello World</div></vue-call-done>
      <vue-call-failed identifier="${identifier}"><div class="failed">Hello World</div></vue-call-failed>
      <vue-call-pending identifier="${identifier}"><div class="pending">Hello World</div></vue-call-pending>
    </div>
  `
};

beforeEach(() => {
  localVue = createLocalVue();
  localVue.use(VueCallStore);
  wrapper = mount(component, { localVue });
});

describe('directive.js', () => {
  it('should update components', async () => {
    await wrapper.vm.$startCall(identifier);
    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(false);
    expect(wrapper.find('.failed').exists()).toBe(false);
    expect(wrapper.find('.pending').exists()).toBe(true);

    await wrapper.vm.$endCall(identifier);
    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(true);
    expect(wrapper.find('.failed').exists()).toBe(false);
    expect(wrapper.find('.pending').exists()).toBe(false);

    await wrapper.vm.$failCall(identifier);
    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBe(false);
    expect(wrapper.find('.failed').exists()).toBe(true);
    expect(wrapper.find('.pending').exists()).toBe(false);
  });
});
