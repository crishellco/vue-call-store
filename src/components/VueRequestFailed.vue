<script>
export default {
  props: {
    identifier: {
      default: '',
      required: true,
      type: [Array, String]
    }
  },

  computed: {
    failed() {
      return this.$requestHasFailed(this.identifier);
    }
  },

  render() {
    return this.failed ? this.$slots.default : document.createComment(' ');
  }
};
</script>
