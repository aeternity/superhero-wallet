<template>
  <div class="names">
    <Plate>
      <AccountSwitcher />
      <Tabs three>
        <RouterLink
          :to="{ name: 'name-list' }"
          exact-path
        >
          <Names /> {{ $t('pages.names.tabs')[0] }}
        </RouterLink>
        <RouterLink :to="{ name: 'auction-list' }">
          <Auction /> {{ $t('pages.names.tabs')[1] }}
        </RouterLink>
        <RouterLink :to="{ name: 'name-claim' }">
          <PlusCircle /> {{ $t('pages.names.tabs')[2] }}
        </RouterLink>
      </Tabs>
    </Plate>
    <RouterView />
  </div>
</template>

<script>
import Plate from '../../components/Plate';
import AccountSwitcher from '../../components/AccountSwitcher';
import Tabs from '../../components/Tabs';
import Names from '../../../../icons/names.svg?vue-component';
import Auction from '../../../../icons/auction.svg?vue-component';
import PlusCircle from '../../../../icons/plus-circle.svg?vue-component';

export default {
  components: {
    Plate, AccountSwitcher, Tabs, Names, Auction, PlusCircle,
  },
};
</script>

<style lang="scss" scoped>
@use '../../../../styles/variables';

.names {
  .plate {
    box-shadow: none;
    background: variables.$color-bg-3;

    .account-switcher {
      border-radius: 0 0 10px 10px;
      box-shadow: rgba(variables.$color-border, 0.5) 0 1px;
      background: variables.$color-black;
      margin-bottom: 1px;

      ::v-deep .buttons {
        margin-bottom: 16px;
      }
    }

    .tabs {
      padding: 4px 8px 4px 8px;
      background-color: variables.$color-bg-3;
    }
  }
}
</style>
