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
    done() {
      return this.$requestIsDone(this.identifier);
    }
  },

  render() {
    return this.done ? this.$slots.default : document.createComment(' ');
  }
};
</script>
