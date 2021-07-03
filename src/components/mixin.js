export default {
  props: {
    identifier: {
      default: '',
      required: true,
      type: [Array, String]
    },
    once: {
      default: false,
      type: Boolean
    }
  },

  data() {
    return { count: 0 };
  },

  computed: {
    shouldRender() {
      return this.once ? this.count < 2 && this.inState : this.inState;
    }
  },

  watch: {
    inState(newVal, oldVal) {
      if (newVal && !oldVal) {
        this.count++;
      }
    }
  },

  render() {
    return this.shouldRender ? this.$slots.default : document.createComment(' ');
  }
};
