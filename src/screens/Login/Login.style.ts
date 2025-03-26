import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONTS } from "../../theme/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logoContainer: {
        marginBottom: 60,
        alignItems: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    logoText: {
        ...FONTS.h1,
        color: COLORS.accent,
        marginBottom: 10,
    },
    subtitle: {
        ...FONTS.body1,
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 80,
    },
    buttonsContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    employeeButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        elevation: 3,
    },
    agencyButton: {
        backgroundColor: COLORS.tertiary,
        paddingVertical: 15,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
        elevation: 3,
    },
    buttonText: {
        ...FONTS.h4,
        color: COLORS.background,
    },
    agencyButtonText: {
        ...FONTS.h4,
        color: COLORS.white,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
        width: '100%',
    },
    footerText: {
        ...FONTS.body3,
        color: COLORS.gray,
    }
});