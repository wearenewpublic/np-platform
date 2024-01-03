import React from 'react';
import { Text, View } from 'react-native';

export class Catcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {error: null};
    }

    componentDidCatch(error, errorInfo) {
        console.log('componentDidCatch', error, errorInfo);
        if (process.env.NODE_ENV === 'test') {
            throw error;
        }

        this.setState({error});
    }

    render() {
        if (this.state.error) {
            return <View style={this.props.style}>
                <Text>Something went wrong</Text>
                <Text>{this.state.error.message}</Text>
            </View>
        } else {
            return this.props.children;
        }
    }
}

export function CatchList({items, renderItem, style}) {
    return <View style={style}>
        {items && items.map(item => 
           <Catcher key={item.key}>{renderItem(item)}</Catcher>
        )}
    </View>
}

export function FailTest(){ 
    throw Error('FailTest');
}
