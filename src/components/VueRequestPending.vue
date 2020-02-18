<script>
import mixin from './mixin';

export default {
  mixins: [mixin],

  computed: {
    inState() {
      return this.$requestIsPending(this.identifier);
    }
  }
};
</script>
