<script>
import mixin from './mixin';

export default {
  name: 'VCallPending',

  mixins: [mixin],

  computed: {
    inState() {
      return this.$callIsPending(this.identifier);
    }
  }
};
</script>
