import { TypeNodeMapping } from "../config";

export default function configure(fac) {
  TypeNodeMapping.forEach(obj => {
    const { type, Class } = obj;
    fac.registerType(type, Class);
  });
}
