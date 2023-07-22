import { makeToast } from 'app/components/Toaster';
import { $logger, logger } from 'app/logging/logger';
import { loraRemoved } from 'features/lora/store/loraSlice';
import { modelSelected } from 'features/parameters/store/actions';
import {
  modelChanged,
  vaeSelected,
} from 'features/parameters/store/generationSlice';
import { zMainModel } from 'features/parameters/types/parameterSchemas';
import { addToast } from 'features/system/store/systemSlice';
import { forEach } from 'lodash-es';
import { startAppListening } from '..';
import { controlNetRemoved } from 'features/controlNet/store/controlNetSlice';

export const addModelSelectedListener = () => {
  startAppListening({
    actionCreator: modelSelected,
    effect: (action, { getState, dispatch }) => {
      const log = logger('models');

      const state = getState();
      const result = zMainModel.safeParse(action.payload);

      if (!result.success) {
        log.error(
          { error: result.error.format() },
          'Failed to parse main model'
        );
        return;
      }

      const newModel = result.data;

      const { base_model } = newModel;

      if (state.generation.model?.base_model !== base_model) {
        // we may need to reset some incompatible submodels
        let modelsCleared = 0;

        // handle incompatible loras
        forEach(state.lora.loras, (lora, id) => {
          if (lora.base_model !== base_model) {
            dispatch(loraRemoved(id));
            modelsCleared += 1;
          }
        });

        // handle incompatible vae
        const { vae } = state.generation;
        if (vae && vae.base_model !== base_model) {
          dispatch(vaeSelected(null));
          modelsCleared += 1;
        }

        const { controlNets } = state.controlNet;
        forEach(controlNets, (controlNet, controlNetId) => {
          if (controlNet.model?.base_model !== base_model) {
            dispatch(controlNetRemoved({ controlNetId }));
            modelsCleared += 1;
          }
        });

        if (modelsCleared > 0) {
          dispatch(
            addToast(
              makeToast({
                title: `Base model changed, cleared ${modelsCleared} incompatible submodel${
                  modelsCleared === 1 ? '' : 's'
                }`,
                status: 'warning',
              })
            )
          );
        }
      }

      dispatch(modelChanged(newModel));
    },
  });
};
