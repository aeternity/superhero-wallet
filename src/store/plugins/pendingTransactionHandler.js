export default async (store) => {
  const waitTransactionMined = async ({
    hash, type, amount, tipUrl, recipientId,
  }) => {
    try {
      const transaction = await store.state.sdk.poll(hash);
      switch (type) {
        case 'tip':
          store.dispatch('router/push', { name: 'success-tip', params: { amount, tipUrl } });
          break;
        case 'spend':
        case 'spendToken':
          store.dispatch('modals/open', {
            name: 'spend-success',
            transaction: { ...transaction, ...type === 'spendToken' ? { tx: { ...transaction.tx, recipientId, amount } } : {} },
          });
          break;
        default:
      }
    } finally {
      store.commit('removePendingTransactionByHash', hash);
    }
  };
  // eslint-disable-next-line no-underscore-dangle
  await store._watcherVM.$watchUntilTruly(() => store.state.sdk);
  store.state.transactions.pending.forEach(waitTransactionMined);

  store.subscribe(async (mutation) => {
    if (mutation.type !== 'addPendingTransaction') return;
    await waitTransactionMined(mutation.payload);
  });
};
