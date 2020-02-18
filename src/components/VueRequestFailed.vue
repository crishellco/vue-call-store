<script>
import mixin from './mixin';

export default {
  mixins: [mixin],

  computed: {
    inState() {
      return this.$requestHasFailed(this.identifier);
    }
  }
};
</script>
