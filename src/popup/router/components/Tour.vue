<!-- eslint-disable vue-i18n/no-v-html, vue/no-v-html-->
<template>
  <div class="tour">
    <v-tour
      name="onboarding"
      :steps="tourSteps"
      :options="{ highlight: true }"
    >
      <template slot-scope="tour">
        <transition name="fade">
          <v-step
            v-if="tour.steps[tour.currentStep]"
            :step="tour.steps[tour.currentStep]"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :highlight="tour.highlight"
            :class="tour.currentStep === 2 ? 'tip-step' : ''"
          >
            <div
              slot="header"
              class="step-header"
            >
              {{ $t(`onboarding.step_${tour.steps[tour.currentStep].step}.title`) }}
              <span class="step-info">
                ({{ tour.steps[tour.currentStep].step }}/{{ steps.length }})
              </span>
            </div>
            <div
              slot="content"
              class="step-content"
              v-html="$t(`onboarding.step_${tour.steps[tour.currentStep].step}.content`)"
            />
            <div slot="actions" />
          </v-step>
        </transition>
      </template>
    </v-tour>
    <div
      v-if="tourRunning"
      class="tour-actions"
      :class="!started ? 'not-started' : ''"
    >
      <div class="container">
        <div class="tour-welcome-message">
          <Hero />
          <div>
            <h3>{{ $t('onboarding.heading') }}</h3>
            <p>{{ $t('onboarding.sub-heading') }}</p>
          </div>
        </div>
        <div class="tour-control-buttons">
          <Button
            onboarding
            class="skip"
            @click="stop"
          >
            {{ $t('onboarding.skip') }}
          </Button>
          <Button
            v-if="started"
            onboarding
            @click="back"
          >
            {{ $t('onboarding.back') }}
          </Button>
          <Button
            v-if="started"
            onboarding
            class="next"
            @click="next"
          >
            {{
              $t('onboarding.next')
            }}
          </Button>
          <Button
            v-if="!started"
            onboarding
            class="start"
            @click="start"
          >
            {{
              $t('onboarding.start')
            }}
          </Button>
        </div>
      </div>
    </div>
    <div
      v-if="!nodeStatus && $route.path === '/account' && isLoggedIn && !tourRunning && tourStartBar"
      class="tour-start"
      @click="toggleTour"
    >
      <div class="container">
        <StartOnboarding class="start-onboarding" />
        <span>{{ $t('onboarding.tutorial') }}</span>
        <div class="close">
          <Close />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import Button from './Button';
import Hero from '../../../icons/hero.svg?vue-component';
import StartOnboarding from '../../../icons/start-onboarding.svg?vue-component';
import Close from '../../../icons/close.svg?vue-component';

export default {
  components: {
    Button,
    Hero,
    StartOnboarding,
    Close,
  },
  data: () => ({
    started: false,
    steps: [
      {
        target: '.tour__step1',
        step: 1,
        params: {
          placement: 'bottom',
        },
      },
      {
        route: '/account',
        target: '.tour__step2 .button-content',
        step: 2,
        params: {
          placement: 'top',
        },
      },
      {
        target: '.tour__step3',
        step: 3,
        params: {
          placement: 'bottom',
        },
        route: '/tips',
      },
      {
        route: '/account',
        target: '.tour__step4 .button-content',
        step: 4,
        params: {
          placement: 'top',
        },
      },
      {
        target: '.tour__step5 .button-content',
        step: 5,
        params: {
          placement: 'top',
        },
      },
      {
        target: '.tour__step6 .button-content',
        step: 6,
        params: {
          placement: 'top',
        },
      },
      {
        target: '.tour__step7 .button-content',
        step: 7,
        params: {
          placement: 'top',
        },
      },
      {
        target: '.tour__step8 .button-content',
        step: 8,
        params: {
          placement: 'top',
        },
      },
    ],
  }),
  computed: {
    ...mapState(['tourStartBar', 'tourRunning', 'nodeStatus']),
    ...mapGetters(['isLoggedIn']),
    tourSteps() {
      return this.steps
        .filter(({ hide }) => !hide)
        .map((step) => ({ ...step, params: { ...step.params, enableScrolling: false } }));
    },
  },
  watch: {
    tourRunning(val) {
      if (val) {
        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';
      }
    },
  },
  methods: {
    toggleTour(event) {
      if (event.target.closest('.close')) this.$store.commit('setTourStatusBar', false);
      else this.$store.commit('setTourRunning', true);
    },
    start() {
      this.$tours.onboarding.start();
      this.started = true;
    },
    stop() {
      this.$tours.onboarding.skip();
      this.$store.commit('setTourRunning', false);
      this.enableScroll();
      this.started = false;
    },
    enableScroll() {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.pointerEvents = '';
    },
    async back() {
      const prevStep = this.$tours.onboarding.steps[this.$tours.onboarding.currentStep - 1];
      if (prevStep && prevStep.route) {
        if (this.$route.path !== prevStep.route) await this.$router.push(prevStep.route);
        this.$nextTick(() => {
          this.$tours.onboarding.previousStep();
        });
      } else {
        this.$tours.onboarding.previousStep();
      }
    },
    async next() {
      const nextStep = this.$tours.onboarding.steps[this.$tours.onboarding.currentStep + 1];
      if (nextStep && nextStep.route) {
        if (this.$route.path !== nextStep.route) await this.$router.push(nextStep.route);
        this.$nextTick(() => {
          this.$tours.onboarding.nextStep();
        });
      } else if (nextStep) {
        this.$tours.onboarding.nextStep();
      } else {
        this.$tours.onboarding.finish();
        this.$store.commit('setTourRunning', false);
        this.enableScroll();
        this.started = false;
      }
    },
  },
};
</script>

