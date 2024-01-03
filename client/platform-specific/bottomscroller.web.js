import { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import { ScrollView } from "react-native";


export class BottomScroller extends PureComponent {
    state = {rendered: false, atBottom: true}
  
    maybeScrollToEnd(animated) {
      const {atBottom} = this.state;
      if (atBottom) {
        this.scrollView?.scrollToEnd({animated: false});
      }
    }
  
    onScroll() {
      const {atBottom} = this.state;
      const scroller = findDOMNode(this.scrollView);
      if (!scroller) return null;
      const scrollBottom = scroller.scrollTop + scroller.parentNode.scrollHeight;
      const scrollGap = scroller.scrollHeight - scrollBottom;
  
      const newAtBottom = scrollGap < 40;
      if (atBottom != newAtBottom) {
        this.setState({atBottom: newAtBottom});
      }
    }
  
    render() {
        const {children, style} = this.props;
        const {rendered} = this.state;
        return  <ScrollView
            style={{...style, opacity: rendered ? 1 : 0}}
            ref={ref => this.scrollView = ref}
            onLayout={() => {
                this.maybeScrollToEnd(false);
                this.setState({rendered: true});
            }}
            onScroll={() =>
                this.onScroll()
            }
            scrollEventThrottle={1}
            onContentSizeChange={(contentWidth, contentHeight)=>{        
                this.maybeScrollToEnd(true);
            }}>
            {children}
        </ScrollView>
    }
  }