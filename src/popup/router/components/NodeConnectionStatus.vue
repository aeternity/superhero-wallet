<template>
  <div
    v-if="nodeStatus && account.address && isLoggedIn"
    :data-cy="nodeStatus !== 'error' ? 'connect-node' : ''"
    class="node-connection-status"
    :class="`connect-${nodeStatus === 'error' ? 'error' : 'node'}`"
  >
    {{ statuses[nodeStatus] }}
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';

export default {
  data() {
    return {
      statuses: {
        initServices: this.$t('pages.nodeConnectionStatus.initServices'),
        connecting: this.$t('pages.nodeConnectionStatus.connecting'),
        connected: this.$t('pages.nodeConnectionStatus.connected'),
        error: this.$t('pages.nodeConnectionStatus.error'),
      },
    };
  },
  computed: {
    ...mapState(['nodeStatus']),
    ...mapGetters(['account', 'isLoggedIn']),
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/mixins';

.node-connection-status,
.connect-error,
.connect-node {
  position: fixed;
  width: 100%;

  @include mixins.desktop {
    position: sticky;
  }

  bottom: 48px;
  bottom: calc(48px + env(safe-area-inset-bottom));
  left: 0;
  right: 0;
  background: variables.$color-blue;
  color: variables.$color-white;
  line-height: 2em;
  z-index: 5;
  text-align: center;
  font-size: 14px;
}

.connect-error {
  font-weight: bold;
}

.connect-node {
  background: variables.$color-bg-3;
}
</style>
