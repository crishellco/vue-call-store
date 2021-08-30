import { createLocalVue, mount } from '@vue/test-utils';

import VueCallStore from '../src';
import constants from '../src/constants';

const identifier = 'identifier';
const message = 'message';
let localVue;
let store;
let wrapper;

const component = {
  template: `
    <div>
      <v-call-done :once="true" identifier="${identifier}">
        <div class="done">Hello World</div>
      </v-call-done>
      <v-call-failed :identifier="['${identifier}', 'second']">
        <div class="failed">Hello World</div>
      </v-call-failed>
      <v-call-pending :once="true" :identifier="['${identifier}', 'third']">
        <div class="pending">Hello World</div>
      </v-call-pending>
    </div>
  `
};

describe('mixin.js', () => {
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(VueCallStore);
    wrapper = mount(component, { localVue });
    store = wrapper.vm.$store;
  });
  it('should return the correct call', () => {
    store.commit('calls/START', { identifier, message });
    const call = wrapper.vm.$call(identifier);

    expect(call).toEqual(wrapper.vm.$calls.get(identifier));
    expect(call).toHaveProperty('message', message);
    expect(call).toHaveProperty('status', constants.PENDING);
    expect(call).toHaveProperty('_started');
    expect(call).toHaveProperty('_stopped');
    expect(call).toHaveProperty('_duration');
  });

  it('should return the correct call [deprecated]', () => {
    store.commit('calls/START', { identifier, message });
    const call = wrapper.vm.$getCall(identifier);

    expect(call).toHaveProperty('message', message);
    expect(call).toHaveProperty('status', constants.PENDING);
    expect(call).toHaveProperty('_started');
    expect(call).toHaveProperty('_stopped');
    expect(call).toHaveProperty('_duration');
  });

  it('should update calls and return correct statuses', async () => {
    wrapper.vm.$startCall(identifier);
    expect(wrapper.vm.$callIsPending(identifier)).toBeTruthy();

    wrapper.vm.$endCall(identifier);
    expect(wrapper.vm.$callIsDone(identifier)).toBeTruthy();

    wrapper.vm.$failCall(identifier);
    expect(wrapper.vm.$callHasFailed(identifier)).toBeTruthy();

    wrapper.vm.$calls.start(identifier);
    expect(wrapper.vm.$calls.isPending(identifier)).toBeTruthy();

    wrapper.vm.$calls.end(identifier);
    expect(wrapper.vm.$calls.isDone(identifier)).toBeTruthy();

    wrapper.vm.$calls.fail(identifier);
    expect(wrapper.vm.$calls.hasFailed(identifier)).toBeTruthy();
  });

  it('should update components', async () => {
    wrapper.vm.$startCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBeFalsy();
    expect(wrapper.find('.failed').exists()).toBeFalsy();
    expect(wrapper.find('.pending').exists()).toBeTruthy();

    wrapper.vm.$endCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBeTruthy();
    expect(wrapper.find('.failed').exists()).toBeFalsy();
    expect(wrapper.find('.pending').exists()).toBeFalsy();

    wrapper.vm.$failCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBeTruthy();
    expect(wrapper.find('.failed').exists()).toBeTruthy();
    expect(wrapper.find('.pending').exists()).toBeFalsy();

    wrapper.vm.$endCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBeTruthy();
    expect(wrapper.find('.failed').exists()).toBeFalsy();
    expect(wrapper.find('.pending').exists()).toBeFalsy();

    wrapper.vm.$startCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBeTruthy();
    expect(wrapper.find('.failed').exists()).toBeFalsy();
    expect(wrapper.find('.pending').exists()).toBeFalsy();

    wrapper.vm.$endCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBeTruthy();
    expect(wrapper.find('.failed').exists()).toBeFalsy();
    expect(wrapper.find('.pending').exists()).toBeFalsy();

    wrapper.vm.$startCall(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.find('.done').exists()).toBeTruthy();
    expect(wrapper.find('.failed').exists()).toBeFalsy();
    expect(wrapper.find('.pending').exists()).toBeFalsy();
  });
});
