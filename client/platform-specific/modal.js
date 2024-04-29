import { colorRed } from "../component/color";
import { UtilityText } from "../component/text";

export function Modal({children}) {
    console.error('Modal not supported');
    return <UtilityText label='Not supported' color={colorRed} />
}
