import { extendRoles } from "../component/admin";
import { registerLoginProviders } from "../structure/login";
import { githubLogin, rcIntLogin, rcLogin } from "./loginproviders";

jest.mock('./firebase');
jest.mock('./eventlog');
jest.mock('expo-linear-gradient');
extendRoles({});
registerLoginProviders([githubLogin, rcLogin, rcIntLogin])
