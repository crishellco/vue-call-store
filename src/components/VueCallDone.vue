<script>
import mixin from './mixin';

export default {
  name: 'VCallDone',

  mixins: [mixin],

  computed: {
    inState() {
      return this.$callIsDone(this.identifier);
    },

    shouldRender() {
      return this.once ? this.count > 0 : this.inState;
    }
  }
};
</script>
