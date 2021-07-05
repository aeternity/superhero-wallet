<template>
  <div class="payments-send">
    <div
      v-if="!reviewStep"
      class="send"
    >
      <InputField
        v-model.trim="form.address"
        class="address"
        :placeholder="$t('pages.send.address-placeholder')"
        :error="!!form.address.length && !validAddress || nameNotExist"
        :error-message="$t('pages.send.address-error')"
        :warning="sameAddress"
        :warning-message="$t('pages.send.same-address')"
        data-cy="address"
        @input="checkSameAddress"
      >
        <span slot="label">
          {{ $t('pages.tipPage.heading') }}
          <span class="secondary-text">{{ tokenSymbol }}</span>
          {{ $t('pages.tipPage.to') }}
        </span>
        <Valid
          v-if="validAddress"
          slot="left"
        />
        <button
          slot="right"
          class="qr-scan"
          data-cy="scan-button"
          @click="scan"
        >
          <QrScan />
        </button>
      </InputField>

      <AmountInput
        v-model="form.amount"
        :error="!validAmount"
        :error-message="!validAmount && $t('pages.signTransaction.insufficientBalance')"
      />
    </div>
    <div
      v-else
      class="review"
    >
      <h1>{{ $t('pages.send.reviewtx') }}</h1>
      <h2>{{ $t('pages.send.checkalert') }}</h2>
      <DetailsItem
        :value="account.address"
        :label="$t('pages.send.sender')"
        data-cy="review-sender"
      />
      <DetailsItem
        :value="form.address"
        :label="$t('pages.send.recipient')"
        data-cy="review-recipient"
      />
    </div>

    <DetailsItem :label="$t('pages.signTransaction.fee')">
      <TokenAmount
        slot="value"
        :amount="+fee.toFixed()"
        symbol="AE"
        hide-fiat
        data-cy="review-fee"
      />
    </DetailsItem>
    <DetailsItem :label="$t('pages.signTransaction.total')">
      <TokenAmount
        slot="value"
        :amount="(selectedToken ? 0 : +fee.toFixed()) + +form.amount"
        :symbol="tokenSymbol"
        high-precision
        data-cy="review-total"
      />
    </DetailsItem>

    <Button
      v-if="!reviewStep"
      data-cy="review-withdraw"
      :disabled="canProceed"
      @click="validate"
    >
      {{ $t('pages.send.review') }}
    </Button>

    <div
      v-if="reviewStep"
      class="review-buttons"
    >
      <Button
        data-cy="reivew-editTxDetails-button"
        half
        dark
        fill="secondary"
        @click="reviewStep = false"
      >
        {{
          $t('pages.send.editTxDetails')
        }}
      </Button>
      <Button
        data-cy="review-send-button"
        third
        :disabled="sdk ? false : true"
        @click="send"
      >
        {{ $t('pages.send.send') }}
      </Button>
    </div>
    <Loader v-if="loading" />
  </div>
</template>

<script>
import { pick, debounce } from 'lodash-es';
import { mapGetters, mapState } from 'vuex';
import { SCHEMA } from '@aeternity/aepp-sdk';
import BigNumber from 'bignumber.js';
import { calculateFee } from '../../utils/constants';
import {
  checkAddress, checkAensName, aeToAettos, convertToken,
} from '../../utils/helper';
import InputField from '../components/InputField';
import AmountInput from '../components/AmountInput';
import Button from '../components/Button';
import QrScan from '../../../icons/qr-scan.svg?vue-component';
import DetailsItem from '../components/DetailsItem';
import TokenAmount from '../components/TokenAmount';
import Valid from '../../../icons/valid.svg?vue-component';

