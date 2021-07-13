<template>
  <Default
    :title="$t('modals.auctions-help.title')"
    icon="info"
    v-bind="$attrs"
  >
    <i18n
      slot="msg"
      path="modals.auctions-help.msg"
      tag="span"
    >
      <br>
    </i18n>
  </Default>
</template>

<script>
import Default from './Default';

export default {
  components: { Default },
};
</script>
