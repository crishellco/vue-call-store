<script>
import mixin from './mixin';

export default {
  name: 'VCallFailed',

  mixins: [mixin],

  computed: {
    inState() {
      return this.$callHasFailed(this.identifier);
    }
  }
};
</script>