export default {
  name: 'PaymentsSend',
  components: {
    InputField,
    AmountInput,
    Button,
    QrScan,
    Valid,
    DetailsItem,
    TokenAmount,
  },
  props: {
    address: { type: String, default: '' },
  },
  data() {
    return {
      reviewStep: false,
      form: {
        address: '',
        amount: '',
      },
      nameNotExist: false,
      sameAddress: false,
      loading: false,
      fee: BigNumber(0),
    };
  },
  computed: {
    ...mapState('fungibleTokens', ['availableTokens']),
    ...mapState(['current', 'sdk']),
    ...mapGetters(['account', 'formatCurrency', 'currentCurrencyRate']),
    ...mapGetters('fungibleTokens', ['selectedToken']),
    validAddress() {
      return checkAddress(this.form.address) || checkAensName(this.form.address);
    },
    validAmount() {
      return !(this.selectedToken
        ? BigNumber(this.selectedToken.balance).comparedTo(this.form.amount) === -1
        || this.balance.comparedTo(this.fee) === -1
        : this.balance.comparedTo(this.fee.plus(this.form.amount)) === -1);
    },
    tokenSymbol() {
      return this.selectedToken ? this.selectedToken.symbol : 'AE';
    },
    canProceed() {
      return !this.form.address.length
        || !this.form.amount.length
        || +this.form.amount <= 0
        || !this.validAmount
        || !this.validAddress;
    },
  },
  watch: {
    selectedToken() {
      this.fetchFee();
    },
  },
  subscriptions() {
    return pick(this.$store.state.observables, ['balance']);
  },
  async mounted() {
    if (typeof this.address !== 'undefined') {
      this.form.address = this.address;
    }
    await this.fetchFee();
  },
  methods: {
    checkSameAddress: debounce(
      async function handler(value) {
        const address = await this.$store.dispatch('names/getAddress', value);
        this.nameNotExist = false;
        if (!address) {
          this.nameNotExist = true;
          return;
        }
        this.sameAddress = this.account.address === address;
      },
      300,
    ),
    async scan() {
      this.form.address = await this.$store.dispatch('modals/open', {
        name: 'read-qr-code',
        title: this.$t('pages.send.scanAddress'),
      });
      if (!this.form.address) this.form.address = '';
    },
    async fetchFee() {
      await this.$watchUntilTruly(() => this.sdk);
      this.fee = calculateFee(
        !this.selectedToken ? SCHEMA.TX_TYPE.spend : SCHEMA.TX_TYPE.contractCall, {
          ...this.sdk.Ae.defaults,
          ...(this.selectedToken && {
            callerId: this.account.address,
            contractId: this.selectedToken.contract,
          }),
        },
      );
    },
    async validate() {
      if (!this.fee) await this.fetchFee();
      if (this.validAddress && this.validAmount) this.reviewStep = true;
    },
    async send() {
      const amount = !this.selectedToken
        ? aeToAettos(this.form.amount)
        : convertToken(this.form.amount, this.selectedToken.decimals);
      const receiver = this.form.address;
      this.loading = true;
      try {
        if (this.selectedToken) {
          const { hash } = await this.$store.dispatch('fungibleTokens/transfer', [
            receiver,
            this.form.amount,
            { waitMined: true, modal: false },
          ]);
          this.$store.commit('addPendingTransaction', {
            hash,
            amount,
            type: 'spendToken',
            recipientId: receiver,
            tx: {
              senderId: this.account.address,
              contractId: this.selectedToken.contract,
              type: SCHEMA.TX_TYPE.contractCall,
            },
          });
        } else {
          const { hash } = await this.sdk.spend(amount, receiver, {
            waitMined: false,
            modal: false,
          });
          this.$store.commit('addPendingTransaction', {
            hash,
            amount,
            type: 'spend',
            tx: {
              senderId: this.account.address,
              recipientId: this.form.address,
              type: SCHEMA.TX_TYPE.spend,
            },
          });
        }
        this.$router.push('/account');
      } catch (e) {
        this.$store.dispatch('modals/open', { name: 'default', type: 'transaction-failed' });
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/typography';

.payments-send {
  padding: 16px;

  .send {
    .address {
      ::v-deep .wrapper {
        padding-right: 0;
      }

      .qr-scan {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 40px;
        height: 40px;
        border-left: 2px solid variables.$color-bg-3;
        border-radius: 2px 6px 6px 2px;
        cursor: pointer;

        svg {
          width: 24px;
          height: 24px;
        }

        &:hover {
          color: variables.$color-green;
          background-color: variables.$color-border;
        }
      }
    }

    .amount-input {
      margin-bottom: 24px;
    }
  }

  .review {
    h1,
    h2 {
      text-align: center;
    }

    h1 {
      @extend %face-sans-20-medium;

      font-size: 19px;
    }

    h2 {
      margin-bottom: 16px;

      @extend %face-sans-16-medium;

      color: variables.$color-light-grey;
    }

    .details-item {
      margin-bottom: 24px;

      ::v-deep .value {
        margin: 0;
        font-size: 11px;
        color: variables.$color-light-grey;
      }
    }
  }

  .details-item {
    display: inline-block;
    margin-right: 24px;
  }

  .button {
    margin-top: 24px;
    margin-bottom: 36px;
  }

  .review-buttons {
    display: flex;
    justify-content: space-around;
  }
}
</style>
