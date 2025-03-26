import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONTS } from "../../theme/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    dotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 24,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 6,
        backgroundColor: COLORS.gray,
    },
    activeDot: {
        width: 20,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 6,
        backgroundColor: COLORS.accent,
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        padding: 10,
        zIndex: 10,
    },
    skipText: {
        ...FONTS.body2,
        color: COLORS.lightGray,
    },
    slideContainer: {
        width: width,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 48,
    },
    title: {
        ...FONTS.h2,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 24,
    },
    description: {
        ...FONTS.body1,
        color: COLORS.lightGray,
        textAlign: 'center',
        marginBottom: 48,
        paddingHorizontal: 24,
    },
    animationContainer: {
        width: width * 0.7,
        height: width * 0.7,
        marginBottom: 48,
    },
    button: {
        position: 'absolute',
        bottom: 72,
        alignSelf: 'center',
        backgroundColor: COLORS.accent,
        paddingHorizontal: 150,
        paddingVertical: 12,
        borderRadius: 12,
        elevation: 3,
    },
    buttonText: {
        ...FONTS.h4,
        color: COLORS.background,
    }
});