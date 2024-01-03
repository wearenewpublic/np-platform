import React from 'react';

export const SharedDataContext = React.createContext({});

export class SharedData extends React.Component {
    data = {};
    dataWatchers = [];

    setData(data) {
        this.data = data;
        this.notifyWatchers();
    }

    getData() {
        return this.data;
    }

    watch(watchFunc) {
        this.dataWatchers.push(watchFunc);
    }
    unwatch(watchFunc) {
        this.dataWatchers = this.dataWatchers.filter(w => w !== watchFunc);
    }
    notifyWatchers() {
        this.dataWatchers.forEach(w => w());
    }

    render() {
        return <SharedDataContext.Provider value={this}>
            {this.props.children}
        </SharedDataContext.Provider>    
    }
}
