import { StyleSheet, View } from "react-native";
import { Heading, UtilityText } from "./text";
import { Pad } from "./basics";
import { colorTeaserBackground } from "./color";
import { CTAButton } from "./button";
import { openSidebar } from "../util/navigate";

function TeaserCommentIcon() {
    return <svg xmlns="http://www.w3.org/2000/svg" width="229" height="229" viewBox="0 0 229 229" fill="none">
        <g opacity="0.05" clipPath="url(#clip0_8_3260)">
            <path d="M145.035 190.283L133.738 187.28L145.69 141.867L179.447 132.821C182.431 132.022 184.976 130.069 186.521 127.394C188.065 124.718 188.484 121.538 187.684 118.554L169.594 51.0397C168.794 48.0553 166.842 45.5109 164.166 43.9661C161.49 42.4213 158.311 42.0027 155.326 42.8023L42.8026 72.953C39.8182 73.7527 37.2738 75.7051 35.729 78.3807C34.1842 81.0564 33.7656 84.2362 34.5652 87.2205L52.6556 154.735C53.4553 157.719 55.4077 160.264 58.0834 161.808C60.759 163.353 63.9388 163.772 66.9231 162.972L117.559 149.404L120.574 160.657L69.9382 174.225C63.9695 175.824 57.61 174.987 52.2587 171.897C46.9074 168.807 43.0026 163.719 41.4033 157.75L23.3129 90.2355C21.7136 84.2669 22.5508 77.9074 25.6404 72.5561C28.73 67.2047 33.8189 63.2999 39.7875 61.7006L152.311 31.55C158.28 29.9507 164.639 30.7879 169.991 33.8775C175.342 36.9671 179.247 42.056 180.846 48.0246L198.937 115.539C200.536 121.508 199.699 127.867 196.609 133.218C193.52 138.57 188.431 142.475 182.462 144.074L155.231 151.37L145.035 190.283Z" fill="black"/>
            <path d="M60.085 92.4427L150.104 68.3222L153.119 79.5746L63.1 103.695L60.085 92.4427ZM69.1302 126.2L125.392 111.125L128.407 122.377L72.1452 137.452L69.1302 126.2Z" fill="black"/>
        </g>
        <defs>
            <clipPath id="clip0_8_3260">
            <rect width="186.389" height="186.389" fill="white" transform="translate(0 48.2411) rotate(-15)"/>
            </clipPath>
        </defs>
    </svg>
}

export function BasicTeaser({title = 'Join the Conversation',
        label = 'There {isAre} {count} {noun} being discussed', formatParams}) {
    const s = BasicTeaserStyle;
    return <View style={s.outer}>
        <Heading label={title} />
        <Pad />
        <UtilityText label={label} formatParams={formatParams} />
        <Pad size={40} />
        <CTAButton type='accent' label='🚀 Read More' onPress={openSidebar} />
        <View style={s.backgroundIcon}>
            <TeaserCommentIcon />
        </View>
    </View>
}

const BasicTeaserStyle = StyleSheet.create({
    outer: {
        backgroundColor: colorTeaserBackground,
        padding: 40,
        borderRadius: 10
    },
    backgroundIcon: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: -1000
    }
})