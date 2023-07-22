import { logger } from 'app/logging/logger';
import { serializeError } from 'serialize-error';
import { sessionInvoked } from 'services/api/thunks/session';
import { startAppListening } from '..';

export const addSessionInvokedPendingListener = () => {
  startAppListening({
    actionCreator: sessionInvoked.pending,
    effect: (action, { getState, dispatch }) => {
      const log = logger('session');
      //
    },
  });
};

export const addSessionInvokedFulfilledListener = () => {
  startAppListening({
    actionCreator: sessionInvoked.fulfilled,
    effect: (action, { getState, dispatch }) => {
      const log = logger('session');
      const { session_id } = action.meta.arg;
      log.debug({ session_id }, `Session invoked (${session_id})`);
    },
  });
};

export const addSessionInvokedRejectedListener = () => {
  startAppListening({
    actionCreator: sessionInvoked.rejected,
    effect: (action, { getState, dispatch }) => {
      const log = logger('session');
      const { session_id } = action.meta.arg;
      if (action.payload) {
        const { arg, error } = action.payload;
        const stringifiedError = JSON.stringify(error);
        log.error(
          {
            session_id,
            error: serializeError(error),
          },
          `Problem invoking session: ${stringifiedError}`
        );
      }
    },
  });
};
