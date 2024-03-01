import React from 'react';

export const SharedDataContext = React.createContext({});

export class SharedData extends React.Component {
    data = {};
    dataWatchers = [];
    indexes = {};

    setData(data) {
        this.data = data;
        this.indexes = {};
        this.notifyWatchers();
    }

    getData() {
        return this.data;
    }

    getIndex(type, indexName) {
        if (!this.indexes[type]) this.indexes[type] = {};
        return this.indexes[type][indexName] ?? null;
    }    

    setIndex(type, indexName, value) {
        if (!this.indexes[type]) this.indexes[type] = {};
        this.indexes[type][indexName] = value;
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
