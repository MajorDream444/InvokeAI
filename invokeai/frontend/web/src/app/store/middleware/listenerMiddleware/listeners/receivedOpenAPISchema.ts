import { logger } from 'app/logging/logger';
import { nodeTemplatesBuilt } from 'features/nodes/store/nodesSlice';
import { parseSchema } from 'features/nodes/util/parseSchema';
import { size } from 'lodash-es';
import { receivedOpenAPISchema } from 'services/api/thunks/schema';
import { startAppListening } from '..';
import { parseify } from 'common/util/serialize';

export const addReceivedOpenAPISchemaListener = () => {
  startAppListening({
    actionCreator: receivedOpenAPISchema.fulfilled,
    effect: (action, { dispatch, getState }) => {
      const log = logger('system');
      const schemaJSON = action.payload;

      log.debug({ schemaJSON }, 'Dereferenced OpenAPI schema');

      const nodeTemplates = parseSchema(schemaJSON);

      log.debug(
        { nodeTemplates: parseify(nodeTemplates) },
        `Built ${size(nodeTemplates)} node templates`
      );

      dispatch(nodeTemplatesBuilt(nodeTemplates));
    },
  });

  startAppListening({
    actionCreator: receivedOpenAPISchema.rejected,
    effect: (action, { dispatch, getState }) => {
      const log = logger('system');
      log.error('Problem dereferencing OpenAPI Schema');
    },
  });
};
