import { createLocalVue, mount } from '@vue/test-utils';

import constants from '../src/constants';
import VueRequestStore from '../src';

const identifier = 'identifier';
const message = 'message';
let localVue;
let store;
let wrapper;

const component = {
  template: `
    <div>
      <v-request-done identifier="${identifier}">
        <div class="done">Hello World</div>
      </v-request-done>
      <v-request-failed :identifier="['${identifier}', 'second']">
        <div class="failed">Hello World</div>
      </v-request-failed>
      <v-request-pending :once="true" :identifier="['${identifier}', 'third']">
        <div class="pending">Hello World</div>
      </v-request-pending>
    </div>
  `
};

describe('mixin.js', () => {
  beforeEach(() => {
    localVue = createLocalVue();
    localVue.use(VueRequestStore);
    wrapper = mount(component, { localVue });
    store = wrapper.vm.$store;
  });
  it('should return the correct request', () => {
    store.commit('requests/start', { identifier, message });
    const request = wrapper.vm.$request(identifier);

    expect(request).toEqual(wrapper.vm.$requests.get(identifier));
    expect(request).toHaveProperty('message', message);
    expect(request).toHaveProperty('status', constants.PENDING);
    expect(request).toHaveProperty('_started');
    expect(request).toHaveProperty('_stopped');
    expect(request).toHaveProperty('_duration');
  });

  it('should return the correct request [deprecated]', () => {
    store.commit('requests/start', { identifier, message });
    const request = wrapper.vm.$getRequest(identifier);

    expect(request).toHaveProperty('message', message);
    expect(request).toHaveProperty('status', constants.PENDING);
    expect(request).toHaveProperty('_started');
    expect(request).toHaveProperty('_stopped');
    expect(request).toHaveProperty('_duration');
  });

  it('should update requests and return correct statuses', () => {
    wrapper.vm.$startRequest(identifier);
    expect(wrapper.vm.$requestIsPending(identifier)).toBe(true);

    wrapper.vm.$endRequest(identifier);
    expect(wrapper.vm.$requestIsDone(identifier)).toBe(true);

    wrapper.vm.$failRequest(identifier);
    expect(wrapper.vm.$requestHasFailed(identifier)).toBe(true);

    wrapper.vm.$requests.start(identifier);
    expect(wrapper.vm.$requests.isPending(identifier)).toBe(true);

    wrapper.vm.$requests.end(identifier);
    expect(wrapper.vm.$requests.isDone(identifier)).toBe(true);

    wrapper.vm.$requests.fail(identifier);
    expect(wrapper.vm.$requests.hasFailed(identifier)).toBe(true);
  });

  it('should update components', async () => {
    wrapper.vm.$startRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.contains('.done')).toBe(false);
    expect(wrapper.contains('.failed')).toBe(false);
    expect(wrapper.contains('.pending')).toBe(true);

    wrapper.vm.$endRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.contains('.done')).toBe(true);
    expect(wrapper.contains('.failed')).toBe(false);
    expect(wrapper.contains('.pending')).toBe(false);

    wrapper.vm.$failRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.contains('.done')).toBe(false);
    expect(wrapper.contains('.failed')).toBe(true);
    expect(wrapper.contains('.pending')).toBe(false);

    wrapper.vm.$startRequest(identifier);

    await wrapper.vm.$forceUpdate();

    expect(wrapper.contains('.done')).toBe(false);
    expect(wrapper.contains('.failed')).toBe(false);
    expect(wrapper.contains('.pending')).toBe(false);
  });
});
