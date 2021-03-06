<template>
  <div class="transaction-details">
    <Plate class="header">
      <TokenAmount
        :amount="amount"
        :symbol="symbol"
        :direction="direction"
        :aex9="isTxAex9(transaction)"
        large
      />
    </Plate>
    <div class="content">
      <TransactionOverview v-bind="transaction" />
      <div class="data-grid">
        <DetailsItem
          v-if="tipUrl"
          :label="$t('pages.transactionDetails.tipUrl')"
          class="span-2-columns"
          data-cy="tip-url"
        >
          <CopyButton
            slot="label"
            :value="tipUrl"
            message="URL copied"
          />
          <LinkButton
            slot="value"
            :to="tipUrl"
          >
            {{ tipUrl }}
          </LinkButton>
        </DetailsItem>
        <DetailsItem
          :value="hash"
          :label="$t('pages.transactionDetails.hash')"
          class="span-2-columns"
          data-cy="hash"
          small
        >
          <CopyButton
            slot="label"
            :value="hash"
            message="Hash copied"
          />
        </DetailsItem>
        <DetailsItem
          v-if="transaction.microTime"
          :value="transaction.microTime | formatDate"
          :secondary="transaction.microTime | formatTime"
          :label="$t('pages.transactionDetails.timestamp')"
          data-cy="timestamp"
        />
        <DetailsItem
          v-if="transaction.blockHeight && transaction.blockHeight > 0"
          :value="transaction.blockHeight"
          :label="$t('pages.transactionDetails.blockHeight')"
          data-cy="block-height"
        />
        <DetailsItem
          v-if="transaction.tx.gasUsed"
          :value="transaction.tx.gasUsed"
          :label="$t('pages.transactionDetails.gas')"
          data-cy="gas"
        />
        <DetailsItem
          v-if="transaction.tx.gasPrice"
          :label="$t('pages.transactionDetails.gasPrice')"
          data-cy="gas-price"
        >
          <TokenAmount
            slot="value"
            :amount="transaction.tx.gasPrice"
            symbol="ættos"
            hide-fiat
          />
        </DetailsItem>
        <DetailsItem
          :label="$t('pages.transactionDetails.amount')"
          data-cy="amount"
        >
          <TokenAmount
            slot="value"
            :amount="amount"
            :symbol="symbol"
            hide-fiat
          />
        </DetailsItem>
        <DetailsItem
          v-if="transaction.tx.nonce"
          :value="transaction.tx.nonce"
          :label="$t('pages.transactionDetails.nonce')"
          data-cy="nonce"
        />
        <DetailsItem
          v-if="transaction.tx.fee"
          :label="$t('pages.transactionDetails.fee')"
          class="span-2-columns"
          data-cy="fee"
        >
          <TokenAmount
            slot="value"
            :amount="transaction.tx.fee"
            symbol="ættos"
            hide-fiat
          />
        </DetailsItem>
        <DetailsItem
          v-if="transaction.pending"
          :value="$t('pages.transactionDetails.pending')"
          :label="$t('pages.transactionDetails.status')"
          data-cy="status"
          highlight
        />
      </div>
      <div class="explorer">
        <LinkButton :to="getExplorerPath(hash)">
          <AnimatedPending v-if="transaction.pending" />
          <BlockIcon v-else />
          {{ $t('pages.transactionDetails.explorer') }}
        </LinkButton>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { formatDate, formatTime } from '../../utils';
import TransactionOverview from '../components/TransactionOverview';
import Plate from '../components/Plate';
import TokenAmount from '../components/TokenAmount';
import DetailsItem from '../components/DetailsItem';
import LinkButton from '../components/LinkButton';
import CopyButton from '../components/CopyButton';
import AnimatedPending from '../../../icons/animated-pending.svg?vue-component';
import BlockIcon from '../../../icons/block.svg?vue-component';

export default {
  name: 'TransactionDetails',
  components: {
    TransactionOverview,
    Plate,
    TokenAmount,
    DetailsItem,
    LinkButton,
    CopyButton,
    AnimatedPending,
    BlockIcon,
  },
  filters: {
    formatDate,
    formatTime,
  },
  props: {
    hash: { type: String, required: true },
  },
  computed: {
    ...mapGetters([
      'getTx',
      'getTxSymbol',
      'getTxAmountTotal',
      'getTxDirection',
      'getTxTipUrl',
      'getExplorerPath',
      'isTxAex9',
    ]),
    transaction() {
      return this.getTx(this.hash);
    },
    amount() {
      return this.getTxAmountTotal(this.transaction);
    },
    symbol() {
      return this.getTxSymbol(this.transaction);
    },
    direction() {
      return this.getTxDirection(this.transaction);
    },
    tipUrl() {
      return this.getTxTipUrl(this.transaction);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/typography';
@use '../../../styles/mixins';

.transaction-details {
  .header {
    display: flex;
    justify-content: center;
    height: 92px;

    @include mixins.mobile {
      width: 100%;
    }

    .token-amount {
      text-align: center;
      margin: 16px 0 24px 0;

      ::v-deep .fiat {
        display: block;
        padding-top: 4px;
        line-height: 24px;
      }
    }
  }

  .content {
    margin-top: -10px;
    background: variables.$color-bg-3;

    .transaction-overview {
      padding: 26px 16px 16px 16px;
    }

    .data-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-auto-rows: 64px;
      row-gap: 8px;
      column-gap: 24px;
      padding: 8px 16px;

      .span-2-columns {
        grid-column-end: span 2;
      }
    }

    .explorer {
      height: 56px;
      margin: 0 16px;
      padding: 8px 0 24px 0;

      .link-button {
        @extend %face-sans-14-medium;
      }
    }
  }
}
</style>
