import ParamDynamicPromptsCollapse from 'features/dynamicPrompts/components/ParamDynamicPromptsCollapse';
import ParamNegativeConditioning from 'features/parameters/components/Parameters/Core/ParamNegativeConditioning';
import ParamPositiveConditioning from 'features/parameters/components/Parameters/Core/ParamPositiveConditioning';
import ParamNoiseCollapse from 'features/parameters/components/Parameters/Noise/ParamNoiseCollapse';
import ProcessButtons from 'features/parameters/components/ProcessButtons/ProcessButtons';
import ParamSDXLConcatPrompt from './ParamSDXLConcatPrompt';
import ParamSDXLNegativeStyleConditioning from './ParamSDXLNegativeStyleConditioning';
import ParamSDXLPositiveStyleConditioning from './ParamSDXLPositiveStyleConditioning';
import ParamSDXLRefinerCollapse from './ParamSDXLRefinerCollapse';
import SDXLImageToImageTabCoreParameters from './SDXLImageToImageTabCoreParameters';

const SDXLImageToImageTabParameters = () => {
  return (
    <>
      <ParamPositiveConditioning />
      <ParamSDXLPositiveStyleConditioning />
      <ParamNegativeConditioning />
      <ParamSDXLNegativeStyleConditioning />
      <ParamSDXLConcatPrompt />
      <ProcessButtons />
      <SDXLImageToImageTabCoreParameters />
      <ParamSDXLRefinerCollapse />
      <ParamDynamicPromptsCollapse />
      <ParamNoiseCollapse />
    </>
  );
};

export default SDXLImageToImageTabParameters;
