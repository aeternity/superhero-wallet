<template>
  <div class="details">
    <ul
      v-if="!addPointer"
      class="name-details"
    >
      <li>
        <span>{{ $t('pages.names.details.name') }}</span> {{ name }}
      </li>
      <li>
        <span>{{ $t('pages.names.details.name-id') }}</span> {{ nameHash }}
      </li>
      <li>
        <span>{{ $t('pages.names.details.owner') }}</span> {{ nameEntry.owner }}
      </li>
      <li>
        <span>{{ $t('pages.names.details.created-height') }}</span> {{ nameEntry.createdAtHeight }}
      </li>
      <li>
        <span>{{ $t('pages.names.details.expires-height') }}</span> {{ nameEntry.expiresAt }}
      </li>
      <li
        v-for="(nameEntryPointer, key, index) in nameEntry.pointers"
        :key="key"
      >
        <span>{{ $t('pages.names.details.pointer', { id: index + 1 }) }}</span>
        {{ nameEntryPointer }}
      </li>
    </ul>
    <InputField
      v-if="addPointer"
      v-model="pointer"
      :error="!validPointer"
      :label="$t('pages.names.details.address-placeholder')"
    />
    <Button
      v-if="!addPointer"
      extend
      :disabled="!sdkInit || account.name === name || !hasPointer"
      @click="setDefault"
    >
      {{ $t('pages.names.details.set-default') }}
    </Button>
    <Button
      v-if="!addPointer"
      extend
      :disabled="!sdkInit || !hasPointer"
      @click="extend"
    >
      {{ $t('pages.names.details.extend') }}
    </Button>
    <Button
      v-if="addPointer"
      fill="secondary"
      extend
      @click="addPointer = false"
    >
      {{ $t('pages.names.details.cancel') }}
    </Button>
    <Button
      extend
      :disabled="!sdkInit || (addPointer && !validPointer) || nameEntry.pending"
      @click="setPointer"
    >
      {{ $t('pages.names.details.set-pointer') }}
    </Button>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import { checkAensName, checkAddress, getAddressByNameEntry } from '../../../utils/helper';
import Button from '../../components/Button';
import InputField from '../../components/InputField';

export default {
  components: { Button, InputField },
  props: {
    name: { type: String, required: true },
  },
  data: () => ({
    pointer: '',
    addPointer: false,
    pointerError: null,
    nameHash: '',
    sdkInit: false,
  }),
  computed: {
    ...mapState(['sdk']),
    ...mapGetters(['account']),
    nameEntry() {
      return this.$store.getters['names/getName'](this.name);
    },
    validPointer() {
      return checkAensName(this.pointer) || checkAddress(this.pointer);
    },
    hasPointer() {
      return this.nameEntry?.pointers?.accountPubkey;
    },
  },
  watch: {
    nameEntry(entry) {
      if (!entry) this.$router.push('/names');
    },
  },
  async mounted() {
    await this.$watchUntilTruly(() => this.sdk);
    this.sdkInit = true;
    this.$watch('name',
      async () => {
        this.nameHash = this.nameEntry.pending
          ? this.nameEntry.nameHash
          : (await this.sdk.api.getNameEntryByName(this.name)).id;
      },
      { immediate: true });
    this.$store.dispatch('names/fetchOwned');
  },
  methods: {
    async setDefault() {
      await this.$store.dispatch('names/setDefault', {
        address: this.account.address,
        name: this.name,
      });
    },
    async extend() {
      this.$store.dispatch('names/updatePointer', { name: this.name, type: 'extend' });
    },
    async setPointer() {
      if (!this.addPointer) {
        this.addPointer = true;
      } else {
        this.pointerError = !this.validPointer;
        if (this.pointerError) return;

        if (checkAensName(this.pointer)) {
          try {
            const nameEntry = await this.sdk.aensQuery(this.pointer);
            const address = getAddressByNameEntry(nameEntry);
            if (!address) {
              this.pointerError = true;
              return;
            }
            this.pointer = address;
          } catch (e) {
            this.pointerError = true;
            return;
          }
        }
        this.$store.dispatch('names/updatePointer', {
          name: this.name,
          address: this.pointer,
          type: 'update',
        });
        this.addPointer = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use "../../../../styles/variables";

.details .name-details {
  padding: 0;
  margin: 0;

  li {
    word-break: break-all;
    list-style: none;
    text-align: left;
    font-size: 12px;
    border-bottom: 1px solid variables.$color-border;
    padding-bottom: 10px;
    padding-top: 5px;

    span {
      display: block;
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
