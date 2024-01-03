import { useEffect, useState } from "react";

export class ObservableValue {
    constructor(initialValue) {
        this.value = initialValue;
        this.observers = [];
    }

    subscribe(observerFunction) {
        this.observers.push(observerFunction);
    }

    unsubscribe(observerFunction) {
        this.observers = this.observers.filter(observer => observer !== observerFunction);
    }

    notify(newValue) {
        this.observers.forEach(observerFunction => observerFunction(newValue));
    }

    set(newValue) {
        this.value = newValue;
        this.notify(newValue);
    }

    get() {
        return this.value;
    }
}
  
export function useObservable(observable) {
    const [value, setValue] = useState(observable.get());

    useEffect(() => {
        observable.subscribe(setValue);
        return () => observable.unsubscribe(setValue);
    }, [observable]);

    return observable.get();
}

export function ObservableProvider({observable, value}) {
    useEffect(() => {
        observable.set(value);
        return () => {
            observable.set(null);
        }
    }, [observable, value]);

    return null;
}
