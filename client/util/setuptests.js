import { extendRoles } from "../component/admin";

jest.mock('./firebase');
jest.mock('./eventlog');
jest.mock('expo-linear-gradient');
extendRoles({});
