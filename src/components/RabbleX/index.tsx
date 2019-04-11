import * as React from 'react';
import { configure, observable, action } from 'mobx';
import { createContext, ReactNode, ReactNodeArray, ReactElement } from 'react';

configure({
    enforceActions: 'observed',
});

// eslint-disable-next-line dot-notation
const entries: (object: object) => [[string, any]] =
    (Object as any)['entries'] ||
    ((o: object) => Object.keys(o).map(key => [key, (o as any)[key]]));

type StoreDecorator<T> = { [K in keyof T]?: Function };

export function createStore<TStore extends object>(
    store: TStore,
    decorators: StoreDecorator<TStore> = {}
): [React.Context<TStore>, (props: { children: ReactNodeArray | ReactNode }) => ReactElement] {
    const actions = entries(store).filter(([, val]) => typeof val === 'function');
    for (let i = 0; i < actions.length; i += 1) {
        // eslint-disable-next-line no-param-reassign
        (decorators as any)[actions[i][0]] = action;
    }
    const observableStore = observable.object(store, decorators);
    const context = createContext<TStore>(null as any);
    return [
        context,
        ({ children }) => <context.Provider value={observableStore}>{children}</context.Provider>,
    ];
}
