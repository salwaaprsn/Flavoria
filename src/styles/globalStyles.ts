import { Platform, StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  bodyText: {
    fontSize: 15,
    color: "#636E72",
    lineHeight: 22,
  },

  titleText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#2D3436",
    letterSpacing: -0.5,
  },

  primaryColor: {
    color: "#FF6B6B",
  },

  screenContainer: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 20,
  },

  shadowProp: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      android: {
        elevation: 5,
      },
    }),
  },

  badge: {
    backgroundColor: "#FFEAEA",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
