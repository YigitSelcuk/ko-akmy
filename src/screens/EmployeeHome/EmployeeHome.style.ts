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
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingVertical: 10,
    },
    headerTitle: {
        ...FONTS.h2,
        color: COLORS.white,
    },
    logoutButton: {
        padding: 8,
    },
    logoutIcon: {
        fontSize: 24,
        color: COLORS.accent,
    },
    userInfoContainer: {
        backgroundColor: COLORS.secondary,
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    welcomeText: {
        ...FONTS.body2,
        color: COLORS.lightGray,
        marginBottom: 8,
    },
    userName: {
        ...FONTS.h3,
        color: COLORS.white,
        marginBottom: 12,
    },
    totalAmount: {
        ...FONTS.body3,
        color: COLORS.accent,
        marginVertical: 8,
    },
    tableContainer: {
        backgroundColor: COLORS.secondary,
        borderRadius: 12,
        padding: 16,
        marginTop: 10,
        flex: 1,
    },
    tableTitle: {
        ...FONTS.h3,
        color: COLORS.white,
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray,
        paddingBottom: 12,
        marginBottom: 8,
    },
    tableHeaderText: {
        ...FONTS.body3,
        fontWeight: 'bold',
        color: COLORS.lightGray,
        paddingHorizontal: 4,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 14,
        minHeight: 50,
        alignItems: 'center',
    },
    tableCell: {
        ...FONTS.body3,
        color: COLORS.white,
        paddingHorizontal: 4,
        flexWrap: 'wrap',
    },
    columnJob: {
        width: '25%',
        paddingRight: 8,
    },
    columnDate: {
        width: '25%',
        paddingRight: 8,
    },
    columnPrice: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
    columnPaymentDate: {
        width: '15%',
        textAlign: 'center',
        paddingHorizontal: 4,
    },
    columnStatus: {
        width: '20%',
        textAlign: 'center',
    },
    statusPaid: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
    statusUnpaid: {
        color: '#F44336',
        fontWeight: 'bold',
    },
    noJobsText: {
        ...FONTS.body2,
        color: COLORS.lightGray,
        textAlign: 'center',
        marginVertical: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Modal stilleri
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        height: '100%'
    },
    modalContent: {
        width: '90%',
        backgroundColor: COLORS.secondary,
        borderRadius: 16,
        padding: 0,
        maxHeight: height * 0.8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 25,
        zIndex: 1000,
        position: 'absolute'
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        backgroundColor: COLORS.primary,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalTitle: {
        ...FONTS.h3,
        color: COLORS.white,
    },
    modalCloseButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.accent,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 0,
    },
    modalScroll: {
        padding: 16,
    },
    detailRow: {
        marginBottom: 20,
    },
    detailLabel: {
        ...FONTS.body3,
        color: COLORS.lightGray,
        marginBottom: 4,
    },
    detailValue: {
        ...FONTS.body2,
        color: COLORS.white,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    statusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    paidIndicator: {
        backgroundColor: '#4CAF50',
    },
    unpaidIndicator: {
        backgroundColor: '#F44336',
    },
    modalActionContainer: {
        marginTop: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    modalActionButton: {
        backgroundColor: COLORS.accent,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        minWidth: 150,
        alignItems: 'center',
    },
    modalActionText: {
        ...FONTS.h4,
        color: COLORS.white,
    }
});