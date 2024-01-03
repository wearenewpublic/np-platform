import React from 'react';
import { ScrollView } from 'react-native';

export class BottomScroller extends React.PureComponent {
    state = {rendered: false, atBottom: true}
    safariScrollToEnd() {}
  
    maybeScrollToEnd(animated) {
        const {atBottom} = this.state;
        if (atBottom) {
            this.scrollView?.scrollToEnd({animated: false});
        }
    }
    
    render() {
        const {children, style} = this.props;
        const {rendered} = this.state;
        return <ScrollView
            style={{...style, opacity: rendered ? 1 : 0}}
            ref={ref => this.scrollView = ref}
            onLayout={() => {
                this.maybeScrollToEnd(false);
                this.setState({rendered: true});
            }}
            scrollEventThrottle={1}
            onContentSizeChange={(contentWidth, contentHeight)=>{        
                this.maybeScrollToEnd(true);
            }}>
            {children}
        </ScrollView>
      
    }
}