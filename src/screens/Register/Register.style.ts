import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONTS } from "../../theme/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    backButton: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 10,
    },
    backIcon: {
        fontSize: 28,
        color: COLORS.white,
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        ...FONTS.h2,
        color: COLORS.white,
        marginBottom: 8,
    },
    subtitle: {
        ...FONTS.body2,
        color: COLORS.lightGray,
        textAlign: 'center',
        marginHorizontal: 20,
    },
    formContainer: {
        marginBottom: 20,
    },
    formRow: {
        marginBottom: 16,
    },
    inputLabel: {
        ...FONTS.body3,
        color: COLORS.white,
        marginBottom: 8,
    },
    required: {
        color: COLORS.accent,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: COLORS.tertiary,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: FONTS.body2.fontSize,
        color: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray,
    },
    errorText: {
        ...FONTS.body3,
        color: COLORS.error,
        marginTop: 5,
    },
    passwordStrengthContainer: {
        marginTop: 8,
        backgroundColor: COLORS.gray,
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    passwordStrengthBar: {
        height: '100%',
        borderRadius: 4,
    },
    passwordStrengthText: {
        ...FONTS.body4,
        color: COLORS.lightGray,
        marginTop: 4,
    },
    registerButton: {
        backgroundColor: COLORS.accent,
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    registerButtonText: {
        ...FONTS.h4,
        color: COLORS.white,
    },
    loginButton: {
        alignSelf: 'center',
        marginTop: 20,
        paddingVertical: 8,
    },
    loginButtonText: {
        ...FONTS.body3,
        color: COLORS.accent,
    }
}); 