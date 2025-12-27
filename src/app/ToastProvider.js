"use client";

import { Toaster } from "react-hot-toast";

import theme from "@/theme/theme";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      // 2. FORCE CENTER POSITION
      containerStyle={{
        top: "50%", // Push down 50% of screen height
        transform: "translateY(-50%)", // Pull back up slightly to be perfectly centered
      }}
      toastOptions={{
        style: {
          // 1. INCREASED BOX SIZE
          padding: theme.spacing.lg, // Changed from md (16px) to lg (24px)
          minWidth: "350px", // Added to make the box wider by default

          // 2. INCREASED TEXT SIZE
          fontSize: "18px", // Changed from 14px to 18px
          fontWeight: "500", // Added slight weight for better readability

          // Standard styling
          border: `1px solid ${theme.colors.primary}`,
          background: theme.colors.background,
          color: theme.colors.light,
          borderRadius: theme.borderRadius,
          fontFamily: theme.fontFamily,
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // Increased shadow slightly for the larger box
        },
        success: {
          iconTheme: {
            primary: theme.colors.success,
            secondary: "white",
          },
          style: {
            border: `1px solid ${theme.colors.success}`,
          },
        },
        error: {
          iconTheme: {
            primary: theme.colors.danger,
            secondary: "white",
          },
          style: {
            border: `1px solid ${theme.colors.danger}`,
          },
        },
      }}
    />
  );
};

export default ToastProvider;
