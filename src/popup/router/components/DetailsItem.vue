<template>
  <div class="details-item">
    <div class="label">
      {{ label }}
      <span
        v-if="$slots.label"
        :class="{ indent: label }"
      >
        <slot name="label" />
      </span>
    </div>
    <div
      class="value"
      :class="{ small, highlight }"
    >
      {{ value }}
      <span
        v-if="secondary"
        class="secondary"
      >
        {{ secondary }}
      </span>
      <slot
        v-if="$slots.value"
        name="value"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailsItem',
  props: {
    label: { type: String, default: '' },
    value: { type: [String, Number, Array], default: '' },
    secondary: { type: String, default: '' },
    small: { type: Boolean },
    highlight: { type: Boolean },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/typography';

.details-item {
  .label {
    margin-bottom: 8px;
    display: flex;
    align-items: center;

    @extend %face-sans-15-medium;

    line-height: 16px;
    color: variables.$color-dark-grey;

    .indent {
      margin-left: 8px;
    }
  }

  .value {
    @extend %face-sans-14-regular;

    color: variables.$color-white;
    margin-bottom: 8px;

    .secondary {
      color: variables.$color-light-grey;
      margin-left: 4px;
    }

    &.small {
      @extend %face-mono-10-medium;
    }

    &.highlight {
      color: variables.$color-error;
    }
  }
}
</style>
