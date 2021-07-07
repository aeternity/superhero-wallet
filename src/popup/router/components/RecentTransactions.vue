<template>
  <div
    class="recent-transactions"
    :class="{ 'tour-bar': tourStartBar }"
  >
    <div class="header">
      <span class="title">{{ $t('pages.recentTransactions.title') }}</span>
      <router-link
        v-if="loading || transactions.latest.length || transactions.pending.length"
        to="/transactions"
        data-cy="view-all-transactions"
        class="view-all"
      >
        {{ $t('pages.recentTransactions.viewAll') }} <TxHistory class="icon" />
      </router-link>
    </div>
    <div class="body">
      <PendingTxs />
      <div
        v-if="transactions.latest.length"
        class="transaction-list"
      >
        <TransactionItem
          v-for="transaction in transactions.latest.slice(0, limit)"
          :key="transaction.hash"
          :transaction="transaction"
        />
      </div>
      <router-link
        v-if="transactions.latest.length > 6"
        to="/transactions"
        class="view-more"
      >
        <Visible class="icon" />
        <span class="text">{{ $t('pages.recentTransactions.viewMore') }}</span>
      </router-link>
      <AnimatedSpinner
        v-if="loading"
        class="spinner"
      />
      <div
        v-else-if="!transactions.latest.length && !transactions.pending.length"
        class="message"
      >
        <p>{{ $t('pages.recentTransactions.noTransactionsFound') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import TxHistory from '../../../icons/tx-history.svg?vue-component';
import Visible from '../../../icons/visible.svg?vue-component';
import AnimatedSpinner from '../../../icons/animated-spinner.svg?skip-optimize';
import PendingTxs from './PendingTxs';
import TransactionItem from './TransactionItem';

export default {
  components: {
    PendingTxs, TransactionItem, TxHistory, Visible, AnimatedSpinner,
  },
  data() {
    return {
      polling: null,
      loading: true,
      limit: 10,
    };
  },
  computed: mapState(['tourStartBar', 'transactions', 'accountSelectedIdx']),
  watch: {
    accountSelectedIdx() {
      this.$store.commit('setTransactions', []);
      this.loading = true;
      this.updateTransactions();
    },
  },
  mounted() {
    if (this.transactions.latest.length) this.loading = false;
    this.polling = setInterval(() => this.updateTransactions(), 5000);
    this.$once('hook:beforeDestroy', () => clearInterval(this.polling));
  },
  methods: {
    async updateTransactions() {
      this.$store.commit(
        'setTransactions',
        await this.$store.dispatch('fetchTransactions', {
          limit: this.limit,
          page: 1,
          recent: true,
        }),
      );
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/typography';
@use '../../../styles/mixins';

.recent-transactions {
  background: variables.$color-bg-3;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  .header {
    height: 48px;
    position: fixed;
    width: 100%;
    padding: 8px 16px 8px 16px;
    background: variables.$color-bg-2;
    border-radius: 0 0 4px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title {
      @extend %face-sans-15-medium;

      color: variables.$color-dark-grey;
    }

    .view-all {
      display: flex;
      padding: 4px 8px;
      border-radius: 16px;
      align-items: center;
      background: variables.$color-bg-1;
      cursor: pointer;
      text-decoration: none;
      color: variables.$color-dark-grey;
      transition: all 0.12s ease-out;

      @extend %face-sans-15-medium;

      .icon {
        margin-left: 4px;
        width: 24px;
        color: variables.$color-white;
        opacity: 0.7;
      }

      &:hover {
        color: variables.$color-green;
        background: rgba(0, 255, 157, 0.1);

        .icon {
          opacity: 1;
          color: variables.$color-green-hover;
        }
      }

      &:active {
        opacity: 0.8;
      }
    }
  }

  .body {
    margin-top: 48px;

    .transaction-list > div {
      margin-bottom: 1px;
    }

    .message,
    .spinner {
      flex-grow: 1;
      display: flex;
      align-items: center;
      padding-bottom: 8px;

      @include mixins.desktop {
        padding-bottom: 56px;
      }
    }

    .message > p {
      padding: 0 64px;

      @extend %face-sans-15-medium;

      color: variables.$color-light-grey;
      text-align: center;
    }

    .spinner {
      width: 56px;
      height: 56px;
      margin: 0 auto;
      color: variables.$color-white;
    }

    .view-more {
      padding: 12px 16px;
      border-radius: 4px;
      background: variables.$color-bg-1;
      display: flex;
      align-items: center;

      .text {
        @extend %face-sans-14-medium;

        color: variables.$color-green;
        padding-left: 4px;
      }

      .icon {
        width: 24px;
        height: 24px;
        opacity: 0.7;
      }

      &:hover {
        background: variables.$color-hover;

        .text {
          color: variables.$color-green-hover;
        }

        .icon {
          opacity: 1;

          path {
            fill: variables.$color-green;
          }
        }
      }

      &:active {
        background: variables.$color-bg-1;

        .text {
          opacity: 0.7;
        }

        .icon {
          opacity: 0.44;
        }
      }
    }
  }
}
</style>
