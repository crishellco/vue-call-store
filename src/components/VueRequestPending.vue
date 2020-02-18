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
    loading() {
      return this.$requestIsPending(this.identifier);
    }
  },

  render() {
    return this.loading ? this.$slots.default : null;
  }
};
</script>
