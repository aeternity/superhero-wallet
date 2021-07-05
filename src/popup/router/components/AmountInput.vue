<template>
  <InputField
    class="amount-input"
    type="number"
    v-bind="$attrs"
    :error="$attrs.error || !!$attrs.value && $attrs.value <= 0"
    :error-message="$attrs['error-message'] || $t('pages.tipPage.insufficientAmountError')"
    placeholder="0.00"
    :label="$attrs.label || $t('pages.tipPage.amountLabel')"
    @input="$emit('input', $event)"
  >
    <TokenAmount
      slot="right"
      :amount="+$attrs.value || 0"
      :symbol="selectedToken ? selectedToken.symbol : 'AE'"
    />
  </InputField>
</template>

<script>
import { mapState } from 'vuex';
import InputField from './InputField';
import TokenAmount from './TokenAmount';

export default {
  components: {
    InputField,
    TokenAmount,
  },
  computed: {
    ...mapState('fungibleTokens', ['selectedToken']),
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/typography';

.amount-input {
  white-space: nowrap;
}
</style>
