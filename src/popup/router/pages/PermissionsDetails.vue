<template>
  <div class="permissions-details">
    <p>{{ host }}</p>
    <div class="permission-row">
      <CheckBox
        :value="address"
        @input="togglePermission({ host, name: 'address' })"
      />
      <span :class="{ highlight: address }">{{ $t('pages.permissions.login') }}</span>
    </div>

    <div class="permission-row">
      <CheckBox
        :value="messageSign"
        @input="togglePermission({ host, name: 'messageSign' })"
      />
      <span :class="{ highlight: messageSign }"> {{ $t('pages.permissions.message-sign') }}</span>
    </div>

    <div class="transaction-sign-limit">
      <div class="permission-row">
        {{ $t('pages.permissions.transaction-sign') }}
        <InputField
          :value="transactionSignLimit || ''"
          :error="transactionSignLimitError"
          placeholder="always ask"
          @input="setTransactionSignLimit"
        />
      </div>
      <RangeInput
        :value="transactionSignLimit"
        min="0"
        :max="+tokenBalance"
        step="0.1"
        @input="setTransactionSignLimit"
      />
      <div class="permission-row">
        {{ $t('pages.permissions.spent-today') }}
        <TokenAmount :amount="transactionSignLimit - transactionSignLimitLeft" />
      </div>
      <div class="permission-row">
        {{ $t('pages.permissions.left-today') }}
        <TokenAmount :amount="transactionSignLimitLeft" />
      </div>
      <div class="permission-row">
        {{ $t('pages.account.balance') }}
        <TokenAmount :amount="+tokenBalance" />
      </div>
    </div>
    <Button
      bold
      @click="removePermissions"
    >
      {{ $t('pages.permissions.delete') }}
    </Button>
  </div>
</template>

<script>
import { pick } from 'lodash-es';
import { mapState, mapMutations } from 'vuex';
import CheckBox from '../components/CheckBox';
import InputField from '../components/InputField';
import RangeInput from '../components/RangeInput';
import TokenAmount from '../components/TokenAmount';
import Button from '../components/Button';

export default {
  components: {
    CheckBox,
    InputField,
    RangeInput,
    TokenAmount,
    Button,
  },
  data: () => ({
    transactionSignLimitError: false,
  }),
  subscriptions() {
    return pick(this.$store.state.observables, ['tokenBalance']);
  },
  computed: {
    host() {
      return this.$route.params.host;
    },
    ...mapState(
      'permissions',
      ['address', 'messageSign', 'transactionSignLimit', 'transactionSignLimitLeft'].reduce(
        (c, s) => ({
          ...c,
          [s](state) {
            return state[this.host][s];
          },
        }),
        {},
      ),
    ),
  },
  mounted() {
    if (!this.$store.state.permissions[this.host]) this.$router.replace({ name: 'not-found' });
  },
  methods: {
    ...mapMutations('permissions', ['togglePermission']),
    setTransactionSignLimit(rawValue) {
      const value = +rawValue;
      this.transactionSignLimitError = Number.isNaN(value) || value < 0;
      if (this.transactionSignLimitError) return;
      this.$store.commit('permissions/setTransactionSignLimit', { host: this.host, value });
    },
    removePermissions() {
      this.$store.commit('permissions/removeAeppPermissions', this.host);
      this.$router.push({ name: 'permissions-settings' });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables.scss';

.permissions-details {
  font-size: 15px;
  text-align: left;
  color: variables.$color-white;

  p {
    text-align: center;
  }

  .permission-row {
    display: flex;
    margin: 30px 0;

    + .permission-row {
      margin-top: -16px;
    }

    + .range-input {
      display: block;
      margin: -16px 0 0 0;
    }

    .highlight {
      font-weight: 700;
      color: variables.$color-white;
    }

    .token-amount {
      margin-left: auto;
      color: variables.$color-white;
    }
  }

  .transaction-sign-limit {
    margin: 0 -12px;
    padding: 0 12px;
    border: 1px solid variables.$color-border;
    border-left: 0;
    border-right: 0;

    .input-wrapper {
      position: relative;

      ::v-deep .input {
        margin: 4px 0 0 30px;
        padding-right: 35px;
        width: 120px;
      }

      &::after {
        content: 'AE';
        position: absolute;
        top: 10px;
        left: 120px;
        color: variables.$color-blue;
      }
    }
  }
}
</style>
