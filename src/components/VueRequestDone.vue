<script>
import mixin from './mixin';

export default {
  mixins: [mixin],

  computed: {
    inState() {
      return this.$requestIsDone(this.identifier);
    },

    shouldRender() {
      return this.once ? this.count > 0 : this.inState;
    }
  }
};
</script>
