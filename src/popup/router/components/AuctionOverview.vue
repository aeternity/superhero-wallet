<template>
  <div class="auction-overview">
    <Avatar :name="name" />
    <span class="name">{{ name }}</span>
    <div class="details">
      <DetailsItem :label="$t('pages.auctionBid.current-highest-bid')">
        <TokenAmount
          slot="value"
          :amount="highestBid"
        />
      </DetailsItem>
      <DetailsItem
        class="end-height"
        :label="$t('pages.auctionBid.ending-height')"
        :value="endHeight"
        :secondary="`(≈${blocksToRelativeTime(endHeight)})`"
      />
    </div>
    <HintButton class="help" />
  </div>
</template>

<script>
import Avatar from './Avatar';
import DetailsItem from './DetailsItem';
import TokenAmount from './TokenAmount';
import HintButton from './HintButton';
import { blocksToRelativeTime } from '../../../filters/toRelativeTime';

export default {
  components: {
    Avatar,
    DetailsItem,
    TokenAmount,
    HintButton,
  },
  props: {
    name: { type: String, required: true },
    highestBid: { type: Number, required: true },
    endHeight: { type: Number, required: true },
  },
  methods: {
    blocksToRelativeTime,
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/typography';

.auction-overview {
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: variables.$extension-width;
  height: 184px;
  background-image: url('../../../icons/squares-bg.svg');

  .avatar {
    width: 48px;
    height: 48px;
    box-shadow: rgba(variables.$color-blue, 0.15) 0 0 0 8px;
    margin-top: 36px;
  }

  .name {
    font-weight: bold;
    font-size: 14px;
    line-height: 16px;
    margin-top: 16px;
  }

  .details {
    display: flex;
    margin-top: 16px;

    .details-item {
      padding: 0 12px;

      ::v-deep .label {
        margin-bottom: 4px;
      }

      ::v-deep .value {
        text-align: left;
      }

      &.end-height {
        ::v-deep .value {
          color: variables.$color-light-grey;
        }

        ::v-deep .secondary {
          color: variables.$color-dark-grey;
        }
      }
    }
  }

  .help {
    position: absolute;
    right: 16px;
    top: 16px;
  }
}
</style>
