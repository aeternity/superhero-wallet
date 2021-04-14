<template>
  <Overview
    class="transaction-overview"
    :title="transaction.title"
    :sender="transaction.sender"
    :recipient="transaction.recipient"
  />
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { TX_TYPE, OBJECT_ID_TX_TYPE } from '@aeternity/aepp-sdk/es/tx/builder/schema';
import { TX_TYPE_MDW } from '../../utils/constants';
import Overview from './Overview';

export default {
  components: { Overview },
  props: {
    tx: { type: Object, required: true },
  },
  computed: {
    ...mapGetters(['getTxDirection', 'getExplorerPath']),
    ...mapState({
      account(_, { account }) {
        return {
          ...account,
          label: this.$t('transaction.overview.accountAddress'),
          url: this.getExplorerPath(account.address),
        };
      },
    }),
    transaction() {
      switch (this.txType) {
        case TX_TYPE.spend:
          return {
            sender: {
              address: this.tx.senderId,
              name: this.getDisplayName(this.tx.senderId),
              url: this.getExplorerPath(this.tx.senderId),
              label: this.$t('transaction.overview.accountAddress'),
            },
            recipient: {
              address: this.tx.recipientId,
              name: this.getDisplayName(this.tx.recipientId),
              url: this.getExplorerPath(this.tx.recipientId),
              label: this.$t('transaction.overview.accountAddress'),
            },
            title: this.$t('transaction.type.spendTx'),
          };
        case TX_TYPE.contractCall: {
          const direction = this.getTxDirection({ tx: this.tx });
          const contract = {
            address: this.tx.contractId,
            url: this.getExplorerPath(this.tx.contractId),
            label: this.$t('transaction.overview.contract'),
          };
          return {
            sender: direction === 'sent' ? this.account : contract,
            recipient: direction === 'received' ? this.account : contract,
            title: this.$t('transaction.type.contractCallTx'),
          };
        }
        case TX_TYPE.contractCreate:
          return {
            sender: this.account,
            recipient: {
              contractCreate: true,
              label: this.$t('transaction.overview.contractCreate'),
            },
            title: this.$t('transaction.type.contractCreateTx'),
          };
        case TX_TYPE.namePreClaim:
        case TX_TYPE.nameClaim:
        case TX_TYPE.nameBid:
        case TX_TYPE.nameUpdate:
          return {
            sender: this.account,
            recipient: {
              aens: true,
              label: this.$t('transaction.overview.aens'),
            },
            title: this.$t('transaction.type')[this.txType],
          };
        default:
          throw new Error('Unsupported transaction type');
      }
    },
    txType() {
      return (
        TX_TYPE_MDW[this.tx.type]
        || OBJECT_ID_TX_TYPE[this.tx.tag]
        || (Object.values(TX_TYPE).includes(this.tx.type) && this.tx.type)
      );
    },
  },
  methods: {
    getDisplayName(address) {
      return this.account.address === address ? this.account.name : '';
    },
  },
};
</script>