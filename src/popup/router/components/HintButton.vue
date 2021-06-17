<template>
  <ButtonPlain
    :class="['hint-button', type]"
    @click="showHintModal"
  >
    <Question />
  </ButtonPlain>
</template>

<script>
import ButtonPlain from './ButtonPlain';
import Question from '../../../icons/question.svg?vue-component';

export default {
  components: { ButtonPlain, Question },
  props: {
    title: { type: String, default: '' },
    msg: { type: String, default: '' },
    type: { type: String, default: 'grey' },
  },
  methods: {
    async showHintModal() {
      await this.$store.dispatch('modals/open', {
        name: 'name-pointers-help',
        title: this.title,
        msg: this.msg,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@use '../../../styles/variables';

.hint-button {
  height: 20px;
  width: 20px;
  border-radius: 10px;
  opacity: 0.7;
  background-color: variables.$color-dark-grey;
  color: variables.$color-white;

  &:hover {
    opacity: 1;
  }

  svg {
    margin-top: 1px;
    height: 13px;
  }

  &.blue {
    background-color: transparent;
    border: 1px solid variables.$color-blue;
    color: variables.$color-blue;
  }
}
</style>
