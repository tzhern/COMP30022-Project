// ----------------------------------------------------------------------

export default function Lists(theme) {
  return {
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#000000',
          minWidth: 'auto',
          marginRight: theme.spacing(2)
        }
      }
    },
    MuiListItemAvatar: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: theme.spacing(2)
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        root: {
          color: '#000000',
          marginTop: 0,
          marginBottom: 0
        },
        multiline: {
          marginTop: 0,
          marginBottom: 0
        }
      }
    }
  };
}
