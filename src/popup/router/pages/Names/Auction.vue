<template>
  <div class="auction">
    <Plate>
      <AccountInfo />
    </Plate>
    <Tabs>
      <RouterLink
        :to="{ name: 'auction-bid' }"
        exact-path
      >
        <Auction /> {{ $t('pages.names.auctions.place-bid') }}
      </RouterLink>
      <RouterLink :to="{ name: 'auction-history' }">
        <History /> {{ $t('pages.names.auctions.bid-history') }}
      </RouterLink>
    </Tabs>
    <Loader v-if="loading" />
    <RouterView v-else />
  </div>
</template>

<script>
import AccountInfo from '../../components/AccountInfo';
import Plate from '../../components/Plate';
import Tabs from '../../components/Tabs';
import Auction from '../../../../icons/auction.svg?vue-component';
import History from '../../../../icons/history.svg?vue-component';

export default {
  components: {
    AccountInfo,
    Plate,
    Tabs,
    Auction,
    History,
  },
  props: {
    name: { type: String, required: true },
  },
  data: () => ({ loading: true }),
  mounted() {
    const id = setInterval(() => this.updateAuctionEntry(), 3000);
    this.$once('hook:destroyed', () => clearInterval(id));
    this.$watch(
      ({ name }) => name,
      () => {
        this.loading = true;
        this.updateAuctionEntry();
      },
      { immediate: true },
    );
  },
  methods: {
    async updateAuctionEntry() {
      await this.$watchUntilTruly(() => this.$store.state.middleware);
      const { expiration, bids } = await this.$store.dispatch('names/fetchAuctionEntry', this.name);
      this.$store.commit('names/setAuctionEntry', {
        name: this.name,
        expiration,
        bids,
      });
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../../styles/variables';

.auction {
  .plate {
    height: 108px;
  }

  .tabs {
    position: sticky;
    z-index: 1;
    top: calc(146px + env(safe-area-inset-top));
    margin-top: -10px;

    a {
      padding-top: 10px;
      height: 60px;
    }
  }
}

</style>