<style lang="scss">
@use "../../../styles/variables";

.v-tour__target--highlighted {
  -webkit-box-shadow: 0 0 0 99999px rgba(67, 67, 67, 0.6);
  -moz-box-shadow: 0 0 0 99999px rgba(67, 67, 67, 0.6);
  box-shadow: 0 0 0 99999px rgba(67, 67, 67, 0.6);
  pointer-events: none;

  &::after {
    content: '';
    border: 1.5px dashed variables.$color-white;
    border-radius: 5px;
    background: rgba(42, 156, 255, 0.25);
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
}
</style>

<style lang="scss" scoped>
@use '../../../styles/variables';

.container {
  max-width: variables.$extension-width;
  margin: 0 auto;
}

.tour .v-tour .v-step {
  background-color: variables.$color-bg-3;
  border-radius: 5px;
  border: 1px solid variables.$color-blue;
  padding: 20px 15px 25px 15px;
  min-width: 345px;

  .step-header {
    background-color: variables.$color-bg-3;
    margin-bottom: 18px;
    font-weight: bold;
    font-size: 16px;
    line-height: 21px;

    .step-info {
      color: variables.$color-white;
      margin-left: 8px;
    }
  }

  .step-content {
    text-align: left;
    font-size: 14px;
    color: variables.$color-white;
    line-height: 20px;
  }

  .v-step__arrow {
    border-color: variables.$color-bg-3;
    border: none;
    width: 35px;
    height: 12px;
    z-index: -3;
    background-repeat: no-repeat;
  }

  &[x-placement^='top'] {
    margin-bottom: 0.8rem;

    .v-step__arrow {
      background-image: url('../../../icons/arrow-up.png');
      transform: rotate(180deg);
      bottom: -0.75rem;
    }
  }

  &[x-placement^='bottom'] {
    margin-top: 0.8rem;

    .v-step__arrow {
      background-image: url('../../../icons/arrow-up.png');
      top: -0.75rem;
    }
  }

  &.tip-step[x-placement^='bottom'] {
    margin-top: 1rem;
  }
}

.tour-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99999;
  background: variables.$color-bg-3;
  padding: 19px;
  padding-top: 0;
  padding-bottom: 15px;
  pointer-events: all;

  &.not-started {
    -webkit-box-shadow: 0 0 0 99999px rgba(67, 67, 67, 0.6);
    -moz-box-shadow: 0 0 0 99999px rgba(67, 67, 67, 0.6);
    box-shadow: 0 0 0 99999px rgba(67, 67, 67, 0.6);
  }

  &::before {
    position: absolute;
    top: -80px;
    height: 100%;
    left: 0;
    right: 0;
    z-index: -1;
    content: '';
    -webkit-clip-path: polygon(0% 49%, 100% 36%, 100% 100%, 0 100%);
    -moz-clip-path: polygon(0% 49%, 100% 36%, 100% 100%, 0 100%);
    clip-path: polygon(0% 49%, 100% 36%, 100% 100%, 0 100%);
    background: variables.$color-bg-3;
  }

  .tour-welcome-message {
    display: flex;
    align-items: flex-end;

    svg {
      width: 165px;
      margin-left: -51px;
      margin-right: 10px;
    }

    h3 {
      font-size: 16px;
      margin: 0;
      margin-bottom: 10px;
      line-height: 21px;
    }

    p {
      font-size: 14px;
      font-weight: normal;
      margin: 0;
      color: variables.$color-white;
      line-height: 20px;
    }
  }

  .tour-control-buttons {
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
  }
}

.tour-start {
  position: fixed;
  background: variables.$color-border;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 6;
  height: 44px;
  cursor: pointer;

  &:hover {
    background: variables.$color-bg-1;
  }

  .container {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 20px;
  }

  span {
    color: variables.$color-green;
    margin-left: 6px;
    font-size: 15px;
    font-weight: bold;
  }

  .close {
    margin-left: auto;
    height: 100%;
    align-items: center;
    width: 30px;
    text-align: center;

    svg {
      margin-top: 11px;
    }
  }
}

@media screen and (min-width: 780px) {
  .tour-actions::after {
    top: -30px;
  }

  .tour .v-tour .v-step {
    &[x-placement^='top'] .v-step__arrow {
      bottom: -0.7rem;
    }

    &[x-placement^='bottom'] .v-step__arrow {
      top: -0.7rem;
    }
  }
}
</style>
