import { features } from '../../feature';
import { runComponentDemoTestsForDemoFeatures } from '../../util/demotests';

jest.mock("../../util/navigate");

runComponentDemoTestsForDemoFeatures(features);
