import { useEffect } from "react";
import { useState } from "react";
import ReactDOM from 'react-dom';


export function DocumentLevelComponent({children}) {
    const [container, setContainer] = useState(null);

    useEffect(() => {
        const container = document.createElement('div');
        document.body.appendChild(container);
        setContainer(container);
        return () => {
            document.body.removeChild(container);
        }
    }, []);

    if (!container) return null;

    return ReactDOM.createPortal(
        children,
        container,
    );
}
