<template>
  <Modal
    class="spend-success"
    close
    @close="resolve"
  >
    <Pending />
    <div>
      <TokenAmount
        :amount="getTxAmountTotal(transaction)"
        :symbol="getSymbol(transaction)"
        hide-fiat
      />
      {{ $t('pages.send.successalert') }}
    </div>
    <span class="name">{{ name || '' }}</span>
    <span>{{ transaction.tx.recipientId }}</span>
    <Button
      slot="footer"
      @click="resolve"
    >
      {{ $t('ok') }}
    </Button>
  </Modal>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Modal from '../Modal';
import Pending from '../../../../icons/animated-pending.svg?vue-component';
import TokenAmount from '../TokenAmount';
import Button from '../Button';

export default {
  components: {
    Modal, Pending, TokenAmount, Button,
  },
  props: {
    resolve: { type: Function, required: true },
    transaction: { type: Object, required: true },
  },
  data: () => ({
    name: '',
  }),
  computed: {
    ...mapState('fungibleTokens', ['availableTokens']),
    ...mapGetters(['getTxAmountTotal', 'getTxSymbol']),
  },
  async mounted() {
    await this.$watchUntilTruly(() => this.$store.state.middleware);
    const names = await this.$store.state.middleware.getOwnedBy(this.transaction.tx.recipientId);
    this.name = names.active.find(
      ({ info }) => info.pointers?.accountPubkey === this.transaction.tx.recipientId,
    )?.name;
  },
  methods: {
    getSymbol() {
      return this.transaction.contractId
        ? this.availableTokens[this.transaction.contractId].symbol
        : 'AE';
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../../styles/variables';
@use '../../../../styles/typography';

.spend-success ::v-deep .container .body {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: variables.$color-light-grey;

  @extend %face-sans-15-regular;

  .name,
  svg {
    color: white;
  }

  svg {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }
}
</style>
