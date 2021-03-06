<template>
  <div class="index">
    <img
      v-if="IN_FRAME"
      src="../../../icons/iframe/sendAndReceive.svg"
    >
    <div
      v-else
      class="not-iframe"
    >
      <Logo />
      <span class="heading">
        {{ $t('pages.index.heading') }}
      </span>
      <template v-if="IS_WEB">
        <Platforms :class="{ agreed: termsAgreed }">
          {{ $t('pages.index.platforms.heading') }}
        </Platforms>
        <span class="web">{{ $t('pages.index.webVersion') }}</span>
      </template>
      <template v-else-if="!IN_FRAME">
        <AnimatedSpinner class="spinner" />
        <span class="go">{{ termsAgreed ? $t('pages.index.go') : $t('pages.index.ready') }}</span>
      </template>
    </div>

    <div class="terms-agreement">
      <CheckBox
        v-model="termsAgreed"
        :class="{ agreed: termsAgreed }"
        data-cy="checkbox"
      >
        <span>
          {{ $t('pages.index.term1') }}
        </span>
      </CheckBox>
      <RouterLink
        to="/about/termsOfService"
        data-cy="terms"
      >
        {{ $t('pages.index.termsAndConditions') }}
      </RouterLink>
    </div>

    <Button
      :disabled="!termsAgreed"
      data-cy="generate-wallet"
      @click="$router.push('/intro')"
    >
      {{ $t('pages.index.generateWallet') }}
    </Button>
    <Button
      :disabled="!termsAgreed"
      data-cy="import-wallet"
      @click="$router.push('/import-account')"
    >
      {{ $t('pages.index.importWallet') }}
    </Button>
  </div>
</template>

<script>
import { IN_FRAME } from '../../utils/helper';
import AnimatedSpinner from '../../../icons/animated-spinner.svg?skip-optimize';
import Logo from '../../../icons/logo.svg?vue-component';
import CheckBox from '../components/CheckBox';
import Button from '../components/Button';
import Platforms from '../components/Platforms';

export default {
  components: {
    Logo, CheckBox, Button, Platforms, AnimatedSpinner,
  },
  data: () => ({
    termsAgreed: false,
    IS_WEB: process.env.PLATFORM === 'web',
    IN_FRAME,
  }),
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';
@use '../../../styles/typography';

.index {
  margin-top: 42px;
  text-align: center;

  .terms-agreement {
    margin-bottom: 24px;
    display: flex;
    justify-content: center;

    @extend %face-sans-15-medium;

    & > * {
      transition: all 0.12s ease-in-out;
    }

    .checkbox-container {
      margin-right: 4px;
      color: variables.$color-dark-grey;

      &.agreed {
        color: white;
      }

      &:hover:not(.agreed),
      &:active:not(.agreed) {
        color: variables.$color-light-grey;
      }

      ::v-deep .checkmark {
        margin-right: 5px;
      }
    }

    a:hover {
      color: variables.$color-green-hover;
    }
  }

  .button {
    width: 280px;
    font-weight: 700;
  }

  .not-iframe {
    text-align: center;

    svg {
      height: 35px;
      margin-bottom: 8px;
    }

    span {
      display: block;

      &.heading {
        @extend %face-sans-16-medium;

        color: variables.$color-blue;
        padding: 5.5px 0;
        margin: 0 auto;
      }

      &.web {
        @extend %face-sans-17-medium;

        margin-top: 32px;
        margin-bottom: 10px;
      }

      &.go {
        @extend %face-sans-20-bold;

        margin-top: -36px;
        margin-bottom: 42px;
      }
    }

    .spinner {
      width: 256px;
      height: 256px;
      color: variables.$color-blue;
    }

    .platforms {
      border-radius: 6px;
      margin: 8px auto 0 auto;
      padding-top: 8px;
      max-width: 312px;

      &.agreed {
        opacity: 0.66;
      }
    }
  }
}
</style>
