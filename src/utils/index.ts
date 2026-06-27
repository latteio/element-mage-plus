import * as ElementMagePlus from '@/element-mage-plus';
import {appConfig} from "@/appconfig";

const {Local, Session} = ElementMagePlus.default.methods.appStorageInstaller(appConfig);
const {ApiRequest} = ElementMagePlus.default.methods.apiRequestInstaller(appConfig, Session);
const Message = ElementMagePlus.default.methods.Message;
const Objects = ElementMagePlus.default.methods.Objects;
const Strings = ElementMagePlus.default.methods.Strings;

export {
  Local,
  Session,
  ApiRequest,
  Message,
  Objects,
  Strings
}
