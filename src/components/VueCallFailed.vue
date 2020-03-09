<script>
import mixin from './mixin';

export default {
  mixins: [mixin],

  computed: {
    inState() {
      return this.$callHasFailed(this.identifier);
    }
  }
};
</script>
