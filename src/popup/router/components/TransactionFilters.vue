<template>
  <div
    class="filters"
    data-cy="filters"
  >
    <ButtonPlain
      v-for="filter in filters"
      :key="filter"
      class="filter"
      :class="{ active: value.type === filter }"
      @click="$emit('input', { ...value, type: filter })"
    >
      <span>{{ $t(`pages.transactionDetails.${filter}`) }}</span>
      <FilterArrow />
    </ButtonPlain>
    <ButtonPlain
      class="filter active"
      @click="$emit('input', { ...value, latestFirst: !value.latestFirst })"
    >
      <span>{{ $t('pages.transactionDetails.date') }}</span>
      <Sort :class="{ rotate: !value.latestFirst }" />
    </ButtonPlain>
  </div>
</template>

<script>
import FilterArrow from '../../../icons/filter-arrow.svg?vue-component';
import Sort from '../../../icons/sort.svg?vue-component';
import ButtonPlain from './ButtonPlain';

export default {
  components: { FilterArrow, Sort, ButtonPlain },
  props: {
    value: { type: Object, required: true },
  },
  data: () => ({
    filters: ['all', 'sent', 'received', 'tips'],
  }),
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/typography';
@use '../../../styles/mixins';

.filters {
  position: sticky;
  top: 48px;
  top: calc(env(safe-area-inset-top) + 48px);
  background: variables.$color-bg-3;
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 8px 16px;

  .filter {
    display: flex;
    align-items: center;

    @extend %face-sans-15-medium;

    color: variables.$color-dark-grey;

    &.active {
      color: variables.$color-green;
    }

    svg {
      margin-left: 4px;
      width: 16px;
      height: 16px;

      &.rotate {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
